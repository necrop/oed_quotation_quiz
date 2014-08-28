import os
import random
from . import quotequizconfig

QUOTES_PER_DECADE = quotequizconfig.QUOTES_PER_DECADE
SWEETSPOT = quotequizconfig.TEXT_LENGTH_SWEETSPOT


def refine(in_dir, out_dir):
    filenames = os.listdir(in_dir)
    for filename in filenames:
        in_file = os.path.join(in_dir, filename)
        out_file = os.path.join(out_dir, filename)

        rows = []
        with open(in_file, 'r') as filehandle:
            for line in filehandle:
                parts = line.strip().split('\t')
                text = parts[2]
                status = int(parts[3])
                distance = abs(len(text) - SWEETSPOT)
                score = status + distance
                rows.append((line, score))
            random.shuffle(rows)
            rows.sort(key=lambda r: r[1])
            rows = rows[0:QUOTES_PER_DECADE]

        with open(out_file, 'w') as filehandle:
            for row in rows:
                filehandle.write(row[0])
