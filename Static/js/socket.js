// static/js/socket.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Socket.IO connection
    const socket = io();
    window.chatSocket = socket;
    
    // Connection event handlers
    socket.on('connect', function() {
        console.log('Connected to server');
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });
    
    // User status updates
    socket.on('user_status', function(data) {
        const userElement = document.querySelector(`.user-item[data-user-id="${data.user_id}"]`);
        if (userElement) {
            const statusIndicator = userElement.querySelector('.status-indicator');
            if (data.status === 'online') {
                statusIndicator.classList.remove('offline');
                statusIndicator.classList.add('online');
            } else {
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
            }
        }
    });
    
    // Receive list of active users
    socket.on('active_users', function(users) {
        users.forEach(user => {
            const userElement = document.querySelector(`.user-item[data-user-id="${user.user_id}"]`);
            if (userElement && user.status === 'online') {
                const statusIndicator = userElement.querySelector('.status-indicator');
                statusIndicator.classList.remove('offline');
                statusIndicator.classList.add('online');
            }
        });
    });
    
    // New message handler
    socket.on('new_message', function(message) {
        addMessageToChat(message);
        // Mark the message as read
        if (message.user_id !== currentUserId) {
            socket.emit('mark_read', { message_id: message.id });
        }
    });
    
    // Message read receipt handler
    socket.on('message_read', function(data) {
        const messageElement = document.querySelector(`.message[data-message-id="${data.message_id}"]`);
        if (messageElement) {
            const statusIcon = messageElement.querySelector('.message-status i');
            statusIcon.classList.remove('fa-check');
            statusIcon.classList.add('fa-check-double');
        }
    });
});
