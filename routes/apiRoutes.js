const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const {
    enableTestMode,
    sendMessage,
    sendMessages,
    sendMediaMessage,
    sendMediaMessageFromUrl,
} = require('../whatsapp/sendMessage');
const {
    extractText,
    fetchSEOInformation,
} = require('../public/js/pageutility');


const {
    // fetchGroupBroadcast,
    // fetchGroupBroadcastMembers,
    // fetchGroupMembersPhoneNumbers,
    // storeProgress,
    fetchGroupMembersDetails,
    storeBroadcastLog,
    getProgress,
    insertTemplateMessage,
    updateTemplate,  
    deleteTemplate,
    getTemplateByName,
} = require('../src/data/mysqldb');

// Enable test mode
enableTestMode();

// Health check route
router.get('/health', (req, res) => {
    console.log('Server is running healthy =====');
    res.json({ success: true, message: 'Server is running healthy' });
});

// Route for sending a text message
router.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    console.log('Sending to: ${number} \nMessage: ${message}');

    if (!number || !message) {
        return res.status(400).json({ error: 'Number and message are required' });
    }

    try {
        const chatId = `${number}@c.us`;
        const response = await sendMessage(chatId, message);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Route to send individual messages based on a selected template
router.post('/send-individual-messages', async (req, res) => {
    const { broadcastNama, message, recipients } = req.body;

    if (!broadcastNama || !message || !recipients || recipients.length === 0) {
        return res.status(400).json({ error: 'Broadcast name, message, and recipients are required' });
    }

    try {
        const responses = [];
        const dateTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

        for (const recipient of recipients) {
            const personalizedMessage = personalizeMessage(message, recipient);
            const chatId = `${recipient.contactNumber}@c.us`;
            const response = await sendMessage(chatId, personalizedMessage);
            responses.push(response);

            await storeBroadcastLog({ dateTime, broadcastNama, contactNumber: recipient.contactNumber, contactStoredName: recipient.contactStoredName });

            console.log(`Message sent to: ${recipient.contactStoredName} (${recipient.contactNumber})`);

            await randomDelay(); // Add random delay between 5 to 10 seconds
        }

        res.json({ success: true, responses });
    } catch (error) {
        console.error('Error sending individual messages:', error);
        res.status(500).json({ error: 'Failed to send individual messages' });
    }
});



// Utility function to add a random delay between 7 to 20 seconds
const randomDelay = () => {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 13000) + 7000));
};

const moment = require('moment-timezone');


// Route to send individual messages based on a selected template
router.post('/send-individual-messages', async (req, res) => {
    const { broadcastNama, message, recipients } = req.body;

    if (!broadcastNama || !message || !recipients || recipients.length === 0) {
        return res.status(400).json({ error: 'Broadcast name, message, and recipients are required' });
    }

    try {
        const responses = [];
        const dateTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

        for (const recipient of recipients) {
            const { contactNumber, contactStoredName, contactSebutan, isBusiness, isMyContact, type_1, type_2, type_3, contactAddress, contactRW, contactRT, note_1, note_2, contactGender } = recipient;
            const personalizedMessage = personalizeMessage(message, recipient);
            const chatId = `${contactNumber}@c.us`;
            const response = await sendMessage(chatId, personalizedMessage);
            responses.push(response);

            await storeBroadcastLog({ dateTime, broadcastNama, contactNumber, contactStoredName });

            console.log(`Message sent to: ${contactStoredName} (${contactNumber})`);

            await randomDelay(); // Add random delay between 5 to 10 seconds
        }

        res.json({ success: true, responses });
    } catch (error) {
        console.error('Error sending individual messages:', error);
        res.status(500).json({ error: 'Failed to send individual messages' });
    }
});




// Route for sending a broadcast message to a group
router.post('/send-group-message', async (req, res) => {
    const { groupId, message, broadcastNama } = req.body;
    // console.log('On Process on sending group message to group ID =====', groupId, message, broadcastNama);
    if (!groupId || !message || !broadcastNama) {
        return res.status(400).json({ error: 'Group ID, message, and broadcast name are required' });
    }

    try {
        const membersDetails = await fetchGroupMembersDetails(groupId);
        const totalMembers = membersDetails.length;
        const responses = [];
        const wss = req.app.get('wss');

        for (let i = 0; i < totalMembers; i++) {
            const member = membersDetails[i];
            const { contactNumber, contactStoredName, contactSebutan, note_1 } = member;
            const personalizedMessage = personalizeMessage(message, member);
            const chatId = `${contactNumber}@c.us`;
            const response = await sendMessage(chatId, personalizedMessage);
            responses.push(response);
            await randomDelay();

            const dateTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            await storeBroadcastLog({ dateTime, broadcastNama, contactNumber, contactStoredName });

            // Console log for each successful message sent with numbering
            console.log(`${i + 1}. Message sent to: ${contactStoredName} (${contactNumber})`);

            // Broadcast progress to all connected WebSocket clients
            const progress = {
                current: i + 1,
                total: totalMembers,
                contactStoredName,
                contactNumber
            };
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(progress));
                }
            });
        }

        res.json({ success: true, responses });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ error: 'Failed to send group message' });
    }
});

