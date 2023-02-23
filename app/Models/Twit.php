<?php

namespace App\Models;
use App\Events\TwitCreated; //event
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Twit extends Model
{
    use HasFactory; 

    //we use this enable mass assigment for safe attributes instead all the data in a request.
    //TODO: learn about laravel mass assignment
    protected $fillable = [
        'message',
        'images' 
    
    ];

    protected $casts = [
        'images' => 'array'
    ];
    
    //dispatch event
    protected $dispatchesEvents = [
        'created'=> TwitCreated::class,
    ];

    // defining a relationship between twit and user:: user hasMany Twits:: Check User Modal
    public function user(){
        return $this->belongsTo(User::class);
    }
}
