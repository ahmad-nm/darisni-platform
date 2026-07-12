<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'course_categories';
    
    protected $fillable = [
        'name',
        'description',
        'image',
        'visible',
    ];

    protected $casts = [
        //
    ];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function getCoursesCountAttribute()
    {
        return $this->courses()->count();
    }

    public function getPublishedCoursesCountAttribute()
    {
        return $this->courses()->where('is_published', true)->count();
    }
}
