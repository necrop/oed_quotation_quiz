"""
Management wrapper for running database build processes
"""

from django.core.management.base import BaseCommand
from apps.qq.build.pipeline import dispatch


class Command(BaseCommand):
    help = 'Run database build processes for QuoteQuiz'

    def handle(self, *args, **options):
        dispatch()
