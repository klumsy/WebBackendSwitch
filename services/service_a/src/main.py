from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, UserRepository
from routes import register_routes
import os
import logging

# Configure logging with color codes
class ColorFormatter(logging.Formatter):
    grey = "\x1b[38;20m"
    green = "\x1b[32;20m"
    blue = "\x1b[34;20m"
    reset = "\x1b[0m"
    format = "%(asctime)s - [SERVICE-A] %(levelname)s: %(message)s"

    def format(self, record):
        color = self.green if record.levelno == logging.INFO else self.blue
        formatter = logging.Formatter(f"{color}{self.format}{self.reset}")
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

        # Verify database connection by attempting a simple query
        test_query = db.session.query(User).first()
        logger.info("Database connection verified successfully")
        logger.debug(f"Test query result: {test_query}")

        # Create user repository with verified db connection
        user_repository = UserRepository(db)

        # Register routes with verified user repository
        register_routes(app, user_repository)

    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

if __name__ == "__main__":
    logger.info("Starting Service A...")
    app.run(host="0.0.0.0", port=5001)