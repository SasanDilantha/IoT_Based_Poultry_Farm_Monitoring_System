#include "DisplayManager.h"

DisplayManager::DisplayManager(uint8_t width, uint8_t height, int8_t reset) 
    : display(width, height, &Wire, reset) {}

void DisplayManager::begin() {
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println("SSD1306 allocation failed");
        for (;;);
    }
    display.display();
    delay(2000);
    display.clearDisplay();
}

void DisplayManager::showData(float temp, float humidity, float airQuality, String message) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.printf("Temp: %.2f C\nHumidity: %.2f %%\nAir Q: %.2f PPM\nMsg: %s", 
                   temp, humidity, airQuality, message.c_str());
    display.display();
}
