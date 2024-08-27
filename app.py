from flask import Flask, request, jsonify, send_from_directory
import os
import json
from uuid import uuid4


app = Flask(__name__)

DB_DIR = "data"
DB_FILE = "data.json"
DB_FILE_PATH = os.path.join(DB_DIR, DB_FILE)
RUNS_DIR = "runs"
os.makedirs(RUNS_DIR, exist_ok=True)


@app.route("/")
def home():
	return "hello world"


@app.route('/start_test', methods=['POST'])
def start_test():
	# Step 1: Get 'probe' and 'config_json' from the request payload
    data = request.get_json()
    probe = data.get('probe')
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
        "config_json_path": config_file_path,
        "results_file_path": os.path.join(RUNS_DIR, f"{job_id}.report.jsonl"),
        "log_file_path": os.path.join(RUNS_DIR, f"{job_id}.log"),
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
        
    # Step 4: Return a response saying "test started"
    return jsonify({"message": "test started"}), 200

@app.route('/get_file/<filename>', methods=['GET'])
def get_file(folder_name, filename):
    # Check if the file exists within the folder
    file_path = os.path.join(RUNS_DIR, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    # Send the file
    return send_from_directory(RUNS_DIR, filename)

@app.route('/list', methods=['GET'])
def list_jobs():
    return jsonify(json.load(open(DB_FILE_PATH, 'r')))

if __name__ == '__main__':  
	app.run(debug=True)