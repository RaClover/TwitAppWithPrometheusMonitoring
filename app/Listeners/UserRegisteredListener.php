<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Prometheus\CollectorRegistry;
use Prometheus\Counter;

class UserRegisteredListener
{
    protected $counter;

    public function __construct(CollectorRegistry $registry)
    {
        $this->counter = $registry->getOrRegisterCounter(
            'app',
            'registered_users',
            'Total count of registered users'
        );
    }

    public function handle(Registered $event)
    {
        $this->counter->inc();
    }
}
