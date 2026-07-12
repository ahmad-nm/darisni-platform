<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\CourseReview;
use Illuminate\Support\Facades\DB;

echo "Testing Course Review Functionality\n";
echo "====================================\n\n";

// Check if CourseReview model can be loaded
echo "1. Loading CourseReview model... ";
try {
    $model = new CourseReview();
    echo "✓ Success\n";
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Check database connection
echo "2. Testing database connection... ";
try {
    $count = DB::table('course_ratings')->count();
    echo "✓ Success (found {$count} existing records)\n";
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test creating a course review
echo "3. Testing CourseReview creation... ";
try {
    // First, clean up any existing test data
    DB::table('course_ratings')->where('user_id', 2)->where('course_id', 6)->delete();
    
    $courseReview = CourseReview::create([
        'course_id' => 6,
        'user_id' => 2, // Using an existing user ID
        'rating' => 4,
        'feedback' => 'Test feedback for course review'
    ]);
    
    echo "✓ Success (ID: {$courseReview->id})\n";
    
    // Verify the data was saved correctly
    echo "4. Verifying saved data... ";
    $saved = CourseReview::find($courseReview->id);
    if ($saved && $saved->rating == 4 && $saved->feedback == 'Test feedback for course review') {
        echo "✓ Success\n";
    } else {
        echo "✗ Failed: Data not saved correctly\n";
    }
    
    // Test updating existing review
    echo "5. Testing update functionality... ";
    $updated = CourseReview::where('user_id', 2)->where('course_id', 6)->first();
    $updated->update([
        'rating' => 5,
        'feedback' => 'Updated feedback for course review'
    ]);
    echo "✓ Success\n";
    
    // Verify update
    echo "6. Verifying updated data... ";
    $updated->refresh();
    if ($updated->rating == 5 && $updated->feedback == 'Updated feedback for course review') {
        echo "✓ Success\n";
    } else {
        echo "✗ Failed: Update not saved correctly\n";
    }
    
    // Clean up test data
    echo "7. Cleaning up test data... ";
    $updated->delete();
    echo "✓ Success\n";
    
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    
    // Show more details about the error
    echo "\nError Details:\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    
    // Clean up any partial data
    DB::table('course_ratings')->where('user_id', 2)->where('course_id', 6)->delete();
}

echo "\nCourse Review Test Complete!\n";
