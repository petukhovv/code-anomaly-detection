import argparse

from toolchain_run import toolchain_run


parser = argparse.ArgumentParser()
parser.add_argument('--input_folder', '-i', nargs=1, type=str, help='folder with kotlin source codes')
parser.add_argument('--output_file', '-o', nargs=1, type=str, help='output folder with anomalies as JSON')

args = parser.parse_args()
input_folder = args.input_folder[0]
output_file = args.output_file[0]

toolchain_run(input_folder, output_file)
