from .. import db
from datetime import datetime

class Inventario(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    ingredient_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    unit = db.Column(db.String(20), nullable=False)
    minimum_stock = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'ingredient_name': self.ingredient_name,
            'quantity': float(self.quantity),
            'unit': self.unit,
            'minimum_stock': float(self.minimum_stock),
            'lastUpdated': self.last_updated.isoformat()
        }
