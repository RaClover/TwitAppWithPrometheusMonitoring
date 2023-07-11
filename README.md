# Twit Web application

 <h3>. приложение</h3> 
Мое приложение - это клон социальных сетей, приложение crud, в котором пользователи создают учетные записи и публикуют, редактируют посты, добавляют изображения к постам и комментарии.
Пользователь может зарегистрироваться на веб-сайте, и он увидит все сообщения от других пользователей, и он может сделать Post (Twit).
он может просмотреть свой пост, отредактировать его или удалить. а также он может прокомментировать любой Post.Пользователь также может видеть комментарии к своему посту, которые пришли от других пользователей,
и он может ответить на этот комментарий. 

# Построенный с
1. Php 8
2. Laravel 10
3. ReactJs
4. Mysql
5. Docker & docker compose
6. Prometheus Custom metrics
7. Prometheus Alertmanager
8. Node exporter
9. Blackbox exporte
10. Mysql exporter
11. Nginx


# Объяснение
<h3>. Prometheus </h3> 
Prometheus является системой мониторинга с открытым исходным кодом, предназначенной для сбора и анализа метрик из различных систем и приложений. Он позволяет получить информацию о производительности и состоянии системы.Прометей следует модели пассивного мониторинга, периодически запрашивая данные метрик из настроенных источников, таких как серверы, контейнеры или сервисы. Эти источники предоставляют метрики в специальном формате (обычно в формате Prometheus экспозиции), который Прометей может интерпретировать.Собранные метрики хранятся Прометеем в базе данных временных рядов и позволяют выполнять запросы и анализ через мощный язык запросов PromQL (Prometheus Query Language). Этот язык позволяет пользователям создавать сложные запросы и выражения для фильтрации, агрегации и манипуляции собранными метриками.

<h3>. Node Exporter </h3> 
 Node Exporter - это инструмент, который позволяет Прометею собирать информацию о системе и ресурсах хоста, таких как процессор, память, дисковое пространство и сетевые интерфейсы. Он предоставляет метрики, связанные с работой самого узла, которые затем можно использовать для мониторинга и анализа.

<h3>. Blackbox Exporter </h3> 
Blackbox Exporter - это компонент Прометея, который позволяет выполнять активное мониторинговые проверки различных сетевых служб и протоколов, таких как HTTP, DNS, TCP и других. Он позволяет проверять доступность сервисов, проверять работу определенных эндпоинтов и возвращать соответствующие метрики, которые затем могут быть использованы для оповещения и анализа состояния сети.

<h3>. Mysql Exporter </h3> 
MySQL Exporter - это экспортер Прометея, который позволяет собирать метрики и статистику производительности из базы данных MySQL. Он предоставляет информацию о запросах, подключениях, потоках, кэше и других аспектах работы MySQL. Эти метрики могут быть использованы для отслеживания производительности базы данных и выявления проблем.

<h3>. Grafana </h3> 
это инструмент визуализации данных и построения графиков, который часто используется в сочетании с Прометеем. Он позволяет создавать красочные и информативные дашборды, настраивать графики и панели инструментов на основе собранных метрик Прометея. Grafana предлагает широкий спектр визуальных возможностей, которые помогают пользователю легко интерпретировать и анализировать данные мониторинга.




# Шаги по настройке мониторинга

<h3>Шаг 1</h3> 
Создайте файл docker-compose.yml с контейнеры (twit, ngix, mysql, promethesu, mysql-exporter , node-exporter, blackbox-exporter)


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

<h3>Шаг 2</h3> 
созданный файл Dockerfile

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

<h3>Шаг 3</h3>
создай Prometheus.yml для настройки prometheus с экспортерами

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
<h3>Шаг 4</h3>
создание файла Nginx конфигурации

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

```

<h3>Шаг 5</h3>
создание  Alertmanager.yml и alert_rules.yml конфигурации

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

```

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

```
<h3>Шаг 6</h3>
создайте route /metrica в приложении для Prometheus Endpoint 

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

```
<h3>Шаг 7</h3>
Создайте Middleware  для считать запроса (Request metrics )


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

```
<h3>Шаг 8</h3>
Создайте контроллер для всех metrics

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

```



# Полученные результаты


###  Docker
![Login Page](public/Imgs/spa1.jpg)


###  metrics в приложении localhost:8000/metrics
![Login Page](public/Imgs/spa1.jpg)

### metrics в prometheus localhost:9090
![registration](public/Ima)

### alertmanager
![CRUD USERS](public/Imgs/spa4.jpg)

### 4. metrics в Node Exporter
![CRUD ROLES](public/Imgs/spa5.jpg)

### 4. metrics в Blackbox Exporter
![CRUD ROLES](public/Imgs/spa5.jpg)

### 4. metrics в Mysql Exporter
![CRUD ROLES](public/Imgs/spa5.jpg)

### 4. Grafana
![CRUD ROLES](public/Imgs/spa5.jpg)

