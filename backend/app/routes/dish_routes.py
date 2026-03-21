from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models.dish import Plato
from .. import db

dish_bp = Blueprint('dishes', __name__)

@dish_bp.route('', methods=['GET'])
def get_all_dishes():
    dishes = Plato.query.all()
    return jsonify([dish.to_dict() for dish in dishes])

@dish_bp.route('/<int:id>', methods=['GET'])
def get_dish(id):
    dish = Plato.query.get_or_404(id)
    return jsonify(dish.to_dict())

@dish_bp.route('', methods=['POST'])
def create_dish():
    data = request.get_json()
    
    # Manejar fechas
    date_str = data.get('fecha_disponibilidad')
    try:
        available_date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else datetime.utcnow().date()
    except ValueError:
        try:
            available_date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ').date()
        except:
             available_date = datetime.utcnow().date()

    new_dish = Plato(
        name=data.get('nombre'),
        description=data.get('descripcion'),
        category=data.get('categoria'),
        price=data.get('precio', 0.0),
        available_date=available_date,
        stock_total=data.get('stock_total', 10),
        image_url=data.get('url_imagen'),
        allergens=data.get('alergenos', []),
        nutritional_info=data.get('informacion_nutricional', {})
    )
    db.session.add(new_dish)
    db.session.commit()
    return jsonify(new_dish.to_dict()), 201

@dish_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_dish(id):
    dish = Plato.query.get_or_404(id)
    data = request.get_json()
    
    if 'nombre' in data: dish.name = data['nombre']
    if 'descripcion' in data: dish.description = data['descripcion']
    if 'categoria' in data: dish.category = data['categoria']
    if 'precio' in data: dish.price = data['precio']
    if 'url_imagen' in data: dish.image_url = data['url_imagen']
    if 'alergenos' in data: dish.allergens = data['alergenos']
    if 'informacion_nutricional' in data: dish.nutritional_info = data['informacion_nutricional']
    if 'esta_activo' in data: dish.is_active = data['esta_activo']
    if 'stock_total' in data: dish.stock_total = data['stock_total']
    
    if 'fecha_disponibilidad' in data:
        try:
            dish.available_date = datetime.strptime(data['fecha_disponibilidad'], '%Y-%m-%d').date()
        except:
             pass
             
    db.session.commit()
    return jsonify(dish.to_dict())

@dish_bp.route('/<int:id>', methods=['DELETE'])
def delete_dish(id):
    dish = Plato.query.get_or_404(id)
    db.session.delete(dish)
    db.session.commit()
    return '', 204
