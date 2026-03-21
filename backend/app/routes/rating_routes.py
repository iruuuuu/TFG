from flask import Blueprint, jsonify, request
from ..models.rating import Valoracion
from .. import db

rating_bp = Blueprint('ratings', __name__)

@rating_bp.route('', methods=['GET'])
def get_all_ratings():
    ratings = Valoracion.query.all()
    return jsonify([r.to_dict() for r in ratings])

@rating_bp.route('', methods=['POST'])
def create_rating():
    data = request.get_json()
    new_rating = Valoracion(
        user_id=data['userId'],
        dish_id=data['dishId'],
        rating=data['rating'],
        comment=data.get('comment')
    )
    db.session.add(new_rating)
    db.session.commit()
    return jsonify(new_rating.to_dict()), 201
