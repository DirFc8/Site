// static/js/chat.js
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const messagesContainer = document.getElementById('messages-container');
    
    // Get current user ID from a data attribute (you'll need to add this to the chat template)
    const currentUserId = parseInt(document.body.dataset.userId);
    window.currentUserId = currentUserId;
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    scrollToBottom();
    
    // Add a new message to the chat
    window.addMessageToChat = function(message) {
        const isOutgoing = message.user_id === currentUserId;
        const messageClass = isOutgoing ? 'outgoing' : 'incoming';
        
        const messageHtml = `
            <div class="message-wrapper ${messageClass}">
                <div class="message" data-message-id="${message.id}">
                    <div class="message-sender">${message.username}</div>
                    <div class="message-content">
                        ${message.content}
                        ${message.image_path ? `
                            <div class="message-image">
                                <img src="${message.image_path}" alt="Shared image">
                            </div>
                        ` : ''}
                    </div>
                    <div class="message-time">${formatTime(message.timestamp)}</div>
                    <div class="message-status">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        scrollToBottom();
    };
    
    // Format timestamp
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // Handle image uploads
    imageUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.innerHTML = `
                    <div class="image-preview-item">
                        <img src="${e.target.result}" alt="Preview">
                        <div class="remove-image">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                `;
                
                // Add remove button functionality
                const removeButton = imagePreview.querySelector('.remove-image');
                removeButton.addEventListener('click', function() {
                    imagePreview.innerHTML = '';
                    imageUpload.value = '';
                });
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // Handle message submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        const file = imageUpload.files[0];
        
        if (!message && !file) return;
        
        if (file) {
            // Upload the image first
            const formData = new FormData();
            formData.append('image', file);
            
            fetch('/upload_image', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Send message with image path
                chatSocket.emit('send_message', {
                    message: message,
                    image_path: data.file_path
                });
                
                // Clear form
                messageInput.value = '';
                imageUpload.value = '';
                imagePreview.innerHTML = '';
            })
            .catch(error => console.error('Error uploading image:', error));
        } else {
            // Send message without image
            chatSocket.emit('send_message', { message: message });
            
            // Clear input
            messageInput.value = '';
        }
    });
});
