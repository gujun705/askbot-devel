from django.http import HttpResponse
from django.shortcuts import render
from askbot.models.presentation import Presentation

def index(request):
    # Cannot filter objects based on property? Dammed!
    presentations = Presentation.objects.all()
    existing = filter(lambda p: p.deleted == False, presentations)
    existing_sorted = sorted(existing, key=lambda x: x.create_at)
    return render(request, 'presentation/index.html', {'presentations': existing_sorted})
