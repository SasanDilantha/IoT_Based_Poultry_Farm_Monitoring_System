#ifndef HTTP_CLIENT_H
#define HTTP_CLIENT_H

#include <HTTPClient.h>


class HttpClientMgr {
    private:
        String serverUrl;
    public:
        HttpClientMgr(String serverUrl);
        String sendData(float temp, float humidity, float airQuality);
};

#endif
