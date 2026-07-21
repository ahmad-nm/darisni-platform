<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Tutor;
use App\Models\TutorCourse;
use App\Models\TutorReview;
use App\Models\Category;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard
     */
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Dashboard');
    }

    /**
     * Get dashboard statistics
     */
    public function getStats()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalCourses' => Course::count(),
            'totalTutors' => Tutor::count(),
            'totalEnrollments' => TutorCourse::count(), // Using tutor-course assignments as enrollments
            'totalCategories' => Category::count(),
            'totalReviews' => TutorReview::count(),
            'totalChapters' => Chapter::count(),
            'recentUsers' => User::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'recentCourses' => Course::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'activeTutors' => Tutor::whereHas('courses')->count(),
            'averageRating' => round(TutorReview::avg('rating') ?? 0, 1),
            'tutorsWithAvailability' => Tutor::whereHas('availability')->count(),
            'coursesWithChapters' => Course::whereHas('chapters')->count(),
            'growthStats' => [
                'usersThisMonth' => User::whereMonth('created_at', Carbon::now()->month)->count(),
                'coursesThisMonth' => Course::whereMonth('created_at', Carbon::now()->month)->count(),
                'tutorsThisMonth' => Tutor::whereMonth('created_at', Carbon::now()->month)->count(),
                'reviewsThisMonth' => TutorReview::whereMonth('created_at', Carbon::now()->month)->count(),
            ]
        ];

        return response()->json($stats);
    }

    /**
     * Get recent activities for the dashboard
     */
    public function getRecentActivities()
    {
        $activities = collect();

        // Recent user registrations
        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'type' => 'user_registered',
                    'icon' => '👤',
                    'message' => "New user registered: <strong>{$user->name}</strong>",
                    'formatted_time' => $user->created_at?->diffForHumans() ?? 'Unknown',
                    'created_at' => $user->created_at,
                ];
            });

        // Recent courses
        $recentCourses = Course::latest()
            ->take(5)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'type' => 'course_created',
                    'icon' => '📚',
                    'message' => "Course created: <strong>{$course->title}</strong>",
                    'formatted_time' => $course->created_at?->diffForHumans() ?? 'Unknown',
                    'created_at' => $course->created_at ?? now(),
                ];
            });

        // Recent tutor registrations
        $recentTutors = Tutor::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($tutor) {
                return [
                    'id' => $tutor->id,
                    'type' => 'tutor_registered',
                    'icon' => '👨‍🏫',
                    'message' => "New tutor registered: <strong>{$tutor->user->name}</strong>",
                    'formatted_time' => $tutor->created_at?->diffForHumans() ?? 'Unknown',
                    'created_at' => $tutor->created_at,
                ];
            });

        // Recent reviews
        $recentReviews = TutorReview::with(['tutor.user', 'user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'type' => 'review_submitted',
                    'icon' => '⭐',
                    'message' => "New review for <strong>{$review->tutor->user->name}</strong> ({$review->rating}/5 stars)",
                    'formatted_time' => $review->created_at?->diffForHumans() ?? 'Unknown',
                    'created_at' => $review->created_at,
                ];
            });

        // Recent categories
        $recentCategories = Category::latest()
            ->take(3)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'type' => 'category_created',
                    'icon' => '📂',
                    'message' => "Category created: <strong>{$category->name}</strong>",
                    'formatted_time' => $category->created_at?->diffForHumans() ?? 'Unknown',
                    'created_at' => $category->created_at,
                ];
            });

        // Merge all activities and sort by creation date
        $activities = $activities
            ->concat($recentUsers)
            ->concat($recentCourses)
            ->concat($recentTutors)
            ->concat($recentReviews)
            ->concat($recentCategories)
            ->sortByDesc('created_at')
            ->take(15)
            ->values();

        return response()->json($activities);
    }

    /**
     * Get chart data for dashboard
     */
    public function getChartData()
    {
        // Users registered over the last 12 months
        $userChart = [];
        $courseChart = [];
        $tutorChart = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->format('M Y');
            
            $userChart[] = [
                'month' => $monthName,
                'count' => User::whereYear('created_at', $date->year)
                              ->whereMonth('created_at', $date->month)
                              ->count()
            ];

            $courseChart[] = [
                'month' => $monthName,
                'count' => Course::whereYear('created_at', $date->year)
                                 ->whereMonth('created_at', $date->month)
                                 ->count()
            ];

            $tutorChart[] = [
                'month' => $monthName,
                'count' => Tutor::whereYear('created_at', $date->year)
                                ->whereMonth('created_at', $date->month)
                                ->count()
            ];
        }

        return response()->json([
            'users' => $userChart,
            'courses' => $courseChart,
            'tutors' => $tutorChart,
        ]);
    }
}
