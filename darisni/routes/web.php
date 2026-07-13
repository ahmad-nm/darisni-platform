<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CourseEnrollmentController;
use App\Http\Controllers\Admin\CourseSuggestionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

// Main website routes
Route::get('/about', function () {
    return Inertia::render('AboutPage/AboutPage');
})->name('about');

Route::get('/course-categories', function () {
    return Inertia::render('CourseCategories/CourseCat');
})->name('course-categories');

Route::get('/courses/{CategoryId}', function ($CategoryId) {
    return Inertia::render('Courses/Courses', [
        'CategoryId' => $CategoryId
    ]);
})->name('courses');

Route::get('/tutors', function () {
    return Inertia::render('Tutors/Tutors');
})->name('tutors');

Route::get('/tutors/{tutorId}', function ($tutorId) {
    return Inertia::render('Tutors/TutorInfo/TutorInfo', [
        'tutorId' => $tutorId
    ]);
})->name('tutor.show');

Route::get('/join-team', function () {
    return Inertia::render('JoinTeam/JoinTeam');
})->name('join-team');

// Tutor Application Routes
Route::post('/tutor-applications', [\App\Http\Controllers\TutorApplicationController::class, 'store'])->name('tutor-applications.store');

// Rating Routes
Route::post('/api/ratings', [\App\Http\Controllers\RatingController::class, 'store'])->name('ratings.store');

Route::get('/docs', function () {
    return Inertia::render('DocsPage/Docs');
})->name('docs');

Route::get('/payment', function () {
    return Inertia::render('Payment/Payment');
})->name('payment');

Route::post('/submit-course-suggestion', [CourseSuggestionController::class, 'store'])->name('course-suggestion.store');

