import pytest
from src.models import User, UserRepository

def test_user_creation(app):
    """Test creating a user with valid data"""
    with app.app_context():
        user = User.create(
            username="testuser",
            email="test@example.com",
            password="password123"
        )
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.password_hash != "password123"  # Password should be hashed

def test_password_hashing_and_verification(app):
    """Test password hashing and verification"""
    with app.app_context():
        user = User.create(
            username="testuser",
            email="test@example.com",
            password="password123"
        )
        assert user.verify_password("password123") is True
        assert user.verify_password("wrongpassword") is False

def test_user_repository_creation(user_repository):
    """Test creating a user through the repository"""
    user = user_repository.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )
    assert user.id is not None
    assert user.username == "testuser"
    assert user.email == "test@example.com"

def test_user_repository_get_user(user_repository):
    """Test retrieving a user by ID"""
    # Create a test user
    created_user = user_repository.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )

    # Retrieve the user
    retrieved_user = user_repository.get_user(created_user.id)
    assert retrieved_user is not None
    assert retrieved_user.id == created_user.id
    assert retrieved_user.username == "testuser"
    assert retrieved_user.email == "test@example.com"

def test_user_repository_get_nonexistent_user(user_repository):
    """Test retrieving a non-existent user"""
    user = user_repository.get_user(999)
    assert user is None

def test_user_repository_get_users(user_repository):
    """Test retrieving all users"""
    # Create test users
    user1 = user_repository.create_user(
        username="user1",
        email="user1@example.com",
        password="password123"
    )
    user2 = user_repository.create_user(
        username="user2",
        email="user2@example.com",
        password="password123"
    )

    # Get all users
    users = user_repository.get_users()
    assert len(users) == 2
    assert any(u.username == "user1" for u in users)
    assert any(u.username == "user2" for u in users)

def test_unique_username_constraint(user_repository):
    """Test that usernames must be unique"""
    # Create first user
    user_repository.create_user(
        username="testuser",
        email="test1@example.com",
        password="password123"
    )

    # Attempt to create second user with same username
    with pytest.raises(Exception):
        user_repository.create_user(
            username="testuser",
            email="test2@example.com",
            password="password123"
        )

def test_unique_email_constraint(user_repository):
    """Test that email addresses must be unique"""
    # Create first user
    user_repository.create_user(
        username="user1",
        email="test@example.com",
        password="password123"
    )

    # Attempt to create second user with same email
    with pytest.raises(Exception):
        user_repository.create_user(
            username="user2",
            email="test@example.com",
            password="password123"
        )