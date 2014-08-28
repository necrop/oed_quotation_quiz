from django.conf.urls import patterns, include, url
from django.contrib import admin

from apps.root.views import homepage


urlpatterns = patterns('',
    url(r'^$', homepage),
    url(r'^home/?$', homepage),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^r/', include('apps.qq.urls', namespace='qq', app_name='qq')),
)
