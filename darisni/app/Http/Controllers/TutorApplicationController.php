<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TutorApplicationController extends Controller
{
    /**
     * Submit a tutor application
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'age' => 'required|integer|min:15|max:99',
            'university' => 'required|string|max:255',
            'year' => 'required|integer|min:1|max:7',
            'coursesToGive' => 'required|array|min:1',
            'coursesToGive.*' => 'string',
            'whereYouSeeYourself' => 'required|string|max:1000',
            'cv' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // 5MB max
            'pay' => 'required|numeric|min:5|max:100',
            'otherCourses' => 'nullable|string|max:500',
            'goodTutor' => 'required|string|max:1000',
            'user_id' => 'nullable|integer|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate unique application ID
            $applicationId = 'app_' . Str::uuid();
            
            // Handle CV file upload
            $cvFileName = null;
            if ($request->hasFile('cv')) {
                $cv = $request->file('cv');
                $cvFileName = $applicationId . '_cv.' . $cv->getClientOriginalExtension();
                
                // Store CV in private storage
                $cv->storeAs('tutor-applications/cvs', $cvFileName, 'local');
            }

            // Prepare application data
            $applicationData = [
                'id' => $applicationId,
                'user_id' => $request->user_id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'age' => (int) $request->age,
                'university' => $request->university,
                'year' => (int) $request->year,
                'courses_to_give' => $request->coursesToGive,
                'where_you_see_yourself' => $request->whereYouSeeYourself,
                'cv_filename' => $cvFileName,
                'expected_hourly_rate' => (float) $request->pay,
                'other_courses' => $request->otherCourses,
                'what_makes_good_tutor' => $request->goodTutor,
                'status' => 'pending',
                'submitted_at' => Carbon::now()->toISOString(),
                'created_at' => Carbon::now()->toISOString()
            ];

            // Save application data as JSON file
            $jsonFileName = $applicationId . '.json';
            Storage::disk('local')->put(
                'tutor-applications/data/' . $jsonFileName,
                json_encode($applicationData, JSON_PRETTY_PRINT)
            );

            return redirect()->back()->with('success', 'Application submitted successfully! We will review your application and get back to you soon.');

        } catch (\Exception $e) {
            \Log::error('Tutor application submission failed: ' . $e->getMessage());
            
            return redirect()->back()->withErrors(['error' => 'Failed to submit application. Please try again.'])->withInput();
        }
    }

    /**
     * Get all tutor applications for admin panel
     */
    public function index()
    {
        try {
            $applications = [];
            $userApplicationCounts = [];

            // Get all JSON files from the tutor applications directory
            $files = Storage::disk('local')->files('tutor-applications/data');

            foreach ($files as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                    $content = Storage::disk('local')->get($file);
                    $applicationData = json_decode($content, true);

                    if ($applicationData) {
                        $applications[] = $applicationData;

                        // Count applications per user_id
                        if (!empty($applicationData['user_id'])) {
                            $userId = (string)$applicationData['user_id'];
                            if (!isset($userApplicationCounts[$userId])) {
                                $userApplicationCounts[$userId] = 0;
                            }
                            $userApplicationCounts[$userId]++;
                        }
                    }
                }
            }

            // Find user_ids with more than one application
            $duplicateUserIds = array_keys(array_filter($userApplicationCounts, function($count) {
                return $count > 1;
            }));

            usort($applications, function($a, $b) {
                return strtotime($b['submitted_at']) - strtotime($a['submitted_at']);
            });

            return response()->json([
                'success' => true,
                'applications' => $applications,
                'duplicate_user_ids' => $duplicateUserIds
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to fetch tutor applications: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch applications'
            ], 500);
        }
    }

    /**
     * Update application status
     */
    public function updateStatus(Request $request, $applicationId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected,under_review'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $filePath = 'tutor-applications/data/' . $applicationId . '.json';
            
            if (!Storage::disk('local')->exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Application not found'
                ], 404);
            }

            $content = Storage::disk('local')->get($filePath);
            $applicationData = json_decode($content, true);
            
            $applicationData['status'] = $request->status;
            $applicationData['updated_at'] = Carbon::now()->toISOString();
            
            // If approved, create tutor profile
            if ($request->status === 'approved' && $applicationData['user_id']) {
                $this->createTutorProfile($applicationData);
            }
            
            Storage::disk('local')->put(
                $filePath,
                json_encode($applicationData, JSON_PRETTY_PRINT)
            );

            return response()->json([
                'success' => true,
                'message' => 'Application status updated successfully',
                'whatsapp_message' => $this->generateWhatsAppMessage($request->status, $applicationData)
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to update application status: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update application status'
            ], 500);
        }
    }

    /**
     * Create tutor profile when application is approved
     */
    private function createTutorProfile($applicationData)
    {
        try {
            // Check if user exists
            $user = \App\Models\User::find($applicationData['user_id']);
            if (!$user) {
                throw new \Exception('User not found');
            }

            // Update user role to tutor
            $user->role = 'tutor';
            $user->save();

            // Check if tutor profile already exists
            $existingTutor = \App\Models\Tutor::where('user_id', $applicationData['user_id'])->first();
            if (!$existingTutor) {
                // Create tutor profile
                \App\Models\Tutor::create([
                    'user_id' => $applicationData['user_id'],
                    'name' => $applicationData['name'],
                    'university' => $applicationData['university'],
                    'year' => $applicationData['year'],
                    'bio' => $applicationData['what_makes_good_tutor'] ?? 'Experienced tutor',
                    'contact' => $applicationData['email'],
                    'experience' => 0,
                    'hourly_rate' => $applicationData['expected_hourly_rate'],
                    'phone' => $applicationData['phone'] ?? null,
                    'age' => $applicationData['age'] ?? null,
                    'rating' => 0.0,
                    'total_reviews' => 0,
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                \Log::info('Tutor profile created for user ID: ' . $applicationData['user_id']);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to create tutor profile: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate WhatsApp message based on status
     */
    private function generateWhatsAppMessage($status, $applicationData)
    {
        $name = $applicationData['name'];
        $phone = $applicationData['phone'];
        
        // Clean and format phone number
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone); // Remove all non-numeric characters
        
        // Validate phone number length (Lebanese numbers should be 8 digits + country code)
        if (empty($cleanPhone)) {
            \Log::warning("Empty phone number for application: {$applicationData['id']}");
            return null;
        }
        
        // Handle different phone number formats
        if (str_starts_with($cleanPhone, '961')) {
            // Already has Lebanon country code
            $formattedPhone = $cleanPhone;
        } elseif (str_starts_with($cleanPhone, '0')) {
            // Local format with leading 0, remove 0 and add country code
            $formattedPhone = '961' . substr($cleanPhone, 1);
        } else {
            // Assume it's a local number without country code
            $formattedPhone = '961' . $cleanPhone;
        }
        
        // Validate final phone number format
        if (strlen($formattedPhone) < 11 || !str_starts_with($formattedPhone, '961')) {
            \Log::warning("Invalid phone number format for application: {$applicationData['id']}, original: {$phone}, formatted: {$formattedPhone}");
            return null;
        }
        
        if ($status === 'approved') {
            $message = "🎉 Congratulations {$name}! Your tutor application has been ACCEPTED. Welcome to the Darisni team! We'll contact you soon with next steps to start tutoring.";
        } elseif ($status === 'rejected') {
            $message = "Thank you {$name} for your interest in joining Darisni as a tutor. Unfortunately, we cannot proceed with your application at this time. We encourage you to apply again in the future. Best regards, Darisni Team";
        } else {
            return null;
        }
        
        $whatsappUrl = "https://wa.me/{$formattedPhone}?text=" . urlencode($message);
        
        \Log::info("Generated WhatsApp URL for application {$applicationData['id']}: {$whatsappUrl}");
        
        return [
            'phone' => $formattedPhone,
            'message' => $message,
            'url' => $whatsappUrl
        ];
    }

    /**
     * Download CV file
     */
    public function downloadCV($applicationId)
    {
        try {
            $dataPath = 'tutor-applications/data/' . $applicationId . '.json';
            
            if (!Storage::disk('local')->exists($dataPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Application not found'
                ], 404);
            }

            $content = Storage::disk('local')->get($dataPath);
            $applicationData = json_decode($content, true);
            
            if (!$applicationData['cv_filename']) {
                return response()->json([
                    'success' => false,
                    'message' => 'CV file not found'
                ], 404);
            }

            $cvPath = 'tutor-applications/cvs/' . $applicationData['cv_filename'];
            
            if (!Storage::disk('local')->exists($cvPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'CV file not found in storage'
                ], 404);
            }

            return Storage::disk('local')->download($cvPath, $applicationData['cv_filename']);

        } catch (\Exception $e) {
            \Log::error('Failed to download CV: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to download CV'
            ], 500);
        }
    }

    /**
     * Delete application
     */
    public function destroy($applicationId)
    {
        try {
            $dataPath = 'tutor-applications/data/' . $applicationId . '.json';
            $applicationData = null;
            
            if (Storage::disk('local')->exists($dataPath)) {
                $content = Storage::disk('local')->get($dataPath);
                $applicationData = json_decode($content, true);
                
                // Delete JSON file
                Storage::disk('local')->delete($dataPath);
            }

            // Delete CV file if exists
            if ($applicationData && $applicationData['cv_filename']) {
                $cvPath = 'tutor-applications/cvs/' . $applicationData['cv_filename'];
                if (Storage::disk('local')->exists($cvPath)) {
                    Storage::disk('local')->delete($cvPath);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Application deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to delete application: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete application'
            ], 500);
        }
    }
}
