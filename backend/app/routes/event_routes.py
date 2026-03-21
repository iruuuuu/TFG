from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models.event import EventoGastro, ReservaEvento
from .. import db

event_bp = Blueprint('events', __name__)

@event_bp.route('', methods=['GET'])
def get_all_events():
    events = EventoGastro.query.all()
    return jsonify([ev.to_dict() for ev in events])

@event_bp.route('', methods=['POST'])
def create_event():
    data = request.get_json()
    
    date_str = data.get('date')
    try:
        event_date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
    except:
        event_date = datetime.utcnow()

    new_event = EventoGastro(
        name=data['name'],
        description=data.get('description'),
        date=event_date,
        max_capacity=data.get('maxCapacity', data.get('max_capacity', 10)),
        current_attendees=0,
        dishes=data.get('dishes', []),
        status=data.get('status', 'active'),
        created_by=data.get('createdBy')
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.to_dict()), 201

@event_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_event(id):
    ev = EventoGastro.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data: ev.name = data['name']
    if 'description' in data: ev.description = data['description']
    if 'maxCapacity' in data: ev.max_capacity = data['maxCapacity']
    if 'status' in data: ev.status = data['status']
    if 'dishes' in data: ev.dishes = data['dishes']
    
    db.session.commit()
    return jsonify(ev.to_dict())

@event_bp.route('/<int:id>', methods=['DELETE'])
def delete_event(id):
    ev = EventoGastro.query.get_or_404(id)
    db.session.delete(ev)
    db.session.commit()
    return '', 204

@event_bp.route('/<int:event_id>/reservations', methods=['GET'])
def get_event_reservations(event_id):
    reservations = ReservaEvento.query.filter_by(event_id=event_id).all()
    return jsonify([res.to_dict() for res in reservations])

@event_bp.route('/<int:event_id>/reservations', methods=['POST'])
def create_event_reservation(event_id):
    data = request.get_json()
    new_res = ReservaEvento(
        event_id=event_id,
        user_id=data['userId'],
        user_name=data.get('userName'),
        status=data.get('status', 'confirmed'),
        attended=data.get('attended', False)
    )
    ev = EventoGastro.query.get(event_id)
    if ev:
        ev.current_attendees += 1
    
    db.session.add(new_res)
    db.session.commit()
    return jsonify(new_res.to_dict()), 201

@event_bp.route('/reservations/<int:id>', methods=['PATCH', 'PUT'])
def update_event_reservation(id):
    res = ReservaEvento.query.get_or_404(id)
    data = request.get_json()
    
    if 'status' in data: res.status = data['status']
    if 'attended' in data: res.attended = data['attended']
    
    db.session.commit()
    return jsonify(res.to_dict())
