const { Client, LocalAuth, MessageMedia } = require('../index'); // Adjust the path as necessary
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const logger = require('./logger');


const {
    getUserState,
    updateUserState,
    activateConversation,
    initializeUserState,
    saveUserResponse,
    deactivateConversation,
} = require('./stateManager');
const { getNextStepMessage, conversationPricingKaos, conversationTestimoni, conversationDesainKaos, conversationSizeFitting, } = require('./conversationFlow');
const { replyWithDelay, sendMessageWithDelay } = require('./utility');
const {
    generateLogoBordir,
    generateDesainSablon,
    generateDesainKaos,
    generateResponseAsCS,
    chatWithBot,
    generateSlogan,
    generateTestimonial,
    appendToGoogleSheet,
    suggestSuitableOccasionOfShirt,
    suggestDesignFromLogo,
    suggestDesignFromLogoBase64Input,
    suggestSuitableOccasionOfShirtBase64Input,
    suggestHowToTakeCareOfShirt,
    suggestHowToTakeCareOfShirtFromLabel,
    googleAuth,
} = require('./openaiService');
const { watermarkingImageUploadToGDrive, 
    uploadBase64ToGoogleDrive,
} = require('./googleImageService');

const translate = require('../src/googletranslate/index.js');

const userConversations = new Map();


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
});

// client.on('message', handleMessage);

