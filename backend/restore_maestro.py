import sys
import os

sys.path.append(r'/app')

from app import create_app, db
from app.models.user import Usuario

app = create_app()

with app.app_context():
    # Check if maestro exists
    maestro = Usuario.query.filter_by(email='maestro@iesmendoza.es').first()
    if not maestro:
        # Create a new maestro using the known bcrypt hash for 'maestro123'
        new_maestro = Usuario(
            email='maestro@iesmendoza.es',
            name='Profesor Demostración',
            password='$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG',
            roles=['maestro']
        )
        db.session.add(new_maestro)
        db.session.commit()
        print("Maestro user created successfully.")
    else:
        # Update it just in case
        maestro.password = '$2b$12$MZbMG5bwDDb9MNc0QYoqVOkulOWZxovvK0bfs/CRsdkz3/cPO24KG'
        maestro.roles = ['maestro']
        db.session.commit()
        print("Maestro user updated successfully.")
