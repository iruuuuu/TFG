from .. import db
from datetime import datetime

class Plato(db.Model):
    __tablename__ = 'platos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    categoria = db.Column(db.String(20))
    precio = db.Column(db.Numeric(precision=5, scale=2), nullable=False)
    url_imagen = db.Column(db.String(255))
    alergenos = db.Column(db.JSON)
    informacion_nutricional = db.Column(db.JSON)
    esta_activo = db.Column(db.Boolean, default=True)
    fecha_disponibilidad = db.Column(db.Date, nullable=False)
    stock_total = db.Column(db.Integer, default=0)
    stock_reservado = db.Column(db.Integer, default=0)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)
    actualizado_en = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    reservas = db.relationship('Reserva', back_populates='plato', lazy=True)

    def obtener_stock_disponible(self):
        return self.stock_total - self.stock_reservado

    def tiene_stock(self, cantidad):
        return self.obtener_stock_disponible() >= cantidad

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'categoria': self.categoria,
            'precio': float(self.precio),
            'url_imagen': self.url_imagen,
            'alergenos': self.alergenos,
            'informacion_nutricional': self.informacion_nutricional,
            'esta_activo': self.esta_activo,
            'fecha_disponibilidad': self.fecha_disponibilidad.isoformat(),
            'stock_disponible': self.obtener_stock_disponible()
        }
