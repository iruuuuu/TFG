from .. import db
from datetime import datetime

class RegistroActividad(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text)
    user_name = db.Column(db.String(150))
    user_role = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'action': self.action,
            'details': self.details,
            'userName': self.user_name,
            'userRole': self.user_role,
            'timestamp': self.timestamp.isoformat()
        }
