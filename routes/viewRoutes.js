const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Page routes
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

/*
This route reads the chatsData.json file, parses the JSON data, and then renders the 'chats' view with the parsed data. 
This is used to display the chat data on a webpage.
*/
router.get('/chat-individual', (req, res) => {
    const chatsPath = path.join(__dirname, '../src/data/chatsData.json');
    fs.readFile(chatsPath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send('An error occurred while reading the chats.json file.');
        }
        const chats = JSON.parse(data);

        res.render('chat-individual', {
            title: 'Chats',
            chats: chats,
        });
    });
});

// Additional routes for datachat, pages, forms
router.get('/datachat', (req, res) => {
    res.render('datachat', { title: 'Data Chat' });
});

router.get('/send-broadcast', (req, res) => {
    res.render('broadcast', { title: 'Kirim Pesan' });
});

router.get('/send-individual', (req, res) => {
    res.render('send-individual', { title: 'Kirim Pesan' });
});

router.get('/prospek', (req, res) => {
    res.render('prospek-usaha', { title: 'Prospek Usaha' });
});

router.get('/kompetitor', (req, res) => {
    res.render('kompetitor-usaha', { title: 'Kompetitor Usaha' });
});

router.get('/kompetitor-detail', (req, res) => {
    res.render('kompetitor-detail', { title: 'Detail Kompetitor' }); // No leading slash
});


router.get('/forms', (req, res) => {
    res.render('forms', { title: 'Forms' });
});

router.get('*', (req, res) => {
    res.render('404', { title: '404' });
});

module.exports = router;
