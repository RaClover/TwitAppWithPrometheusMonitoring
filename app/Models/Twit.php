<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Twit extends Model
{
    use HasFactory; 

    //we use this enable mass assigment for safe attributes instead all the data in a request.
    //TODO: learn about laravel mass assignment
    protected $fillable = [
        'message',
    ];


    // defining a relationship between twit and user:: user hasMany Twits:: Check User Modal
    public function user(){
        return $this->belongsTo(User::class);
    }
}