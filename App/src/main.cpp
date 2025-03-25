#include <WiFi.h>
#include <Wire.h>
#include <MQ135.h>
#include <HTTPClient.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <AHT10.h>

#define WIFI_SSID "Xperia_3309"
#define WIFI_PASSWORD "ds516dila"
#define SERVER_URL "http://192.168.64.44:5000"

AHT10 aht(AHT10_ADDRESS_0X38, AHT10_SENSOR);
MQ135 mq135_sensor(34);
Adafruit_SSD1306 display(128, 64, &Wire, -1);

void connectWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
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

String sendData(float temp, float humidity, float airQuality) {
    HTTPClient http;
    http.begin(String(SERVER_URL) + "/data");
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{";
    jsonPayload += "\"temperature\":" + String(temp) + ",";
    jsonPayload += "\"humidity\":" + String(humidity) + ",";
    jsonPayload += "\"airQuality\":" + String(airQuality);
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
    display.printf("Temp: %.2f C\nHumidity: %.2f %%\nAir Q: %.2f PPM\nMsg: %s", temp, humidity, airQuality, message.c_str());
    display.display();
}

void setup() {
    Serial.begin(115200);
    connectWiFi();
    initSensors();
    initDisplay();
}

void loop() {
    float temp = aht.readTemperature();
    float humidity = aht.readHumidity();
    float airQuality = mq135_sensor.getCorrectedPPM(temp, humidity);
    String message = sendData(temp, humidity, airQuality);
    showData(temp, humidity, airQuality, message);
    delay(10000);
}
