// eslint-disable-next-line no-unused-vars
const { Client, LocalAuth, MessageMedia } = require('../index'); // Adjust the path as necessary
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const cron = require('node-cron');

const nasehatList = require('../models/nasehatData');
const haditsData = require('../models/haditsMuslimData');
const kiatSehatList = require('../models/kiatSehatData');

const {
    saveContact,
    saveContactPersonal,
    saveRegistration,
    saveMessage,
} = require('../src/data/mysqldb');

const {
    getUserState,
    updateUserState,
    activateConversation,
    initializeUserState,
    saveUserResponse,
    deactivateConversation,
} = require('./stateManager');
const {
    getNextStepMessage,
    conversationTestimoni,
    conversationDaftarPanitiaSizeKaos
} = require('./conversationFlow');
const {
    replyWithDelay,
    sendMessageWithDelay,
    getFormattedDateTime,
    surahNames,
} = require('./utility');
const {
    generateResponseAsCS,
    generateTestimonial,
    appendToGoogleSheet,
    appendMuhajirinToSheet,
    inputRegistrasiPanitiaQurban,
    getInfoKegiatanLayananMuhajirin,
    getInfoQurban,
    getInfoKhitan,
    convertTo24Hour,
    adjustTime,
    googleAuth,
} = require('./openaiService');

// const translate = require('../src/googletranslate/index.js');

// const userConversations = new Map();

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: false },
//     webVersionCache: {
//         type: 'remote',
//         remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
//     },
// });

const wwebVersion = '2.2412.54';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', (msg) => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('🧤 WhatsApp Client is ready!');

    // Schedule a message to be sent every morning at 5 AM (GMT +7)
    cron.schedule('0 5 * * *', async () => {
        // const groupId = '62811334932-1630463874@g.us'; // Replace with your group ID
        const groupId = '120363229540640101@g.us'; // Replace with your group ID

        try {
            const groupMessage = await getInfoQurban(googleAuth, 'Rekap');
            await client.sendMessage(groupId, groupMessage);
            console.log('Message sent to group');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }, {
        timezone: 'Asia/Jakarta' // Set timezone to GMT +7
    });

    // Schedule a message to be sent every morning at 5 AM (GMT +7)
    cron.schedule('5 5 * * *', async () => {
        const groupId = '120363305283662799@g.us'; // Replace with your group ID

        try {
            const groupMessage = await getInfoKhitan(googleAuth, 'Rekap');
            await client.sendMessage(groupId, groupMessage);
            console.log('Message sent to group');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }, {
        timezone: 'Asia/Jakarta' // Set timezone to GMT +7
    });
});



// Define the CSV writers
const contactsCsvWriter = createObjectCsvWriter({
    path: 'contacts.csv',
    header: [
        { id: 'userId', title: 'User ID' },
        { id: 'number', title: 'Number' },
        { id: 'name', title: 'Name' },
        { id: 'profilePicUrl', title: 'Profile Picture URL' },
        { id: 'isBusiness', title: 'Is Business' },
        { id: 'isMyContact', title: 'Is My Contact' }
    ]
});

const groupsCsvWriter = createObjectCsvWriter({
    path: 'groups.csv',
    header: [
        { id: 'id', title: 'Group ID' },
        { id: 'name', title: 'Group Name' },
        { id: 'description', title: 'Group Description' }
    ]
});

const groupMembersCsvWriter = createObjectCsvWriter({
    path: 'group_members.csv',
    header: [
        { id: 'groupId', title: 'Group ID' },
        { id: 'groupName', title: 'Group Name' },
        { id: 'memberId', title: 'Member ID' },
        { id: 'isAdmin', title: 'Is Admin' },
        { id: 'isSuperAdmin', title: 'Is Super Admin' }
    ]
});

// client.on('message', handleMessage);

