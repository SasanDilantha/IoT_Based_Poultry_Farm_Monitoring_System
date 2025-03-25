#include <WiFi.h>
#include <Wire.h>
#include <MQ135.h>
#include <HTTPClient.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <AHT10.h>

class WiFiManager {
private:
    const char* ssid;
    const char* password;
public:
    WiFiManager(const char* ssid, const char* password) : ssid(ssid), password(password) {}
    void connect() {
        WiFi.begin(ssid, password);
        while (WiFi.status() != WL_CONNECTED) {
            delay(1000);
            Serial.println("Connecting to WiFi...");
        }
        Serial.println("Connected to WiFi");
    }
    bool isConnected() {
        return WiFi.status() == WL_CONNECTED;
    }
};

class SensorManager {
private:
    AHT10 aht;  // Fixed initialization
    MQ135 mq135_sensor;
public:
    SensorManager(uint8_t mq135Pin) : aht(AHT10_ADDRESS_0X38, AHT10_SENSOR), mq135_sensor(mq135Pin) {} // Corrected constructor

    void begin() { 
        while (!aht.begin()) {
            Serial.println("AHT10 not connected or failed to load calibration");
            delay(3000);
        }
    }
    float getTemperature() { return aht.readTemperature(); }
    float getHumidity() { return aht.readHumidity(); }
    float getAirQuality() { return mq135_sensor.getCorrectedPPM(getTemperature(), getHumidity()); }
};

class HttpClientMgr {
private:
    String serverUrl;
public:
    HttpClientMgr(String serverUrl) : serverUrl(serverUrl) {}
    String sendData(float temp, float humidity, float airQuality) {
        HTTPClient http;
        String url = String(serverUrl) + "/update?temp=" + String(temp) + "&humidity=" + String(humidity) + "&ammonia=" + String(airQuality);
        http.begin(url);
        int httpCode = http.GET();
        String response = (httpCode == 200) ? http.getString() : "No Response";
        http.end();
        return response;
    }
};

class DisplayManager {
private:
    Adafruit_SSD1306 display;
public:
    DisplayManager(uint8_t width, uint8_t height, int8_t reset) : display(width, height, &Wire, reset) {}
    
    void begin() {
        if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
            Serial.println("SSD1306 allocation failed");
            for (;;);
        }
        display.display();
        delay(2000);
        display.clearDisplay();
    }

    void showData(float temp, float humidity, float airQuality, String message) {
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.printf("Temp: %.2f C\nHumidity: %.2f %%\nAir Q: %.2f PPM\nMsg: %s", temp, humidity, airQuality, message.c_str());
        display.display();
    }
};

class IoTController {
private:
    WiFiManager wifi;
    SensorManager sensor;
    DisplayManager display;
    HttpClientMgr http;
public:
    IoTController() : wifi("Xperia_3309", "ds516dila"), sensor(34), display(128, 64, -1), http("http://192.168.64.44:5000") {} // Fixed constructor

    void setup() {
        Serial.begin(115200);
        wifi.connect();
        sensor.begin();
        display.begin();
    }

    void loop() {
        float temp = sensor.getTemperature();
        float humidity = sensor.getHumidity();
        float airQuality = sensor.getAirQuality();
        String message = http.sendData(temp, humidity, airQuality);
        display.showData(temp, humidity, airQuality, message);
        delay(10000);
    }
};

IoTController controller;

void setup() {
    controller.setup();
}

void loop() {
    controller.loop();
}
