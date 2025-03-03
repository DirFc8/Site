from flask import request
from flask_socketio import emit, join_room, leave_room
from flask_login import current_user
from app import socketio, db
from app.models import User, Message
import os

# Store active users
active_users = {}

@socketio.on('connect')
def handle_connect():
    if current_user.is_authenticated:
        active_users[current_user.id] = request.sid
        emit('user_status', {'user_id': current_user.id, 'status': 'online'}, broadcast=True)
        # Send the list of currently active users to the newly connected client
        active_user_list = [{'user_id': user_id, 'status': 'online'} for user_id in active_users.keys()]
        emit('active_users', active_user_list)

@socketio.on('disconnect')
def handle_disconnect():
    if current_user.is_authenticated:
        if current_user.id in active_users:
            del active_users[current_user.id]
        emit('user_status', {'user_id': current_user.id, 'status': 'offline'}, broadcast=True)

@socketio.on('send_message')
def handle_message(data):
    if not current_user.is_authenticated:
        return

    content = data.get('message', '')
    image_path = data.get('image_path', None)
    
    # Create and save message
    message = Message(content=content, image_path=image_path, user_id=current_user.id)
    db.session.add(message)
    db.session.commit()
    
    # Emit to all connected clients
    emit('new_message', {
        'id': message.id,
        'content': message.content,
        'image_path': message.image_path,
        'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'user_id': message.user_id,
        'username': current_user.username,
        'avatar': current_user.avatar
    }, broadcast=True)

@socketio.on('mark_read')
def mark_as_read(data):
    if not current_user.is_authenticated:
        return
        
    message_id = data.get('message_id')
    message = Message.query.get(message_id)
    if message:
        message.read = True
        db.session.commit()
        emit('message_read', {'message_id': message_id}, broadcast=True)
