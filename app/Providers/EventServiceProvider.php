<?php

namespace App\Providers;

use App\Events\TwitCreated;
use App\Listeners\sendTwitCreatedNotifications;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\DB;
use Prometheus\CollectorRegistry;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        DB::listen(function ($query) {
            $duration = $query->time / 1000; // Convert milliseconds to seconds
            $queryType = $this->getQueryType($query->sql);

            $queryCounter = app(CollectorRegistry::class)->getOrRegisterCounter(
                'app',
                'query_count',
                'Total number of database queries',
                ['query_type']
            );
            $queryCounter->incBy(1, [$queryType]);

            $queryDuration = app(CollectorRegistry::class)->getOrRegisterHistogram(
                'app',
                'query_duration_seconds',
                'Database query duration in seconds',
                ['query_type'],
                [0.01, 0.1, 1, 5] // Adjust the buckets as per your needs
            );
            $queryDuration->observe($duration, [$queryType]);
        });
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }

    private function getQueryType($sql)
    {
        $sql = strtolower($sql);
        if (str_starts_with($sql, 'select')) {
            return 'select';
        } elseif (str_starts_with($sql, 'insert')) {
            return 'insert';
        } elseif (str_starts_with($sql, 'update')) {
            return 'update';
        } elseif (str_starts_with($sql, 'delete')) {
            return 'delete';
        } else {
            return 'other';
        }
    }
}
