<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Twit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;

class MetricsController extends Controller
{


    public function getMetrics(Request $request)
    {

        DB::connection()->enableQueryLog();
        $collectorRegistry = app(CollectorRegistry::class);

        //memory usage metric
        $memoryUsage = memory_get_usage(true);
        $gauge = $collectorRegistry->getOrRegisterGauge('app', 'memory_usage_bytes', 'Memory usage in bytes');
        $gauge->set($memoryUsage);

        // Count the number of registered users
        $usersRegistered = User::count();
        $gauge = $collectorRegistry->getOrRegisterGauge(
            'app',
            'users_registered_total',
            'Total number of registered users'
        );
        $gauge->set($usersRegistered);

        // Count the number of Twits
        $twitsCount = Twit::count();
        $twitsCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'twits_total',
            'Total number of Twits'
        );
        $twitsCounter->set($twitsCount);


        // Count the number of comments posted on Twits
        $commentsCount = Comment::count();
        $commentsCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'comments_total',
            'Total number of comments posted on Twits'
        );
        $commentsCounter->set($commentsCount);

        // Count the number of likes
        $likesCount = Like::count();
        $likesCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'likes_total',
            'Total number of likes'
        );
        $likesCounter->set($likesCount);


        // Count the number of Twit deletions
        $twitDeletionsCount = Twit::onlyTrashed()->count();
        $twitDeletionsCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'twit_deletions_total',
            'Total number of Twit deletions'
        );
        $twitDeletionsCounter->set($twitDeletionsCount);

        // Count the number of Twit updates
        $twitUpdatesCount = Twit::whereNotNull('updated_at')->count();
        $twitUpdatesCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'twit_updates_total',
            'Total number of Twit updates'
        );
        $twitUpdatesCounter->set($twitUpdatesCount);

        // Count the number of comment deletions
        $commentDeletionsCount = Comment::onlyTrashed()->count();
        $commentDeletionsCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'comment_deletions_total',
            'Total number of comment deletions'
        );
        $commentDeletionsCounter->set($commentDeletionsCount);


        // Count the number of comment replies
        $commentRepliesCount = Comment::whereNotNull('parent_id')->count();
        $commentRepliesCounter = $collectorRegistry->getOrRegisterGauge(
            'app',
            'comment_replies_total',
            'Total number of comment replies'
        );
        $commentRepliesCounter->set($commentRepliesCount);



        // Track cache hits and misses
        $cacheHits = Cache::get('cache_hits', 0);
        $cacheMisses = Cache::get('cache_misses', 0);
        $cacheHitsCounter = $collectorRegistry->getOrRegisterCounter(
            'app',
            'cache_hits_total',
            'Total number of cache hits'
        );
        $cacheHitsCounter->incBy($cacheHits);
        $cacheMissesCounter = $collectorRegistry->getOrRegisterCounter(
            'app',
            'cache_misses_total',
            'Total number of cache misses'
        );
        $cacheMissesCounter->incBy($cacheMisses);




//        $exceptionRate = $this->getExceptionRate();
//        $exceptionRateGauge = $collectorRegistry->getOrRegisterGauge(
//            'app',
//            'exception_rate',
//            'Exception rate per minute'
//        );
//        $exceptionRateGauge->set($exceptionRate);



        $renderer = new RenderTextFormat();
        $result = $renderer->render($collectorRegistry->getMetricFamilySamples());

        return response($result, 200)->header('Content-Type', RenderTextFormat::MIME_TYPE);

    }


//    private function getExceptionRate()
//    {
//        $errorCount = app(CollectorRegistry::class)
//            ->getOrRegisterCounter('app', 'error_count', 'Total number of errors');
//        $interval = 60; // Time interval in seconds (e.g., 60 seconds)
//        return $errorCount->get() / $interval;
//    }

}
