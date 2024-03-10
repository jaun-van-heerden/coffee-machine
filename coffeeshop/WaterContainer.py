import simpy

class WaterContainer(simpy.Container):
    def __init__(self, env, capacity=2.0):
        super().__init__(env, capacity=capacity)