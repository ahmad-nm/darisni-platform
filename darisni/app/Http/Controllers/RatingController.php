<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\TutorReview;
use App\Models\CourseReview;
use App\Models\DarisniReview;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class RatingController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'type' => 'required|in:tutor,course,darisni',
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:1000',
            'subject_id' => 'nullable|integer',
        ]);

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to submit a rating.'
            ], 401);
        }

        $userId = Auth::id();
        $type = $request->type;
        $rating = $request->rating;
        $feedback = $request->feedback;
        $subjectId = $request->subject_id;

        try {
            switch ($type) {
                case 'tutor':
                    if (!$subjectId) {
                        return redirect()->back()->with('error', 'Tutor ID is required for tutor ratings.');
                    }

                    // Validate that the tutor exists
                    $tutorExists = \App\Models\Tutor::where('id', $subjectId)->exists();
                    if (!$tutorExists) {
                        return redirect()->back()->with('error', 'Invalid tutor ID.');
                    }

                    // Check if user already rated this tutor
                    $existingRating = TutorReview::where('user_id', $userId)
                        ->where('tutor_id', $subjectId)
                        ->first();

                    if ($existingRating) {
                        // Update existing rating
                        $existingRating->update([
                            'rating' => $rating,
                            'feedback' => $feedback,
                        ]);
                        $message = 'Your tutor rating has been updated successfully!';
                    } else {
                        // Create new rating
                        TutorReview::create([
                            'tutor_id' => $subjectId,
                            'user_id' => $userId,
                            'rating' => $rating,
                            'feedback' => $feedback,
                        ]);
                        $message = 'Your tutor rating has been submitted successfully!';
                    }
                    break;

                case 'course':
                    if (!$subjectId) {
                        return redirect()->back()->with('error', 'Course ID is required for course ratings.');
                    }

                    // Validate that the course exists
                    $courseExists = \App\Models\Course::where('id', $subjectId)->exists();
                    if (!$courseExists) {
                        return redirect()->back()->with('error', 'Invalid course ID.');
                    }

                    // Check if user already rated this course
                    $existingRating = CourseReview::where('user_id', $userId)
                        ->where('course_id', $subjectId)
                        ->first();

                    if ($existingRating) {
                        // Update existing rating
                        $existingRating->update([
                            'rating' => $rating,
                            'feedback' => $feedback,
                        ]);
                        $message = 'Your course rating has been updated successfully!';
                    } else {
                        // Create new rating
                        CourseReview::create([
                            'course_id' => $subjectId,
                            'user_id' => $userId,
                            'rating' => $rating,
                            'feedback' => $feedback,
                        ]);
                        $message = 'Your course rating has been submitted successfully!';
                    }
                    break;

                case 'darisni':
                    // Check if user already rated the platform
                    $existingRating = DarisniReview::where('user_id', $userId)
                        ->first();

                    if ($existingRating) {
                        // Update existing rating
                        $existingRating->update([
                            'rating' => $rating,
                            'feedback' => $feedback,
                        ]);
                        $message = 'Your platform rating has been updated successfully!';
                    } else {
                        // Create new rating
                        DarisniReview::create([
                            'user_id' => $userId,
                            'rating' => $rating,
                            'feedback' => $feedback,
                        ]);
                        $message = 'Your platform rating has been submitted successfully!';
                    }
                    break;

                default:
                    return redirect()->back()->with('error', 'Invalid rating type.');
            }

            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while submitting your rating. Please try again.');
        }
    }
}
