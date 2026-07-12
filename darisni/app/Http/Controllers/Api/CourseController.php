<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of published courses
     */
    public function index(Request $request)
    {
        try {
            $query = Course::with(['category', 'chapters', 'tutor.user']);

            // Only show visible courses if requested
            if ($request->has('visible')) {
                $visible = filter_var($request->get('visible'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if (!is_null($visible)) {
                    $query->where('visible', $visible);
                }
            }

            // Optional filtering
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('code', 'like', "%{$searchTerm}%")
                    ->orWhere('subject', 'like', "%{$searchTerm}%");
                });
            }

            $courses = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            \Log::error('Courses API Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified course
     */
    public function show($id)
    {
        try {
            $course = Course::with(['category', 'chapters', 'tutor.user', 'reviews.user'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $course
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get courses by category
     */
    public function getByCategory($categoryId)
    {
        try {
            $courses = Course::with(['category', 'chapters', 'tutor.user'])
                ->where('category_id', $categoryId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching courses for category',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
