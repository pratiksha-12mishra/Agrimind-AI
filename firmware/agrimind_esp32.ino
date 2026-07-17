/*
 * AgriMind AI — ESP32 Firmware
 * Team Semicolon | Biothon 2026 Grand Finale
 *
 * Hardware:
 *   - Soil Moisture Sensor (Analog) → GPIO34
 *   - DHT11 (optional) → GPIO14
 *   - Relay Module → GPIO26
 *
 * MQTT:
 *   - Publishes sensor data → agrimind/sensor (every 60 seconds)
 *   - Subscribes motor commands ← agrimind/motor ("start" / "stop")
 *
 * Broker: HiveMQ Cloud (TLS port 8883)
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ─── WiFi Credentials ──────────────────────────────────────────────────────
#define WIFI_SSID        "Harsh's F17"
#define WIFI_PASSWORD    "radhe.radhe"

// ─── HiveMQ Credentials ────────────────────────────────────────────────────
#define MQTT_BROKER      "7252c397d75341328e1a4db667942487.s1.eu.hivemq.cloud"
#define MQTT_PORT        8883
#define MQTT_USERNAME    "Agrimind_Ai"
#define MQTT_PASSWORD    "Agri102030"
#define MQTT_CLIENT_ID   "agrimind_esp32_001"

// ─── MQTT Topics ───────────────────────────────────────────────────────────
#define TOPIC_SENSOR     "agrimind/sensor"
#define TOPIC_MOTOR      "agrimind/motor"
#define TOPIC_HEARTBEAT  "agrimind/heartbeat"

// ─── Pin Definitions ───────────────────────────────────────────────────────
#define SOIL_PIN         34    // Analog input — soil moisture sensor
#define DHT_PIN          14    // DHT11 data pin (optional)
#define RELAY_PIN        26    // Relay control pin
#define DHTTYPE DHT11
// ─── Timing ────────────────────────────────────────────────────────────────
#define SENSOR_INTERVAL     30000   // Publish sensor data every 60 seconds
#define HEARTBEAT_INTERVAL  30000   // Heartbeat every 30 seconds
#define RECONNECT_DELAY     10000    // Wait 5s between reconnect attempts

// ─── Offline Buffer ────────────────────────────────────────────────────────
#define BUFFER_SIZE 10
struct SensorReading {
  float soilMoisture;
  float temperature;
  float humidity;
  bool  dhtAvailable;
};
SensorReading offlineBuffer[BUFFER_SIZE];
int bufferHead = 0;
int bufferCount = 0;

// ─── Global Objects ────────────────────────────────────────────────────────
WiFiClientSecure wifiClient;
PubSubClient     mqttClient(wifiClient);
DHT dht(DHT_PIN, DHTTYPE);

// ─── State ─────────────────────────────────────────────────────────────────
bool    motorRunning    = false;
bool    dhtWorking      = false;
unsigned long lastSensorPublish   = 0;
unsigned long lastHeartbeat       = 0;
unsigned long lastReconnectAttempt = 0;

// ───────────────────────────────────────────────────────────────────────────
// Read soil moisture — returns 0–100%
// ───────────────────────────────────────────────────────────────────────────
float readSoilMoisture() {
  int raw = analogRead(SOIL_PIN);
  // Calibrated from your test: dry=4095 (0%), wet=0 (100%)
  int moisture = map(raw, 4095, 0, 0, 100);
  return constrain(moisture, 0, 100);
}

// ───────────────────────────────────────────────────────────────────────────
// Read DHT11 — fills temp and humidity, returns false if sensor unavailable
// ───────────────────────────────────────────────────────────────────────────
bool readDHT(float &temperature, float &humidity) {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) return false;
  temperature = t;
  humidity    = h;
  return true;
}
// ───────────────────────────────────────────────────────────────────────────
// Motor control
// ───────────────────────────────────────────────────────────────────────────
void startMotor() {
  digitalWrite(RELAY_PIN, LOW);   // LOW = relay ON (active low module)
  motorRunning = true;
  Serial.println("[MOTOR] Started");
}

void stopMotor() {
  digitalWrite(RELAY_PIN, HIGH);  // HIGH = relay OFF
  motorRunning = false;
  Serial.println("[MOTOR] Stopped");
}

// ───────────────────────────────────────────────────────────────────────────
// MQTT message callback — handles motor commands
// ───────────────────────────────────────────────────────────────────────────
void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  message.trim();
  message.toLowerCase();

  Serial.print("[MQTT] Received on ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);

  if (String(topic) == TOPIC_MOTOR) {
    if (message == "start") {
      startMotor();
    } else if (message == "stop") {
      stopMotor();
    } else {
      Serial.println("[MOTOR] Unknown command: " + message);
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// WiFi connection
// ───────────────────────────────────────────────────────────────────────────
void connectWiFi() {
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("[WiFi] Connected. IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("[WiFi] Failed to connect. Will retry...");
  }
}

// ───────────────────────────────────────────────────────────────────────────
// MQTT connection
// ───────────────────────────────────────────────────────────────────────────
bool connectMQTT() {
  Serial.print("[MQTT] Connecting to HiveMQ...");

  // Set shorter timeout so TLS doesn't hang forever
  wifiClient.setTimeout(10);

  String clientId = "esp32_" + String((uint32_t)ESP.getEfuseMac(), HEX);
  Serial.print("[MQTT] Using client ID: ");
  Serial.println(clientId);

  if (mqttClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD)) {
    Serial.println(" Connected!");
    mqttClient.subscribe(TOPIC_MOTOR);
    Serial.println("[MQTT] Subscribed to: " + String(TOPIC_MOTOR));
    mqttClient.publish(TOPIC_HEARTBEAT, "online");

    // Flush offline buffer
    if (bufferCount > 0) {
      Serial.print("[BUFFER] Flushing ");
      Serial.print(bufferCount);
      Serial.println(" offline readings...");
      for (int i = 0; i < bufferCount; i++) {
        int idx = (bufferHead - bufferCount + i + BUFFER_SIZE) % BUFFER_SIZE;
        publishSensorData(
          offlineBuffer[idx].soilMoisture,
          offlineBuffer[idx].temperature,
          offlineBuffer[idx].humidity,
          offlineBuffer[idx].dhtAvailable
        );
        delay(100);
        yield(); // Feed watchdog during buffer flush
      }
      bufferCount = 0;
      Serial.println("[BUFFER] Flushed.");
    }
    return true;
  } else {
    Serial.print(" Failed. RC=");
    Serial.println(mqttClient.state());
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Publish sensor data to MQTT
// ───────────────────────────────────────────────────────────────────────────
void publishSensorData(float soilMoisture, float temperature,
                       float humidity, bool dhtAvail) {
  StaticJsonDocument<256> doc;
  doc["soil_moisture"]  = round(soilMoisture * 10) / 10.0;
  doc["motor_running"]  = motorRunning;
  doc["device_id"]      = MQTT_CLIENT_ID;

  if (dhtAvail) {
    doc["temperature"] = round(temperature * 10) / 10.0;
    doc["humidity"]    = round(humidity * 10) / 10.0;
  } else {
    doc["temperature"] = nullptr;  // null → frontend uses OpenWeather value
    doc["humidity"]    = nullptr;
  }

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);

  bool published = mqttClient.publish(TOPIC_SENSOR, jsonBuffer);

  Serial.print("[MQTT] Published sensor data: ");
  Serial.println(jsonBuffer);
  if (!published) {
    Serial.println("[MQTT] Publish failed — storing in offline buffer");
    // Store in offline buffer for retransmit on reconnect
    offlineBuffer[bufferHead] = {soilMoisture, temperature, humidity, dhtAvail};
    bufferHead = (bufferHead + 1) % BUFFER_SIZE;
    if (bufferCount < BUFFER_SIZE) bufferCount++;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// SETUP
// ───────────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("============================================");
  Serial.println("  AgriMind AI — ESP32 Firmware");
  Serial.println("  Team Semicolon | Biothon 2026");
  Serial.println("============================================");

  // Pin setup
pinMode(RELAY_PIN, OUTPUT);
digitalWrite(RELAY_PIN, HIGH);  // Force OFF on boot
delay(100);                      // Give it time to settle
  pinMode(SOIL_PIN, INPUT);

  // DHT11 setup (optional — fails silently if sensor faulty)
  dht.begin();
  delay(1000);

  // Test DHT11
  float t, h;
  dhtWorking = readDHT(t, h);
  if (dhtWorking) {
    Serial.println("[DHT11] Working — Temp: " + String(t) + "°C, Humidity: " + String(h) + "%");
  } else {
    Serial.println("[DHT11] Not available — will use OpenWeather for temp/humidity");
  }

  // WiFi
  connectWiFi();

  // MQTT — skip certificate verification for demo
  // (In production, add the HiveMQ root CA certificate)
  wifiClient.setInsecure();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);
  mqttClient.setKeepAlive(30);
  mqttClient.setBufferSize(512);
  mqttClient.setSocketTimeout(10);
  // Connect MQTT
  connectMQTT();

  Serial.println("[SETUP] Complete. Starting sensor loop.");
}

// ───────────────────────────────────────────────────────────────────────────
// LOOP
// ───────────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // ── WiFi watchdog ──
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Disconnected. Reconnecting...");
    connectWiFi();
  }

  // ── MQTT watchdog ──
// ── MQTT watchdog ──
  if (!mqttClient.connected()) {
    if (now - lastReconnectAttempt > RECONNECT_DELAY) {
      lastReconnectAttempt = now;
      Serial.println("[MQTT] Disconnected. Reconnecting...");
      yield(); // Feed watchdog before TLS handshake
      connectMQTT();
      yield(); // Feed watchdog after
    }
  } else {
    mqttClient.loop();
    yield(); // Feed watchdog after processing messages
  }
  // ── Publish sensor data every 60 seconds ──
  if (now - lastSensorPublish > SENSOR_INTERVAL) {
    lastSensorPublish = now;

    float soilMoisture = readSoilMoisture();
    float temperature  = 0;
    float humidity     = 0;
    bool  dhtAvail     = readDHT(temperature, humidity);

    Serial.println("─────────────────────────────");
    Serial.print("[SENSOR] Soil Moisture: ");
    Serial.print(soilMoisture);
    Serial.println("%");

    if (dhtAvail) {
      Serial.print("[SENSOR] Temperature: ");
      Serial.print(temperature);
      Serial.println("°C");
      Serial.print("[SENSOR] Humidity: ");
      Serial.print(humidity);
      Serial.println("%");
    } else {
      Serial.println("[SENSOR] DHT11 not available");
    }

    Serial.print("[MOTOR] Status: ");
    Serial.println(motorRunning ? "Running" : "Stopped");

    if (mqttClient.connected()) {
      publishSensorData(soilMoisture, temperature, humidity, dhtAvail);
    } else {
      // Store in offline buffer
      offlineBuffer[bufferHead] = {soilMoisture, temperature, humidity, dhtAvail};
      bufferHead = (bufferHead + 1) % BUFFER_SIZE;
      if (bufferCount < BUFFER_SIZE) bufferCount++;
      Serial.println("[BUFFER] Stored offline. Will transmit on reconnect.");
    }
  }

  // ── Heartbeat every 30 seconds ──
  if (now - lastHeartbeat > HEARTBEAT_INTERVAL) {
    lastHeartbeat = now;
    if (mqttClient.connected()) {
      mqttClient.publish(TOPIC_HEARTBEAT, "alive");
      Serial.println("[HEARTBEAT] Sent");
    }
  }
}
