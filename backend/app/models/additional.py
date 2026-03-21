from .. import db
from datetime import datetime

class InventarioMovimiento(db.Model):
    __tablename__ = 'inventory_movements'
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id', ondelete='CASCADE'), nullable=False)
    movement_type = db.Column(db.Enum('in', 'out'), nullable=False)
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    reason = db.Column(db.String(255))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SugerenciaIA(db.Model):
    __tablename__ = 'ai_suggestions'
    id = db.Column(db.Integer, primary_key=True)
    suggestion_type = db.Column(db.Enum('menu', 'inventory', 'optimization'), nullable=False)
    content = db.Column(db.JSON, nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'rejected'), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    reviewed_at = db.Column(db.DateTime)
