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

# Create database tables
with app.app_context():
    db.create_all()

# Pass db instance to UserRepository
user_repository = UserRepository(db)
register_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)