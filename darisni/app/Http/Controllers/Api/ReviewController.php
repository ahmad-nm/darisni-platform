<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DarisniReview;
use App\Models\CourseReview;
use App\Models\TutorReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get Darisni platform reviews for testimonials
     */
    public function getDarisniReviews(Request $request)
    {
        $limit = $request->get('limit', 10);
        
        $reviews = DarisniReview::with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Get reviews for a specific course
     */
    public function getCourseReviews($courseId)
    {
        $reviews = CourseReview::with('user')
            ->where('course_id', $courseId)
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating') ?? 0;
        $totalReviews = $reviews->count();

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
                'average_rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews
            ]
        ]);
    }

    /**
     * Get reviews for a specific tutor
     */
    public function getTutorReviews($tutorId)
    {
        $reviews = TutorReview::with('user')
            ->where('tutor_id', $tutorId)
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating') ?? 0;
        $totalReviews = $reviews->count();

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
                'average_rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews
            ]
        ]);
    }
}
