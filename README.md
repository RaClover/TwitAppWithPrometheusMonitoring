# Twit Web app

![Laravel Logo](https://laravel.com/img/logomark.min.svg)

Twit web app is A social media clone, crud application where users create accounts and post, edit posts, add images to posts, and comments.
User can register to the website and he will see all the posts from the other users and he can make a twit (post).
he can see his post , edit it or delete it .and also he can comment in any post.The user also can see the comments of his post that are came from the other users,
and he can answer (replay) for that comment . 


## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## I have used 

- Docker
- Node.js & NPM
- Reactjs
- Inertiajs
- MySQL 
- Elasticsearch for getting the logs from the application
- Kibana to see the logs that are in elasticsearch that comes from the application
- Grafana to see the logs also from elasticsearch

## Steps that I have made for this project



1. Make the docker-compose file with the images (app, mysql, elasticsearch , kibana , grafana):

```bash
git clone https://github.com/yourusername/yourlaravelproject.git
```

2. Clone the repository:

```bash
version: '3.8'

services:
    app:
        build:
            context: .
            dockerfile: Dockerfile
        container_name: laravel_app
        ports:
            - "8000:8000"
        volumes:
            - .:/var/www/html
        depends_on:
            - mysql

    mysql:
        image: mysql:8.0
        ports:
            - '3307:3306'
        environment:
            MYSQL_ROOT_PASSWORD: '${DB_PASSWORD}'
            MYSQL_ROOT_HOST: "%"
            MYSQL_DATABASE: '${DB_DATABASE}'
            MYSQL_PASSWORD: '${DB_PASSWORD}'
        volumes:
            - twit_mysql_data:/var/lib/mysql

    elasticsearch:
        image: elasticsearch:7.6.2
        container_name: elasticsearch
        environment:
            - discovery.type=single-node
        ports:
            - "9200:9200"
        deploy:
            resources:
                limits:
                    memory: 4g

    kibana:
        image: kibana:7.6.2
        container_name: kibana
        ports:
            - "5601:5601"
        depends_on:
            - elasticsearch

    grafana:
        image: grafana/grafana
        container_name: grafana
        ports:
            - "8080:3000"
        depends_on:
            - elasticsearch

volumes:
    twit_mysql_data:

```

3. Make the Dockerfile:

```bash
FROM php:8.2.0-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    libpq-dev \
    && docker-php-ext-install zip pdo_mysql pdo_pgsql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install application dependencies
RUN composer install

CMD php artisan serve --host=0.0.0.0 --port=8000

```
4. Install docker / docker desktop
5. Configure the .env file : 

```bash
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_SCHEME=http
ELASTICSEARCH_USER=
ELASTICSEARCH_PASS=


DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=chirper
DB_USERNAME=root
DB_PASSWORD=mysecretpassword
```
6. Install the elasticsearch using composer : 

```bash
composer require elasticsearch/elasticsearch
```

7. Configure the channels in config/logging.php :

```bash
  'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['single', 'elasticsearch'],
            'ignore_exceptions' => false,
        ],
        'elasticsearch' => [
            'driver' => 'custom',
            'via' => App\Logging\ElasticsearchLogger::class,
            'client' => Elasticsearch\ClientBuilder::fromConfig([
                'hosts' => [
                    [
                        'host' => env('ELASTICSEARCH_HOST', 'localhost'),
                        'port' => env('ELASTICSEARCH_PORT', 9200),
                        'scheme' => env('ELASTICSEARCH_SCHEME', 'http'),
                        'user' => env('ELASTICSEARCH_USER', null),
                        'pass' => env('ELASTICSEARCH_PASS', null),
                    ],
                ],
            ]),
            'index' => 'twit_logs', // Customize the index name as per your preference
            'level' => 'info',
        ],
    ],
```

8. Make App\Logging\ElasticsearchLogger class with this content :

```bash
class ElasticsearchLogger extends AbstractProcessingHandler
{
    private $elasticsearch;
    private $index;

    public function __construct(Client $elasticsearch, $index, $level = Logger::DEBUG, bool $bubble = true)
    {
        parent::__construct($level, $bubble);
        $this->elasticsearch = $elasticsearch;
        $this->index = $index;
    }

    protected function write(array $record): void
    {
        // Create a DateTime object with the current timestamp
        $timestamp = new DateTime('now', new DateTimeZone('UTC'));

        // Format the timestamp in the desired format
        $formattedTimestamp = $timestamp->format('Y-m-d\TH:i:s.u\Z');

        if ($record['level'] >= $this->level) {
            $this->elasticsearch->index([
                'index' => $this->index,
                'body' => [
                    'message' => $record['message'],
                    'level' => $record['level_name'],
                    'context' => $record['context'],
//                    'timestamp' => $record['datetime']->format('Y-m-d H:i:s'),
                    'timestamp' => $formattedTimestamp,
                ],
            ]);
        }
    }
}
```


