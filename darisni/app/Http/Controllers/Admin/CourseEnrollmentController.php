<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseEnrollmentController extends Controller
{
    public function index()
    {
        $users = \App\Models\User::with(['enrollments.course'])->get();
        $courses = \App\Models\Course::all();

        return Inertia::render('Admin/EnrollmentManagement/EnrollmentManagement', [
            'users' => $users,
            'courses' => $courses,
        ]);
    }

    public function show($id)
    {
        $user = \App\Models\User::with(['enrollments.course'])->findOrFail($id);
        return Inertia::render('Admin/EnrollmentDetail', [
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_ids' => 'required|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        foreach ($request->course_ids as $course_id) {
            \App\Models\Enrollment::firstOrCreate([
                'user_id' => $request->user_id,
                'course_id' => $course_id,
            ], [
                'enrolled_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Enrollments created successfully.');
    }

    public function destroy($id)
    {
        $enrollment = \App\Models\Enrollment::findOrFail($id);
        $enrollment->delete();

        return redirect()->back()->with('success', 'Enrollment deleted successfully.');
    }
}
