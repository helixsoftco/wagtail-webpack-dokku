from django.conf import settings
from django.urls import reverse
from wagtail import hooks
from wagtail.admin.menu import AdminOnlyMenuItem


if settings.DEBUG:
    @hooks.register('register_admin_menu_item')
    def register_schema_menu_item():
        return AdminOnlyMenuItem('API Schema/Spec', reverse('api-spec'), icon_name='doc-empty', order=1000)


    @hooks.register('register_admin_menu_item')
    def register_schema_docs_item():
        return AdminOnlyMenuItem('API Documentation', reverse('swagger-ui'), icon_name='view', attrs={"target": "_blank"}, order=1001)
