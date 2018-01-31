import os
import shutil

from lib.kotlin_source2ast.source2ast import source2ast

from lib.ast_set2matrix.asts2vectors import asts2vectors
from lib.ast_set2matrix.sparse_transform import sparse_transform
from lib.ast_set2matrix.vectors2matrix import vectors2matrix
from lib.ast_set2matrix.matrix2csv import matrix2csv

from lib.anomaly_detection.autoencoding import autoencoding
from lib.anomaly_detection.anomaly_selection import anomaly_selection


class Paths:
    # Stage paths to input-output files/folders
    AST = './ast'
    AST_VECTORS = './ast_vectors'
    AST_SPARSED_VECTORS = './ast_sparsed_vectors'
    DATASET_JSON = './dataset.json'
    DATASET_CSV = './dataset.csv'
    DISTANCES = './distances.json'

    # Stage paths to additional files
    FEATURES_CONFIG = './features_config.json'
    ALL_FEATURES = '%s/all_features.json' % AST_VECTORS
    FILES_MAP = './files_map.json'


CLEANABLE_FILES = [Paths.FILES_MAP, Paths.ALL_FEATURES, Paths.DATASET_JSON, Paths.DATASET_CSV, Paths.DISTANCES]
CLEANABLE_FOLDERS = [Paths.AST, Paths.AST_VECTORS, Paths.AST_SPARSED_VECTORS]


def toolchain_run(input, output):
    # Kotlin source codes paring
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

    for file in CLEANABLE_FILES:
        os.remove(file)

    for folder in CLEANABLE_FOLDERS:
        shutil.rmtree(folder)

    print('===================' + os.linesep)
    print('%d anomalies found' % anomalies_number)
