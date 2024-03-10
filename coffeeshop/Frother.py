import simpy
import threading

class Frother:

    FULL_CAPACITY = 1.0
    MAX_SPEED = 1.0

    def __init__(self) -> None:
        self.state = "idle"
        self.speed = 0.0
        self.clean = 0.1
        self.temperature = 23.0
        self.frothPercentage = 0.0
        self.amount = 0.0
        self.capacity = self.FULL_CAPACITY
        self.runningTime = 0.0

    def __repr__(self) -> str:
        return (f"Frother(state='{self.state}', speed={self.speed}, clean={self.clean}, "
                f"temperature={self.temperature}, frothPercentage={self.frothPercentage}, amount={self.amount})")

    def adjustSpeed(self, speed):
        self.speed = speed

    def fill(self, amount):
        if amount > self.capacity - self.amount:
            self.spill()
        else:
            self.amount += amount  # Corrected to update the amount properly

    def pour(self, amount: float) -> None:
        if amount <= self.amount:
            self.amount -= amount
        else:
            print("Not enough milk to pour the requested amount.")

    def spill(self):
        print("Spilled! Cleaning needed.")
        self.amount = 0
        self.clean = 0.0

    def turn_on(self):  # Renamed from 'on' to avoid conflict
        if self.amount > 0:
            self.state = "on"
            print("Frother turned on.")
        else:
            print("Please fill the frother before turning it on.")

    def turn_off(self):  # Renamed from 'off' for consistency
        self.state = "idle"
        print("Frother turned off.")

    def run(self, env):
        while True:
            if self.state == "on" and self.amount > 0:
                yield env.timeout(1)
                self.frothPercentage += 10
                print(f"Frothing... Froth percentage: {self.frothPercentage}%")
                if self.frothPercentage >= 100:
                    print("Frothing complete.")
                    self.turn_off()  # Use the renamed method
            else:
                yield env.timeout(1)

def run_simulation(frother):
    env = simpy.Environment()
    env.process(frother.run(env))
    env.run()

frother = Frother()

def frother_cli():
    print("Frother CLI. Commands: fill [amount], pour [amount], start, stop, quit")
    while True:
        cmd = input("> ").split()
        if not cmd:
            continue

        command = cmd[0].lower()
        if command == "quit":
            break
        elif command == "fill" and len(cmd) == 2:
            frother.fill(float(cmd[1]))
        elif command == "pour" and len(cmd) == 2:
            frother.pour(float(cmd[1]))
        elif command == "start":
            frother.turn_on()  # Use the renamed method
        elif command == "stop":
            frother.turn_off()  # Use the renamed method
        else:
            print("Unknown command or incorrect usage.")

if __name__ == "__main__":
    sim_thread = threading.Thread(target=run_simulation, args=(frother,), daemon=True)
    sim_thread.start()
    frother_cli()
