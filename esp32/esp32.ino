#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>

void sendData(float temperature, double longitude, double latitude, long speed, float altitude, float hdop, int satellites, String time);
void initWiFi();
void initGPS();
void initTemperatureSensor();
void initLCD();

const char* vehicleId = "3MlPDEStfBZvXo6g6gFN";

const char* ssid = "Hansa Wi-Fi";
const char* password = "00000000";

String serverName = "https://asia-southeast1-vehicle-tracking-system-e465c.cloudfunctions.net/updateVehicleData";

unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

#define RXD2 16
#define TXD2 17
#define GPS_BAUD 9600

HardwareSerial gpsSerial(2);
TinyGPSPlus gps;

const int oneWireBus = 4;
OneWire oneWire(oneWireBus);
DallasTemperature tempSensor(&oneWire);

LiquidCrystal_I2C lcd(0x27, 16, 2);

// Variables to store the last sent data
double lastLongitude = 0.0;
double lastLatitude = 0.0;
float lastTemperature = 0.0;

const double MIN_LAT_LNG_CHANGE = 0.0001;
const float MIN_TEMP_CHANGE = 0.5;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Initialize modules
  initWiFi();
  initGPS();
  initTemperatureSensor();
  initLCD();
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    while (gpsSerial.available() > 0) {
      gps.encode(gpsSerial.read());
    }

    if (gps.location.isUpdated()) {
      double longitude = gps.location.lng();
      double latitude = gps.location.lat();
      long speed = gps.speed.kmph();
      float altitude = gps.altitude.meters();
      float hdop = gps.hdop.value() / 100.0;
      int satellites = gps.satellites.value();
      String time = String(gps.date.year()) + "-" + String(gps.date.month()) + "-" + String(gps.date.day()) + "T" + String(gps.time.hour()) + ":" + String(gps.time.minute()) + ":" + String(gps.time.second());

      Serial.print("Longitude: ");
      Serial.println(longitude);
      Serial.print("Latitude: ");
      Serial.println(latitude);
      Serial.print("Speed: ");
      Serial.println(speed);
      Serial.print("Altitude: ");
      Serial.println(altitude);
      Serial.print("HDOP: ");
      Serial.println(hdop);
      Serial.print("Satellites: ");
      Serial.println(satellites);
      Serial.print("Time: ");
      Serial.println(time);

      tempSensor.requestTemperatures();
      float temperature = tempSensor.getTempCByIndex(0);
      Serial.print("Temperature: ");
      Serial.print(temperature);
      Serial.println("ºC");

      // Displaying time on LCD
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Time: ");
      lcd.print(gps.time.hour());
      lcd.print(":");
      lcd.print(gps.time.minute());
      lcd.print(":");
      lcd.print(gps.time.second());

      sendData(vehicleId, temperature, longitude, latitude, speed, altitude, hdop, satellites, time);
      lastTime = millis();
    } else {
      Serial.println("GPS calibrating");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("GPS calibrating");
      lcd.setCursor(0, 1);
      lcd.print("Please wait...");
      delay(2000);
    }
  }
}

void initWiFi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void initGPS() {
  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("GPS module initialized");
}

void initTemperatureSensor() {
  tempSensor.begin();
  Serial.println("Temperature sensor initialized");
}

void initLCD() {
  lcd.init();
  lcd.clear();
  lcd.backlight();
  lcd.setCursor(3, 0);
  lcd.print("Welcome to");
  lcd.setCursor(0, 1);
  lcd.print("Embedded Systems");
  delay(2000);
  Serial.println("LCD initialized");
}

bool hasSignificantChange(double longitude, double latitude, float temperature) {
  return abs(longitude - lastLongitude) > MIN_LAT_LNG_CHANGE || abs(latitude - lastLatitude) > MIN_LAT_LNG_CHANGE || abs(temperature - lastTemperature) > MIN_TEMP_CHANGE;
}

void sendData(String vehicleId, float temperature, double longitude, double latitude, long speed, float altitude, float hdop, int satellites, String time) {
  // Check for significant changes in coordinates and temperature
  if (hasSignificantChange(longitude, latitude, temperature)) {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String serverPath = serverName + "/?vehicleId=" + vehicleId + "&temperature=" + temperature + "&longitude=" + longitude + "&latitude=" + latitude + "&speed=" + speed + "&altitude=" + altitude + "&hdop=" + hdop + "&satellites=" + satellites + "&time=" + time;
      Serial.print("Server Path: ");
      Serial.println(serverPath);
      http.begin(serverPath.c_str());
      int httpResponseCode = http.GET();

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();

      // Update the last sent data
      lastLongitude = longitude;
      lastLatitude = latitude;
      lastTemperature = temperature;
    } else {
      Serial.println("WiFi Disconnected");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("WiFi Disconnected");
      delay(2000);
    }
    Serial.println("No significant movement or temperature change");
    lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("No significant change");
    delay(2000);
  }
}
