<?php

namespace App\Providers;

use Elasticsearch\ClientBuilder;
use Illuminate\Support\ServiceProvider;
use Elasticsearch\Client;

class ElasticsearchServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Client::class, function ($app) {
            $clientBuilder = ClientBuilder::create()
                ->setHosts([
                    [
                        'host' => env('ELASTICSEARCH_HOST'),
                        'port' => env('ELASTICSEARCH_PORT'),
                        'scheme' => env('ELASTICSEARCH_SCHEME'),
                        'user' => env('ELASTICSEARCH_USER'),
                        'pass' => env('ELASTICSEARCH_PASSWORD'),
                    ],
                ]);

            return $clientBuilder->build();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
