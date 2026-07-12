<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('tutor_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('tutors')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('rating');
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->unique(['tutor_id', 'user_id']);    // one rating per user per tutor
        });

        DB::statement('ALTER TABLE tutor_ratings ADD CONSTRAINT rating_between CHECK (rating BETWEEN 1 AND 5)');
    }

    public function down(): void {
        Schema::dropIfExists('tutor_ratings');
    }
};
