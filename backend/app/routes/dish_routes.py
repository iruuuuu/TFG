from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models.dish import Plato
from .. import db

dish_bp = Blueprint('dishes', __name__)

@dish_bp.route('/', methods=['GET'])
def get_all_dishes():
    dishes = Plato.query.all()
    return jsonify([dish.to_dict() for dish in dishes])

@dish_bp.route('/<int:id>', methods=['GET'])
def get_dish(id):
    dish = Plato.query.get_or_404(id)
    return jsonify(dish.to_dict())

@dish_bp.route('/', methods=['POST'])
def create_dish():
    data = request.get_json()
    new_dish = Plato(
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        categoria=data.get('categoria'),
        precio=data['precio'],
        fecha_disponibilidad=datetime.strptime(data['fecha_disponibilidad'], '%Y-%m-%d'),
        stock_total=data.get('stock_total', 0)
    )
    db.session.add(new_dish)
    db.session.commit()
    return jsonify(new_dish.to_dict()), 201
