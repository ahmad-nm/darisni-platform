<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Course;
use App\Models\Tutor;

echo "Testing Tutor Course Assignment Types\n";
echo "=====================================\n\n";

// Test the current state
$course = Course::find(6);
echo "Course: {$course->title} (Type: {$course->type})\n";

$tutor = Tutor::find(1);
echo "Tutor: {$tutor->name}\n\n";

// Check current assignment
$currentAssignment = $course->tutors()->where('tutor_id', $tutor->id)->first();
if ($currentAssignment) {
    echo "Current assignment type: {$currentAssignment->pivot->type}\n";
    echo "Assignment created: {$currentAssignment->pivot->created_at}\n";
    echo "Assignment updated: {$currentAssignment->pivot->updated_at}\n";
} else {
    echo "No current assignment found\n";
}

echo "\nTest completed!\n";
