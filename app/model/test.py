import jwt
from app import config
import jwt
import random
from app import config

jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYmRlMjFiOGRmYmUwNDhjOTY2OWFmNGRjZmE1MDBkYzlhYjZmMDcyZDg2NjZkMjg3YWUzNzg0Y2Q4OTA0YzI4IiwiaWF0IjoiMjAyNC0wNy0yM1QxMTozMToyOS4xMjc2NzMrMDA6MDAiLCJleHAiOiIyMDI0LTA3LTIzVDEyOjAxOjI5LjEyNzY5MCswMDowMCIsInJvbGUiOiJ1c2VyIn0.QTX6NgzHKgGToEP20l5pyIvvVjgQ7V1ga78oOklhoB4"

decoded = jwt.decode(jwt_token, config.SECRET_KEY, algorithms=["HS256"])
print(decoded)

random_number = random.randrange(1, 10)
print(random_number)