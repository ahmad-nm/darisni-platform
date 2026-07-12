<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create {email?} {password?}';
    protected $description = 'Create an admin user';

    public function handle()
    {
        $email = $this->argument('email') ?: 'admin@admin.com';
        $password = $this->argument('password') ?: 'password';

        // Check if admin already exists
        $existingAdmin = User::where('email', $email)->first();
        if ($existingAdmin) {
            $this->info("Admin user already exists: {$email}");
            $this->info("Role: {$existingAdmin->role}");
            return;
        }

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        $this->info("Admin user created successfully!");
        $this->info("Email: {$email}");
        $this->info("Password: {$password}");
        $this->info("Please change the password after first login.");
    }
}
