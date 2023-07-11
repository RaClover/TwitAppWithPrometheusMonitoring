<?php

namespace App\Models;
use App\Events\TwitCreated; //event
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Twit extends Model
{
    use HasFactory , SoftDeletes;

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


    public function save(array $options = [])
    {
        if (!$this->exists) {
            $this->created_at = now();
            $this->updated_at = null;
        } else {
            $this->updated_at = now();
        }

        parent::save($options);
    }

    // defining a relationship between twit and user:: user hasMany Twits:: Check User Modal
    public function user(){
        return $this->belongsTo(User::class);
    }
    //relation between comments and twits: Each twit can have many comments
    public function comments(){
        return $this->hasMany(Comment::class,'twit_id','id');
    }

    //relation between twit and likes: Each twit can have many likes
    public function likes(){
        return $this->hasMany(Like::class);
    }






}
