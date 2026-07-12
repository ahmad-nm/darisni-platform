<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Course;
use Illuminate\Support\Facades\DB;

class SyncTutorCourseTypes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tutor:sync-course-types';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync tutor course types with their respective course types';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to sync tutor course types...');

        $courses = Course::with('tutors')->get();
        $updated = 0;

        foreach ($courses as $course) {
            foreach ($course->tutors as $tutor) {
                // Update the pivot table with the course type
                DB::table('tutor_courses')
                    ->where('tutor_id', $tutor->id)
                    ->where('course_id', $course->id)
                    ->update([
                        'type' => $course->type,
                        'updated_at' => now()
                    ]);
                
                $updated++;
                $this->line("Updated: Course '{$course->title}' (Type: {$course->type}) - Tutor '{$tutor->name}'");
            }
        }

        $this->info("Successfully updated {$updated} tutor-course relationships.");

        // Show current state
        $this->info("\nCurrent tutor course assignments:");
        $assignments = DB::table('tutor_courses')
            ->join('courses', 'tutor_courses.course_id', '=', 'courses.id')
            ->join('tutors', 'tutor_courses.tutor_id', '=', 'tutors.id')
            ->select('courses.title as course_title', 'courses.type as course_type', 'tutors.name as tutor_name', 'tutor_courses.type as assignment_type')
            ->get();

        foreach ($assignments as $assignment) {
            $status = $assignment->assignment_type ? '✓' : '✗';
            $this->line("{$status} Course: {$assignment->course_title} | Type: {$assignment->assignment_type} | Tutor: {$assignment->tutor_name}");
        }

        return 0;
    }
}
