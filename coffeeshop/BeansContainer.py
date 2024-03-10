import simpy
from enum import Enum

class BeanType(Enum):
    ARABICA = 0
    ROBUSTA = 1

class BeanContainer(simpy.Container):
    def __init__(self, env, capacity=2.0, bean_type=BeanType.ARABICA):
        super().__init__(env, capacity=capacity)
        self.bean_type = bean_type

    def fill(self):
        yield self.env.timeout(20)
        yield self.put(self.capacity)