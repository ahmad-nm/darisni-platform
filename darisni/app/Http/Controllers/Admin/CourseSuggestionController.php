<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CourseSuggestion;
use Inertia\Inertia;


class CourseSuggestionController extends Controller
{
    public function index()
    {
        $suggestions = CourseSuggestion::latest()->get();
        return Inertia::render('Admin/CourseSuggestionManagement/CourseSuggestionManagement', [
            'suggestions' => $suggestions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'userName' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'courseSuggestion' => 'required|string',
        ]);

        CourseSuggestion::create([
            'user_name' => $request->userName,
            'phone' => $request->phone,
            'suggestion' => $request->courseSuggestion,
        ]);

        return redirect()->back()->with('success', 'Thank you for your suggestion!');
    }

    public function destroy($id)
    {
        $suggestion = CourseSuggestion::findOrFail($id);
        $suggestion->delete();

        return response()->json(['success' => true]);
    }
}