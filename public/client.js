const socket = io();
let name;

do {
    name = prompt('Please enter your name:');
} while (!name);

socket.emit('new-user', name); // Notify server about new user

const textarea = document.querySelector('#textarea');
const messageArea = document.querySelector('.message_area');

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    const msg = {
        user: name,
        message: message
    };

    socket.emit('chat-message', msg);

    textarea.value = '';
}

function appendMessage(msg, type) {
    const mainDiv = document.createElement('div');
    const className = type;
    mainDiv.classList.add(className, 'message');

    const markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;

    mainDiv.innerHTML = markup;

    if (msg.user === name) {
        mainDiv.classList.add('outgoing'); // Right-aligned for sender
    } else if (type === 'system') {
        mainDiv.classList.add('system-message'); // Center-aligned for system messages
    } else {
        mainDiv.classList.add('incoming'); // Left-aligned for receiver
    }

    messageArea.appendChild(mainDiv);

    // Scroll to the bottom after appending the message
    scrollToBottom();
}

// Scroll to the bottom of the message area
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

socket.on('chat-message', (msg) => {
    appendMessage(msg, 'message');
});

socket.on('user-connected', (username) => {
    if (name !== username) {
        appendMessage({ user: '', message: `${username} has joined the chat` }, 'system');
    }
});

socket.on('user-disconnected', (username) => {
    if (name !== username) {
        appendMessage({ user: '', message: `${username} has left the chat` }, 'system');
    }
});
