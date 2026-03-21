from .. import db
from datetime import datetime

class Usuario(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(180), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    roles = db.Column(db.JSON, nullable=False, default=['ROLE_USER'])
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    reservas = db.relationship('Reserva', back_populates='usuario', lazy=True)
    valoraciones = db.relationship('Valoracion', back_populates='usuario', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'roles': self.roles
        }
