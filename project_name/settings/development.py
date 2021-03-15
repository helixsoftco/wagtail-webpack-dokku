from .common import *
import dj_database_url

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'p3gm=o9o+_r(5*o$$kn#h*8#n1r)aquf^^nm_v5u0pn^qa$=4*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# CORS Config: install django-cors-headers and uncomment the following to allow CORS from any origin
"""
DEV_APPS = [
    'corsheaders'
]

INSTALLED_APPS += DEV_APPS

DEV_MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware'
]

MIDDLEWARE = MIDDLEWARE + DEV_MIDDLEWARE  # CORS middleware should be at the top of the list

CORS_ORIGIN_ALLOW_ALL = True
"""

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

# Configured with DATABASE_URL env, usually from dokku
if os.environ.get('DATABASE_URL', ''):
    DATABASES = {
        'default': dj_database_url.config()
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'USER': 'postgres',
            'PASSWORD': 'postgres',
            'HOST': 'db',
            'PORT': 5432,
        }
    }

# Webpack config
WEBPACK_LOADER['DEFAULT'].update({
    'BUNDLE_DIR_NAME': 'webpack_bundles/',  # must end with slash
    'STATS_FILE': os.path.join(BASE_DIR, 'webpack-development-stats.json'),
})

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'assets')
]

# Local settings
try:
    from .local import *
except ImportError:
    pass
