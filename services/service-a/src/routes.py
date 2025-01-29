from flask import Flask, request, jsonify
from models import UserRepository
from typing import Any

def register_routes(app: Flask, user_repository: UserRepository) -> None:
    @app.before_request
    def before_request():
        print("\n[DEBUG] -------- New Request --------")
        print(f"[DEBUG] Method: {request.method}, Path: {request.path}")
        print(f"[DEBUG] Current request started")

    @app.route('/api/users', methods=['GET'])
    @app.route('/api/users/', methods=['GET'])
    def get_users() -> Any:
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

        try:
            user = user_repository.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            print(f"[DEBUG] Created user: {user.id}, {user.username}")
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email
            }), 201
        except Exception as e:
            print(f"[DEBUG] Error creating user: {str(e)}")
            return jsonify({'error': str(e)}), 400