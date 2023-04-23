from drf_spectacular.extensions import OpenApiAuthenticationExtension


# Note, drf-spectacular will automatically pick up this extension as long as it is loaded,
# therefore this is loaded from models.apps.MainConfig.ready()
class Oauth2AuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = 'oauth2_provider.contrib.rest_framework.OAuth2Authentication'
    name = 'bearerToken'  # name used in the schema

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'scheme': 'bearer',
        }
