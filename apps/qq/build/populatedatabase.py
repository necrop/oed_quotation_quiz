import os

from apps.qq.models import Quotation


def populate_database(in_dir):
    # Clear out the existing database
    Quotation.objects.all().delete()
    # Repopulate
    print('Populating quotations table...')
    populate_quotations(in_dir)


def populate_quotations(in_dir):
    record_count = 0
    filenames = os.listdir(in_dir)
    for filename in filenames:
        in_file = os.path.join(in_dir, filename)

        rows = []
        with open(in_file, 'r') as filehandle:
            for line in filehandle:
                record_count += 1
                parts = line.strip().split('\t')
                quotation = Quotation(
                    id=record_count,
                    year=int(parts[0]),
                    decade=(int(parts[0]) // 10) * 10,
                    citation=parts[1],
                    text=parts[2],
                    lemma=parts[4],
                    entry=int(parts[5]),
                    lexid=int(parts[6]),
                )
                rows.append(quotation)

        Quotation.objects.bulk_create(rows)

