#include <WiFi.h>
#include <Wire.h>
#include <MQ135.h>
#include <HTTPClient.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <AHT10.h>
#include <ESP32Servo.h>
#include <FS.h>
#include <SPIFFS.h>

#define WIFI_SSID "Xperia_3309"
#define WIFI_PASSWORD "ds121098"
#define SERVER_URL "http://192.168.171.15:5000"
#define FAN_PIN 5
#define HIGH_TEMP_THRESHOLD 30.0
#define LOW_TEMP_THRESHOLD 25.0
#define FEED_GATE_PIN 6

AHT10 aht(AHT10_ADDRESS_0X38, AHT10_SENSOR);
MQ135 mq135_sensor(34);
Adafruit_SSD1306 display(128, 64, &Wire, -1);
Servo feedGate;
bool manualFanControl = false;
bool fanStatus = false;


void connectWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED && attempt < 20) {  // Try for ~20 seconds
        delay(1000);
        Serial.println("Connecting to WiFi...");
        attempt++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Connected to WiFi");
    } else {
        Serial.println("Failed to connect to WiFi. Continuing without it...");
    }
}


void initSensors() {
    while (!aht.begin()) {
        Serial.println("AHT10 not connected or failed to load calibration");
        delay(3000);
    }
}

void initDisplay() {
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println("SSD1306 allocation failed");
        for (;;);
    }
    display.display();
    delay(2000);
    display.clearDisplay();
}

void controlFan(float temp) {
    if (!manualFanControl) {
        if (temp >= HIGH_TEMP_THRESHOLD) {
            digitalWrite(FAN_PIN, HIGH);
            fanStatus = true;
        } else if (temp <= LOW_TEMP_THRESHOLD) {
            digitalWrite(FAN_PIN, LOW);
            fanStatus = false;
        }
    }
}

void toggleFan(bool state) {
    manualFanControl = state;
    digitalWrite(FAN_PIN, state ? HIGH : LOW);
    fanStatus = state;
}

String sendData(float temp, float humidity, float airQuality) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected, skipping data send");
        return "No WiFi";
    }

    HTTPClient http;
    String url = String(SERVER_URL) + "/data";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{";
    jsonPayload += "\"temperature\":" + String(temp) + ",";
    jsonPayload += "\"humidity\":" + String(humidity) + ",";
    jsonPayload += "\"airQuality\":" + String(airQuality) + ",";
    jsonPayload += "\"fanStatus\":" + String(fanStatus ? "true" : "false");
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);
    Serial.println("Data Sent. Response: " + String(httpResponseCode));

    http.end();
    return (httpResponseCode == 200) ? "Success" : "Failed";
}

void showData(float temp, float humidity, float airQuality, String message) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.printf("Temp: %.2f C\nHumidity: %.2f %%\nAir Q: %.2f PPM\nFan: %s\nMsg: %s", 
                   temp, humidity, airQuality, fanStatus ? "ON" : "OFF", message.c_str());
    display.display();
}

void checkFeedTime() {
    if (!SPIFFS.exists("/feed_time.txt")) {
        Serial.println("Feed time file not found. Using default time: 08:00");
        return;
    }

    File file = SPIFFS.open("/feed_time.txt", "r");
    if (!file) {
        Serial.println("Failed to open feed_time.txt");
        return;
    }

    String feedTime = file.readStringUntil('\n');
    file.close();
    feedTime.trim();

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return;
    }

    char currentTime[6];
    snprintf(currentTime, sizeof(currentTime), "%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min);

    if (feedTime.equals(String(currentTime))) {
        Serial.println("Feeding time! Opening feed gate...");
        feedGate.write(90);
        delay(15000);
        Serial.println("Closing feed gate...");
        feedGate.write(0);
    }
}


void setup() {
    Serial.begin(115200);
    pinMode(FAN_PIN, OUTPUT);
    digitalWrite(FAN_PIN, LOW);
    feedGate.attach(FEED_GATE_PIN);
    connectWiFi();
    initSensors();
    initDisplay();
    if (!SPIFFS.begin(true)) {
        Serial.println("An Error has occurred while mounting SPIFFS");
    }
}

void loop() {
    float temp = aht.readTemperature();
    float humidity = aht.readHumidity();
    float airQuality = mq135_sensor.getCorrectedPPM(temp, humidity);
    controlFan(temp);
    checkFeedTime();
    String message = sendData(temp, humidity, airQuality);
    showData(temp, humidity, airQuality, message);
    delay(10000);
}
