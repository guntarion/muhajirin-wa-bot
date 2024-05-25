async function replyWithDelay(chat, msg, replyText) {
    chat.sendStateTyping();
    setTimeout(() => {
        msg.reply(replyText);
    }, Math.random() * 1000 + 1000);
}

// this doesn't work because the client is not initialized
async function sendMessageWithDelay(client, chat, msg, messageText) {
    // Simulate typing in the chat
    chat.sendStateTyping();

    // Wait for a random time between 2 and 4 seconds
    const delay = Math.random() * 1000 + 1000;
    setTimeout(() => {
        if (client && client.sendMessage) {
            client.sendMessage(msg.from, messageText);
        } else {
            console.error(
                'Client is not initialized or sendMessage is not a function'
            );
        }
    }, delay);
}

module.exports = {
    replyWithDelay,
    sendMessageWithDelay,
};
