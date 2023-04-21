# project_name

Wagtail 4.1 + Django 4.1 + Webpack + Postgres 11 + Dokku config (Production Ready)

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

### How to install the template

Clone the repository, and update your origin url: 
```
git clone https://github.com/helixsoftco/wagtail-webpack-dokku project_name
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

### How to run the project

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

### Accessing Administration

The django admin site of the project can be accessed at `localhost:8000/admin`

By default, the development configuration creates a superuser with the following credentials:

```
Username: admin
Password: admin
```

### Authentication with OAuth2

The REST API is configured along with `django-oauth2-toolkit`, and the `dev` fixture creates an OAuth2 application with the authorization-code flow.
You can start the authorization-code flow by going to:

http://localhost:8000/o/authorize

With the following parameters:

* response_type: code
* client_id: MDzf7CCFbK3I12vmBR0QxjK14gNJYnD6rcjH7s3O
* redirect_uri: http://localhost:8000/noexist/callback
* code_challenge: XRi41b-5yHtTojvCpXFpsLUnmGFz6xR15c3vpPANAvM
* code_challenge_method: S256

The Full URL is:

http://localhost:8000/o/authorize/?response_type=code&code_challenge=XRi41b-5yHtTojvCpXFpsLUnmGFz6xR15c3vpPANAvM&code_challenge_method=S256&client_id=MDzf7CCFbK3I12vmBR0QxjK14gNJYnD6rcjH7s3O&redirect_uri=http://localhost:8000/noexist/callback

> **IMPORTANT:** You can see the parameters contain the code_challenge for [PKCE (Proof Key for Code Exchange)](https://oauth.net/2/pkce/),
here you can see an example about how to create the code_challenge with Javascript:
https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce

> In case you want to disable PKCE, add the following to the OAuth settings:
```python
OAUTH2_PROVIDER = {
    'PKCE_REQUIRED': False,
}
```

For more information see:

- https://django-oauth-toolkit.readthedocs.io/en/latest/getting_started.html

## Production Deployment:

The project is dokku ready, these are the steps to deploy it in your dokku server:

#### Server Side:

> These docs do not cover dokku setup, you should already have configured the initial dokku config including ssh keys

Create the app and configure postgres:
```
dokku apps:create project_name
dokku git:set project_name deploy-branch main
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
* DATABASE_URL e.g: postgres://{user}:{password}@{hostname}:{port}/{database-name}

Use the same command to configure secret credentials for the app

#### Local Side: ####

Configure the dokku remote:

```
git remote add production dokku@<my-dokku-server.com>:project_name
```

Now config your SSH key so that it gets loaded when pushing the code, open `~/.ssh/config` and add the following:
```
Host my-dokku-server.com
    Hostname my-dokku-server.com
    IdentityFile ~/.ssh/my-ssh-key-with-access
```

Push your changes and just wait for the magic to happens :D:

```
git push production master
```

> *IMPORTANT:* After deploying configure the correct site domain on: https://<my-domain>/admin/sites/
> Otherwise some URLs would be blocked by the ALLOWED_HOSTS due to Wagtail requesting localhost

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

In the server create the directories that will host the `static` and `media` files:
```
sudo mkdir -p /var/lib/dokku/data/storage/project_name/media
sudo mkdir -p /var/lib/dokku/data/storage/project_name/static
```

**IMPORTANT**: The directories owner should be the same user as in the docker containers, currently `wagtail`,
the GUI and UID should be `2000` (You can confirm these values in the Dockerfile), otherwise the containers won't have enough permissions to read/write to the directories,
therefore the following commands to create the user and assign it the directories are needed:
```
sudo groupadd --gid 2000 wagtail
sudo useradd --uid 2000 --gid wagtail wagtail
sudo chown -R wagtail:wagtail /var/lib/dokku/data/storage/project_name/media
sudo chown -R wagtail:wagtail /var/lib/dokku/data/storage/project_name/static
```

Now, in the server configure the dokku persistent storage:
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

### Extra steps

#### Configuring the domain

You might get a `400` or `403` response from the server if you haven't configured the `ALLOWED_HOSTS` or the `CSRF_TRUSTED_ORIGINS` correctly, therefore open
`settings/production.py` and update the `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` accordingly.

#### Installing SSL
Dokku makes it easy to configure SSL on the apps by using its letsencrypt plugin, to do so install the plugin:
```
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

Config the letsencrypt email if you haven't already:
```
dokku config:set --global DOKKU_LETSENCRYPT_EMAIL=your@email.tld
```

Enable it for the app:
```
dokku letsencrypt:enable project_name
```

And finally configure the auto-renewal:
```
dokku letsencrypt:cron-job --add
```

#### Create a Superuser

So can do so with these commands when the application is running:
```
dokku enter project_name
python manage.py createsuperuser
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
