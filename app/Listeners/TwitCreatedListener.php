<?php

namespace App\Listeners;

use App\Events\TwitCreated;
use App\Models\Twit;
use Prometheus\CollectorRegistry;
use Prometheus\Counter;

class TwitCreatedListener
{
    protected $counter;

    public function __construct(CollectorRegistry $registry)
    {
        $this->counter = $registry->getOrRegisterCounter(
            'app',
            'total_twits',
            'Total count of twits'
        );
    }

    public function handle(TwitCreated $event)
    {
        $this->counter->inc();
    }
}
