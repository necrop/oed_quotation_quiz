from django.conf.urls import patterns, url

urlpatterns = patterns(
    'apps.qq.views',
    url(r'^/?$', 'homepage', name='home'),
    url(r'^home$', 'homepage', name='home'),
    url(r'^newquiz', 'new_quiz', name='newquiz'),
    url(r'^question', 'new_question', name='newquestion'),
    url(r'^check/(?P<id>[0-9]+)$', 'answers', name='answers'),
    url(r'^results', 'results', name='results'),
)
