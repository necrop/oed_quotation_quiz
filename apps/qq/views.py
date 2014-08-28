from django.shortcuts import render
from django.db.models import Max
from django.http import HttpResponse
from random import randint

from .models import Quotation


def homepage(request):
    """
    Home page
    """
    params = {}
    return render(request, 'qq/newquiz.html', params)


def new_quiz(request, **kwargs):
    params = {}
    return render(request, 'qq/newquiz.html', params)


def new_question(request, **kwargs):
    q = _select_random_quotation()
    params = {'quotation': q}
    return render(request, 'qq/question.html', params)


def results(request, **kwargs):
    params = {}
    return render(request, 'qq/results.html', params)


def answers(request, **kwargs):
    import json
    quotation_id = kwargs.get('id')
    try:
        q = Quotation.objects.get(pk=quotation_id)
    except Quotation.DoesNotExist:
        q = None
    if q:
        citation = q.citation.replace('<sc>', '<span class="author">')\
            .replace('</sc>', '</span>')
        data = {
            'id': q.id,
            'year': q.year,
            'citation': citation,
            'text': q.text,
            'lemma': q.lemma,
            'target': q.target(),
        }
    else:
        data = {
            'id': 0,
            'year': 0,
            'citation': '',
            'text': q.text,
            'lemma': '',
            'target': '',
        }
    response = json.dumps(data)
    return HttpResponse(response, content_type='text/plain')


def _select_random_quotation():
    # Pick a random decade...
    decade = 1500 + (randint(0, 49) * 10)
    # ...get all the records for that decade...
    decadeset = Quotation.objects.filter(decade=decade)
    # ...pick a random record from that set.
    idx = randint(0, decadeset.count()-1)
    return decadeset[idx]
