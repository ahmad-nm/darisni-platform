<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('course_categories')->cascadeOnDelete();
            $table->foreignId('tutor_id')->constrained('tutors')->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('title');
            $table->string('subject')->nullable();
            $table->decimal('price', 8, 2)->default(0);
            $table->integer('lectures')->nullable();
            $table->integer('credits')->nullable();
            $table->integer('semester')->nullable();
            $table->unsignedSmallInteger('duration_weeks')->nullable();
            $table->string('type')->nullable();
            $table->string('image')->nullable();
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['tutor_id', 'title']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('courses');
    }
};
