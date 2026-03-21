from flask import Blueprint, jsonify, request
from ..models.user import Usuario
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(email=data.get('email')).first()
    
    if user and user.password == data.get('password'):
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "token": "dummy-jwt-token"
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = Usuario.query.all()
    return jsonify([u.to_dict() for u in users])

@auth_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if Usuario.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email already exists"}), 400
    user = Usuario(
        email=data['email'],
        name=data.get('name', 'Nuevo Usuario'),
        password=data.get('password', '123456'),
        roles=data.get('roles', ['alumno-cocina'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Usuario.query.get_or_404(user_id)
    data = request.get_json()
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = data['password']
    if 'roles' in data:
        user.roles = data['roles']
    db.session.commit()
    return jsonify(user.to_dict())

@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Usuario.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
