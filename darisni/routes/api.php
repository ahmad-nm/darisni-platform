<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\TutorController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReviewController;

Route::middleware('api')->group(function () {
    // Public API routes for main website
    
    // Courses
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::get('/courses/category/{categoryId}', [CourseController::class, 'getByCategory']);
    
    // Tutors
    Route::get('/tutors', [TutorController::class, 'index']);
    Route::get('/tutors/{id}', [TutorController::class, 'show']);
    
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    
    // Reviews
    Route::get('/reviews/darisni', [ReviewController::class, 'getDarisniReviews']);

    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        // Example: POST route for submitting a review/rating
        Route::post('/reviews/course/{courseId}', [ReviewController::class, 'storeCourseReview']);
        Route::post('/reviews/tutor/{tutorId}', [ReviewController::class, 'storeTutorReview']);
        Route::post('/reviews/darisni', [ReviewController::class, 'storeDarisniReview']);
    });

    Route::get('/reviews/course/{courseId}', [ReviewController::class, 'getCourseReviews']);
    Route::get('/reviews/tutor/{tutorId}', [ReviewController::class, 'getTutorReviews']);
    Route::get('/reviews/darisni', [ReviewController::class, 'getDarisniReviews']);
});

Route::middleware(['auth:sanctum', 'verified'])->get('/user', function (Request $request) {
    return $request->user();
});
