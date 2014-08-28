"""
Collector

@author: James McCracken
"""
import os

from lex.entryiterator import EntryIterator
from . import quotequizconfig

ENTRY_MAX_SIZE = quotequizconfig.ENTRY_MAX_SIZE
DATE_MIN = quotequizconfig.DATE_MIN
DATE_MAX = quotequizconfig.DATE_MAX
TEXT_LENGTH_MIN = quotequizconfig.TEXT_LENGTH_MIN
TEXT_LENGTH_MAX = quotequizconfig.TEXT_LENGTH_MAX
CITATION_LENGTH_MAX = quotequizconfig.CITATION_LENGTH_MAX
LEMMA_LENGTH_MAX = quotequizconfig.LEMMA_LENGTH_MAX
OBSCENITIES = quotequizconfig.OBSCENITIES
BUFFER_SIZE = 1000


class Collector(object):

    def __init__(self, **kwargs):
        self.output_dir = kwargs.get('output_dir', None)
        self.buffers = {}

    def collect(self):

        # Initialize the buffers where quotations will be stored
        self.buffers = {}
        for year in range(DATE_MIN, DATE_MAX+1):
            decade = (year // 10) * 10
            self.buffers[decade] = []

        iterator = EntryIterator(dict_type='oed', verbosity='low')
        for entry in iterator.iterate():

            # Skip entries which may be obscenities
            if any([token in entry.lemma for token in OBSCENITIES]):
                continue

            for sense in entry.senses():
                if sense.is_subentry() or sense.is_subentry_like():
                    pass
                elif entry.num_quotations() > ENTRY_MAX_SIZE:
                    continue

                if sense.is_subentry() or sense.is_subentry_like():
                    lemma = sense.lemma
                else:
                    lemma = entry.lemma
                lemma = lemma[0:LEMMA_LENGTH_MAX]

                for quotation in sense.quotations(strip_suppressed=True):
                    if (quotation.is_textless() or
                            quotation.is_bracketed() or
                            quotation.is_suppressed() or
                            quotation.year < DATE_MIN or
                            quotation.year > DATE_MAX or
                            quotation.citation.date_qualifier or
                            not quotation.citation.author() or
                            quotation.citation.is_glossary() or
                            quotation.text.comments() or
                            quotation.is_modernized_text() or
                            quotation.is_electronic_text() or
                            quotation.is_title_quotation()):
                        continue
                    if quotation.text.node.findall('.//i'):
                        continue

                    if quotation.citation.edition:
                        status = 30
                    elif quotation.citation.bibsub is not None:
                        status = 20
                    else:
                        status = 10
                    if quotation.citation.publication_datestring:
                        status += 10
                    if quotation.citation.is_translation():
                        status += 10

                    text = quotation.text.plaintext
                    text_lower = text.lower()
                    if (len(text) < TEXT_LENGTH_MIN or
                            len(text) > TEXT_LENGTH_MAX):
                        continue
                    if any([token in text_lower for token in OBSCENITIES]):
                        continue

                    citation = quotation.citation.html_lite
                    if len(citation) > CITATION_LENGTH_MAX:
                        continue

                    decade = (quotation.year // 10) * 10
                    row = [quotation.year,
                           citation,
                           text,
                           status,
                           lemma,
                           entry.id,
                           sense.node_id(),]
                    self.buffers[decade].append(row)
                    if len(self.buffers[decade]) > BUFFER_SIZE:
                        self._flush_buffer(decade)

        # Flush anything left in the buffers
        for decade in self.buffers:
            self._flush_buffer(decade)

    def initialize_output_files(self):
        decades = set()
        for year in range(DATE_MIN, DATE_MAX+1):
            decade = (year // 10) * 10
            decades.add(decade)
            self.buffers[decade] = []
        for decade in decades:
            filepath = self._decade_to_file(decade)
            with open(filepath, 'w') as filehandle:
                pass

    def _flush_buffer(self, decade):
        filepath = self._decade_to_file(decade)
        with open(filepath, 'a') as filehandle:
            for row in self.buffers[decade]:
                line = '\t'.join([str(cell) for cell in row])
                filehandle.write(line + '\n')
        self.buffers[decade] = []

    def _decade_to_file(self, decade):
        return os.path.join(self.output_dir, str(decade) + '.tsd')
