import argparse
import json

from lib.TimeLogger import TimeLogger

parser = argparse.ArgumentParser()
parser.add_argument('--anomalies_file', '-i', nargs=1, type=str, help='folder with kotlin source codes')
parser.add_argument('--snippets_folder', '-s', nargs=1, type=str, help='output folder with anomalies as JSON')
parser.add_argument('--anomalies_folder', '-o', nargs=1, type=str, help='output folder with anomalies as JSON')

args = parser.parse_args()
anomalies_file = args.anomalies_file[0]
snippets_folder = args.snippets_folder[0]
anomalies_folder = args.anomalies_folder[0]

time_logger_common = TimeLogger(task_name="Anomalies coping")

with open(anomalies_file) as anomalies_file_descriptor:
    anomalies = json.loads(anomalies_file_descriptor.read())
    for anomaly in anomalies:
        time_logger = TimeLogger(task_name="%s coping" % anomaly[0])

        anomaly_number_splited = str(anomaly[1]).split(".")
        anomaly_number = "%s_%s" % (anomaly_number_splited[0], anomaly_number_splited[1][:9])
        anomaly_file_path = "%s/%s" % (snippets_folder, anomaly[0])
        with open(anomaly_file_path) as anomaly_snippet_descriptor:
            snippet_psi = json.loads(anomaly_snippet_descriptor.read())
            snippet = snippet_psi[0]['chars']

        with open("%s/%s" % (anomalies_folder, "%s.kt" % anomaly_number), 'w') as anomaly_file_descriptor:
            anomaly_file_descriptor.write(snippet)

        time_logger.finish()

time_logger_common.finish(full_finish=True)
