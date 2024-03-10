import WaterContainer


from enum import Enum

class MachineStatus(Enum):
    OFF = 0
    IDLE = 1
    BREWING = 2
    STEAMING = 3



class Container:
    def __init__(self, capacity):
        self.capacity = capacity
        self.contents = 0

    def add(self, amount):
        if self.contents + amount <= self.capacity:
            self.contents += amount
            return True
        else:
            print("Container is full. Cannot add more.")
            return False

    def remove(self, amount):
        if self.contents >= amount:
            self.contents -= amount
            return True
        else:
            print("Insufficient contents in the container.")
            return False


class CoffeeMachine:
    def __init__(self, env):
        self.env = env

        # SLOTS
        self.water_container_slot = None
        self.coffee_grinds_container_slot = None
        self.spent_grinds_container_slot = None


        self.steam_pressure = 0
        self.temperature = 20  # Initial room temperature
        self.hours_total = 0
        self.litres_total = 0
        self.kilowatts_total = 0
        self.amps = 0
        self.status = MachineStatus.OFF


    def connect(self, component):
        if type(component) == WaterContainer:
            if self.water_container_slot is None:
                return (False, f"{type(component)} Already in slot")
            self.water_container_slot = component
        else:
            return (False, f"{type(component)} No compatible slot")


    def heating_element_loop(self):
        while True:
            ...
            # if not MachineStatus.BREWING:
            #     self.


    def brew(self, duration):
        if self.status != MachineStatus.OFF and self.coffee_grinds_container_slot is not None and self.water_container_slot is not None:
            if self.coffee_grinds_container.contents >= 10 and self.water_container_slot.contents >= 0.2:
                self.status = MachineStatus.BREWING
                self.temperature += 10  # Increase temperature while brewing
                self.amps = 10  # Assuming constant current during brewing
                self.kilowatts_total += self.amps * 220 * duration / 3600  # Calculate energy consumption in kWh
                yield self.env.timeout(duration)
                self.water_container_slot.remove(0.2)  # Brewing consumes 0.2 litres of water
                self.coffee_grinds_container.remove(10)  # Brewing consumes 10 grams of coffee grinds
                if self.spent_grinds_container is not None:
                    self.spent_grinds_container.add(10)  # Add spent grinds to the container
                self.litres_total += 0.2
                self.hours_total += duration / 3600  # Convert seconds to hours
                self.status = MachineStatus.IDLE
            else:
                print("Insufficient coffee grinds or water.")
        else:
            print("Cannot brew. Check machine status, coffee grinds container, and water container.")

    def steam(self, duration):
        if self.status != MachineStatus.OFF:
            self.status = MachineStatus.STEAMING
            self.temperature += 20  # Increase temperature while steaming
            self.amps = 15  # Assuming constant current during steaming
            self.kilowatts_total += self.amps * 220 * duration / 3600  # Calculate energy consumption in kWh
            yield self.env.timeout(duration)
            self.steam_pressure += 10  # Steaming increases steam pressure by 10 units
            self.hours_total += duration / 3600  # Convert seconds to hours
            self.status = MachineStatus.IDLE
        else:
            print("Cannot steam. Machine is off.")

    def turn_on(self):
        if self.status == MachineStatus.OFF:
            self.status = MachineStatus.IDLE
            self.temperature = 20  # Reset temperature to room temperature
            self.steam_pressure = 0  # Reset steam pressure
            self.amps = 5  # Assuming constant current when idle
        else:
            print("Machine is already on.")

    def turn_off(self):
        if self.status != MachineStatus.OFF:
            self.status = MachineStatus.OFF
            self.temperature = 20  # Reset temperature to room temperature
            self.steam_pressure = 0  # Reset steam pressure
            self.amps = 0  # No current when off
        else:
            print("Machine is already off.")