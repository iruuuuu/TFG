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
    try:
        data = request.get_json()
        
        # Flexibilidad en los nombres de los campos
        user_id = data.get('userId') or data.get('user_id')
        dish_id = data.get('dishId') or data.get('menuItemId') or data.get('dish_id')
        rating_value = data.get('rating')
        comment = data.get('comment')

        if not all([user_id, dish_id, rating_value is not None]):
            return jsonify({'error': 'Faltan campos obligatorios: userId, dishId o rating'}), 400

        new_rating = Valoracion(
            user_id=int(user_id),
            dish_id=int(dish_id),
            rating=int(rating_value),
            comment=comment
        )
        db.session.add(new_rating)
        db.session.commit()
        return jsonify(new_rating.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
