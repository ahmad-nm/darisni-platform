<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use Illuminate\Http\Request;

class TutorController extends Controller
{
    /**
     * Display a listing of tutors
     */
    public function index(Request $request)
    {
        $query = Tutor::with(['user', 'courses.category']);

        // Optional filtering
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('university', 'like', "%{$searchTerm}%")
                  ->orWhere('bio', 'like', "%{$searchTerm}%")
                  ->orWhereHas('user', function($userQuery) use ($searchTerm) {
                      $userQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        if ($request->has('university')) {
            $query->where('university', $request->university);
        }

        if ($request->has('experience_min')) {
            $query->where('experience_years', '>=', $request->experience_min);
        }

        $tutors = $query->orderBy('created_at', 'desc')->get();

        // Add calculated fields
        $tutors->each(function ($tutor) {
            $tutor->average_rating = $tutor->average_rating;
            $tutor->total_reviews = $tutor->total_reviews;
            $tutor->courses_count = $tutor->courses->count();
        });

        return response()->json([
            'success' => true,
            'data' => $tutors
        ]);
    }

    /**
     * Display the specified tutor
     */
    public function show($id)
    {
        $tutor = Tutor::with([
            'user', 
            'courses.category', 
            'reviews.user',
            'availability'
        ])->findOrFail($id);

        // Add calculated fields
        $tutor->average_rating = $tutor->average_rating;
        $tutor->total_reviews = $tutor->total_reviews;
        $tutor->courses_count = $tutor->courses->count();

        return response()->json([
            'success' => true,
            'data' => $tutor
        ]);
    }
}
