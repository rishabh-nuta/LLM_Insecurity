from flask import Flask, request, jsonify, send_from_directory
import os
import json
from uuid import uuid4
import subprocess
import threading


ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(ROOT_DIR, "data")
DB_FILE = "data.json"
DB_FILE_PATH = os.path.join(DB_DIR, DB_FILE)
RUNS_DIR = os.path.join(ROOT_DIR, "runs")
os.makedirs(DB_DIR, exist_ok=True)
os.makedirs(RUNS_DIR, exist_ok=True)

app = Flask(__name__, static_folder=RUNS_DIR)

def _start_test_and_logging(probe, job_id, config_file_path, runs_dir=RUNS_DIR):
    logfile_name = f'{job_id}_output.log'  
    logfile_path = os.path.join(RUNS_DIR, logfile_name)

    # Open the logfile in write mode
    with open(logfile_path, 'w', encoding='utf-8') as logfile:
        process = subprocess.Popen(
            f'python -m garak --model_type rest --probes {probe} -G {config_file_path} --config garak_config.yaml --report_prefix {job_id}',
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            shell=True,
            encoding='utf-8',
            errors='replace'
        )

        while True:
            realtime_output = process.stdout.readline()

            if realtime_output == '' and process.poll() is not None:
                break

            if realtime_output:
                # print(realtime_output.strip(), flush=True)  # Print to console
                logfile.write(realtime_output)  # Write to logfile
                logfile.flush()  # Ensure the output is written to the file immediately


@app.route("/")
def home():
	return "hello world"

@app.route('/start_test', methods=['POST'])
def start_test():
	# Step 1: Get 'dataset' and 'config_json' from the request payload
    data = request.get_json()
    probe = data.get('dataset')
    config_json = data.get('config_json')
    job_id = uuid4()
    
    if not probe or not config_json:
        return jsonify({"error": "Missing 'probe' or 'config_json' parameter"}), 400
    
    # Step 2: Inside data folder, create a config.json with data from 'uuid_config_json'
    config_file_path = os.path.join(DB_DIR, f'{job_id}_config.json')
    with open(config_file_path, 'w') as config_file:
        json.dump(config_json, config_file, indent=2)

    new_data = {
        "job_id": str(job_id),
        "probe": probe,
        "config_json_path": config_json,
        "results_file_path": os.path.join(RUNS_DIR, f"{job_id}.report.jsonl"),
        "log_file_path": os.path.join(RUNS_DIR, f"{job_id}_output.log"),
        "total_prompts": 100,
        "passed_prompts": 70,
    }
    with open(DB_FILE_PATH, 'r') as file:
        try:
            data = json.load(file)
        except json.JSONDecodeError:
            data = []
            
    data.append(new_data)

    with open(DB_FILE_PATH, 'w') as ff:
        json.dump(data, ff, indent=2)
    
    # Step 3: Start a test using garak with the 'probe' and 'config_json'
    # Run the process in a separate thread
    thread = threading.Thread(target=_start_test_and_logging, args=(probe, job_id, config_file_path))
    thread.start()

    # Step 4: Return a response saying "test started"
    return jsonify({"message": "test started", "job_id": job_id}), 200

@app.route('/get_file/<filename>', methods=['GET'])
def get_file(filename):
    # Check if the file exists within the folder
    file_path = os.path.join(RUNS_DIR, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    # Send the file
    return send_from_directory(app.static_folder, filename)

@app.route('/list', methods=['GET'])
def list_jobs():
    return jsonify(json.load(open(DB_FILE_PATH, 'r')))

if __name__ == '__main__':  
	app.run(debug=True)
