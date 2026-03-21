from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models.reservation import Reserva
from .. import db

reservation_bp = Blueprint('reservations', __name__)

@reservation_bp.route('', methods=['GET'])
def get_all_reservations():
    reservations = Reserva.query.all()
    return jsonify([res.to_dict() for res in reservations])

@reservation_bp.route('/<int:id>', methods=['GET'])
def get_reservation(id):
    res = Reserva.query.get_or_404(id)
    return jsonify(res.to_dict())

@reservation_bp.route('', methods=['POST'])
def create_reservation():
    data = request.get_json()
    
    date_str = data.get('fecha_reserva')
    try:
        reservation_date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()
    except ValueError:
        try:
            reservation_date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ').date()
        except:
             reservation_date = datetime.utcnow().date()

    new_res = Reserva(
        user_id=data.get('id_usuario'),
        dish_id=data.get('id_plato'),
        reservation_date=reservation_date,
        quantity=data.get('cantidad', 1),
        notes=data.get('notas'),
        status=data.get('estado', 'pending')
    )
    db.session.add(new_res)
    db.session.commit()
    return jsonify(new_res.to_dict()), 201

@reservation_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_reservation(id):
    res = Reserva.query.get_or_404(id)
    data = request.get_json()
    
    if 'estado' in data: res.status = data['estado']
    if 'cantidad' in data: res.quantity = data['cantidad']
    if 'notas' in data: res.notes = data['notas']
    
    db.session.commit()
    return jsonify(res.to_dict())

@reservation_bp.route('/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    res = Reserva.query.get_or_404(id)
    db.session.delete(res)
    db.session.commit()
    return '', 204
