# general imports
from django.urls import path
from django.urls import include

# api imports
from rest_framework import routers
from main.api import ConfigurationView

# api urls
api_router = routers.DefaultRouter()
# /api/main/configurations
api_router.register('configurations', ConfigurationView)

apiurls = ([
    # /api/main/<routers>
    path('', include(api_router.urls))
], 'main')

# general urls
urlpatterns = []
