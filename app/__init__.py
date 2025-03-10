# app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_login import LoginManager
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()
login_manager = LoginManager()
login_manager.login_view = 'main.login'

def create_app(config_class=Config):
    # Adjust the paths so Flask looks one level up for templates and static files
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins="*", async_mode='eventlet')
    login_manager.init_app(app)

    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    from app.routes import main
    app.register_blueprint(main)

    from app import socket_events

    # Automatically create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app




