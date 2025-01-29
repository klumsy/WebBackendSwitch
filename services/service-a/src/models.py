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
        self.users: List[User] = []
        self.next_id = 1

    def create_user(self, username: str, email: str, password: str) -> User:
        user = User.create(username, email, password)
        user.id = self.next_id
        self.next_id += 1
        self.users.append(user)
        return user

    def get_user(self, user_id: int) -> Optional[User]:
        return next((user for user in self.users if user.id == user_id), None)

    def get_users(self) -> List[User]:
        return self.users
