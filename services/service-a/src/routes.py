from flask import Flask, request, jsonify
from models import UserRepository
from typing import Any

user_repository = UserRepository()

def register_routes(app: Flask) -> None:
    @app.route('/api/users', methods=['GET'])
    @app.route('/api/users/', methods=['GET'])
    def get_users() -> Any:
        users = user_repository.get_users()
        print(f"Getting users, found: {len(users)} users")  # Debug log
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
        print(f"Creating user with data: {data}")  # Debug log
        user = user_repository.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        print(f"Created user: {user.id}, {user.username}")  # Debug log
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 201