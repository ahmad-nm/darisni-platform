<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('course_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('rating');
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->unique(['course_id', 'user_id']);   // one rating per user per course
        });
    
        DB::statement('ALTER TABLE course_ratings ADD CONSTRAINT rating_between CHECK (rating BETWEEN 1 AND 5)');
    }

    public function down(): void {
        Schema::dropIfExists('course_ratings');
    }
};
