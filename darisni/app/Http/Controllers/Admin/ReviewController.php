<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\CourseReview;
use App\Models\TutorReview;
use App\Models\DarisniReview;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews
     */
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'latest');
        $search = $request->get('search', '');

        // Get reviews from all tables
        $courseReviews = CourseReview::with(['user', 'course'])
            ->when($search, function($query, $search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('course', function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                })->orWhere('feedback', 'like', "%{$search}%");
            })
            ->select(['id', 'user_id', 'course_id', 'rating', 'feedback', 'created_at'])
            ->get()
            ->map(function($review) {
                return [
                    'id' => $review->id,
                    'type' => 'course',
                    'user' => $review->user,
                    'subject' => [
                        'type' => 'Course',
                        'title' => $review->course->title ?? 'Unknown Course',
                        'code' => $review->course->code ?? '',
                    ],
                    'rating' => $review->rating,
                    'feedback' => $review->feedback,
                    'created_at' => $review->created_at,
                ];
            });

        $tutorReviews = TutorReview::with(['user', 'tutor.user'])
            ->when($search, function($query, $search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('tutor.user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('feedback', 'like', "%{$search}%");
            })
            ->select(['id', 'user_id', 'tutor_id', 'rating', 'feedback', 'created_at'])
            ->get()
            ->map(function($review) {
                return [
                    'id' => $review->id,
                    'type' => 'tutor',
                    'user' => $review->user,
                    'subject' => [
                        'type' => 'Tutor',
                        'title' => $review->tutor->user->name ?? 'Unknown Tutor',
                        'code' => '',
                    ],
                    'rating' => $review->rating,
                    'feedback' => $review->feedback,
                    'created_at' => $review->created_at,
                ];
            });

        $darisniReviews = DarisniReview::with('user')
            ->when($search, function($query, $search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('feedback', 'like', "%{$search}%");
            })
            ->select(['id', 'user_id', 'rating', 'feedback', 'created_at'])
            ->get()
            ->map(function($review) {
                return [
                    'id' => $review->id,
                    'type' => 'darisni',
                    'user' => $review->user,
                    'subject' => [
                        'type' => 'Platform',
                        'title' => 'Darisni Platform',
                        'code' => '',
                    ],
                    'rating' => $review->rating,
                    'feedback' => $review->feedback,
                    'created_at' => $review->created_at,
                ];
            });

        // Combine and filter
        $allReviews = collect()
            ->concat($courseReviews)
            ->concat($tutorReviews)
            ->concat($darisniReviews);

        // Apply type filter
        if ($filter !== 'latest') {
            $allReviews = $allReviews->where('type', $filter);
        }

        // Sort by created_at
        $allReviews = $allReviews->sortByDesc('created_at')->values();

        return Inertia::render('Admin/ReviewManagement/ReviewManagement', [
            'reviews' => $allReviews,
            'stats' => [
                'total_reviews' => $allReviews->count(),
                'course_reviews' => $courseReviews->count(),
                'tutor_reviews' => $tutorReviews->count(),
                'darisni_reviews' => $darisniReviews->count(),
                'average_ratings' => [
                    'overall' => $allReviews->avg('rating') ? round($allReviews->avg('rating'), 1) : 0,
                    'course' => $courseReviews->avg('rating') ? round($courseReviews->avg('rating'), 1) : 0,
                    'tutor' => $tutorReviews->avg('rating') ? round($tutorReviews->avg('rating'), 1) : 0,
                    'darisni' => $darisniReviews->avg('rating') ? round($darisniReviews->avg('rating'), 1) : 0,
                ],
                'recent_reviews' => [
                    'total' => $allReviews->where('created_at', '>=', now()->subDays(7))->count(),
                    'course' => $courseReviews->where('created_at', '>=', now()->subDays(7))->count(),
                    'tutor' => $tutorReviews->where('created_at', '>=', now()->subDays(7))->count(),
                    'darisni' => $darisniReviews->where('created_at', '>=', now()->subDays(7))->count(),
                ]
            ]
        ]);
    }

    /**
     * Remove the specified review
     */
    public function destroy(Request $request, $id)
    {
        $type = $request->get('type');

        switch ($type) {
            case 'course':
                $review = CourseReview::findOrFail($id);
                break;
            case 'tutor':
                $review = TutorReview::findOrFail($id);
                break;
            case 'darisni':
                $review = DarisniReview::findOrFail($id);
                break;
            default:
                return response()->json(['message' => 'Invalid review type'], 400);
        }

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully');
    }

    public function getCourseReviews($courseId)
    {
        $reviews = \App\Models\CourseReview::where('course_id', $courseId)
            ->with('user:id,name,image')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
            ],
        ]);
    }

    public function getTutorReviews($tutorId)
    {
        $reviews = \App\Models\TutorReview::where('tutor_id', $tutorId)
            ->with('user:id,name,image')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
            ],
        ]);
    }

    public function getDarisniReviews()
    {
        $reviews = \App\Models\DarisniReview::with('user:id,name,image')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
            ],
        ]);
    }
}
