#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

class DisplayManager {
private:
    Adafruit_SSD1306 display;
public:
    DisplayManager(uint8_t width, uint8_t height, int8_t reset);
    void begin();
    void showData(float temp, float humidity, float airQuality, String message);
};

#endif
