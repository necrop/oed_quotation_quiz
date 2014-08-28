"""
Pipeline - Runs build processes for quotation-dating quiz
"""

from . import quotequizconfig


def dispatch():
    for function_name, status in quotequizconfig.PIPELINE:
        if status:
            print('=' * 30)
            print('Running "%s"...' % function_name)
            print('=' * 30)
            func = globals()[function_name]
            func()


def collect_quotations():
    from .collector import Collector
    coll = Collector(output_dir=quotequizconfig.RAW_DIR)
    coll.initialize_output_files()
    coll.collect()


def filter_quotations():
    from .refiner import refine
    refine(quotequizconfig.RAW_DIR, quotequizconfig.FILTERED_DIR)


def populate_db():
    from .populatedatabase import populate_database
    populate_database(quotequizconfig.FILTERED_DIR)



if __name__ == '__main__':
    dispatch()