client.on('message', async (msg) => {
    console.log('MESSAGE RECEIVED', msg);
    let info = client.info;
    const chat = await msg.getChat();
    const sender = await msg.getContact();
    console.log(`Sender: ${sender.pushname}, Number: ${sender.number}, timestamp: ${msg.timestamp}, from: ${msg.from}, to: ${msg.to}`);
    const userId = sender.number;

    const userState = getUserState(userId);    

    if (msg.from.endsWith('@g.us')) {
        console.log('Message from group chat');
        if (msg.body === '.thisgroupid') {
            // Send a reply with the group ID
            await msg.reply(`Group ID: ${msg.from}`);
            console.log(`Replied with group ID: ${msg.from}`);
        }
        console.log(`Group ID: ${msg.from}`);
        console.log(`Author ID: ${msg.author}`);
    } else {
        console.log('Message from personal chat');
        console.log(`Contact ID: ${msg.from}`);
    }


    

    // Save contact information
    const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const contactData = {
        dateTime: dateTime,
        updatedTime: dateTime,
        contactNumber: sender.number,
        contactPlatform: info.platform,
        contactPublishedName: sender.pushname,
        contactSavedName: sender.name,
    };
    
    let contactId;
    try {
        contactId = await saveContact(contactData);
    } catch (error) {
        console.error('Error saving contact:', error);
        return;
    }

    // Remove @c.us suffix from msg.from and msg.to
    const msgFrom = msg.from.replace('@c.us', '');
    const msgTo = msg.to.replace('@c.us', '');

    // Save message information
    const messageData = {
        dateTime: dateTime,
        msgTimestamp: msg.timestamp,
        msgFrom: msgFrom,
        msgTo: msgTo,
        msgBody: msg.body,
        contactId: contactId
    };
    
    try {
        await saveMessage(messageData);
    } catch (error) {
        console.error('Error saving message:', error);
    }


    if (msg.from === '62811334932-1630463874@g.us') {
        // Check if the message body is 'tes'
        if (msg.body.toLowerCase() === 'tes') {
            // Send a reply message
            await msg.reply('Halo');
            console.log('Replied with "Halo" to the group');
        }
    }

    if (msg.body === 'getcontacts') {
        try {
            const contacts = await client.getContacts();
            const individualContacts = contacts.filter(contact => 
                !contact.isGroup && 
                !contact.isMe && 
                !contact.id._serialized.endsWith('@lid')
            );

            const contactsData = [];

            for (const contact of individualContacts) {
                const contactDetails = await client.getContactById(contact.id._serialized);
                const profilePicUrl = await contactDetails.getProfilePicUrl();
                const contactInfo = {
                    userId: contact.id._serialized,
                    number: contact.number,
                    name: contactDetails.pushname || contactDetails.name || 'Unknown',
                    profilePicUrl: profilePicUrl || 'No profile picture', // Handle default value here
                    isBusiness: contact.isBusiness,
                    isMyContact: contact.isMyContact
                };

                await saveContactPersonal(contactInfo); // Save to MySQL
                contactsData.push(contactInfo); // Collect data for CSV
                console.log(JSON.stringify(contactInfo, null, 2));
            }

            // Write contacts data to CSV
            await contactsCsvWriter.writeRecords(contactsData);
            console.log('Contacts data saved to contacts.csv');

        } catch (error) {
            console.error('Failed to get contact details:', error);
        }

    } else if (msg.body === 'getgroupsandmembers') {
        try {
            const chats = await client.getChats();
            const groupChats = chats.filter(chat => chat.isGroup);

            const groupsData = [];
            const groupMembersData = [];

            for (const group of groupChats) {
                // Fetch group details
                const groupInfo = {
                    id: group.id._serialized,
                    name: group.name,
                    description: group.description || 'No description'
                };
                groupsData.push(groupInfo);

                // Fetch group members
                const groupChat = await client.getChatById(group.id._serialized);
                const members = groupChat.participants.map(participant => ({
                    groupId: group.id._serialized,
                    groupName: group.name,
                    memberId: participant.id._serialized,
                    isAdmin: participant.isAdmin,
                    isSuperAdmin: participant.isSuperAdmin
                }));

                groupMembersData.push(...members);
            }

            // Write groups data to CSV
            await groupsCsvWriter.writeRecords(groupsData);
            console.log('Groups data saved to groups.csv');

            // Write group members data to CSV
            await groupMembersCsvWriter.writeRecords(groupMembersData);
            console.log('Group members data saved to group_members.csv');

        } catch (error) {
            console.error('Failed to get group details or members:', error);
        }
    }

    if (!chat.isGroup) {
    
        if (msg.body === '.status') {
            chat.sendSeen();
            const currentDate = new Date();
            const masehiDateTime = currentDate.toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta',
            });
            const hijriDateTime = currentDate.toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta',
                calendar: 'islamic-umalqura',
            });

            const replyMessage = `Server Al Muhajirin is up and running 🚀\nMasehi: ${masehiDateTime}\nHijriah: ${hijriDateTime}`;
            await replyWithDelay(chat, msg, replyMessage);
        } else if (msg.body.startsWith('!ping')) {
            await replyWithDelay(chat, msg, 'pong');
        } else if (msg.body === '!ping reply') {
            chat.sendSeen();
            msg.reply('pong');
        } else if (msg.body === '!chats') {
            const chats = await client.getChats();
            console.log(chats); // to see the content in the console

            // Save it in a JSON file
            fs.writeFile('allchats.json', JSON.stringify(chats, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('File written successfully');
                }
            });
            client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
        } 

        
        else if (msg.body.toLowerCase() === 'kirimkanpesan') {
            const groupId = '62811334932-1630463874@g.us';
            const groupMessage = 'Hello, group!';
            try {
                await client.sendMessage(groupId, groupMessage);
                console.log('Message sent to group');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
        
        
        else if (msg.body.trim().toLowerCase() === 'info') {
            const replyMessage = `
        📳 WhatsApp Center
        🌟 Al Muhajirin Rewwin
        🔖 0823-1213-2187

    \`info\`
        Menampilkan informasi ini.

    \`panitia qurban\`
        Mendaftar sbg panitia qurban & daftar ukuran kaos. Syarat: bersedia ditempatkan di sie manapun.

    \`nasehat\`
        Menampilkan inspirasi nasehat dari ayat Al Qur'an.

    \`sehat\`
        Menampilkan kiat sehat islami.

    \`sholat\`
        Menampilkan jadwal waktu sholat khusus untuk wilayah Sidoarjo di hari ini.

    \`hadits (angka)\`
        Menampilkan hadits shahih Muslim sesuai nomor yang diminta (1 - 4.930). Contoh: \`hadits 123\` untuk hadits nomer 123. Bila angka tidak diisi macam \`hadits\`, maka  akan ditampilkan hadits nomer sembarang.

    \`ayat (no-surat):(no-ayat)\`
        Menampilkan terjemah dari ayat Al Qur'an. Contoh: \`ayat 2:30\` untuk ayat dari surah ke-2 ayat ke-30. 

    \`cari (istilah-yang-dicari):(nomer-surat)\`
        Menampilkan daftar ayat yang berisikan istilah yang dicari: Contoh: \`cari ibrahim:2\` untuk mencari ayat di surah ke-2 yang mengandung kata "ibrahim". Bisa juga \`cari ibrahim\` untuk menampilkan semua ayat dari surat manapun yang mengandung kata bersangkutan

    \`ai (pertanyaan bebas)\`
        Mengajukan pertanyaan bebas pada Artificial Intelligence. Contoh: \`ai apa syarat sah wudhu?\`

    \`inputan (informasi atau saran/masukan)\`
        Sampaikan informasi (mis: kerusakan AC) atau berikan saran untuk seluruh program/unit di YAMR.

            `;
            await replyWithDelay(chat, msg, replyMessage);
        } else if (msg.body.toLowerCase() === 'nasehat') {
            const randomNasehat =
                nasehatList[Math.floor(Math.random() * nasehatList.length)];
            const replyMessage = `🎖 _${randomNasehat.advice}_ \n\n📍Inspirasi dari Surat ☪️ ${randomNasehat.reference}\n\n~ Al Muhajirin WA Center`;

            await replyWithDelay(chat, msg, replyMessage);
        } else if (msg.body === 'sehat') {
            const randomKiatSehat =
                kiatSehatList[Math.floor(Math.random() * kiatSehatList.length)];
            const replyMessage = `💝 Kiat Sehat: *${randomKiatSehat.kiat}*\n\n${randomKiatSehat.deskripsi}\n\n~ Al Muhajirin WA Center`;

            await replyWithDelay(chat, msg, replyMessage);
        } else if (msg.body.toLowerCase().startsWith('hadits')) {
            // Extract the number part from the message
            const parts = msg.body.split(' '); // This splits the message into parts based on spaces
            let hadith;
            if (parts.length === 2 && !isNaN(parts[1])) {
                let hadithNumber = parseInt(parts[1], 10);
                // Ensure the hadith number is within the valid range
                if (hadithNumber < 1) {
                    hadithNumber = 1;
                } else if (hadithNumber > 4930) {
                    hadithNumber = 4930;
                }
                // Find the hadith by number
                hadith = haditsData.find((h) => h.number === hadithNumber);
            } else if (parts.length === 1) {
                // Select a random hadith
                hadith = haditsData[Math.floor(Math.random() * haditsData.length)];
            }

            if (hadith) {
                const replyMessage = `🖌️ Hadits Muslim no: ${hadith.number}:\n ${hadith.id} \n\n~ Al Muhajirin WA Center`;
                await replyWithDelay(chat, msg, replyMessage);
            } else {
                await replyWithDelay(chat, msg, 'Hadits tidak ditemukan.');
            }
        } else if (msg.body.toLowerCase() === 'sholat') {
            fetch('https://muslimsalat.com/sidoarjo.json')
                .then((response) => response.json())
                .then(async (data) => {
                    const prayerTimes = data.items[0];
                    const date = data.items[0].date_for;
                    const city = data.city;

                    // Convert prayer times to 24 hour format and adjust the time
                    const fajr = adjustTime(convertTo24Hour(prayerTimes.fajr), 3);
                    const shurooq = adjustTime(
                        convertTo24Hour(prayerTimes.shurooq),
                        3
                    );
                    const dhuhr = adjustTime(convertTo24Hour(prayerTimes.dhuhr), 4);
                    const asr = adjustTime(convertTo24Hour(prayerTimes.asr), 2);
                    const maghrib = adjustTime(
                        convertTo24Hour(prayerTimes.maghrib),
                        1
                    );
                    const isha = adjustTime(convertTo24Hour(prayerTimes.isha), 3);

                    const currentDate = new Date();
                    const hijriDate = currentDate.toLocaleString('en-US', {
                        timeZone: 'Asia/Jakarta',
                        calendar: 'islamic-umalqura',
                    });

                    const replyMessage = `*⏰ Waktu Sholat ${city}, ${date}*\n*Hijri: ${hijriDate}*\n\n- Shubuh: ${fajr}\n- Shuruq: ${shurooq}\n- Dhuhur: ${dhuhr}\n- Ashar: ${asr}\n- Maghrib: ${maghrib}\n- Isya': ${isha}\n\n~ Al Muhajirin WA Center`;

                    await replyWithDelay(chat, msg, replyMessage);
                })
                .catch((error) => console.error('Error:', error));
        } else if (msg.body.toLowerCase() === 'kegiatan') {
            let infoKegiatan = await getInfoKegiatanLayananMuhajirin(
                googleAuth,
                'kegiatan'
            );
            await replyWithDelay(chat, msg, infoKegiatan);
        } else if (msg.body.toLowerCase() === 'layanan') {
            let infoLayanan = await getInfoKegiatanLayananMuhajirin(
                googleAuth,
                'layanan'
            );
            await replyWithDelay(chat, msg, infoLayanan);
        } else if (msg.body.toLowerCase().startsWith('inputan')) {
            const formattedDateTime = getFormattedDateTime();
            const sender = await msg.getContact();
            const data = {
                dateTime: formattedDateTime,
                contactPlatform: info.platform,
                contactPublishedName: sender.pushname,
                contactSavedName: sender.name,
                contactNumber: sender.number,
                message: msg.body.replace('inputan ', ''),
            };
            msg.react('🙏🏼');
            await appendMuhajirinToSheet(googleAuth, 'receivedMessages', data);
            await replyWithDelay(
                chat,
                msg,
                'Terima kasih atas informasi/saran/masukan yang telah diberikan.'
            );
        } else if (msg.body.toLowerCase().startsWith('!askpdf')) {
            console.log('Received a question to ask the PDF.');
            const input = msg.body.slice(8); // Get the input from the message, removing "!askpdf " from the start
            console.log('Input:', input);

            const url = 'http://localhost:3001/ask';

            // Send the question to the local endpoint
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: input,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Reply with the answer
                    msg.reply(data.result.text);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else if (msg.body.toLowerCase().startsWith('ayat ')) {
            let inputanAsli = msg.body.slice(5); // Get the ayah number or surah:ayah from the message
            let surahAndAyah = inputanAsli.split(':'); // Split the input by ':'
            let surahNumber = parseInt(surahAndAyah[0], 10); // Get the surah number and convert it to an integer
            let ayahNumber = parseInt(surahAndAyah[1], 10); // Get the ayah number and convert it to an integer

            if (surahNumber > 114) {
                surahNumber = 114;
                return;
            }

            let inputanAPI = `${surahNumber}:${ayahNumber}`;
            console.log(inputanAPI);

            const surahName = surahNames[surahNumber - 1]; // Get the surah name using the surah number as an index

            const url = `http://api.alquran.cloud/v1/ayah/${inputanAPI}/id.indonesian`;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    const content = data.data.text; // Get the content from the API response
                    // Use the content here
                    msg.reply(
                        `Surah ${surahNumber}: ${surahName} ayat ke-${ayahNumber}\n${content}`
                    );
                })
                .catch((error) => console.error('Error:', error));
        } else if (msg.body.toLowerCase().startsWith('cari ')) {
            const input = msg.body.slice(6); // Get the user's input, removing "!qcari " from the start
            let keyword, surah;

            if (input.includes(':')) {
                [keyword, surah] = input.split(':'); // Split the input at the colon to get the keyword and surah number
            } else {
                keyword = input; // If there's no colon, the whole input is the keyword
                surah = 'all'; // Search all surahs
            }

            const url = `http://api.alquran.cloud/v1/search/${encodeURIComponent(
                keyword
            )}/${encodeURIComponent(surah)}/id.indonesian`;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (
                        data.data &&
                        data.data.matches &&
                        data.data.matches.length > 0
                    ) {
                        // Start building the reply message
                        let replyMessage = `Terdapat ${data.data.matches.length} Hasil Pencarian untuk kata kunci '${keyword}':\n\n`;

                        // Append each match to the reply message with a sequence number
                        data.data.matches.forEach((match, index) => {
                            replyMessage += `${index + 1}. Surah ${
                                match.surah.number
                            } ayat ${match.numberInSurah}\n`;
                        });

                        // Send the formatted reply
                        msg.reply(replyMessage);
                    } else {
                        // No matches found
                        msg.reply(
                            `Tidak ada hasil pencarian ditemukan untuk kata kunci '${keyword}'.`
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    msg.reply(
                        'Maaf, terjadi kesalahan saat memproses permintaan Anda.'
                    );
                });
        } else if (msg.body.toLowerCase().startsWith('ai ')) {
            const prompt = msg.body.slice(7);
            chat.sendSeen();
            generateResponseAsCS(prompt)
                .then((response) => {
                    // Send the response text back to the user
                    msg.reply(response);
                })
                .catch((error) => {
                    console.error('OpenAI Error:', error);
                    msg.reply(
                        'Mohon maaf, terjadi error saat memproses request Anda.',
                        error
                    );
                });
        } else if (msg.body.startsWith('sizereg ')) {
            chat.sendSeen();
            const isiRegistrasiSize = msg.body.slice(8);
            const parts = isiRegistrasiSize.split(' ');
            const kodeOrder = parts[0];
            const size = parts[1].toUpperCase();
            const name = parts[2].toUpperCase();
            let info = client.info;
            const formattedDateTime = getFormattedDateTime();
            const sender = await msg.getContact();
            const data = {
                dateTime: formattedDateTime,
                contactPlatform: info.platform,
                contactPublishedName: sender.pushname,
                contactSavedName: sender.name,
                contactNumber: sender.number,
                kodeOrder: kodeOrder,
                size: size,
                name: name,
            };
            chat.sendSeen();
            msg.react('📝');
            await appendToGoogleSheet(googleAuth, 'entriSize', data);
            await replyWithDelay(
                chat,
                msg,
                'Terima kasih. Entri size Anda kami catat.'
            );
        } else if (msg.body.toLowerCase().startsWith('askcs2 ')) {
            console.log('Received a question to ask the knowledgebase.');
            const input = msg.body.slice(7);
            console.log('Input:', input);
            chat.sendSeen();
            const url = 'http://localhost:3010/ask';

            // Send the question to the local endpoint
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: input,
                    collection: 'vido',
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Reply with the answer
                    msg.reply(data.result.text);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else if (msg.body.toLowerCase() === 'feedback') {
            chat.sendSeen();
            initializeUserState(userId, conversationTestimoni);
            activateConversation(userId);
            const initialMessage = getNextStepMessage(
                conversationTestimoni,
                'askAlasanMemilih'
            );
            await sendMessageWithDelay(client, chat, msg, initialMessage);
        } else if (
            [
                'panitia',
                'qurban',
                'panitia qurban',
                'panitia kurban',
                'panitiaqurban',
                'panitiakurban',
            ].some((substring) => msg.body.toLowerCase().trim().includes(substring))
        ) {
            chat.sendSeen();
            initializeUserState(userId, conversationDaftarPanitiaSizeKaos);
            activateConversation(userId);
            const initialMessage = getNextStepMessage(
                conversationDaftarPanitiaSizeKaos,
                'askNamaLengkap'
            );
            await sendMessageWithDelay(client, chat, msg, initialMessage);
        } else if (userState.active) {
            if (msg.body.toLowerCase() === 'exit') {
                client.sendMessage(msg.from, 'Conversation ended.');
                deactivateConversation(userId);
                initializeUserState(userId);
            } else {
                // Pass the userState.conversationType directly to handle steps based on the active conversation
                await handleConversationStep(
                    msg,
                    userId,
                    chat,
                    userState.conversationType
                );
            }
        }
    }


});

