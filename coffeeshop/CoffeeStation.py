from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import simpy
import asyncio
from CoffeeMachine import CoffeeMachine, Container

import inspect

app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

class EntityConfig(BaseModel):
    type: str
    config: dict

@app.post("/add_entity")
def add_entity(entity_config: EntityConfig):
    entity_id = coffee_station.add_entity(entity_config)
    return {"message": f"Entity {entity_id} added to the coffee station"}

@app.get("/entities")
def get_entities():
    return coffee_station.get_entities()

@app.post("/entity/{entity_id}/{method}")
async def call_entity_method(entity_id: str, method: str, config: dict = None):
    entity = coffee_station.get_entity(entity_id)
    if entity:
        if hasattr(entity, method):
            method_func = getattr(entity, method)
            try:
                if config:
                    result = method_func(**config)
                else:
                    result = method_func()
                
                if asyncio.iscoroutine(result):
                    await coffee_station.env.process(result)
                    coffee_station.env.run()
                
                return {"message": f"{entity_id}.{method} executed"}
            except Exception as e:
                return {"error": f"Error executing {entity_id}.{method}: {str(e)}"}
        else:
            return {"error": f"Method {method} not found on entity {entity_id}"}
    else:
        return {"error": f"Entity {entity_id} not found"}

@app.get("/report")
def get_report():
    return coffee_station.get_report()

@app.get("/available_entities")
def get_available_entities():
    return {
        "entities": [
            {"type": "coffee_machine", "config": {}},
            {"type": "water_container", "config": {"capacity": 1.0}},
            {"type": "coffee_grinds_container", "config": {"capacity": 500.0}},
            {"type": "spent_grinds_container", "config": {"capacity": 1000.0}},
            {"type": "milk_frother", "config": {}},
        ]
    }

class CoffeeStation:
    def __init__(self, env):
        self.env = env
        self.entities = {}

    def add_entity(self, entity_config: EntityConfig):
        entity_type = entity_config.type
        if entity_type == "coffee_machine":
            entity = CoffeeMachine(self.env)
        elif entity_type == "water_container":
            entity = Container(self.env)
        elif entity_type == "coffee_grinds_container":
            entity = Container(self.env)
        elif entity_type == "spent_grinds_container":
            entity = Container(self.env)
        # elif entity_type == "milk_frother":
            # entity = MilkFrother(self.env)
        else:
            raise ValueError(f"Invalid entity type: {entity_type}")
        entity_id = f"{entity_type}_{len(self.entities) + 1}"
        self.entities[entity_id] = entity
        return entity_id

    

    def get_entities(self):
        entities = []
        for entity_id, entity in self.entities.items():
            entity_dict = {
                "id": entity_id,
                "type": entity.__class__.__name__,
                "methods": []
            }
            for method_name in [m for m in dir(entity) if not m.startswith("__")]:
                method = getattr(entity, method_name)
                if callable(method):
                    method_dict = {
                        "name": method_name,
                        "parameters": []
                    }
                    arg_spec = inspect.getfullargspec(method)
                    for arg_name in arg_spec.args:
                        if arg_name != "self":
                            param_dict = {
                                "name": arg_name,
                                "required": True
                            }
                            if arg_spec.defaults and arg_name in arg_spec.args[-len(arg_spec.defaults):]:
                                param_dict["required"] = False
                                param_dict["default"] = arg_spec.defaults[arg_spec.args[-len(arg_spec.defaults):].index(arg_name)]
                            method_dict["parameters"].append(param_dict)
                    entity_dict["methods"].append(method_dict)
            entities.append(entity_dict)
        return entities

    def get_entity(self, entity_id):
        return self.entities.get(entity_id)

    def get_report(self):
        report = {}
        for entity_id, entity in self.entities.items():
            entity_report = {}
            for attr, value in entity.__dict__.items():
                if not attr.startswith("_"):  # Exclude private attributes
                    if isinstance(value, (int, float, str, bool, list, dict)):
                        entity_report[attr] = value
                    else:
                        entity_report[attr] = str(value)
            report[entity_id] = entity_report
        return report

   
if __name__ == "__main__":
    env = simpy.Environment()
    coffee_station = CoffeeStation(env)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)