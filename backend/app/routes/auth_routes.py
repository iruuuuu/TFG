from flask import Blueprint, jsonify, request
from ..models.user import Usuario
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Basic registration logic placeholder
    user = Usuario(email=data['email'], password=data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    # Basic login logic placeholder
    return jsonify({"message": "Login successful"}), 200
