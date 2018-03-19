import argparse
import json
import shutil

from lib.TimeLogger import TimeLogger

parser = argparse.ArgumentParser()
parser.add_argument('--intersection', '-i', nargs=1, type=str, help='folder with kotlin source codes')
parser.add_argument('--anomalies_directory', nargs=1, type=str, help='output folder with anomalies as JSON')
parser.add_argument('--other_anomalies_directory', nargs=1, type=str, help='output folder with anomalies as JSON')
parser.add_argument('--new_anomalies_directory', nargs=1, type=str, help='output folder with anomalies as JSON')
parser.add_argument('--not_included_anomalies_directory', nargs=1, type=str, help='output folder with anomalies as JSON')

args = parser.parse_args()
intersection_file = args.intersection[0]
anomalies_directory = args.anomalies_directory[0]
other_anomalies_directory = args.other_anomalies_directory[0]
new_anomalies_directory = args.new_anomalies_directory[0]
not_included_anomalies_directory = args.not_included_anomalies_directory[0]

time_logger_common = TimeLogger(task_name="Anomalies selection by calculated intersection")

with open(intersection_file) as intersection_file_descriptor:
    anomalies = json.loads(intersection_file_descriptor.read())

    second_contain_only = anomalies['second_contain_only']
    for anomaly in second_contain_only:
        anomaly_filename_splited = str(second_contain_only[anomaly]).split(".")
        anomaly_filename = "%s_%s.kt" % (anomaly_filename_splited[0], anomaly_filename_splited[1][:9])
        shutil.copyfile("%s/%s" % (anomalies_directory, anomaly_filename),
                        "%s/%s" % (new_anomalies_directory, anomaly_filename))

    first_contain_only = anomalies['first_contain_only']
    for anomaly in first_contain_only:
        anomaly_filename_splited = str(first_contain_only[anomaly]).split(".")
        anomaly_filename = "%s_%s.kt" % (anomaly_filename_splited[0], anomaly_filename_splited[1][:9])
        shutil.copyfile("%s/%s" % (other_anomalies_directory, anomaly_filename),
                        "%s/%s" % (not_included_anomalies_directory, anomaly_filename))

time_logger_common.finish(full_finish=True)
