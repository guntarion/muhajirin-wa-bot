const client = require('./muhaclient');

const sendMessage = (req, res) => {
    // console.log('sendMessage req.body =====', req.body);
    const number = req.body.number;
    const text = req.body.text;
    const chatId = number.substring(1) + '@c.us';
    client.sendMessage(chatId, text);
    res.send({ status: 'Message sent' });
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
    sendMessage,
    sendMessages,
};
