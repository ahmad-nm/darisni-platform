<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tutor_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('tutors')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('type')->nullable();
            $table->timestamps();

            $table->unique(['tutor_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutor_courses');
    }
};


Schema::create('tutor_course', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tutor_id')->constrained()->onDelete('cascade');
    $table->foreignId('course_id')->constrained()->onDelete('cascade');
    $table->string('type')->nullable(); // extra field if needed
    $table->timestamps();

    $table->unique(['tutor_id', 'course_id']); // prevent duplicates
});
