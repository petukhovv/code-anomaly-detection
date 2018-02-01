import shutil

from lib.TimeLogger import TimeLogger

from lib.kotlin_source2ast.source2ast import source2ast

from lib.ast_set2matrix.asts2vectors import asts2vectors
from lib.ast_set2matrix.sparse_transform import sparse_transform
from lib.ast_set2matrix.vectors2matrix import vectors2matrix
from lib.ast_set2matrix.matrix2csv import matrix2csv

from lib.anomaly_detection.autoencoding import autoencoding
from lib.anomaly_detection.anomaly_selection import anomaly_selection


class Paths:
    # Path to the data of intermediate stages
    STAGES_DATA = './data'

    # Stage paths to input-output files/folders
    AST = './%s/ast' % STAGES_DATA
    AST_VECTORS = './%s/ast_vectors' % STAGES_DATA
    AST_SPARSED_VECTORS = './%s/ast_sparsed_vectors' % STAGES_DATA
    DATASET_JSON = './%s/dataset.json' % STAGES_DATA
    DATASET_CSV = './%s/dataset.csv' % STAGES_DATA
    DISTANCES = './%s/distances.json' % STAGES_DATA

    # Stage paths to additional files
    FEATURES_CONFIG = './%s/features_config.json' % STAGES_DATA
    ALL_FEATURES = '%s/all_features.json' % AST_VECTORS
    FILES_MAP = './%s/files_map.json' % STAGES_DATA


def toolchain_run(input, output):
    time_logger = TimeLogger(task_name='Code anomaly detection')

    # Kotlin source codes parsing
    source2ast(input, Paths.AST)

    # Kotlin CST factorization
    asts2vectors(Paths.AST, Paths.AST_VECTORS, Paths.FEATURES_CONFIG)
    sparse_transform(Paths.AST_VECTORS, Paths.AST_SPARSED_VECTORS, Paths.ALL_FEATURES, 'list')
    vectors2matrix(Paths.AST_SPARSED_VECTORS, Paths.DATASET_JSON)
    matrix2csv(Paths.DATASET_JSON, Paths.DATASET_CSV)

    # Anomaly detection
    autoencoding(Paths.DATASET_CSV, 0.9, 0.8, Paths.DISTANCES)
    anomalies_number =\
        anomaly_selection(Paths.FILES_MAP, output, use_dbscan=False, differences_file=Paths.DISTANCES)

    shutil.rmtree(Paths.STAGES_DATA)

    time_logger.finish(full_finish=True)
    print('Found %d anomalies' % anomalies_number)
