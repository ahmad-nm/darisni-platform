<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TutorReview extends Model
{
    protected $table = 'tutor_ratings';
    
    protected $fillable = [
        'tutor_id',
        'user_id',
        'rating',
        'feedback'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
