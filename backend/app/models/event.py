from .. import db
from datetime import datetime

class EventoGastro(db.Model):
    __tablename__ = 'gastro_events'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, nullable=False)
    max_capacity = db.Column(db.Integer, nullable=False)
    current_attendees = db.Column(db.Integer, default=0)
    dishes = db.Column(db.JSON)
    status = db.Column(db.String(20), default='active')
    created_by = db.Column(db.String(180))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reservas = db.relationship('ReservaEvento', back_populates='evento', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'date': self.date.isoformat(),
            'maxCapacity': self.max_capacity,
            'currentAttendees': self.current_attendees,
            'dishes': self.dishes if self.dishes else [],
            'status': self.status,
            'createdBy': self.created_by,
            'createdAt': self.created_at.isoformat(),
            'lastModified': self.last_modified.isoformat() if self.last_modified else None
        }

class ReservaEvento(db.Model):
    __tablename__ = 'event_reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('gastro_events.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user_name = db.Column(db.String(150))
    reserved_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='confirmed')
    attended = db.Column(db.Boolean, default=False)

    evento = db.relationship('EventoGastro', back_populates='reservas')
    usuario = db.relationship('Usuario')

    def to_dict(self):
        return {
            'id': str(self.id),
            'eventId': str(self.event_id),
            'userId': str(self.user_id),
            'userName': self.user_name,
            'reservedAt': self.reserved_at.isoformat(),
            'status': self.status,
            'attended': self.attended
        }