async function handleConversationStep(msg, userId, chat) {
    const userState = getUserState(userId);
    const currentStep = userState.conversationType.steps[userState.step];
    const userInput = msg.body.trim();
    let validInput = true;

    // Input validation
    if (userState.step === 'askGender' && !['1', '2'].includes(userInput)) {
        validInput = false;
    } else if (
        userState.step === 'askSize' &&
        !['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].includes(
            userInput.toUpperCase()
        )
    ) {
        validInput = false;
    } else if (userState.step === 'askUsia' && isNaN(userInput)) {
        validInput = false;
    }

    if (!validInput) {
        await replyWithDelay(chat, msg, 'Input tidak valid. Silahkan ulangi.');
        return;
    }

    if (currentStep && userInput !== '') {
        saveUserResponse(userId, userState.step, userInput);

        if (currentStep.nextStep) {
            updateUserState(userId, { step: currentStep.nextStep });
            const nextStepMessage = getNextStepMessage(
                userState.conversationType,
                currentStep.nextStep
            );
            await sendMessageWithDelay(client, chat, msg, nextStepMessage);
        } else {
            await processFinalStep(
                msg,
                userId,
                chat,
                userState.conversationType.type
            );
        }
    } else {
        await replyWithDelay(chat, msg, 'Bisa tolong diulangi?');
    }
}

