from app import create_app, db
from app.models.user import Usuario
import sys

app = create_app()
with app.app_context():
    try:
        # Create all tables
        db.create_all()
        print("Tables created successfully.")
        
        # Seed users
        seed_users = [
            ('admin@iesmendoza.es', 'Administrador', 'admin123', ['admin']),
            ('maestro@iesmendoza.es', 'Maestro', 'maestro123', ['maestro']),
            ('cocina@iesmendoza.es', 'Cocinero Jefe', 'cocina123', ['cocina']),
            ('alumno@iesmendoza.es', 'Alumno Cocina', 'alumno123', ['alumno-cocina']),
        ]
        
        for email, name, password, roles in seed_users:
            u = Usuario.query.filter_by(email=email).first()
            if not u:
                u = Usuario(
                    email=email,
                    name=name,
                    password=password,
                    roles=roles
                )
                db.session.add(u)
                print(f"User {email} added.")
            else:
                u.password = password
                u.name = name
                u.roles = roles
                print(f"User {email} updated.")
        
        db.session.commit()
        print("Database seeding completed.")
    except Exception as e:
        print(f"Error during initialization: {e}")
        db.session.rollback()
        sys.exit(1)
