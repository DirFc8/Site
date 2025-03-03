// static/js/ui.js
document.addEventListener('DOMContentLoaded', function() {
    // Flash message auto-hide
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    });
    
    // Image modal
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.message-image img')) {
            const imgSrc = e.target.src;
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${imgSrc}" alt="Enlarged image">
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal on click
            modal.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
        }
    });
    
    // Add dynamic styles for image modal
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            display: flex;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s;
        }
        
        .image-modal-content {
            max-width: 90%;
            max-height: 90%;
            position: relative;
        }
        
        .image-modal-content img {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 4px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .close-modal {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});
