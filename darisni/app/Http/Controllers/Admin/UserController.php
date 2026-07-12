<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index()
    {
        $users = User::select(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at', 'image'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/UserManagement/UserManagement', [
            'users' => $users,
            'stats' => [
                'total' => $users->count(),
                'active' => $users->where('email_verified_at', '!=', null)->count(),
                'tutors' => $users->where('role', 'tutor')->count(),
                'students' => $users->where('role', 'student')->count(),
                'admins' => $users->where('role', 'admin')->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        return Inertia::render('Admin/NewUser/newUser');
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Debug what we're receiving
        \Log::info('Store request data:', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string|same:password',
            'role' => 'required|string|in:admin,tutor,student',
            'email_verified_at' => 'sometimes|boolean',
        ]);

        \Log::info('Validated data:', $validated);

        // Handle email verification checkbox properly
        $emailVerifiedAt = null;
        if (isset($validated['email_verified_at']) && $validated['email_verified_at']) {
            $emailVerifiedAt = now();
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => $emailVerifiedAt,
        ]);

        \Log::info('Created user:', $user->toArray());

        // If user is created with tutor role, create tutor record
        if ($validated['role'] === 'tutor') {
            Tutor::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'university' => null,
                'year' => null,
                'bio' => 'New tutor profile - please update your information',
                'contact' => null,
                'experience_years' => 0,
                'hourly_rate' => 0.00,
                'image' => null,
            ]);
        }

        return redirect()->route('admin.users')->with('success', 'User created successfully');
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        if (auth()->id() === $user->id && auth()->user()->role === 'admin' && $request->role !== 'admin') {
            return redirect()->route('admin.users')
                ->with('error', 'You cannot change your own role from admin.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|string|in:admin,tutor,student',
            'email_verified_at' => 'sometimes|boolean',
            'image' => 'nullable|string|max:255',
        ]);

        // Store the original role to check if it's changing
        $originalRole = $user->role;
        $newRole = $validated['role'];

        // Handle email verification checkbox properly
        $emailVerifiedAt = null;
        if (isset($validated['email_verified_at']) && $validated['email_verified_at']) {
            $emailVerifiedAt = now();
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('storage/user_images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0775, true);
            }
            $file->move($destinationPath, $filename);

            // Delete old image if exists
            if ($user->image) {
                $oldPath = public_path($user->image);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $validated['image'] = '/storage/user_images/' . $filename;
        } else {
            \Log::info('No new image uploaded.');
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'email_verified_at' => $emailVerifiedAt,
            'image' => $validated['image'] ?? $user->image,
        ]);

        \Log::info('User updated:', ['user' => $user->toArray()]);

        // If user was a tutor and is no longer a tutor, delete the tutor record
        if ($originalRole === 'tutor' && $newRole !== 'tutor') {
            $tutor = $user->tutor;
            if ($tutor) {
                $tutor->courses()->detach();
                $tutor->reviews()->delete();
                $tutor->delete();
            }
        }

        // If user was not a tutor and is now becoming a tutor, create tutor record
        if ($originalRole !== 'tutor' && $newRole === 'tutor') {
            if (!$user->tutor) {
                Tutor::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'university' => null,
                    'year' => null,
                    'bio' => 'New tutor profile - please update your information',
                    'contact' => null,
                    'experience_years' => 0,
                    'hourly_rate' => 0.00,
                    'image' => null,
                ]);
            }
        }

        return redirect()->route('admin.users')
            ->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Prevent deleting the last admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return redirect()->route('admin.users')
                ->with('error', 'Cannot delete the last admin user');
        }

        $user->delete();

        return redirect()->route('admin.users')
            ->with('success', 'User deleted successfully');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // 2MB max
        ]);

        $file = $request->file('image');
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $destinationPath = public_path('storage/user_images');

        // Ensure the directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0775, true);
        }

        $file->move($destinationPath, $filename);

        $url = asset('storage/user_images/' . $filename);

        return response()->json(['url' => $url]);
    }

    /**
     * Get user statistics
     */
    public function stats()
    {
        $users = User::all();
        
        return response()->json([
            'total' => $users->count(),
            'active' => $users->where('email_verified_at', '!=', null)->count(),
            'inactive' => $users->where('email_verified_at', null)->count(),
            'tutors' => $users->where('role', 'tutor')->count(),
            'students' => $users->where('role', 'student')->count(),
            'admins' => $users->where('role', 'admin')->count(),
            'recent' => $users->where('created_at', '>=', now()->subDays(7))->count(),
        ]);
    }
}
