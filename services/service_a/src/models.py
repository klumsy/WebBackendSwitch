from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional, List
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def __init__(self, username: str, email: str, password: str):
        logger.debug(f"Creating new User instance with username: {username}")
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def create(username: str, email: str, password: str) -> 'User':
        logger.debug(f"Creating new user with username: {username}, email: {email}")
        return User(username=username, email=email, password=password)

class UserRepository:
    def __init__(self, db):
        self.db = db
        logger.debug("Initializing UserRepository with db instance")

    def create_user(self, username: str, email: str, password: str) -> User:
        logger.debug(f"Creating user in repository - username: {username}")
        try:
            user = User(username=username, email=email, password=password)
            self.db.session.add(user)
            logger.debug("Added user to session, about to commit")
            self.db.session.commit()
            logger.debug(f"User created successfully - id: {user.id}")
            return user
        except Exception as e:
            logger.error(f"Error in create_user: {str(e)}")
            self.db.session.rollback()
            raise

    def get_user(self, user_id: int) -> Optional[User]:
        logger.debug(f"Getting user by id: {user_id}")
        return self.db.session.get(User, user_id)

    def get_users(self) -> List[User]:
        logger.debug("Getting all users - Start")
        try:
            users = self.db.session.query(User).all()
            logger.debug(f"Found {len(users)} users")
            return users
        except Exception as e:
            logger.error(f"Error in get_users: {str(e)}")
            return []