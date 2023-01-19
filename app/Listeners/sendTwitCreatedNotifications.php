<?php

namespace App\Listeners;
use App\Events\TwitCreated;
use App\Models\User; //add user
use App\Notifications\NewTwit; //add notification
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class sendTwitCreatedNotifications implements ShouldQueue //implements shouldque to run in a queue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\TwitCreated  $event
     * @return void
     */
    public function handle(TwitCreated $event)
    {
        //que events
        foreach (User::whereNot('id',$event->twit->user_id)->cursor() as $user){
            $user->notify(new NewTwit($event->twit));
        }
    }
}
