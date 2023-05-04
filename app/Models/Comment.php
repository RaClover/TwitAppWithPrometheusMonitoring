<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    //specifying the table
    protected $table = 'comments';

    protected $fillable = [
        'twit_id',
        'user_id',
        'comment_body',
        'parent_id',
        'like_dislike',

    ];
    
    //making this into booleaon ( 1 or 0)
    protected $casts = [
        'like_dislike' => 'boolean'
    ];
    
    //defining a relationship between comment and user:: user hasMany comments:: Check User Modal
    public function user(){
        return $this->belongsTo(User::class);
    }
    //relation between comments and twits: Each twit can have many comments
    public function twit(){
        return $this->belongsTo(Twit::class,'twit_id','id');
    }

    //relation between comments and comments: Each comment can have many comments
    public function replies(){
        return $this->hasMany(Comment::class, 'parent_id');
    }

    //relation between comments and comments: Each comment can have many comments
    // public function parent(){
    //     return $this->belongsTo(Comment::class, 'parent_id');
    // }

}
