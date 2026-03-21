from flask import Blueprint, jsonify, request
from ..models.log import RegistroActividad
from .. import db

log_bp = Blueprint('logs', __name__)

@log_bp.route('', methods=['GET'])
def get_all_logs():
    logs = RegistroActividad.query.order_by(RegistroActividad.timestamp.desc()).all()
    return jsonify([log.to_dict() for log in logs])

@log_bp.route('', methods=['POST'])
def create_log():
    data = request.get_json()
    new_log = RegistroActividad(
        action=data['action'],
        details=data.get('details'),
        user_name=data.get('userName'),
        user_role=data.get('userRole')
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify(new_log.to_dict()), 201