async function processFinalStep(msg, userId, chat, conversationType) {
    const userState = getUserState(userId);
    const { responses } = userState;

    // Retrieve contactId for the current user
    const contactId = await saveContact({
        dateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        contactNumber: userId,
        contactPlatform: client.info.platform,
        contactPublishedName: (await msg.getContact()).pushname,
        contactSavedName: (await msg.getContact()).name,
    });

    switch (conversationType) {
    case 'testimoni':
        try {
            const rekomendasiTestimonial = await suggestTestimonial(responses);
            const message = `Terima kasih atas feedback Anda! Jika Anda berkenan, barangkali Anda bisa memberikan review untuk kami di https://bitly/AGCS32.\n\nBerikut adalah rekomendasi testimonial dari Anda:\n\n${rekomendasiTestimonial}\n\nTerima kasih atas kerjasamanya!`;
            await sendMessageWithDelay(client, chat, msg, message);
        } catch (error) {
            console.error('Error generating testimonial:', error);
            await sendMessageWithDelay(client, chat, msg, 'Maaf, terjadi kesalahan saat memproses testimonial Anda.');
        }
        break;

    case 'daftarPanitiaUkuranKaos':
        try {
            const registrasiPanitiaKaos = await procesRegistrasiPanitia(userState.responses);

            // Save to Google Sheets
            const formattedDateTime = getFormattedDateTime();
            let info = client.info;
            const sender = await msg.getContact();
            const data = {
                dateTime: formattedDateTime,
                contactPlatform: info.platform,
                contactPublishedName: sender.pushname,
                contactSavedName: sender.name,
                contactNumber: sender.number,
                namaLengkap: userState.responses.askNamaLengkap,
                panggilan: userState.responses.askPanggilan,
                gender: userState.responses.askGender === '1' ? 'Laki-laki' : 'Perempuan',
                size: userState.responses.askSize.toUpperCase(),
                alamat: userState.responses.askAlamat,
                usia: userState.responses.askUsia,
                catatan: userState.responses.askCatatan
            };

            // Append to Google Sheet
            await inputRegistrasiPanitiaQurban(googleAuth, 'regPanitia', data);

            // Save to MySQL
            await saveRegistration(contactId, data);

            const message = `Info registrasi Anda telah tercatat. Terima kasih. Silahkan tunggu kabar berikutnya.\n\n${registrasiPanitiaKaos}`;
            await sendMessageWithDelay(client, chat, msg, message);
        } catch (error) {
            console.error('Error processing registration:', error);
            await sendMessageWithDelay(client, chat, msg, 'Maaf, terjadi kesalahan saat memproses registrasi Anda.');
        }
        break;

    default:
        await sendMessageWithDelay(client, chat, msg, 'Kami telah selesai dengan proses ini.');
        break;
    }

    deactivateConversation(userId);
    initializeUserState(userId);
}

