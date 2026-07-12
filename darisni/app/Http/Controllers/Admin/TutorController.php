<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tutor;
use App\Models\TutorAvailability;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class TutorController extends Controller
{
    /**
     * Display a listing of tutors
     */
    public function index()
    {
        $tutors = Tutor::with(['user', 'courses', 'reviews', 'availability'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Add ratings as an alias for reviews for frontend compatibility
        $tutors->each(function ($tutor) {
            $tutor->ratings = $tutor->reviews;
        });

        $users = User::where('role', 'tutor')
            
            ->select(['id', 'name', 'email'])
            ->get();

        $courses = Course::select(['id', 'title', 'code'])->get();

        return Inertia::render('Admin/TutorManagement/TutorManagement', [
            'tutors' => $tutors,
            'users' => $users,
            'courses' => $courses,
            'stats' => [
                'total' => $tutors->count(),
                'active' => $tutors->filter(function($tutor) {
                    return $tutor->courses && $tutor->courses->count() > 0;
                })->count(),
                'experienced' => $tutors->where('experience_years', '>=', 2)->count(),
                'new' => $tutors->where('experience_years', '<', 2)->count(),
            ]
        ]);
    }

    /**
     * Store a newly created tutor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:tutors,user_id',
            'name' => 'nullable|string|max:255',
            'university' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1|max:10',
            'bio' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'hourly_rate' => 'nullable|numeric|min:0',
            'image' => 'nullable|string|max:255',
        ]);

        // Update user role to tutor
        $user = User::findOrFail($validated['user_id']);
        $user->update(['role' => 'tutor']);

        $tutor = Tutor::create($validated);

        // If request wants JSON (for AJAX calls with availability/courses)
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return response()->json([
                'message' => 'Tutor created successfully',
                'tutor' => $tutor
            ], 201);
        }

        return redirect()->route('admin.tutors')
            ->with('success', 'Tutor created successfully');
    }

    /**
     * Update the specified tutor
     */
    public function update(Request $request, Tutor $tutor)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'university' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1|max:10',
            'bio' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'hourly_rate' => 'nullable|numeric|min:0',
            'image' => 'nullable|string|max:255',
            'availability' => 'nullable|array',
            'availability.*.day' => 'required_with:availability|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'availability.*.start_time' => 'required_with:availability|string',
            'availability.*.end_time' => 'required_with:availability|string',
        ]);

        // Update basic tutor data
        $tutorData = collect($validated)->except('availability')->toArray();
        $tutor->update($tutorData);

        // Handle availability updates if provided
        if (isset($validated['availability'])) {
            // Delete all existing availability
            $tutor->availability()->delete();
            
            // Create new availability records
            foreach ($validated['availability'] as $availabilityData) {
                if (!empty($availabilityData['day']) && !empty($availabilityData['start_time']) && !empty($availabilityData['end_time'])) {
                    $tutor->availability()->create($availabilityData);
                }
            }
        }

        // If request wants JSON (for AJAX calls)
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return response()->json([
                'message' => 'Tutor updated successfully',
                'tutor' => $tutor->load('availability')
            ]);
        }

        return redirect()->route('admin.tutors')
            ->with('success', 'Tutor updated successfully');
    }

    /**
     * Remove the specified tutor
     */
    public function destroy(Tutor $tutor)
    {
        if ($tutor->user && auth()->id() === $tutor->user->id && auth()->user()->role === 'admin') {
            return redirect()->route('admin.tutors')
                ->with('error', 'You cannot change your own role from admin.');
        }
        
        // Update user role back to student
        if ($tutor->user) {
            $tutor->user->update(['role' => 'student']);
        }

        $tutor->delete();

        return redirect()->route('admin.tutors')
            ->with('success', 'Tutor deleted successfully');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // 2MB max
        ]);

        $file = $request->file('image');
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $destinationPath = public_path('storage/tutor_images');

        // Ensure the directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0775, true);
        }

        $file->move($destinationPath, $filename);

        $url = asset('storage/tutor_images/' . $filename);

        return response()->json(['url' => $url]);
    }

    /**
     * Store tutor availability
     */
    public function storeAvailability(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id',
            'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        $availability = TutorAvailability::create($validated);

        return response()->json([
            'message' => 'Availability created successfully',
            'availability' => $availability
        ], 201);
    }

    /**
     * Update tutor availability
     */
    public function updateAvailability(Request $request, TutorAvailability $availability)
    {
        $validated = $request->validate([
            'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        $availability->update($validated);

        return response()->json([
            'message' => 'Availability updated successfully',
            'availability' => $availability
        ]);
    }

    /**
     * Remove tutor availability
     */
    public function destroyAvailability(TutorAvailability $availability)
    {
        $availability->delete();

        return response()->json([
            'message' => 'Availability deleted successfully'
        ]);
    }
}
