from django.shortcuts import render


def homepage(request):
    """
    Redirect to newquiz
    """
    params = {}
    return render(request, 'qq/newquiz.html', params)
