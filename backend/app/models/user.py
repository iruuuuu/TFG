from .. import db
from datetime import datetime

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(180), unique=True, nullable=False)
    roles = db.Column(db.JSON, default=['ROLE_USER'])
    password = db.Column(db.String(255), nullable=False)
    
    # Relationship
    reservas = db.relationship('Reserva', back_populates='usuario', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'roles': self.roles
        }
