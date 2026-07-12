<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    /**
     * Display a listing of courses
     */
    public function index()
    {
        $courses = Course::with(['category', 'tutor.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        $categories = Category::select(['id', 'name'])->get();
        $tutors = Tutor::with('user')->select(['id', 'user_id', 'name'])->get();

        return Inertia::render('Admin/CourseManagement/CourseManagement', [
            'courses' => $courses,
            'categories' => $categories,
            'tutors' => $tutors,
            'stats' => [
                'total' => $courses->count(),
                'categories' => $categories->count(),
                'tutors' => $tutors->count(),
                'free' => $courses->where('price', 0)->count(),
            ]
        ]);
    }

    /**
     * Store a newly created course
     */
    public function store(Request $request)
    {
        \Log::info('CourseController store - Request data:', $request->all());
        
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:courses',
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'category_id' => 'required|exists:course_categories,id',
            'tutor_id' => 'nullable|exists:tutors,id',
            'price' => 'nullable|numeric|min:0',
            'lectures' => 'nullable|integer|min:0',
            'credits' => 'nullable|integer|min:0',
            'semester' => 'nullable|integer|min:1|max:12',
            'duration_weeks' => 'nullable|integer|min:1',
            'type' => 'nullable|string|max:100',
            'image' => 'nullable|string|max:255',
            'visible' => 'nullable|boolean',
        ]);

        $course = Course::create($validated);
        
        // Automatically assign the course to the tutor if tutor_id is provided
        if (isset($validated['tutor_id']) && $validated['tutor_id']) {
            \App\Models\TutorCourse::firstOrCreate([
                'tutor_id' => $validated['tutor_id'],
                'course_id' => $course->id
            ], [
                'type' => $validated['type'] ?? null
            ]);
        }
        
        \Log::info('CourseController store - Course created:', $course->toArray());

        return redirect()->route('admin.courses')
            ->with('success', 'Course created successfully!');
    }

    /**
     * Update the specified course
     */
    public function update(Request $request, Course $course)
    {
        \Log::info('CourseController update - Request data:', $request->all());
        \Log::info('CourseController update - Course ID: ' . $course->id);
        
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20', Rule::unique('courses')->ignore($course->id)],
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'category_id' => 'required|exists:course_categories,id',
            'tutor_id' => 'nullable|exists:tutors,id',
            'price' => 'nullable|numeric|min:0',
            'lectures' => 'nullable|integer|min:0',
            'credits' => 'nullable|integer|min:0',
            'semester' => 'nullable|integer|min:1|max:12',
            'duration_weeks' => 'nullable|integer|min:1',
            'type' => 'nullable|string|max:100',
            'image' => 'nullable|string|max:255',
            'visible' => 'nullable|boolean',
        ]);

        $course->update($validated);
        
        // Handle tutor assignment changes
        if (isset($validated['tutor_id'])) {
            // Remove existing tutor assignments
            \App\Models\TutorCourse::where('course_id', $course->id)->delete();
            
            // Add new tutor assignment if tutor_id is provided
            if ($validated['tutor_id']) {
                \App\Models\TutorCourse::create([
                    'tutor_id' => $validated['tutor_id'],
                    'course_id' => $course->id,
                    'type' => $validated['type'] ?? null
                ]);
            }
        } else {
            // If tutor_id is not in the request but type is updated, update existing relationships
            if (isset($validated['type'])) {
                \App\Models\TutorCourse::where('course_id', $course->id)
                    ->update(['type' => $validated['type']]);
            }
        }
        
        \Log::info('CourseController update - Course updated:', $course->fresh()->toArray());

        return redirect()->route('admin.courses')
            ->with('success', 'Course updated successfully!');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // 2MB max
        ]);

        $file = $request->file('image');
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $destinationPath = public_path('storage/course_images');

        // Ensure the directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0775, true);
        }

        $file->move($destinationPath, $filename);

        $url = asset('storage/course_images/' . $filename);

        return response()->json(['url' => $url]);
    }

    /**
     * Remove the specified course
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('admin.courses')
            ->with('success', 'Course deleted successfully!');
    }
}
