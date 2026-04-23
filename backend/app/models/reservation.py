from .. import db
from datetime import datetime

class Reserva(db.Model):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.Enum('pending', 'confirmed', 'cancelled', 'completed'), default='pending')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    usuario = db.relationship('Usuario', back_populates='reservas')
    plato = db.relationship('Plato', back_populates='reservas')

    def to_dict(self):
        return {
            'id': str(self.id),
            'id_usuario': str(self.user_id),
            'id_plato': str(self.dish_id),
            'fecha_reserva': self.reservation_date.isoformat() if self.reservation_date else None,
            'estado': self.status,
            'notas': self.notes,
            'creado_en': self.created_at.isoformat(),
            'actualizado_en': self.updated_at.isoformat()
        }
