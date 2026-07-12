<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::withCount('courses')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/CategoryManagement/CategoryManagement', [
            'categories' => $categories,
            'stats' => [
                'total' => $categories->count(),
                'total_courses' => $categories->sum('courses_count'),
                'active' => $categories->where('courses_count', '>', 0)->count(),
                'empty' => $categories->where('courses_count', 0)->count(),
            ]
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:course_categories',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'visible' => 'nullable|boolean',
        ]);

        $category = Category::create($validated);

        // If request wants JSON (for AJAX calls)
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return response()->json([
                'message' => 'Category created successfully',
                'category' => $category->loadCount('courses')
            ], 201);
        }

        return redirect()->route('admin.categories')
            ->with('success', 'Category created successfully');
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', \Illuminate\Validation\Rule::unique('course_categories')->ignore($category->id)],
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'visible' => 'nullable|boolean',
        ]);

        $category->update($validated);

        // If request wants JSON (for AJAX calls)
        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return response()->json([
                'message' => 'Category updated successfully',
                'category' => $category->loadCount('courses')
            ]);
        }

        return redirect()->route('admin.categories')
            ->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category)
    {
        $uncategorizedId = 5; // Or create/find a category for 'Uncategorized'

        // Move all courses to 'Uncategorized'
        $category->courses()->update(['category_id' => $uncategorizedId]);

        $category->delete();

        // If request wants JSON (for AJAX calls)
        if (request()->wantsJson() || request()->header('Accept') === 'application/json') {
            return response()->json([
                'message' => 'Category deleted successfully. Courses moved to Uncategorized.'
            ]);
        }

        return redirect()->route('admin.categories')
            ->with('success', 'Category deleted successfully. Courses moved to Uncategorized.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // 2MB max
        ]);

        $file = $request->file('image');
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $destinationPath = public_path('storage/category_images');

        // Ensure the directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0775, true);
        }

        $file->move($destinationPath, $filename);

        $url = asset('storage/category_images/' . $filename);

        return response()->json(['url' => $url]);
    }
}
