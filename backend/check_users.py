import sys
import os

# Set up path to import backend app
sys.path.append(r'c:\Users\iruuu\Desktop\TFG\backend')

from app import create_app, db
from app.models.user import Usuario

app = create_app()

with app.app_context():
    users = Usuario.query.all()
    print("USERS IN DATABASE:")
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Name: {u.name}, Roles: {u.roles}")
