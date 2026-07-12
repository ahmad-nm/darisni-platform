<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tutor extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'university',
        'year',
        'bio',
        'contact',
        'experience_years',
        'hourly_rate',
        'image'
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'year' => 'integer',
        'experience_years' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'tutor_courses')
                    ->withPivot('type')
                    ->withTimestamps();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(TutorReview::class);
    }

    public function availability(): HasMany
    {
        return $this->hasMany(TutorAvailability::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    public function getTotalReviewsAttribute()
    {
        return $this->reviews()->count();
    }
}
