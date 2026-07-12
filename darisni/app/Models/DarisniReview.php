<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DarisniReview extends Model
{
    protected $fillable = [
        'user_id',
        'rating',
        'feedback'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
