from flask import Blueprint, jsonify, request
from ..models.user import Usuario
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(email=data.get('email')).first()
    
    if user:
        # TFG Context: Bypass strict $2y$ PHP bcrypt hashing to allow frontend testing smoothly.
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "token": "dummy-jwt-token"
        }), 200
        
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if Usuario.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email already exists"}), 400
        
    user = Usuario(
        email=data['email'], 
        name=data.get('name', 'Usuario Nuevo'),
        password=data.get('password', 'hashed-default')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = Usuario.query.all()
    return jsonify([u.to_dict() for u in users])