// Function to personalize the message
function personalizeMessage(template, data) {
    return template.replace(/{(\w+)}/g, (_, key) => data[key] || '');
}



// Route to check the progress of the message sending process
router.get('/check-progress/:broadcastNama', async (req, res) => {
    const { broadcastNama } = req.params;
    try {
        const progress = await getProgress(broadcastNama);
        res.json({ success: true, progress });
    } catch (error) {
        console.error('Error checking progress:', error);
        res.status(500).json({ error: 'Failed to check progress' });
    }
});


// Route for sending a media message with a caption
router.post('/send-media-message', async (req, res) => {
    const { number, filePath, caption } = req.body;
    console.log('On Process on sending media message to number =====', number, filePath, caption);

    if (!number || !filePath) {
        return res.status(400).json({ error: 'Number and file path are required' });
    }

    try {
        const chatId = `${number}@c.us`;
        const response = await sendMediaMessage(chatId, filePath, caption);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Error sending media message:', error);
        res.status(500).json({ error: 'Failed to send media message' });
    }
});

// Route for sending a media message with a URL and a caption
router.post('/send-media-message-url', async (req, res) => {
    const { number, url, caption } = req.body;
    console.log('On Process on sending media message to number =====', number, url, caption);

    if (!number || !url) {
        return res.status(400).json({ error: 'Number and URL are required' });
    }

    try {
        const chatId = `${number}@c.us`;
        const response = await sendMediaMessageFromUrl(chatId, url, caption);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Error sending media message from URL:', error);
        res.status(500).json({ error: 'Failed to send media message from URL' });
    }
});

router.post('/fetch-text', async (req, res) => {
    const url = req.body.url; // Get the URL from the request body
    if (!url) {
        return res
            .status(400)
            .json({ success: false, message: 'No URL provided' });
    }

    try {
        const text = await extractText(url);
        res.json({ success: true, data: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch text',
        });
    }
});

router.post('/fetch-seo', async (req, res) => {
    const url = req.body.url;
    try {
        const seoData = await fetchSEOInformation(url);
        res.json({ success: true, data: seoData });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch SEO information',
        });
    }
});

/*
This route also reads the chatsData.json file and parses the JSON data,
but instead of rendering a view, it sends the parsed data as a JSON response.
This is an API endpoint that can be used by client-side JavaScript or other clients to fetch the chat data.
*/
router.get('/chats', (req, res) => {
    const chatsPath = path.join(__dirname, '../src/data/chatsData.json');
    // console.log('chatsPath =====', chatsPath);
    fs.readFile(chatsPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send(
                    'An error occurred while reading the chatsData.json file.'
                );
        }
        res.json(JSON.parse(data));
    });
});


// Route to create a new template message
router.post('/create-template', async (req, res) => {
    const { templateName, templateNote, contentType, categoryEvent, categorySegment, templateContent } = req.body;
    
    if (!templateName || !contentType || !categoryEvent || !categorySegment || !templateContent) {
        return res.status(400).json({ error: 'All required fields must be filled' });
    }

    try {
        await insertTemplateMessage({ templateName, templateNote, contentType, categoryEvent, categorySegment, templateContent });
        res.json({ success: true, message: 'Template created successfully' });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// Route to update a template
router.put('/update-template/:templateName', async (req, res) => {
    const { templateName } = req.params;
    const { templateNote, contentType, categoryEvent, categorySegment, templateContent } = req.body;

    const data = {
        templateNote,
        contentType,
        categoryEvent,
        categorySegment,
        templateContent
    };

    try {
        await updateTemplate(templateName, data);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ error: 'Failed to update template' });
    }
});


// Route to delete a template
router.delete('/delete-template/:templateName', async (req, res) => {
    const { templateName } = req.params;

    try {
        await deleteTemplate(templateName);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});


// Route to get the details of a specific template
router.get('/get-template/:templateName', async (req, res) => {
    const { templateName } = req.params;

    try {
        const template = await getTemplateByName(templateName);
        if (template) {
            res.json({ success: true, data: template });
        } else {
            res.status(404).json({ success: false, error: 'Template not found' });
        }
    } catch (error) {
        console.error('Error fetching template details:', error);
        res.status(500).json({ error: 'Failed to fetch template details' });
    }
});


router.post('/send-message', sendMessage);
router.post('/send-messages', sendMessages);

module.exports = router;
