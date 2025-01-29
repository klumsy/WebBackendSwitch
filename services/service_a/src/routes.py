from flask import Flask, request, jsonify
from .models import UserRepository
from typing import Any
import os

# Secret key for internal API authentication
INTERNAL_API_KEY = os.environ.get('INTERNAL_API_KEY', 'dev_internal_key_123')

def register_routes(app: Flask, user_repository: UserRepository) -> None:
    def require_internal_auth():
        auth_key = request.headers.get('X-Internal-API-Key')
        if not auth_key or auth_key != INTERNAL_API_KEY:
            return jsonify({'error': 'Unauthorized'}), 401
        return None

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

    # Private API endpoints for service-to-service communication
    @app.route('/internal/api/users/verify/<int:user_id>', methods=['GET'])
    def verify_user_internal(user_id: int) -> Any:
        auth_error = require_internal_auth()
        if auth_error:
            return auth_error

        print(f"[DEBUG] Internal API: Verifying user {user_id}")
        user = user_repository.get_user(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'verified': True
        })

    @app.route('/internal/api/users/batch', methods=['POST'])
    def get_users_batch_internal() -> Any:
        auth_error = require_internal_auth()
        if auth_error:
            return auth_error

        data = request.get_json()
        user_ids = data.get('user_ids', [])
        print(f"[DEBUG] Internal API: Fetching users batch {user_ids}")

        users = []
        for user_id in user_ids:
            user = user_repository.get_user(user_id)
            if user:
                users.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                })

        return jsonify(users)