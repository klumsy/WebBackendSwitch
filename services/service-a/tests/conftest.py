import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Add src directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from models import db, User, UserRepository
from routes import register_routes

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    logger.debug("Setting up test Flask application")
    app = Flask(__name__)

    # Use in-memory SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = True

    # Initialize the database and create tables
    db.init_app(app)

    with app.app_context():
        logger.debug("Creating database tables")
        db.create_all()
        # Create user repository
        user_repository = UserRepository(db)
        # Register routes
        register_routes(app, user_repository)

        yield app

        # Clean up
        logger.debug("Cleaning up test database")
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Test client for the app."""
    logger.debug("Creating test client")
    return app.test_client()

@pytest.fixture
def runner(app):
    """Test CLI runner for the app."""
    logger.debug("Creating test CLI runner")
    return app.test_cli_runner()

@pytest.fixture
def user_repository(app):
    """User repository instance for testing."""
    logger.debug("Creating user repository for tests")
    with app.app_context():
        return UserRepository(db)