from flask import Flask, request, jsonify
import os
from pathlib import Path

app = Flask(__name__)

FEED_TIME_FILE = Path('../Common/feed_time.txt')

# Test App
@app.route('/test', methods=['POST'])
def app_test():
    return jsonify({"message": "Successfully Start Flask app for IOT system"}), 200

# Receive Sensor Data
@app.route("/data", methods=["POST"])
def receive_data():
    global latest_data
    data = request.json
    latest_data.update(data)
    print("Received Data:", latest_data)
    return jsonify({"message": "Data received successfully"}), 200

# Get Latest Sensor Data
@app.route("/data", methods=["GET"])
def get_data():
    return jsonify(latest_data)


# API to set feed time from mobile app
@app.route('/set_feed_time', methods=['POST'])
def set_feed_time():
    data = request.get_json()
    feed_time = data.get("feed_time")
    
    if not feed_time:
        return jsonify({"message": "Feed time is required"}), 400
    
    with open(FEED_TIME_FILE, "w") as file:
        file.write(feed_time)
    
    return jsonify({"message": "Feed time saved successfully"}), 200

# API to get feed time for IoT app
@app.route('/get_feed_time', methods=['GET'])
def get_feed_time():
    if not os.path.exists(FEED_TIME_FILE):
        return jsonify({"message": "No feed time set"}), 404
    
    with open(FEED_TIME_FILE, "r") as file:
        feed_time = file.read().strip()
    
    return jsonify({"feed_time": feed_time}), 200

# Run Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
