<?php

namespace App\Http\Controllers;

use App\Logging\ElasticsearchLogger;
use Elasticsearch\ClientBuilder;
use Illuminate\Support\Facades\Log;
use DateTime;
use DateTimeZone;

class LogsController extends Controller
{

    /**
     * @throws \Exception
     */
    public static  function sendLogs($message , $level , $userName , $userEmail)
    {
        // Create Elasticsearch client
        $hosts = [
            [
                'host' => 'elasticsearch',
                'port' => 9200,
            ]
        ];
        $client = ClientBuilder::create()->setHosts($hosts)->build();

        // Create a DateTime object with the current timestamp
        $timestamp = new DateTime('now', new DateTimeZone('UTC'));

        // Format the timestamp in the desired format
        $formattedTimestamp = $timestamp->format('Y-m-d\TH:i:s.u\Z');

        // Define log entry data
        $logData = [
            'message' => $message,
            'level' => $level,
            'context' => [
                'user_name' => $userName,
                'user_email' => $userEmail,
            ],
            'timestamp' => $formattedTimestamp,
        ];

        // Index the log entry
        $params = [
            'index' => 'twit_logs', // Specify the index name
            'body' => $logData,
        ];
        $response = $client->index($params);

//        return 'Logs pushed to Elasticsearch';
        return $response; // Return the Elasticsearch response
    }

}