// Admin routes (protected)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Dashboard API endpoints
    Route::get('/dashboard/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'getStats'])->name('dashboard.stats');
    Route::get('/dashboard/activities', [\App\Http\Controllers\Admin\DashboardController::class, 'getRecentActivities'])->name('dashboard.activities');
    Route::get('/dashboard/charts', [\App\Http\Controllers\Admin\DashboardController::class, 'getChartData'])->name('dashboard.charts');
    
    // User Management
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users');
    Route::get('/users/create', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    Route::get('/users/stats', [\App\Http\Controllers\Admin\UserController::class, 'stats'])->name('users.stats');
    
    // Course Management
    Route::get('/courses', [\App\Http\Controllers\Admin\CourseController::class, 'index'])->name('courses');
    Route::post('/courses', [\App\Http\Controllers\Admin\CourseController::class, 'store'])->name('courses.store');
    Route::put('/courses/{course}', [\App\Http\Controllers\Admin\CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [\App\Http\Controllers\Admin\CourseController::class, 'destroy'])->name('courses.destroy');
    Route::post('/courses/upload-image', [\App\Http\Controllers\Admin\CourseController::class, 'uploadImage'])->name('courses.upload-image');
    
    // Chapter Management
    Route::get('/courses/{course}/chapters', [\App\Http\Controllers\Admin\ChapterController::class, 'index'])->name('chapters.index');
    Route::post('/chapters', [\App\Http\Controllers\Admin\ChapterController::class, 'store'])->name('chapters.store');
    Route::put('/chapters/{chapter}', [\App\Http\Controllers\Admin\ChapterController::class, 'update'])->name('chapters.update');
    Route::delete('/chapters/{chapter}', [\App\Http\Controllers\Admin\ChapterController::class, 'destroy'])->name('chapters.destroy');
    
    // Category Management
    Route::get('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'index'])->name('categories');
    Route::post('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::post('/categories/upload-image', [\App\Http\Controllers\Admin\CategoryController::class, 'uploadImage'])->name('categories.upload-image');
    
    // Tutor Management
    Route::get('/tutors', [\App\Http\Controllers\Admin\TutorController::class, 'index'])->name('tutors');
    Route::post('/tutors', [\App\Http\Controllers\Admin\TutorController::class, 'store'])->name('tutors.store');
    Route::put('/tutors/{tutor}', [\App\Http\Controllers\Admin\TutorController::class, 'update'])->name('tutors.update');
    Route::delete('/tutors/{tutor}', [\App\Http\Controllers\Admin\TutorController::class, 'destroy'])->name('tutors.destroy');
    Route::post('/tutors/upload-image', [\App\Http\Controllers\Admin\TutorController::class, 'uploadImage'])->name('tutors.upload-image');
    
    // Tutor Availability
    Route::post('/tutors/availability', [\App\Http\Controllers\Admin\TutorController::class, 'storeAvailability'])->name('tutors.availability.store');
    Route::put('/tutors/availability/{availability}', [\App\Http\Controllers\Admin\TutorController::class, 'updateAvailability'])->name('tutors.availability.update');
    Route::delete('/tutors/availability/{availability}', [\App\Http\Controllers\Admin\TutorController::class, 'destroyAvailability'])->name('tutors.availability.destroy');
    
    // Tutor Course Assignments (Helper routes for TutorManagement component)
    Route::get('/tutors/{tutor}/courses', [\App\Http\Controllers\Admin\TutorCourseController::class, 'getTutorCourses'])->name('tutors.courses');
    Route::get('/courses/{course}/tutors', [\App\Http\Controllers\Admin\TutorCourseController::class, 'getCourseTutors'])->name('courses.tutors');
    
    // Tutor Course Assignment API routes
    Route::post('/tutors/courses', [\App\Http\Controllers\Admin\TutorCourseController::class, 'store'])->name('tutors.courses.store');
    Route::put('/tutors/courses/{course}', [\App\Http\Controllers\Admin\TutorCourseController::class, 'update'])->name('tutors.courses.update');
    Route::delete('/tutors/courses/{course}/{tutor}', [\App\Http\Controllers\Admin\TutorCourseController::class, 'destroy'])->name('tutors.courses.destroy');
    
    // Review Management
    Route::get('/reviews', [\App\Http\Controllers\Admin\ReviewController::class, 'index'])->name('reviews');
    Route::delete('/reviews/{id}', [\App\Http\Controllers\Admin\ReviewController::class, 'destroy'])->name('reviews.destroy');
    
    // Tutor Applications Management
    Route::get('/applications', function () {
        return Inertia::render('Admin/TutorApplications/TutorApplications');
    })->name('applications.page');
    
    // Tutor Applications API routes
    Route::get('/applications/data', [\App\Http\Controllers\TutorApplicationController::class, 'index'])->name('applications.data');
    Route::patch('/applications/{applicationId}/status', [\App\Http\Controllers\TutorApplicationController::class, 'updateStatus'])->name('applications.status');
    Route::get('/applications/{applicationId}/cv', [\App\Http\Controllers\TutorApplicationController::class, 'downloadCV'])->name('applications.cv');
    Route::delete('/applications/{applicationId}', [\App\Http\Controllers\TutorApplicationController::class, 'destroy'])->name('applications.destroy');

    //Enrollment route
    Route::get('/enrollments', [CourseEnrollmentController::class, 'index'])->name('enrollments');
    Route::post('/enrollments', [CourseEnrollmentController::class, 'store'])->name('enrollments.store');
    Route::delete('/enrollments/{id}', [CourseEnrollmentController::class, 'destroy'])->name('enrollments.destroy');

    // Course Suggestions Management
    Route::get('/course-suggestions', [CourseSuggestionController::class, 'index'])->name('course-suggestions');
    Route::delete('/course-suggestions/{id}', [CourseSuggestionController::class, 'destroy'])->name('course-suggestions.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/image', [ProfileController::class, 'updateImage'])->name('profile.image');
    Route::post('/profile/image/delete', [ProfileController::class, 'deleteImage'])->name('profile.image.delete');
});

require __DIR__.'/auth.php';
