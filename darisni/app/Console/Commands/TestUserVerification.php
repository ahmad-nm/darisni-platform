<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class TestUserVerification extends Command
{
    protected $signature = 'test:verification {user_id?}';
    protected $description = 'Test user email verification';

    public function handle()
    {
        $userId = $this->argument('user_id');
        
        if (!$userId) {
            // Show all users
            $users = User::orderBy('id', 'desc')->take(5)->get();
            $this->info("Recent users:");
            foreach ($users as $user) {
                $verified = $user->email_verified_at ? 'VERIFIED' : 'UNVERIFIED';
                $this->info("ID: {$user->id} | {$user->name} | {$user->email} | {$verified}");
            }
            return;
        }
        
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User {$userId} not found");
            return;
        }

        $this->info("User: {$user->name}");
        $this->info("Email: {$user->email}");
        $this->info("Email verified at: " . ($user->email_verified_at ? $user->email_verified_at : 'NULL'));
        $this->info("Is verified: " . ($user->email_verified_at ? 'YES' : 'NO'));
        
        // Test updating verification
        $this->info("\nTesting verification update...");
        $user->email_verified_at = now();
        $user->save();
        $user->refresh();
        
        $this->info("After update:");
        $this->info("Email verified at: " . ($user->email_verified_at ? $user->email_verified_at : 'NULL'));
        $this->info("Is verified: " . ($user->email_verified_at ? 'YES' : 'NO'));
    }
}
