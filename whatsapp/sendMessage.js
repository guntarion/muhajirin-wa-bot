const client = require('./muhaclient');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

// const sendMessage = (req, res) => {
//     // console.log('sendMessage req.body =====', req.body);
//     const number = req.body.number;
//     const text = req.body.text;
//     const chatId = number.substring(1) + '@c.us';
//     client.sendMessage(chatId, text);
//     res.send({ status: 'Message sent' });
// };

let isTestMode = false;

const enableTestMode = () => {
    // isTestMode = true;
};

const sendMessage = async (chatId, text) => {
    // THis is a mock function to simulate sending a message
    if (isTestMode) {
        console.log(`Mock sendMessage to ${chatId}
        \nMessage: ${text}\n\n`);
        return { success: true, mock: true };
    }

    try {
        const response = await client.sendMessage(chatId, text);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

const sendMediaMessage = async (chatId, filePath, caption) => {
    try {
        // Ensure the file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist');
        }
        console.log('Sending media message:', filePath);

        const media = await MessageMedia.fromFilePath(filePath);
        console.log('Media object created:', media);

        const response = await client.sendMessage(chatId, media, { caption });
        console.log('Media message sent:', response.id);
        return response;
    } catch (error) {
        console.error('Error sending media message:', error);
        throw error;
    }
};

const sendMediaMessageFromUrl = async (chatId, url, caption) => {
    try {
        const media = await MessageMedia.fromUrl(url);
        console.log('Media object created:', media);
        const response = await client.sendMessage(chatId, media, { caption });
        console.log('Media message sent:', response.id);
        return response;
    } catch (error) {
        console.error('Error sending media message from URL:', error);
        throw error;
    }
};



/*
const sendMessages = (req, res) => {
    // console.log('sendMessages ', req.body);
    const numbers = req.body.numbers; // Expect an array of numbers
    const text = req.body.text;

    numbers.forEach((number) => {
        const chatId = number.substring(1) + '@c.us';
        client.sendMessage(chatId, text);
    });

    res.send({ status: 'Messages sent' });
};
*/

const sendMessages = (req, res) => {
    const numbers = req.body.numbers; // Expect an array of numbers
    const text = req.body.text;

    numbers.forEach((number, index) => {
        // Generate a random delay between 2 to 8 seconds
        const delay = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;

        setTimeout(() => {
            const chatId = number.substring(1) + '@c.us';
            client.sendMessage(chatId, text);
        }, index * delay);
    });

    res.send({ status: 'Messages sent' });
};


module.exports = {
    enableTestMode,
    sendMessage,
    sendMessages,
    sendMediaMessage,
    sendMediaMessageFromUrl,
};
