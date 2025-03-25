from flask import Flask, request, jsonify
import os
from pathlib import Path

app = Flask(__name__)

FEED_TIME_FILE = Path('../App/src/feed_time.txt')

data_store = {
    "temperature": None,
    "humidity": None,
    "airQuality": None,
    "fanStatus": False
}

# Test App
@app.route('/test', methods=['POST'])
def app_test():
    return jsonify({"message": "Successfully Start Flask app for IOT system"}), 200

@app.route("/data", methods=["POST"])
def receive_data():
    try:
        data = request.get_json()
        data_store["temperature"] = data.get("temperature")
        data_store["humidity"] = data.get("humidity")
        data_store["airQuality"] = data.get("airQuality")
        data_store["fanStatus"] = data.get("fanStatus")
        
        return jsonify({"message": "Data received successfully", "data": data_store}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/status", methods=["GET"])
def get_status():
    return jsonify(data_store)

@app.route("/fan", methods=["POST"])
def control_fan():
    try:
        data = request.get_json()
        fan_status = data.get("fanStatus")
        if fan_status is not None:
            data_store["fanStatus"] = fan_status
            return jsonify({"message": "Fan status updated", "fanStatus": fan_status}), 200
        else:
            return jsonify({"error": "Invalid data"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400


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
