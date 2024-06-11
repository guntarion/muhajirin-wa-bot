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

const {
    fetchAllTemplates,
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

router.get('/send-individual', async (req, res) => {
    try {
        const contacts = await getAllContactsPersonal();
        const templates = await fetchAllTemplates(); 
        res.render('send-individual', {
            title: 'Kirim Pesan Individual',
            contacts,
            templates,
        });
    } catch (error) {
        console.error('Error fetching contacts or templates:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/compose-template', async (req, res) => {
    try {
        const templates = await fetchAllTemplates();
        res.render('compose-template', {
            title: 'Compose Template Broadcast',
            templates,
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).send('Internal Server Error');
    }
});

// router.get('/compose', (req, res) => {
//     res.render('compose-broadcast', { title: 'Compose Pesan Broadcast' });
// });


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

router.get('/broadcast-template', async (req, res) => {
    try {
        const groups = await fetchGroupBroadcast();
        const templates = await fetchAllTemplates();
        res.render('broadcast-template', {
            title: 'Broadcast dari Template',
            groups,
            templates,
        });
    } catch (error) {
        console.error('Error fetching groups or templates:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/broadcast-custom', async (req, res) => {
    try {
        const groups = await fetchGroupBroadcast();
        // console.log('Groups to be rendered:', groups);
        res.render('broadcast-custom', { title: 'Broadcast Pesan', groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/kontak-kelola-data', async (req, res) => {
    try {
        const contacts = await getAllContactsPersonal();

        res.render('kontak-kelola-data', {
            title: 'Kontak Buat Grup',
            contacts,
        });
    } catch (error) {
        console.error('Error fetching contacts or groups:', error);
        res.status(500).send('Internal Server Error');
    }
});




router.get('/kontak-buat-grup', async (req, res) => {
    try {
        const contacts = await getAllContactsPersonal();
        const groups = await fetchGroupBroadcast();

        res.render('kontak-buat-grup', {
            title: 'Kontak Buat Grup',
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
