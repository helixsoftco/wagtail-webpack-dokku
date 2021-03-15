# project_name

Wagtail 2.12 + Django 3.1 + Webpack + Postgres 11 + Dokku config (Production Ready)

## Documentation ##

### Directory Tree ###
```

├── main (Main application of the project, use it to add main templates, statics and root routes)
│   ├── fixtures
│   │   ├── dev.json (Useful dev fixtures, by default it creates an `admin` user with password `admin`)
│   │   └── initial.json (Initial fixture loaded on each startup of the project)
│   ├── migrations
│   ├── static (Add here the main statics of the app)
│   ├── templates (Add here the main templates of the app)
│   ├── admin.py
│   ├── apps.py
│   ├── models.py (Main models like City, Config)
│   ├── tests.py (We hope you will put some tests here :D)
│   ├── urls.py (Main urls, place the home page here)
│   └── views.py
├── assets (js, stylesheets, etc to create bundle using webpack)
├── media
├── project_name
│   ├── settings
│   │   ├── partials
│   │   │   └── util.py (Useful functions to be used in settings)
│   │   ├── common.py (Common settings for different environments)
│   │   ├── development.py (Settings for the development environment)
│   │   └── production.py (Settings for production)
│   ├── urls.py
│   └── wsgi.py
├── scripts
│   ├── command-dev.sh (Commands executed after the development containers are ready)
│   └── wait-for-it.sh (Dev script to wait for the database to be ready before starting the django app)
├── static
├── Dockerfile (Instructions to create the project image with docker)
├── Makefile (Useful commands)
├── Procfile (Dokku or Heroku file with startup command)
├── README.md (This file)
├── app.json (Dokku deployment configuration)
├── docker-compose.yml (Config to easily deploy the project in development with docker)
├── manage.py (Utility to run most django commands)
└── requirements.txt (Python dependencies to be installed)
```

### How to install the template ###

Clone the repository, and update your origin url: 
```
git clone https://github.com/altixco/django-postgres-dokku project_name
cd project_name
```

Merge the addons required by your project (Optional):
```
git merge origin/rest
git merge origin/webpack
git merge origin/push-notifications
```

Rename your project files and directories:
```
make name=project_name init
```
> Info: Make is required, for mac run `brew install make`

> After this command you can already delete the init command inside the `Makefile` 

The command before will remove the `.git` folder, so you will have to initialize it again:
```
git init
git remote add origin <repository-url>
```

### How to run the project ###

The project use docker, so just run:

```
docker-compose up
```

> If it's first time, the images will be created. Sometimes the project doesn't run at first time because the init of postgres, just run again `docker-compose up` and it will work.

*Your app will run in url `localhost:8000`*

To recreate the docker images after dependencies changes run:

```
docker-compose up --build
```

To remove the docker containers including the database (Useful sometimes when dealing with migrations):

```
docker-compose down
```

#### Assets development with webpack

After the containers are running, the webpack bundle is required in order to render the statics, so just run:

```
make webpack-dev
```

The previous command will generate the bundle for webpack once. 
However, if you want to take advantage of the live reload functionality you should use the next command instead:

```
make webpack-dev-server
```

> *NOTE:* You must run one of the previous commands at least once, otherwise the following error would be displayed:
> OSError at / Error reading /src/webpack-development-stats.json. Are you sure webpack has generated the file and the path is correct?

### Accessing Administration

The django admin site of the project can be accessed at `localhost:8000/admin`

By default, the development configuration creates a superuser with the following credentials:

```
Username: admin
Password: admin
```

## Production Deployment: ##

The project is dokku ready, these are the steps to deploy it in your dokku server:

#### Server Side: ####

> These docs do not cover dokku setup, you should already have configured the initial dokku config including ssh keys

Create the app and configure postgres:
```
dokku apps:create project_name
dokku postgres:create project_name
dokku postgres:link project_name project_name
```

> If you don't have dokku postgres installed, run this before:
> `sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git`

Create the required environment variables:
```
dokku config:set project_name ENVIRONMENT=production DJANGO_SECRET_KEY=....
```

Current required environment variables are:

* ENVIRONMENT
* DJANGO_SECRET_KEY
* EMAIL_PASSWORD

Use the same command to configure secret credentials for the app

#### Local Side: ####

Configure the dokku remote:

```
git remote add production dokku@<my-dokku-server.com>:project_name
```

Push your changes and just wait for the magic to happens :D:

```
git push production master
```

Optional: To add SSL to the app check:
https://github.com/dokku/dokku-letsencrypt

Optional: Additional nginx configuration (like client_max_body_size) should be placed server side in:
```
/home/dokku/<app>/nginx.conf.d/<app>.conf
```

> Further dokku configuration can be found here: http://dokku.viewdocs.io/dokku/

### Serving static and media files from the dokku server

In case you want to serve the `static` and `media` files directly from the server, instead of AWS or a different storage,
the following steps are required:

In the server configure the dokku persistent storage:

```
dokku storage:mount project_name /var/lib/dokku/data/storage/project_name/media:/src/media
dokku storage:mount project_name /var/lib/dokku/data/storage/project_name/static:/src/static
dokku ps:restart project_name
```
> See: https://github.com/dokku/dokku/blob/master/docs/advanced-usage/persistent-storage.md

Then add the following config:
```
location /media/ {
  alias /var/lib/dokku/data/storage/project_name/media/;
}
location /static/ {
  alias /var/lib/dokku/data/storage/project_name/static/;
}
```

To the following file (You may need to create it):
```
/home/dokku/project_name/nginx.conf.d/project_name.conf
```

Finally, restart Nginx:
```
service nginx restart
```

### Configuring CORS

In production, you may want to configure Nginx to allow requests from a different domain, in that case add:

```
add_header "Access-Control-Allow-Origin" * always;
add_header "Access-Control-Allow-Methods" "GET, POST, PUT, OPTIONS, HEAD, PATCH, DELETE" always;
add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept" always;

if ($request_method = OPTIONS) {
  return 204;
}
```

To the following file:
```
/home/dokku/project_name/nginx.conf.d/project_name.conf
```

Then restart Nginx:
```
service nginx restart
```
