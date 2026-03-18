from .. import db
from datetime import datetime

class Reserva(db.Model):
    __tablename__ = 'reservas'
    
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    id_plato = db.Column(db.Integer, db.ForeignKey('platos.id'), nullable=False)
    fecha_reserva = db.Column(db.Date, nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.String(20), default='pending')
    notas = db.Column(db.Text)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    usuario = db.relationship('Usuario', back_populates='reservas')
    plato = db.relationship('Plato', back_populates='reservas')

    def to_dict(self):
        return {
            'id': self.id,
            'id_usuario': self.id_usuario,
            'id_plato': self.id_plato,
            'fecha_reserva': self.fecha_reserva.isoformat(),
            'cantidad': self.cantidad,
            'estado': self.estado,
            'notas': self.notas,
            'creado_en': self.creado_en.isoformat(),
            'actualizado_en': self.actualizado_en.isoformat()
        }
