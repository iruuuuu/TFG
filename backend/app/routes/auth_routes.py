import bcrypt
from flask import Blueprint, jsonify, request
from ..models.user import Usuario
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = Usuario.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Check if the database password is a hash
    is_valid = False
    if user.password.startswith('$2'):
        try:
            # The hash in DB might be string, need bytes for bcrypt
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                is_valid = True
        except Exception:
            # Fallback if hash is malformed but looks like one
            pass
    
    # Fallback for plain text if not a hash or check failed
    if not is_valid and user.password == password:
        is_valid = True

    if is_valid:
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "token": f"dummy-token-{user.id}"
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
def get_me():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth_header.split(' ')[1]
    if not token.startswith('dummy-token-'):
        return jsonify({"error": "Invalid token"}), 401
    
    try:
        user_id = int(token.replace('dummy-token-', ''))
        user = Usuario.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid token format"}), 401

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
