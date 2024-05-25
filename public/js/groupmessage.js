
fetch('/api/data') // Replace '/api/data' with the URL of your API
    .then((response) => response.json())
    .then((data) => {
        const rows = data; // Assign the fetched data to 'rows'

        // Now you can use 'rows' in your 'forEach' loop
        rows.forEach((row) => {
            const tr = document.createElement('tr');

            Object.values(row).forEach((cell) => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });

            const tableBody = document.querySelector('#chatDataTable tbody');
            if (tableBody) {
                tableBody.appendChild(tr);
            }
        });
    })
    .catch((error) => console.error('Failed to fetch data:', error));

// This function fetches chat data from the apiRoutes and displays messages for a specific chatId
// eslint-disable-next-line no-unused-vars
function loadMessages(chatId) {
    // console.log('Loading messages for chat:', chatId);
    fetch('/api/chats') // Assuming '/api/chats' is set up to return the chatsData.json content
        .then((response) => response.json())
        .then((chatsData) => {
            const chat = chatsData.find((c) => c.id === chatId);
            if (chat) {
                displayChatMessages(chat);
            }
        })
        .catch((error) => console.error('Failed to load chats data:', error));
}

function displayChatMessages(chat) {
    const chatAvatar = document.getElementById('chat-avatar');
    const chatName = document.getElementById('chat-name');
    const chatLastOnline = document.getElementById('chat-last-online');
    const chatMessages = document.getElementById('chat-messages');

    chatAvatar.src = chat.avatar;
    chatName.textContent = chat.name;
    chatLastOnline.textContent = chat.lastonline;

    let messagesHtml = '';
    chat.messages.forEach((msg) => {
        const alignClass = msg.type === 'me' ? ' me' : '';
        messagesHtml += `
            <div class="message${alignClass}">
                <div class="bubble">${msg.content}</div>
                <div class="time">${msg.time}</div>
            </div>
        `;
    });
    chatMessages.innerHTML = messagesHtml;
}

