from .. import db
from datetime import datetime

class Valoracion(db.Model):
    __tablename__ = 'ratings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id', ondelete='CASCADE'), nullable=False)
    reservation_id = db.Column(db.Integer, nullable=True)
    rating = db.Column(db.SmallInteger, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    usuario = db.relationship('Usuario', back_populates='valoraciones')
    plato = db.relationship('Plato', back_populates='valoraciones')

    def to_dict(self):
        return {
            'id': str(self.id),
            'userId': str(self.user_id),
            'dishId': str(self.dish_id),
            'reservationId': str(self.reservation_id) if self.reservation_id else None,
            'rating': self.rating,
            'comment': self.comment,
            'date': self.created_at.isoformat()
        }
