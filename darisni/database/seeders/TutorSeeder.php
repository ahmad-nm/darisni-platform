<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tutor;
use App\Models\Course;
use App\Models\TutorAvailability;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TutorSeeder extends Seeder
{
    public function run(): void
    {
        $tutors = [
            [
                'name' => 'Ahmad Khalil',
                'email' => 'ahmad.tutor@example.com',
                'university' => 'Lebanese University',
                'year' => 4,
                'bio' => 'Computer Science tutor specializing in programming and algorithms.',
                'contact' => '+96170000000',
                'experience_years' => 5,
                'hourly_rate' => 20.00,
                'image' => null,
            ],

            [
                'name' => 'Sara Hassan',
                'email' => 'sara.tutor@example.com',
                'university' => 'American University of Beirut',
                'year' => 3,
                'bio' => 'Mathematics tutor helping students understand calculus and algebra.',
                'contact' => '+96171111111',
                'experience_years' => 3,
                'hourly_rate' => 15.00,
                'image' => null,
            ],

            [
                'name' => 'Mohammad Ali',
                'email' => 'mohammad.tutor@example.com',
                'university' => 'Saint Joseph University',
                'year' => 2,
                'bio' => 'Physics tutor with experience teaching high school students.',
                'contact' => '+96172222222',
                'experience_years' => 4,
                'hourly_rate' => 18.00,
                'image' => null,
            ],
        ];


        foreach ($tutors as $data) {

            // Create user account
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'tutor',
                'email_verified_at' => now(),
            ]);


            // Create tutor profile
            $tutor = Tutor::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'university' => $data['university'],
                'year' => $data['year'],
                'bio' => $data['bio'],
                'contact' => $data['contact'],
                'experience_years' => $data['experience_years'],
                'hourly_rate' => $data['hourly_rate'],
                'image' => $data['image'],
            ]);


            // Add availability
            TutorAvailability::create([
                'tutor_id' => $tutor->id,
                'day' => 'Monday',
                'start_time' => '09:00:00',
                'end_time' => '12:00:00',
            ]);

            TutorAvailability::create([
                'tutor_id' => $tutor->id,
                'day' => 'Wednesday',
                'start_time' => '14:00:00',
                'end_time' => '17:00:00',
            ]);


            // Attach courses if courses exist
            $courses = Course::inRandomOrder()
                ->take(2)
                ->get();

            foreach ($courses as $course) {
                $tutor->courses()->attach($course->id, [
                    'type' => 'Private',
                ]);
            }
        }
    }
}