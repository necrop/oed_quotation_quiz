from django.db import models


class Quotation(models.Model):
    year = models.IntegerField()
    decade = models.IntegerField(db_index=True)
    citation = models.CharField(max_length=150)
    text = models.CharField(max_length=170)
    lemma = models.CharField(max_length=100)
    entry = models.IntegerField()
    lexid = models.IntegerField()

    class Meta:
        ordering = ['year',]

    def __str__(self):
        return '%s %s' % (self.citation, self.text)

    def citation_html(self):
        return self.citation.replace('<sc>', '<span class="author">')\
            .replace('</sc>', '</span>')

    def html(self):
        return ('<span class="citation">' + self.citation_html() + '</span>' +
                '<span class="qtext">&ldquo;' + self.text + '&rdquo;</span>')

    def target(self):
        return '%d#eid%d' % (self.entry, self.lexid)
