from flask import Flask, request, jsonify, g
from models import UserRepository
from typing import Any

def get_user_repository() -> UserRepository:
    print("[DEBUG] Accessing user repository from flask context")
    if 'user_repository' not in g:
        print("[DEBUG] Creating new user repository in flask context")
        g.user_repository = UserRepository()
    else:
        print(f"[DEBUG] Retrieved existing repository with {len(g.user_repository.users)} users")
    return g.user_repository

def register_routes(app: Flask) -> None:
    @app.before_request
    def before_request():
        print("\n[DEBUG] -------- New Request --------")
        print(f"[DEBUG] Method: {request.method}, Path: {request.path}")
        if hasattr(g, 'user_repository'):
            print(f"[DEBUG] Repository exists with {len(g.user_repository.users)} users")
        else:
            print("[DEBUG] No repository in context yet")

    @app.route('/api/users', methods=['GET'])
    @app.route('/api/users/', methods=['GET'])
    def get_users() -> Any:
        user_repository = get_user_repository()
        print("[DEBUG] Fetching all users")
        users = user_repository.get_users()
        print(f"[DEBUG] Found {len(users)} users")
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'email': user.email
        } for user in users])

    @app.route('/api/users/<int:user_id>', methods=['GET'])
    def get_user(user_id: int) -> Any:
        user_repository = get_user_repository()
        user = user_repository.get_user(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })

    @app.route('/api/users', methods=['POST'])
    @app.route('/api/users/', methods=['POST'])
    def create_user() -> Any:
        data = request.get_json()
        print(f"[DEBUG] Creating user with data: {data}")
        user_repository = get_user_repository()
        user = user_repository.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        print(f"[DEBUG] Created user: {user.id}, {user.username}")
        print(f"[DEBUG] Current repository state: {len(user_repository.users)} users")
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 201