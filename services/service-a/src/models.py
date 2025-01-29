from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional, List

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def __init__(self, username: str, email: str, password: str):
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def create(username: str, email: str, password: str) -> 'User':
        print(f"[DEBUG] Creating new user with username: {username}, email: {email}")
        return User(username=username, email=email, password=password)

class UserRepository:
    def __init__(self, db):
        self.db = db
        print("[DEBUG] Initializing UserRepository with db instance")

    def create_user(self, username: str, email: str, password: str) -> User:
        print(f"[DEBUG] Creating user in repository - Before: ")
        try:
            user = User(username=username, email=email, password=password)
            self.db.session.add(user)
            print(f"[DEBUG] Added user to session, about to commit")
            self.db.session.commit()
            print(f"[DEBUG] User created - id: {user.id}")
            return user
        except Exception as e:
            print(f"[DEBUG] Error in create_user: {str(e)}")
            self.db.session.rollback()
            raise

    def get_user(self, user_id: int) -> Optional[User]:
        print(f"[DEBUG] Getting user by id: {user_id}")
        return self.db.session.query(User).get(user_id)

    def get_users(self) -> List[User]:
        print(f"[DEBUG] Getting all users - Start")
        try:
            query = self.db.session.query(User)
            print(f"[DEBUG] Query created: {str(query)}")
            users = query.all()
            print(f"[DEBUG] Query executed, found users: {[(u.id, u.username) for u in users]}")
            return users
        except Exception as e:
            print(f"[DEBUG] Error in get_users: {str(e)}")
            return []