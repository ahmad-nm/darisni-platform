<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tutors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('university')->nullable();
            $table->integer('year')->nullable();
            $table->text('bio')->nullable();
            $table->string('contact')->nullable();
            $table->unsignedSmallInteger('experience_years')->default(0);
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->string('image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('tutors');
    }
};
