from dataclasses import dataclass
from typing import List, Optional

@dataclass
class User:
    id: int
    username: str
    email: str
    password_hash: str

    @staticmethod
    def create(username: str, email: str, password: str) -> 'User':
        from werkzeug.security import generate_password_hash
        print(f"[DEBUG] Creating new user with username: {username}, email: {email}")
        return User(
            id=0,  # Will be set by database
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )

    def verify_password(self, password: str) -> bool:
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

class UserRepository:
    def __init__(self):
        print("[DEBUG] Initializing UserRepository")
        self.users: List[User] = []
        self.next_id = 1
        print(f"[DEBUG] Initial state - users: {len(self.users)}, next_id: {self.next_id}")

    def create_user(self, username: str, email: str, password: str) -> User:
        print(f"[DEBUG] Creating user in repository - Before: {len(self.users)} users")
        user = User.create(username, email, password)
        user.id = self.next_id
        self.next_id += 1
        self.users.append(user)
        print(f"[DEBUG] User created - id: {user.id}, Current users count: {len(self.users)}")
        print(f"[DEBUG] All users: {[(u.id, u.username) for u in self.users]}")
        return user

    def get_user(self, user_id: int) -> Optional[User]:
        print(f"[DEBUG] Getting user by id: {user_id}, Total users: {len(self.users)}")
        return next((user for user in self.users if user.id == user_id), None)

    def get_users(self) -> List[User]:
        print(f"[DEBUG] Getting all users - Count: {len(self.users)}")
        print(f"[DEBUG] User list: {[(u.id, u.username) for u in self.users]}")
        return self.users