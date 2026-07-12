<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chapter extends Model
{
    protected $table = 'course_chapters';
    
    protected $fillable = [
        'course_id',
        'content'
    ];

    protected $casts = [
        'course_id' => 'integer'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
