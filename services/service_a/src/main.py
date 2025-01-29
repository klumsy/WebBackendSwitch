from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from services.service_a.src.models import db, User, UserRepository
from services.service_a.src.routes import register_routes
import os
import logging

# Configure logging with color codes
class ColorFormatter(logging.Formatter):
    grey = "\x1b[38;20m"
    green = "\x1b[32;20m"
    blue = "\x1b[34;20m"
    reset = "\x1b[0m"
    format_str = "%(asctime)s - [SERVICE-A] %(levelname)s: %(message)s"

    def format(self, record):
        color = self.green if record.levelno == logging.INFO else self.blue
        formatter = logging.Formatter(f"{color}{self.format_str}{self.reset}")
        return formatter.format(record)

# Set up logging
logger = logging.getLogger()
handler = logging.StreamHandler()
handler.setFormatter(ColorFormatter())
logger.handlers = [handler]
logger.setLevel(logging.DEBUG)

app = Flask(__name__)
CORS(app)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Initialize database and verify connection
with app.app_context():
    try:
        # Create database tables
        db.create_all()
        logger.info("Database tables created successfully")

        # Verify database connection by attempting a simple query
        test_query = db.session.query(User).first()
        logger.info("Database connection verified successfully")
        logger.debug(f"Test query result: {test_query}")

        # Create user repository with verified db connection
        user_repository = UserRepository(db)
        logger.info("User repository initialized successfully")

        # Register routes with verified user repository
        register_routes(app, user_repository)
        logger.info("Routes registered successfully")

    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

if __name__ == "__main__":
    logger.info("Starting Service A...")
    app.run(host="0.0.0.0", port=5001)