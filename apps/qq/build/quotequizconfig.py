"""
fulltextconfig -- configuration for OED full-text linking processes
"""

import os
from lex import lexconfig
from apps.qq.models import Quotation

PIPELINE = [
    ('collect_quotations', 1),
    ('filter_quotations', 1),
    ('populate_db', 1),
]

OED_ROOT = lexconfig.OED_DIR
PROJECT_ROOT = os.path.join(OED_ROOT, 'projects', 'quotequiz')

RAW_DIR = os.path.join(PROJECT_ROOT, 'quotations_raw')
FILTERED_DIR = os.path.join(PROJECT_ROOT, 'quotations_filtered')

ENTRY_MAX_SIZE = 50
DATE_MIN = 1500
DATE_MAX = 1999
TEXT_LENGTH_MIN = 70
TEXT_LENGTH_MAX = min(170, Quotation._meta.get_field('text').max_length)
TEXT_LENGTH_SWEETSPOT = 120
CITATION_LENGTH_MAX = Quotation._meta.get_field('citation').max_length
LEMMA_LENGTH_MAX = Quotation._meta.get_field('lemma').max_length
QUOTES_PER_DECADE = 500

OBSCENITIES = ('shit', 'piss', 'fuck', 'cunt', 'sex', 'penis', 'vagina',
               'nigger', 'negro', 'fellatio', 'cunniling', 'blowjob')
