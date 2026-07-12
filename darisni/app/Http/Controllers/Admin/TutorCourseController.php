<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\Course;
use Illuminate\Http\Request;

class TutorCourseController extends Controller
{
    /**
     * Get courses for a specific tutor
     */
    public function getTutorCourses(Tutor $tutor)
    {
        $courses = $tutor->courses()->with('category')->get();

        return response()->json([
            'courses' => $courses
        ]);
    }

    /**
     * Get tutors for a specific course
     */
    public function getCourseTutors(Course $course)
    {
        $tutors = $course->tutors()->with('user')->get();

        return response()->json([
            'tutors' => $tutors
        ]);
    }

    /**
     * Assign a course to a tutor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        $tutorId = $validated['tutor_id'];
        
        // Get the type from the course itself
        $courseType = $course->type;

        // Check if relationship already exists
        if ($course->tutors()->where('tutor_id', $tutorId)->exists()) {
            // Update existing relationship with current course type
            $course->tutors()->updateExistingPivot($tutorId, [
                'type' => $courseType,
                'updated_at' => now()
            ]);
            
            return response()->json([
                'message' => 'Tutor course assignment updated successfully',
                'type' => $courseType
            ]);
        }

        // Create new relationship with course type
        $course->tutors()->attach($tutorId, [
            'type' => $courseType,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Course assigned to tutor successfully',
            'type' => $courseType
        ], 201);
    }

    /**
     * Update a tutor course assignment
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id',
        ]);

        $tutorId = $validated['tutor_id'];
        $courseType = $course->type;

        // Check if relationship exists
        if (!$course->tutors()->where('tutor_id', $tutorId)->exists()) {
            return response()->json(['message' => 'Tutor course relationship not found'], 404);
        }

        // Update the relationship with current course type
        $course->tutors()->updateExistingPivot($tutorId, [
            'type' => $courseType,
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Tutor course assignment updated successfully',
            'type' => $courseType
        ]);
    }

    /**
     * Remove a tutor from a course
     */
    public function destroy(Course $course, Tutor $tutor)
    {
        $course->tutors()->detach($tutor->id);

        return response()->json([
            'message' => 'Tutor unassigned from course successfully'
        ]);
    }
}
