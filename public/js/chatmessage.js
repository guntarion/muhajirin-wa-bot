// const getContentButton = document.getElementById('get-content');
// const getResponseRecommendationButton = document.getElementById('response-recommendation');


/*
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
*/
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

/*
if (getContentButton) {
    document.getElementById('get-content').addEventListener('click', function () {
        const chatMessages = document.getElementById('chat-messages');
        const chatContent = document.getElementById('chat-content');
        const lastSender = document.getElementById('last-sender');

        // Get the text content and type of all .message elements within #chat-messages
        const messages = Array.from(chatMessages.querySelectorAll('.message')).map(
            (message) => {
                const content = message.querySelector('.bubble').textContent;
                const type = message.classList.contains('me') ? 'CS' : 'Clients';
                return { type, content };
            }
        );

        // Join the messages into a single string with line breaks between each message
        const messagesText = messages
            .map((message) => `${message.type}: ${message.content}`)
            .join('\n');

        // Insert the messages into #chat-content
        chatContent.textContent = messagesText;

        // Insert the type of the last message into #last-sender
        lastSender.textContent = messages[messages.length - 1].type;
    });
}


// On chat page, when the response recommendation button is clicked

if (getResponseRecommendationButton) {
    document
        .getElementById('response-recommendation')
        .addEventListener('click', function () {
            const chatContent =
                document.getElementById('chat-content').textContent;
            const lastSender =
                document.getElementById('last-sender').textContent;
            console.log('chatContent:', chatContent);

            // Show the spinner
            document.querySelector('.css3-spinner').style.display = 'block';

            fetch('/api/openai-response-recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatContent, lastSender }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Hide the spinner
                    document.querySelector('.css3-spinner').style.display =
                        'none';

                    document.getElementById('openai-output').value =
                        data.message;
                })
                .catch((error) => {
                    // Hide the spinner in case of error
                    document.querySelector('.css3-spinner').style.display ='none';
                    console.error('Error:', error);
                });
        });
}
*/

// // Berlaku untuk page Kirim Pesan
// document.addEventListener('DOMContentLoaded', function () {
//     const updateSelectedList = () => {
//         const selectedList = document.getElementById('selectedPersonsList');
//         selectedList.innerHTML = ''; // Clear the list
//         const checkboxes = document.querySelectorAll('.select-checkbox:checked');
//         checkboxes.forEach((checkbox, index) => {
//             const name = checkbox.getAttribute('data-name');
//             const listItem = document.createElement('li');
//             listItem.textContent = `${index + 1}. ${name}`; // Create list item with the name
//             selectedList.appendChild(listItem); // Add the list item to the list
//         });
//     };

//     // Event listener for checkboxes
//     const checkboxes = document.querySelectorAll('.select-checkbox');
//     if (checkboxes) {
//         checkboxes.forEach((checkbox) => {
//             checkbox.addEventListener('change', updateSelectedList);
//         });
//     }

//     // Sending messages when button is clicked
//     const sendMessagesBtn = document.getElementById('sendMessagesBtn');
//     if (sendMessagesBtn) {
//         sendMessagesBtn.addEventListener('click', function () {
//             const selectedUsers = [];
//             document.querySelectorAll('.select-checkbox:checked').forEach((checkbox) => {
//                 selectedUsers.push({
//                     name: checkbox.getAttribute('data-name'),
//                     number: checkbox.getAttribute('data-number'),
//                 });
//             });

//             // Get the content of the message from the textarea
//             const messageContent = document.getElementById('konten-dikirim').value;

//             // Log selected users or send this data to your server/API for further processing
//             console.log('%c Selected users', 'color: green', selectedUsers);

//             // Example: Post to a server endpoint
//             const numbers = selectedUsers.map(user => user.number);
//             fetch('http://localhost:3002/api/send-messages', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     numbers: numbers,
//                     text: messageContent,
//                 }),
//             })
//                 .then((response) => response.json())
//                 .then((data) => console.log(data))
//                 .catch((error) => console.error('Error:', error));
//         });
//     }
// });

/*
// Testing sending a single message
document.getElementById('improve-pesan').addEventListener('click', function () {
    // Replace these with the actual number and text message
    const number = '+62817309143';
    const text = 'hallo this is WA Bot on 31 April';

    fetch('http://localhost:3002/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: number, text: text }),
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
        });
});

// Testing sending multiple messages
document.getElementById('sendMessagesBtn').addEventListener('click', function() {
    // Replace these with the actual numbers and text message
    const numbers = ['+62817309143', '+62817309143', '+62811334932'];
    const text = 'hallo this is WA Bot on 1 Mei';

    fetch('http://localhost:3002/api/send-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numbers: numbers, text: text }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});
*/


// document.getElementById('improve-pesan').addEventListener('click', function () {
//     // Get the values from the inputs
//     const previousMessage = document.getElementById('previous-message').value;
//     const userDraft = document.getElementById('user-draft').value;
//     const userInstruction = document.getElementById('user-instruction').value;
//     const useEmoji = document.getElementById('use-emoji').checked;

//     // Show the spinner
//     document.querySelector('.css3-spinner').style.display = 'block';

//     // Fetch data from the OpenAI API
//     fetch('/api/openai-improvement-pesan', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             userDraft: userDraft,
//             previousMessage: previousMessage,
//             userInstruction: userInstruction,
//             useEmoji: useEmoji,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Hide the spinner
//             document.querySelector('.css3-spinner').style.display = 'none';
//             // Put the result in the 'konten-dikirim' textarea
//             document.getElementById('konten-dikirim').value = data.message;
//         })
//         .catch((error) => {
//             // Hide the spinner in case of error
//             document.querySelector('.css3-spinner').style.display ='none';
//             console.error('Error:', error);
//         });
// });
