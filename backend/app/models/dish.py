from .. import db
from datetime import datetime

class Plato(db.Model):
    __tablename__ = 'dishes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(20))
    allergens = db.Column(db.JSON)
    nutritional_info = db.Column(db.JSON)
    price = db.Column(db.Numeric(5, 2), nullable=False, default=0.00)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    available_date = db.Column(db.Date, nullable=False)
    stock_total = db.Column(db.Integer, nullable=False, default=10)
    stock_reserved = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reservas = db.relationship('Reserva', back_populates='plato', lazy=True)
    valoraciones = db.relationship('Valoracion', back_populates='plato', lazy=True)

    def obtener_stock_disponible(self):
        return self.stock_total - self.stock_reserved

    def tiene_stock(self, cantidad):
        return self.obtener_stock_disponible() >= cantidad

    def to_dict(self):
        return {
            'id': str(self.id),
            'nombre': self.name,
            'descripcion': self.description,
            'categoria': self.category,
            'precio': float(self.price),
            'url_imagen': self.image_url,
            'alergenos': self.allergens,
            'informacion_nutricional': self.nutritional_info,
            'esta_activo': self.is_active,
            'fecha_disponibilidad': self.available_date.isoformat() if self.available_date else None,
            'stock_disponible': self.obtener_stock_disponible(),
            'stock_total': self.stock_total,
            'stock_reservado': self.stock_reserved
        }
