import pytest
from src.models import User, UserRepository

def test_user_creation():
    user = User.create(
        username="testuser",
        email="test@example.com",
        password="password123"
    )
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.password_hash != "password123"

def test_password_verification():
    user = User.create(
        username="testuser",
        email="test@example.com",
        password="password123"
    )
    assert user.verify_password("password123") is True
    assert user.verify_password("wrongpassword") is False

def test_user_repository():
    repo = UserRepository()
    
    # Test user creation
    user = repo.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )
    assert user.id == 1
    assert len(repo.get_users()) == 1
    
    # Test user retrieval
    retrieved_user = repo.get_user(1)
    assert retrieved_user is not None
    assert retrieved_user.username == "testuser"
    
    # Test non-existent user
    assert repo.get_user(999) is None