// Translate helper function using a pseudo-translation module
/*
async function translateIntoEnglish(text, options) {
    return new Promise((resolve, reject) => {
        try {
            const translate = require('../src/googletranslate/index.js');
            translate(text, options).then((result) => {
                resolve(result);
            });
        } catch (error) {
            console.error('Translation Error:', error);
            reject(error);
        }
    });
}
*/

async function procesRegistrasiPanitia(responses) {
    const {
        askNamaLengkap: namaLengkap,
        askPanggilan: panggilan,
        askGender: gender,
        askSize: size,
        askAlamat: alamat,
        askUsia: usia,
        askCatatan: catatan,
    } = responses;

    // Format the responses as a string
    const registrasiInfo = `Nama Lengkap: ${namaLengkap}\nNama Panggilan: ${panggilan}\nGender: ${
        gender === '1' ? 'Laki-laki' : 'Perempuan'
    }\nSize Kaos: ${size}\nAlamat: ${alamat}\nUsia: ${usia}\nCatatan: ${catatan}`;



    return registrasiInfo;
}

async function suggestTestimonial(responses) {
    // Parsing responses for multiple choice answers
    const parseResponse = (response, options) => {
        const indices = response.split(/[ ,]+/).map(Number); // Split by comma or space and convert to numbers
        return indices
            .map((index) => options[index - 1])
            .filter(Boolean)
            .join(', ');
    };

    // Options corresponding to the numbers for 'askAlasanMemilih'
    const optionsAlasanMemilih = [
        'Atas rekomendasi teman/relasi',
        'Review yang banyak dan bagus',
        'Lokasi mudah ditemukan',
        'Mendapat masukan bermanfaat',
        'Mendapat rekomendasi bagus',
        'Banyak referensi pilihan',
        'Harganya kompetitif',
    ];

    // Options corresponding to the numbers for 'askYangBerkesanApa'
    const optionsYangBerkesanApa = [
        'Lokasi cukup nyaman',
        'Pilihan desain/bahan/warna beragam',
        'Proses pra produksi efektif & positif',
        'Mendapatkan harga terbaik',
        'Hasil jahitan rapi/kuat',
        'Hasil sablonan/bordiran bagus',
        'Ketepatan waktu delivery',
        'Penanganan komplain baik',
    ];

    const responAlasanMemilih = parseResponse(
        responses.askAlasanMemilih,
        optionsAlasanMemilih
    );
    const responYangBerkesanApa = parseResponse(
        responses.askYangBerkesanApa,
        optionsYangBerkesanApa
    );

    const responKesanTambahan = responses.askKesanTambahan;

    console.log(`responAlasanMemilih: ${responAlasanMemilih}`);
    console.log(`responYangBerkesanApa: ${responYangBerkesanApa}`);
    console.log(`responKesanTambahan: ${responKesanTambahan}`);

    // Here you can form a complete testimonial string using responses
    const clueTestimonial = `Alasan memilih Vido: ${responAlasanMemilih}. Perihal yang positif/berkesan: ${responYangBerkesanApa}. Kesan/catatan tambahan: ${responKesanTambahan}`;

    return generateTestimonial(clueTestimonial);
}



module.exports = client;
