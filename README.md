# Twit Web app

![Laravel Logo](https://laravel.com/img/logomark.min.svg)

Twit web app is A social media clone, crud application where users create accounts and post, edit posts, add images to posts, and comments.
User can register to the website and he will see all the posts from the other users and he can make a twit (post).
he can see his post , edit it or delete it .and also he can comment in any post.The user also can see the comments of his post that are came from the other users,
and he can answer (replay) for that comment . 

<details>
<summary><h2>Table of Contents</h2></summary>

- [Requirements](#requirements)
- [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
</details>

<details>
 <summary><h2>I have used</h2></summary>
 

- Docker
- Node.js & NPM
- Reactjs
- Inertiajs
- MySQL 
- Elasticsearch for getting the logs from the application
- Kibana to see the logs that are in elasticsearch that comes from the application
- Grafana to see the logs also from elasticsearch

</details>


<details>
 <summary><h2>Steps that I have made for this project</h2></summary>



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

3. Создать Dockerfile:

FROM php:8.2.0-fpm: Определяет базовый образ с PHP версии 8.2.0 и модулем FPM.

WORKDIR /var/www/html: Устанавливает рабочую директорию внутри образа на /var/www/html.

RUN apt-get update && apt-get install -y: Обновляет списки пакетов и устанавливает системные зависимости.

&& docker-php-ext-install zip pdo_mysql pdo_pgsql: Устанавливает расширения PHP для работы с ZIP, MySQL и PostgreSQL.

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer: Устанавливает Composer, менеджер зависимостей для PHP.

COPY . .: Копирует содержимое текущей директории (где находится Dockerfile) в рабочую директорию внутри образа.

RUN composer install: Устанавливает зависимости приложения с помощью Composer.

CMD php artisan serve --host=0.0.0.0 --port=8000: Устанавливает команду по умолчанию для запуска PHP-сервера разработки с помощью интерфейса командной строки artisan в Laravel. Сервер настроен на прослушивание всех сетевых интерфейсов (--host=0.0.0.0) и порта 8000 (--port=8000).

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

Elasticsearch:

ELASTICSEARCH_HOST=elasticsearch: Хост Elasticsearch, где elasticsearch указывает на имя хоста Elasticsearch.
ELASTICSEARCH_PORT=9200: Порт Elasticsearch, где 9200 указывает на номер порта для подключения к Elasticsearch.
ELASTICSEARCH_SCHEME=http: Протокол для подключения к Elasticsearch, где http указывает на использование протокола HTTP.
ELASTICSEARCH_USER=: Пользователь Elasticsearch (не указано).
ELASTICSEARCH_PASS=: Пароль для пользователя Elasticsearch (не указано).
MySQL:

DB_CONNECTION=mysql: Тип соединения с базой данных MySQL.
DB_HOST=mysql: Хост базы данных MySQL, где mysql указывает на имя хоста.
DB_PORT=3306: Порт базы данных MySQL, где 3306 указывает на номер порта для подключения к MySQL.
DB_DATABASE=chirper: Имя базы данных MySQL, где chirper указывает на имя базы данных.
DB_USERNAME=root: Имя пользователя для подключения к базе данных MySQL, где root указывает на имя пользователя.
DB_PASSWORD=mysecretpassword: Пароль пользователя для подключения к базе данных MySQL, где mysecretpassword указывает на пароль.

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





<details>

<details>
  <summary>ENd</summary>

This is the content of the collapsible section.

You can add multiple paragraphs, lists, code snippets, and other Markdown elements here.
</details>


