const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { 
    getAllContactsPersonal,
    saveGroupBroadcast,
    saveGroupBroadcastMember,
    deleteGroupBroadcastMember,
    fetchGroupBroadcast,
    fetchGroupBroadcastMembers,
    deleteGroup,
    getGroupById,
} = require('../src/data/mysqldb');

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

router.get('/send-individual', (req, res) => {
    res.render('send-individual', { title: 'Kirim Pesan' });
});

router.get('/compose', (req, res) => {
    res.render('compose-broadcast', { title: 'Compose Pesan Broadcast' });
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



// router.get('/kontak-personal', async (req, res) => {
//     try {
//         const contacts = await getAllContactsPersonal();
//         const groups = await fetchGroupBroadcast();

//         const groupDataPromises = groups.map(async (group) => {
//             const members = await fetchGroupBroadcastMembers(group.groupId);
//             return { ...group, members };
//         });

//         const groupData = await Promise.all(groupDataPromises);

//         res.render('kontak-personal', {
//             title: 'Kontak Personal',
//             contacts,
//             groups: groupData,
//         });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.get('/send-broadcast', async (req, res) => {
    try {
        const groups = await fetchGroupBroadcast();
        // console.log('Groups to be rendered:', groups);
        res.render('send-broadcast', { title: 'Broadcast Pesan', groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/kontak-personal', async (req, res) => {
    try {
        const contacts = await getAllContactsPersonal();
        const groups = await fetchGroupBroadcast();

        res.render('kontak-personal', {
            title: 'Kontak Personal',
            contacts,
            groups,
        });
    } catch (error) {
        console.error('Error fetching contacts or groups:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/get-group-members/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    try {
        const members = await fetchGroupBroadcastMembers(groupId);
        const group = await getGroupById(groupId);
        res.json({ members, groupName: group.groupName });
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ error: 'Error fetching group members' });
    }
});

router.post('/api/delete-group-member', async (req, res) => {
    const { groupId, contactId } = req.body;
    try {
        await deleteGroupBroadcastMember(groupId, contactId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting group member:', error);
        res.status(500).json({ error: 'Error deleting group member' });
    }
});

router.delete('/api/delete-group/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    try {
        await deleteGroup(groupId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Error deleting group' });
    }
});

router.post('/create-group', async (req, res) => {
    const { groupName, groupDescription } = req.body;
    try {
        const groupId = await saveGroupBroadcast(groupName, groupDescription);
        res.json({ success: true, groupId });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Error creating group' });
    }
});

router.post('/add-group-member', async (req, res) => {
    const { groupId, contactId } = req.body;
    try {
        await saveGroupBroadcastMember(groupId, contactId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding group member:', error);
        res.status(500).json({ error: 'Error adding group member' });
    }
});




router.get('*', (req, res) => {
    res.render('404', { title: '404' });
});


module.exports = router;
