// chat.js
document.addEventListener("DOMContentLoaded", function () {
  // Connect to the Socket.IO server
  const socket = io();

  // Select DOM elements
  const chatContainer = document.getElementById("chat-container");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message");

  // Listen for new messages from the server
  socket.on("new_message", function (data) {
    displayMessage(data);
  });

  // Optional: Listen for a message-read event if needed
  socket.on("message_read", function (data) {
    // You can implement a visual indicator for read messages here
    console.log("Message read:", data.message_id);
  });

  // Handle the message form submission
  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim() !== "") {
      // Emit the message event to the server
      socket.emit("send_message", { message: message });
      messageInput.value = "";
    }
  });

  // Function to display a message in the chat container
  function displayMessage(data) {
    // Create a container for the message
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // Format the message content
    messageDiv.innerHTML = `
      <div class="message-header">
        <img src="${data.avatar}" alt="${data.username}'s avatar" class="avatar">
        <strong>${data.username}</strong>
        <span class="timestamp">${data.timestamp}</span>
      </div>
      <div class="message-body">
        ${data.content}
      </div>
    `;

    // Append the message to the chat container
    chatContainer.appendChild(messageDiv);

    // Optionally scroll to the bottom to show the new message
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});
