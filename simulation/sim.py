import pika
import json
import time
import random

# Establish a connection to RabbitMQ server
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Declare a queue for the coffee machine state
channel.queue_declare(queue='coffee_machine_state')

def publish_state():
    while True:
        # Simulate the state of the coffee machine
        state = {
            'temperature': random.randint(20, 100),
            'sugar_level': random.randint(0, 5),
            'milk_steamed': random.choice([True, False])
        }

        # Publish the state to the RabbitMQ queue
        channel.basic_publish(exchange='',
                              routing_key='coffee_machine_state',
                              body=json.dumps(state))
        print(" [x] Sent state update")
        time.sleep(5)  # Update every 5 seconds

try:
    publish_state()
finally:
    connection.close()
