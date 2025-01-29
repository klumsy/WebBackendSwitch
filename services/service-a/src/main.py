from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, UserRepository
from routes import register_routes
import os

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
        print("[DEBUG] Database connection verified successfully")
        print(f"[DEBUG] Test query result: {test_query}")

        # Create user repository with verified db connection
        user_repository = UserRepository(db)

        # Register routes with verified user repository
        register_routes(app, user_repository)

    except Exception as e:
        print(f"[ERROR] Database initialization failed: {str(e)}")
        raise

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)