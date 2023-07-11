<?php
//
//namespace App\Jobs;
//
//use App\Models\User;
//use Illuminate\Bus\Queueable;
//use Illuminate\Contracts\Queue\ShouldQueue;
//use Illuminate\Foundation\Bus\Dispatchable;
//use Illuminate\Http\Request;
//use Illuminate\Queue\InteractsWithQueue;
//use Illuminate\Queue\SerializesModels;
//use Illuminate\Support\Facades\DB;
//use Prometheus\CollectorRegistry;
//use Prometheus\Exception\MetricsRegistrationException;
//use Prometheus\RenderTextFormat;
//use Symfony\Component\HttpFoundation\Response;
//
//
//class ObserveRequestDuration implements ShouldQueue
//{
//    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
//
//    protected Request $request;
//    protected Response $response;
//
//    /**
//     * Create a new job instance.
//     *
//     * @param Request $request
//     * @param Response $response
//     */
//    public function __construct($request, $response)
//    {
//        $this->request = $request;
//        $this->response = $response;
//    }
//
//    /**
//     * Execute the job.
//     *
//     * @param CollectorRegistry $collectorRegistry
//     * @return void
//     * @throws MetricsRegistrationException
//     */
//    public function handle(CollectorRegistry $collectorRegistry)
//    {
//        // Observe the request duration in seconds
//        $histogram = $collectorRegistry->getOrRegisterHistogram(
//            'app',
//            'http_request_duration_seconds',
//            'Duration of HTTP requests in seconds',
//            ['path', 'method', 'status'],
//            [0.05, 0.1, 0.25, 0.5, 1.0]
//        );
//
//        $start = microtime(true);
//        $duration = microtime(true) - $start;
//
//        if ($this->response instanceof Response) {
//            $status = $this->response->getStatusCode();
//        } else {
//            $status = 200; // Default status code if the response is not an instance of Response
//        }
//
//        $histogram->observe(
//            $duration,
//            $this->request->method(),
//            $this->request->getPathInfo(),
//            (string)$status
//        );
//
//        // Count the number of database queries executed
//        $databaseQueries = DB::getQueryLog();
//        $counter = $collectorRegistry->getOrRegisterCounter(
//            'app',
//            'database_queries_total',
//            'Total number of database queries'
//        );
//        $counter->incBy(count($databaseQueries));
//
//        // Collect and track CPU and memory usage
//        $cpuUsage = sys_getloadavg()[0];
//        $gauge = $collectorRegistry->getOrRegisterGauge('app', 'cpu_usage', 'CPU usage');
//        $gauge->set($cpuUsage);
//
//        $memoryUsage = memory_get_usage(true);
//        $gauge = $collectorRegistry->getOrRegisterGauge('app', 'memory_usage_bytes', 'Memory usage in bytes');
//        $gauge->set($memoryUsage);
//
//        // Count the number of registered users
//        $usersRegistered = User::count();
//        $gauge = $collectorRegistry->getOrRegisterGauge(
//            'app',
//            'users_registered_total',
//            'Total number of registered users'
//        );
//        $gauge->set($usersRegistered);
//    }
//}
