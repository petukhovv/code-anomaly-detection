from lib.kotlin_source2ast.source2ast import source2ast
from lib.ast_set2matrix.asts2vectors import asts2vectors


def toolchain_run(input, output):
    source2ast(input, './ast')
    asts2vectors('./ast', './ast_vectors', './features_config.json')