client.on('message', async (msg) => {
    // console.log('MESSAGE RECEIVED', msg);
    logger.info('MESSAGE RECEIVED', msg);
    const chat = await msg.getChat();
    const sender = await msg.getContact();
    console.log(`Sender: ${sender.pushname}, Number: ${sender.number}`);
    const userId = sender.number;

    const userState = getUserState(userId);

    if (msg.body === '.status') {
        chat.sendSeen();
        const currentDate = new Date();
        const masehiDateTime = currentDate.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
        });
        const replyMessage = `WA-Bot Vido is up and running 🚀\nMasehi: ${masehiDateTime}`;
        await replyWithDelay(chat, msg, replyMessage);
        // translate('Anak Kucing warna putih sedang bermain bola bersama dua anjing', {from: 'id', to: 'en'}).then(result => {
        //     console.log(result.text); // Outputs: 'Hola mundo'
        //     msg.reply(result.text);
        // });
    } else if (msg.body.startsWith('!ping')) {
        await replyWithDelay(chat, msg, 'pong');
    } else if (msg.body === '!ping reply') {
        chat.sendSeen();
        msg.reply('pong');
    } 

    // TODO: test out link preview
    else if (msg.body.startsWith('!preview ')) {
        const text = msg.body.slice(9);
        msg.reply(text, null, { linkPreview: true });   
    }

    else if (msg.hasMedia && msg.body === 'tes') {
        console.log('Received media from Guntar');
        const media = await msg.downloadMedia();
        // const base64data = media.data.toString('base64');
        const base64data = media.data;

        uploadBase64ToGoogleDrive(base64data, 'media.jpg')
            .then((response) => {
                // Send the response text back to the user
                msg.reply(response);
            })
            .catch((error) => {
                console.error('Upload Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat upload file.',
                    error
                );
            });
    }

    else if (msg.body.toLowerCase().startsWith('pasuntuk ')) {
        const link_gambar = msg.body.slice(9);
        suggestSuitableOccasionOfShirt(link_gambar)
            .then((response) => {
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat memproses request Anda.',
                    error
                );
            });
    }

    // with base64 (media is in the message)
    else if (msg.hasMedia && msg.body.toLowerCase() === 'pasuntuk') {
        const media = await msg.downloadMedia();
        const base64data = media.data.toString('base64');

        suggestSuitableOccasionOfShirtBase64Input(base64data)
            .then((response) => {
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat memproses request Anda.',
                    error
                );
            });
    }

    // with url
    else if (msg.body.toLowerCase().startsWith('idedesain ')) {
        const link_gambar = msg.body.slice(10);
        suggestDesignFromLogo(link_gambar)
            .then((response) => {
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat memproses request Anda.',
                    error
                );
            });
    }

    // with base64 (media is in the message)
    else if (msg.hasMedia && msg.body.toLowerCase() === 'idedesain') {
        const media = await msg.downloadMedia();
        const base64data = media.data.toString('base64');

        suggestDesignFromLogoBase64Input(base64data)
            .then((response) => {
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat memproses request Anda.',
                    error
                );
            });
    } else if (msg.hasMedia && msg.body.toLowerCase() === 'cararawat') {
        const media = await msg.downloadMedia();
        const base64data = media.data.toString('base64');

        suggestHowToTakeCareOfShirt(base64data)
            .then((response) => {
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat memproses request Anda.',
                    error
                );
            });
    } 
    else if (msg.hasMedia && msg.body.toLowerCase() === 'labelrawat') {
        const media = await msg.downloadMedia();
        const base64data = media.data.toString('base64');

        suggestHowToTakeCareOfShirtFromLabel(base64data)
            .then((response) => {
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Mohon maaf, terjadi error saat memproses request Anda.',
                    error
                );
            });
    } 
    else if (msg.body.startsWith('img ')) {
        const link_gambar = msg.body.slice(4);
        watermarkingImageUploadToGDrive(link_gambar)
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
    } else if (msg.body.startsWith('sizereg ')) {
        chat.sendSeen();
        const isiRegistrasiSize = msg.body.slice(8);
        const parts = isiRegistrasiSize.split(' ');
        const kodeOrder = parts[0];
        const size = parts[1].toUpperCase();
        const name = parts[2].toUpperCase();
        let info = client.info;
        const now = new Date();
        const formattedDateTime = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${now
            .getDate()
            .toString()
            .padStart(2, '0')} ${now
            .getHours()
            .toString()
            .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
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
    } else if (msg.body.toLowerCase().startsWith('askcs1 ')) {
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
    } else if (
        ['quit', 'cukup', 'berhenti', 'stop'].includes(msg.body.toLowerCase())
    ) {
        // Remove user from conversation map if they want to quit
        userConversations.delete(msg.from);
        msg.reply('Anda telah mengakhiri percakapan dengan bot cs.');
    } else if (
        msg.body.toLowerCase().startsWith('chat ') ||
        userConversations.has(msg.from)
    ) {
        // Handles both initiating and continuing a conversation
        const userId = msg.from;
        const prompt = msg.body.toLowerCase().startsWith('chat ')
            ? msg.body.slice(5).trim()
            : msg.body;

        let conversation = userConversations.get(userId);
        if (!conversation) {
            // Initialize the conversation if this is the start
            conversation = [
                {
                    role: 'system',
                    content:
                        'Anda adalah chatbot layanan pelanggan dari Vido Garment, perusahaan yang membuat seragam, yang diprogram untuk menangani pertanyaan dengan nada humoris dan santai. Tujuan utama Anda adalah untuk membantu pelanggan secara efisien sambil membuat mereka tersenyum. Anda dapat menggunakan plesetan, permainan kata, dan lelucon ringan. Pastikan humor Anda sopan dan tidak menyinggung, cocok untuk semua audiens. Saat merespons, tujuannya adalah untuk membantu namun juga menyisipkan humor yang ceria untuk meringankan suasana. Pertahankan nada yang ramah dan humoris tanpa mengabaikan keseriusan kekhawatiran pelanggan. Gunakan humor untuk meningkatkan interaksi tetapi tidak untuk mengalihkan dari pertanyaan atau kekhawatiran penting yang mungkin dimiliki pelanggan. Untuk pertanyaan di luar lingkup pembahasan seragam dan seputar pembuatannya, atau yang di luar lingkup industri konveksi, garment, tekstil, Anda menolak dengan halus.',
                },
            ];
            userConversations.set(userId, conversation);
        }

        // Add the user's message to the conversation
        conversation.push({ role: 'user', content: prompt });

        chatWithBot(conversation)
            .then((response) => {
                // Add the bot's response to the conversation
                conversation.push({ role: 'assistant', content: response });

                // Send the response text back to the user
                msg.reply(response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply('Sorry, there was an error processing your request.');
            });
    } else if (msg.body.toLowerCase().startsWith('slogan ')) {
        const userRequirement = msg.body.slice(7);
        chat.sendSeen();
        const requirement = await translate(userRequirement, {
            from: 'id',
            to: 'en',
        });
        // await sendMessageWithDelay(client, chat, msg, 'Harap bersabar menunggu, Vido AI butuh beberapa waktu untuk generate logo Anda 😊');
        generateSlogan(requirement.text)
            .then(async (response) => {
                await client.sendMessage(msg.from, response);
            })
            .catch((error) => {
                console.error('OpenAI Error:', error);
                msg.reply(
                    'Sorry, I encountered an error while processing your request.'
                );
            });
    } else if (msg.body.toLowerCase().startsWith('logobordir ')) {
        const userRequirement = msg.body.slice(11);
        chat.sendSeen();
        const requirement = await translate(userRequirement, {
            from: 'id',
            to: 'en',
        });
        await sendMessageWithDelay(
            client,
            chat,
            msg,
            'Harap bersabar menunggu, Vido AI butuh beberapa waktu untuk generate logo Anda 😊'
        );
        generateLogoBordir(requirement.text)
            .then((imageUrl) => {
                // Use the generated image URL to add a watermark and upload to Google Drive
                console.log('Image URL:', imageUrl);
                return watermarkingImageUploadToGDrive(imageUrl);
            })
            .then(async ({ url, mimeType }) => {
                // Create media from the watermarked image URL
                const media = await MessageMedia.fromUrl(url, {
                    unsafeMime: true,
                    mimeType: mimeType,
                });
                // Send the watermarked image as an attachment
                await client.sendMessage(msg.from, media);
            })
            .catch((error) => {
                console.error('Error:', error);
                msg.reply(
                    'Sorry, I encountered an error while processing your request.'
                );
            });
    } else if (msg.body.toLowerCase().startsWith('desainsablon ')) {
        const userRequirement = msg.body.slice(13);
        chat.sendSeen();
        const requirement = await translate(userRequirement, {
            from: 'id',
            to: 'en',
        });
        await sendMessageWithDelay(
            client,
            chat,
            msg,
            'Harap bersabar menunggu, Vido AI butuh beberapa waktu untuk meng-generate desain sablon Anda 😊'
        );
        generateDesainSablon(requirement.text)
            .then((imageUrl) => {
                // Use the generated image URL to add a watermark and upload to Google Drive
                console.log('Image URL:', imageUrl);
                return watermarkingImageUploadToGDrive(imageUrl);
            })
            .then(async ({ url, mimeType }) => {
                // Create media from the watermarked image URL
                const media = await MessageMedia.fromUrl(url, {
                    unsafeMime: true,
                    mimeType: mimeType,
                });
                // Send the watermarked image as an attachment
                await client.sendMessage(msg.from, media);
            })
            .catch((error) => {
                console.error('Error:', error);
                msg.reply(
                    'Sorry, I encountered an error while processing your request.'
                );
            });
    } else if (msg.body.toLowerCase() === 'harga kaos') {
        chat.sendSeen();
        initializeUserState(userId, conversationPricingKaos);
        activateConversation(userId);
        const initialMessage = getNextStepMessage(
            conversationPricingKaos,
            'askJenisKaos'
        ); // Use the first step from the specific conversation
        // const initialMessage = getNextStepMessage('askJenisKaos'); // Ensure to use the initial step key
        // const initialMessage = getNextStepMessage(conversationPricingKaos, userState.step);
        await sendMessageWithDelay(client, chat, msg, initialMessage);
        // Do not update the user state here. It should be updated after the user responds.
    } else if (msg.body.toLowerCase() === 'feedback') {
        chat.sendSeen();
        initializeUserState(userId, conversationTestimoni);
        activateConversation(userId);
        const initialMessage = getNextStepMessage(
            conversationTestimoni,
            'askAlasanMemilih'
        );
        await sendMessageWithDelay(client, chat, msg, initialMessage);
    } else if (msg.body.toLowerCase() === 'desain kaos') {
        chat.sendSeen();
        initializeUserState(userId, conversationDesainKaos);
        activateConversation(userId);
        const initialMessage = getNextStepMessage(
            conversationDesainKaos,
            'askJenisKaos'
        );
        await sendMessageWithDelay(client, chat, msg, initialMessage);
    } else if (msg.body.toLowerCase() === 'size order') {
        chat.sendSeen();
        initializeUserState(userId, conversationSizeFitting);
        activateConversation(userId);
        const initialMessage = getNextStepMessage(
            conversationSizeFitting,
            'askOrderPO'
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
});

async function handleConversationStep(msg, userId, chat) {
    const userState = getUserState(userId);
    const currentStep = userState.conversationType.steps[userState.step];

    if (currentStep && msg.body.trim() !== '') {
        saveUserResponse(userId, userState.step, msg.body.trim());

        if (currentStep.nextStep) {
            updateUserState(userId, { step: currentStep.nextStep });
            const nextStepMessage = getNextStepMessage(userState.conversationType, currentStep.nextStep);
            await sendMessageWithDelay(client, chat, msg, nextStepMessage);
        } else {
            await processFinalStep(msg, userId, chat, userState.conversationType.type);
        }
    } else {
        await replyWithDelay(chat, msg, 'Bisa tolong diulangi?');
    }
}


async function processFinalStep(msg, userId, chat, conversationType) {
    const userState = getUserState(userId);
    const { responses } = userState;

    switch (conversationType) {
    case 'pricingKaos':
        // eslint-disable-next-line no-case-declarations
        const { priceIndividual, priceTotal } = calculatePrices(responses);
        await sendMessageWithDelay(client, chat, msg, `Harga per pcs @: Rp ${priceIndividual.toLocaleString('id-ID')}, Total Biayanya: Rp ${priceTotal.toLocaleString('id-ID')}`);
        break;
    case 'testimoni':
        try {
            const rekomendasiTestimonial = await suggestTestimonial(userState.responses);
            const message = `Terima kasih atas feedback Anda! Jika Anda berkenan, barangkali Anda bisa memberikan review untuk kami di https://bitly/AGCS32.\n\nBerikut adalah rekomendasi testimonial dari Anda:\n\n${rekomendasiTestimonial}\n\nTerima kasih atas kerjasamanya!`;
            await sendMessageWithDelay(client, chat, msg, message);
        } catch (error) {
            console.error('Error generating testimonial:', error);
            await sendMessageWithDelay(client, chat, msg, 'Maaf, terjadi kesalahan saat memproses testimonial Anda.');
        }
        break;
    case 'desainKaos':
        await sendMessageWithDelay(client, chat, msg, 'Harap bersabar menunggu, Vido AI butuh beberapa waktu untuk ini 😊');    
        // eslint-disable-next-line no-case-declarations
        const desainKaosPrompt = await suggestDesainKaos(responses);
        // Generate the design image from the prompt
        generateDesainKaos(desainKaosPrompt)
            .then((imageUrl) => {
                // Use the generated image URL to add a watermark and upload to Google Drive
                console.log('Design Image URL:', imageUrl);
                return watermarkingImageUploadToGDrive(imageUrl);
            })
            .then(async ({ url, mimeType }) => {
                // Create media from the watermarked image URL
                const media = await MessageMedia.fromUrl(url, {
                    unsafeMime: true,
                    mimeType: mimeType,
                });
                console.log('Media:', media);
                // Send the watermarked image as an attachment
                await client.sendMessage(msg.from, media, { caption: 'Berikut mockup desain untuk Anda, dari Vido AI' });
            })
            .catch(async (error) => {  // Note the async keyword here
                console.error('Error in generating design:', error);
                await sendMessageWithDelay(client, chat, msg, 'Sorry, I encountered an error while processing your design request.');
            });
        break;
    case 'sizeFitting':
        await sendMessageWithDelay(client, chat, msg, 'Detail ukuran telah dicatat. Terima kasih telah mengonfirmasi ukuran Anda.');
        break;
    default:
        await sendMessageWithDelay(client, chat, msg, 'Kami telah selesai dengan proses ini.');
        break;
    }

    deactivateConversation(userId);
    initializeUserState(userId);
}

async function suggestDesainKaos(responses) {
    // Define responses based on the user's selection
    const responJenisKaosOptions = [
        'Generate a high-quality image of a simple, everyday t-shirt. The t-shirt should have a classic design with short sleeves and a round neckline. It should be displayed on a plain white background to emphasize its details. The neckline should be a classic crew neck, and the sleeves should be short and relaxed. The image should include details such as a subtle texture or weave to the fabric.',
        'Create a high-quality image of a polo shirt. The shirt should have a solid color background, with a classic and clean design. The polo collar should be prominent, with a subtle button placket and a relaxed fit. The image should include details such as a subtle texture or weave to the fabric, the cuffs should be ribbed, and a classic button placket with 2-3 buttons.',
        'Create a high-quality image of a raglan shirt. The shirt should have a solid color background, with a simple and clean design. The raglan sleeve should be prominent, with a seamless integration into the body of the shirt.  The shirt should have a relaxed fit, with a slightly fitted silhouette. The collar should be a classic crew neck, and the cuffs should be ribbed. The image should include a subtle texture or weave to the fabric.',
    ];
    // const responLokasiSablonOptions = [
    //     'front middle',
    //     'left chest',
    //     'right chest',
    //     'the back',
    // ];

    // Extracting responses
    const responJenisKaos = responJenisKaosOptions[responses.askJenisKaos - 1];
    // const responLokasiSablon = responLokasiSablonOptions[responses.askLokasiSablon - 1];
    const responWarnaKaos = responses.askWarnaKaos; // Directly use the response
    const responWarnaLengan = responses.askWarnaLengan; // Directly use the response
    const responDeskripsiSablon = responses.askDeskripsiSablon;

    // Translate responses
    const translatedWarnaKaos = await translate(responWarnaKaos, {from: 'id', to: 'en',});
    const translatedWarnaLengan = await translate(responWarnaLengan, {from: 'id', to: 'en',});
    const translatedDeskripsiSablon = await translateIntoEnglish(responDeskripsiSablon, {from: 'id',to: 'en',});

    // Create the full design prompt
    const desainKaosPrompt = `
        ${responJenisKaos} 
        The color of shirt body is ${translatedWarnaKaos.text}. 
        The color of the sleeves is ${translatedWarnaLengan.text}. 
        The front side of it has a colorful picture of: ${translatedDeskripsiSablon.text}.
    `;
    // console.log('Desain Kaos Prompt:', desainKaosPrompt);

    return desainKaosPrompt.trim(); // Clean up any extra spaces or new lines
}

// Translate helper function using a pseudo-translation module
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

    const responKesanTambahan  = responses.askKesanTambahan;

    console.log(`responAlasanMemilih: ${responAlasanMemilih}`);
    console.log(`responYangBerkesanApa: ${responYangBerkesanApa}`);
    console.log(`responKesanTambahan: ${responKesanTambahan}`);

    // Here you can form a complete testimonial string using responses
    const clueTestimonial = `Alasan memilih Vido: ${responAlasanMemilih}. Perihal yang positif/berkesan: ${responYangBerkesanApa}. Kesan/catatan tambahan: ${responKesanTambahan}`;

    return generateTestimonial(clueTestimonial);
}


function calculatePrices(responses) {
    let price = 0;
    const { askJenisKaos, askJenisSablon, askTitikSablon, askQuantityPesan } =
        responses;

    console.log(`askJenisKaos: ${askJenisKaos}`);
    console.log(`askJenisSablon: ${askJenisSablon}`);
    console.log(`askTitikSablon: ${askTitikSablon}`);
    console.log(`askQuantityPesan: ${askQuantityPesan}`);

    switch (askJenisKaos) {
    case '1': // Kaos Oblong
        price += 2000;
        break;
    case '2': // Kaos Kerah
        price += 1500;
        break;
    case '3': // Kaos Raglan
        price += 500;
        break;
    }

    console.log(`price 1: ${price}`);

    const titikSablon = parseInt(askTitikSablon, 10);
    switch (askJenisSablon) {
    case '1': // Sablon Plastisol
        price += 4500 * titikSablon;
        break;
    case '2': // Sablon Rubber
        price += 2500 * titikSablon;
        break;
    case '3': // Sablon Discharge
        price += 3000 * titikSablon;
        break;
    case '4': // Belum Tahu
        price += 2500 * titikSablon; // Default case
        break;
    }

    console.log(`price 2: ${price}`);

    const quantityPesan = parseInt(askQuantityPesan, 10);

    console.log(`askQuantityPesan: ${askQuantityPesan}`);
    const priceIndividual = price;
    const priceTotal = priceIndividual * quantityPesan;

    return { priceIndividual, priceTotal };
}



module.exports = client;
