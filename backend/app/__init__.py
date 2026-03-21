from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///mendoza.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    app.url_map.strict_slashes = False

    # Register blueprints (to be implemented)
    from .routes.dish_routes import dish_bp
    from .routes.reservation_routes import reservation_bp
    from .routes.auth_routes import auth_bp
    from .routes.inventory_routes import inventory_bp
    from .routes.event_routes import event_bp
    from .routes.log_routes import log_bp
    from .routes.rating_routes import rating_bp

    app.register_blueprint(dish_bp, url_prefix='/api/dishes')
    app.register_blueprint(reservation_bp, url_prefix='/api/reservations')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(log_bp, url_prefix='/api/logs')
    app.register_blueprint(rating_bp, url_prefix='/api/ratings')

    return app
