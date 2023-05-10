<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;
    protected $table = 'likes';
    protected $fillable = ['user_id', 'twit_id'];

    // protected $cast = [
    //     'twit_id' => 'int'
    // ];

    //making this into booleaon ( 1 or 0)
    // protected $casts = [
    //     'like_dislike' => 'boolean'
    // ];
    
    
}
