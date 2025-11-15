import os  # <-- ADD THIS
import dj_database_url  # <-- ADD THIS
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- UPDATED: SECRET_KEY ---
# Read the secret key from an environment variable.
# We will set this in Render.
SECRET_KEY = os.environ.get(
    'SECRET_KEY', 
    'django-insecure-default-key-for-local-dev' # A fallback for local
)

# --- UPDATED: DEBUG ---
# Debug should be False in production. We'll set this from Render.
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# --- UPDATED: ALLOWED_HOSTS ---
# This will be your Render URL and Vercel URL.
# We load it from an environment variable as a comma-separated string.
ALLOWED_HOSTS_STRING = os.environ.get(
    'ALLOWED_HOSTS', 
    '127.0.0.1,localhost' # Default for local dev
)
ALLOWED_HOSTS = ALLOWED_HOSTS_STRING.split(',')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    # --- ADD WHITENOISE ---
    'whitenoise.runserver_nostatic', # Add this
    'django.contrib.staticfiles',
    'users',
    'favorites',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # --- ADD WHITENOISE MIDDLEWARE ---
    'whitenoise.middleware.WhiteNoiseMiddleware', # Add this right after SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# --- UPDATED: Database ---
# This will use Postgres in production (from DATABASE_URL)
# or fallback to SQLite for local development if DATABASE_URL is not set.
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.config(
            conn_max_age=600,
            ssl_require=True # Important for Render
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
# ... (rest of the file is the same) ...

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --- UPDATED: Static files (for Admin) ---
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' # Directory where collectstatic will gather files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- UPDATED: CORS ---
# We will set this in Render to point to your Vercel URL
CORS_ALLOWED_ORIGINS_STRING = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000' # Default for local dev
)
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_STRING.split(',')

# ... (rest of your settings if any) ...