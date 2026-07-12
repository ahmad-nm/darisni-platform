<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChapterController extends Controller
{
    /**
     * Display chapters for a specific course
     */
    public function index(Course $course)
    {
        $chapters = Chapter::where('course_id', $course->id)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'chapters' => $chapters
        ]);
    }

    /**
     * Store a newly created chapter
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'content' => 'required|string'
        ]);

        $chapter = Chapter::create($validated);

        return Inertia::render('Admin/CourseManagement/CourseManagement', [
        'chapter' => $chapter,
        'success' => 'Chapter created successfully'
    ]);
    }

    /**
     * Update the specified chapter
     */
    public function update(Request $request, Chapter $chapter)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $chapter->update($validated);

        // Get the course and its chapters for updated props
        $course = $chapter->course;
        $chapters = Chapter::where('course_id', $course->id)->orderBy('created_at')->get();

        return Inertia::render('Admin/CourseManagement/CourseManagement', [
            'course' => $course,
            'chapters' => $chapters,
            'chapter' => $chapter->fresh(),
            'success' => 'Chapter updated successfully'
        ]);
    }

    /**
     * Remove the specified chapter
     */
    public function destroy(Chapter $chapter)
    {
        $course = $chapter->course;
        $chapter->delete();

        $chapters = Chapter::where('course_id', $course->id)->orderBy('created_at')->get();

        return Inertia::render('Admin/CourseManagement/CourseManagement', [
            'course' => $course,
            'chapters' => $chapters,
            'success' => 'Chapter deleted successfully'
        ]);
    }
}
