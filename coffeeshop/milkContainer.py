import simpy
from enum import Enum

class MilkType(Enum):
    A2 = 0
    LACTOSE_FREE = 1
    SKIM = 2
    OAT = 3


class MilkContainer(simpy.Container):
    def __init__(self, env, capacity=2.0):
        super().__init__(env, capacity=capacity)
        self.type = MilkType.A2