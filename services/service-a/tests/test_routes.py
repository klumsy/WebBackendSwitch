import json
import pytest
from flask import Flask
from src.models import User

def test_get_users_empty(client, app):
    """Test GET /api/users with no users in database"""
    response = client.get('/api/users')
    assert response.status_code == 200
    assert response.json == []

def test_get_users(client, user_repository):
    """Test GET /api/users with existing users"""
    # Create test users
    user1 = user_repository.create_user(
        username="testuser1",
        email="test1@example.com",
        password="password123"
    )
    user2 = user_repository.create_user(
        username="testuser2",
        email="test2@example.com",
        password="password123"
    )

    response = client.get('/api/users')
    assert response.status_code == 200
    users = response.json
    assert len(users) == 2
    assert users[0]['username'] == 'testuser1'
    assert users[1]['username'] == 'testuser2'
    # Ensure password hash is not exposed
    assert 'password_hash' not in users[0]
    assert 'password_hash' not in users[1]

def test_get_user(client, user_repository):
    """Test GET /api/users/<id> with valid user"""
    user = user_repository.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )

    response = client.get(f'/api/users/{user.id}')
    assert response.status_code == 200
    assert response.json['username'] == 'testuser'
    assert response.json['email'] == 'test@example.com'
    assert 'password_hash' not in response.json

def test_get_user_not_found(client):
    """Test GET /api/users/<id> with non-existent user"""
    response = client.get('/api/users/999')
    assert response.status_code == 404
    assert 'error' in response.json

def test_create_user(client):
    """Test POST /api/users with valid data"""
    data = {
        'username': 'newuser',
        'email': 'new@example.com',
        'password': 'password123'
    }
    response = client.post(
        '/api/users',
        data=json.dumps(data),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json['username'] == 'newuser'
    assert response.json['email'] == 'new@example.com'
    assert 'password_hash' not in response.json

def test_create_user_duplicate_username(client, user_repository):
    """Test POST /api/users with duplicate username"""
    # Create initial user
    user_repository.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )

    # Try to create user with same username
    data = {
        'username': 'testuser',
        'email': 'another@example.com',
        'password': 'password123'
    }
    response = client.post(
        '/api/users',
        data=json.dumps(data),
        content_type='application/json'
    )
    assert response.status_code == 400
    assert 'error' in response.json

def test_internal_verify_user(client, user_repository):
    """Test internal API endpoint for user verification"""
    # Create test user
    user = user_repository.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )

    # Test with valid internal API key
    response = client.get(
        f'/internal/api/users/verify/{user.id}',
        headers={'X-Internal-API-Key': 'dev_internal_key_123'}
    )
    assert response.status_code == 200
    assert response.json['username'] == 'testuser'
    assert response.json['verified'] is True

def test_internal_verify_user_unauthorized(client, user_repository):
    """Test internal API endpoint with invalid API key"""
    # Create test user
    user = user_repository.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )

    # Test without API key
    response = client.get(f'/internal/api/users/verify/{user.id}')
    assert response.status_code == 401

    # Test with invalid API key
    response = client.get(
        f'/internal/api/users/verify/{user.id}',
        headers={'X-Internal-API-Key': 'invalid_key'}
    )
    assert response.status_code == 401
