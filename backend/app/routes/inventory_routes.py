from flask import Blueprint, jsonify, request
from ..models.inventory import Inventario
from .. import db

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('', methods=['GET'])
def get_all_inventory():
    items = Inventario.query.all()
    return jsonify([item.to_dict() for item in items])

@inventory_bp.route('', methods=['POST'])
def create_inventory():
    data = request.get_json()
    new_item = Inventario(
        ingredient_name=data['ingredient_name'],
        quantity=data.get('quantity', 0),
        unit=data['unit'],
        minimum_stock=data.get('minimum_stock', 0)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@inventory_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_inventory(id):
    item = Inventario.query.get_or_404(id)
    data = request.get_json()
    
    if 'ingredient_name' in data: item.ingredient_name = data['ingredient_name']
    if 'quantity' in data: item.quantity = data['quantity']
    if 'unit' in data: item.unit = data['unit']
    if 'minimum_stock' in data: item.minimum_stock = data['minimum_stock']
    
    db.session.commit()
    return jsonify(item.to_dict())

@inventory_bp.route('/<int:id>', methods=['DELETE'])
def delete_inventory(id):
    item = Inventario.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204
