#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <MQ135.h>

// WiFi credentials
const char* ssid = "Xperia_3309";
const char* password = "ds516dila";

// Flask server URL
//const char* serverUrl = "http://127.0.0.1:5000";
const char* serverUrl = "http://192.168.64.44:5000";


// OLED display settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// DHT sensor settings
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// MQ135 sensor settings
#define MQ135_PIN 34  // Analog pin connected to MQ135 sensor
MQ135 mq135_sensor(MQ135_PIN);  // Initialize the MQ135 sensor

void setup() {
    // Initialize Serial Monitor
    Serial.begin(115200);

    // Initialize OLED display
    if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;);
    }
    display.display();
    delay(2000); 
    display.clearDisplay();

    // Initialize DHT sensor
    dht.begin();

    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
}

void loop() {
    // Get the current temperature, humidity, and ammonia level
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    float mq135_value = mq135_sensor.getCorrectedPPM(t, h);  // Correct based on temperature & humidity

    // Check if sensor readings failed
    if (isnan(h) || isnan(t)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    // Send sensor data to Flask server
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = String(serverUrl) + "/update?temp=" + t + "&humidity=" + h + "&ammonia=" + mq135_value;
        http.begin(url);
        int httpCode = http.GET();

        

        // If response is OK, get message from Flask and display on OLED
        if (httpCode == 200) {
            String message = http.getString();
            display.clearDisplay();
            display.setTextSize(1);
            display.setTextColor(SSD1306_WHITE);
            display.setCursor(0, 0);
            display.print("Temp: "); display.print(t); display.print(" C");
            display.setCursor(0, 10);
            display.print("Humidity: "); display.print(h); display.print(" %");
            display.setCursor(0, 20);
            display.print("Ammonia: "); display.print(mq135_value); display.print(" PPM");
            display.setCursor(0, 30);
            display.print("Msg: "); display.print(message);  // Display message from Flask
            display.display();
        }
        http.end();
    } else {
        Serial.println("WiFi Disconnected");
    }

    delay(10000); // Wait 10 seconds before sending data again
}
