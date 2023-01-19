<?php

namespace App\Notifications;

use App\Models\Twit; //modal
use Illuminate\Bus\Queueable;
use Illuminate\Support\Str; //str
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTwit extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public Twit $twit) //add TwitModal to allow it to accept the Twit
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line("Check to see what {$this->twit->user->name} is twitting about. Join the converstation!")
                    ->action('Notification Action', url('/'))
                    ->subject("New Twit from {$this->twit->user->name}")
                    ->greeting("{$this->twit->user->name} Just posted a new Twit!")
                    ->line(Str::limit($this->twit->message,60))
                    ->action('See more',url('/'))
                    ->line('Thank you for using Twiter!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
