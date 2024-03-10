import simpy
from enum import Enum

class SensorStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Sensor:
    def __init__(self, env, name='sensor', mqtt_client=None, rate=2, on_change=0.5):
        self.env = env
        self.name = name
        self.mqtt_client = mqtt_client
        self.rate = rate  # every two seconds
        self.on_change = on_change  # threshold for change
        self.previous_value = -1
        self.last_update = -1  # timestamp
        self.status = SensorStatus.ACTIVE
        self.topic = None
        self.env.process(self.update())

    def set_rate(self, rate):
        self.rate = rate

    def set_topic(self, topic):
        self.topic = topic

    def update(self):
        while True:
            yield self.env.timeout(self.rate)
            value = self.get_value()  # Implement this method in subclasses
            if abs(value - self.previous_value) >= self.on_change:
                self.previous_value = value
                self.last_update = self.env.now
                if self.mqtt_client:
                    self.mqtt_client.publish(self.topic, value)

    def get_value(self):
        raise NotImplementedError("Subclasses must implement the get_value method")

class TemperatureSensor(Sensor):
    def __init__(self, env, name='temperature_sensor', mqtt_client=None, rate=2, on_change=0.5):
        super().__init__(env, name, mqtt_client, rate, on_change)
        self.temperature = None

    def update(self):
        if self.temperature is not None:
            if abs(self.temperature - self.previous_value) >= self.on_change:
                self.previous_value = self.temperature
                self.last_update = self.env.now
                if self.mqtt_client:
                    self.mqtt_client.publish(self.topic, self.temperature)

