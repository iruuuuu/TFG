from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models.reservation import Reserva
from .. import db

reservation_bp = Blueprint('reservations', __name__)

@reservation_bp.route('/', methods=['GET'])
def get_all_reservations():
    reservations = Reserva.query.all()
    return jsonify([res.to_dict() for res in reservations])

@reservation_bp.route('/', methods=['POST'])
def create_reservation():
    data = request.get_json()
    new_res = Reserva(
        id_usuario=data['id_usuario'],
        id_plato=data['id_plato'],
        fecha_reserva=datetime.strptime(data['fecha_reserva'], '%Y-%m-%d'),
        cantidad=data['cantidad'],
        notas=data.get('notas')
    )
    db.session.add(new_res)
    db.session.commit()
    return jsonify(new_res.to_dict()), 201
