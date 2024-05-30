// openaiService.js

// const fs = require('fs');
// const csv = require('csv-parser');

// const rows = [];
// const path = require('path');
// const csvFilePath = path.resolve(__dirname, '../src/data/data-pt.csv');

// console.log(csvFilePath);

// fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on('data', (row) => {
//         rows.push(row);
//     })
//     .on('end', () => {
//         console.log('CSV file successfully processed');
//     });



const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

/*
async function describeImageWithUrl(imageUrl) {
    try {
        // Create the payload for the API request
        const payload = {
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'system',
                    content: 'Given a picture of a shirt, analyze the shirt in detail while completely ignoring any person present in the image. Provide a thorough description of the shirt, including its color, pattern, material, style, and any distinctive features such as buttons, collars, cuffs, or embroidery. Based on these characteristics, suggest suitable occasions where the shirt would be appropriately worn. Consider a range of scenarios, from casual to formal events, and specify why the shirt\'s design and style make it ideal for these occasions. Also, consider the versatility of the shirt and if it can be adapted to different settings with various accessories or complementary clothing items. Translate or provide your response in Bahasa Indonesia.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: imageUrl,
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);

        // Log the response from the API
        console.log('Description:', response.choices[0].message.content);
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}
*/


async function generateResponseAsCS(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'Anda memberi edukasi dan menerima pertanyaan yang terkait dengan agama, pendidikan, sosial, dan kesehatan.',
                },
                { role: 'user', content: prompt },
            ],
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('An error occurred while processing your request.');
    }
}

async function chatWithBot(conversation) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversation, // Pass the whole conversation context
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('An error occurred while processing your request.');
    }
}

async function generateSlogan(requirement) {
    const myPrompt =
        'Create a concise and impactful slogan that captures the essence of the following description:  ' +
        requirement +
        '. The slogan should be short, memorable, and thought-provoking, making it suitable for use on a t-shirt. It should be able to convey the main idea or message of the description in a few words, while also being visually appealing and easy to read. Please ensure that the slogan is: Concise (less than 17 words), Clear and easy to understand, Thought-provoking and memorable, Suitable for use on a t-shirt.';
    console.log('My Slogan Prompt:', myPrompt);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: myPrompt,
                },
            ],
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('An error occurred while processing your request.');
    }
}


async function generateTestimonial(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'Berikan testimonial singkat untuk perusahaan Vido Garment, suatu usaha yang bergerak di bidang konfeksi/garment, yang spesialisasi dalam pembuatan baju seragam custom made. Sertakan dalam testimonial alasan mengapa Anda memilih memesan seragam di Vido Garment dan apa yang membuat Anda terkesan selama berinteraksi dengan mereka. Jika ada masukan yang ingin Anda sampaikan, silakan tambahkan dengan penataan bahasa yang konstruktif dan halus. Fokuskan narasi pada aspek positif yang menonjol dan bagaimana Vido Garment telah memenuhi atau melebihi ekspektasi Anda dalam hal kualitas produk dan layanan pelanggan. User akan memberikan clue yang menjadi acuan Anda dalam membuat testimoni tersebut: ',
                },
                { role: 'user', content: 'Clue (muatan isi) testimoni: ' + prompt },
            ],
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('An error occurred while processing your request.');
    }
}

const { google } = require('googleapis');

const googleAuth = new google.auth.GoogleAuth({
    keyFile: 'hardy-position-391701-f77f2a757d7d.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function appendToGoogleSheet(auth, range, data) {
    const spreadsheetId = '1w7c0MOhPHBbti6Lh49MpkuerAfI9XF8k_Et6Z8B8aGY';
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [
                    [
                        data.dateTime,
                        'FALSE',
                        data.contactNumber,
                        data.contactPlatform,
                        data.contactPublishedName,
                        data.contactSavedName,
                        data.kodeOrder,
                        data.size,
                        data.name,
                    ],
                ],
            },
        });
        console.log(response.data);
    } catch (err) {
        console.error('The API returned an error: ' + err);
    }
}

async function appendMuhajirinToSheet(auth, range, data) {
    const spreadsheetId = '1cyJRLS-Op7chCV1sY-jZuu4TIhfrvDjS_RM1jhrZIJo';
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [
                    [
                        data.dateTime,
                        'FALSE',
                        data.contactNumber,
                        data.contactPlatform,
                        data.contactPublishedName,
                        data.contactSavedName,
                        data.message,
                    ],
                ],
            },
        });
        console.log(response.data);
    } catch (err) {
        console.error('The API returned an error: ' + err);
    }
}


const inputRegistrasiPanitiaQurban = async (auth, sheetName, data) => {
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: '1cyJRLS-Op7chCV1sY-jZuu4TIhfrvDjS_RM1jhrZIJo',
            range: sheetName,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [
                    [
                        data.dateTime,
                        data.contactPlatform,
                        data.contactPublishedName,
                        data.contactSavedName,
                        data.contactNumber,
                        data.namaLengkap,
                        data.panggilan,
                        data.gender,
                        data.size,
                        data.alamat,
                        data.usia,
                        data.catatan,
                    ],
                ],
            },
        });

        console.log('Appended data:', response.data);
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
        throw error;
    }
};

async function getInfoKegiatanLayananMuhajirin(auth, jenisInfo) {
    const spreadsheetId = '1cyJRLS-Op7chCV1sY-jZuu4TIhfrvDjS_RM1jhrZIJo';
    const sheets = google.sheets({ version: 'v4', auth });
    let range;
    console.log('jenisInfo:', jenisInfo.toLowerCase());

    if (jenisInfo.toLowerCase() === 'kegiatan') {
        range = 'infoLayanan!B2';
    } else if (jenisInfo.toLowerCase() === 'layanan') {
        range = 'infoLayanan!B4';
    } else {
        console.error('Invalid jenisInfo provided: ' + jenisInfo);
        return;
    }

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        const value = response.data.values[0][0];
        console.log('Value:', value);
        return value;
    } catch (err) {
        console.error('The API returned an error: ' + err);
    }
}

async function getInfoQurban(auth, sheetName) {
    const spreadsheetId = '1BaCFTyvh-mXsK_TE5Bt1wk5KZ6U5is1Sd_actNBfSPQ';
    const sheets = google.sheets({ version: 'v4', auth });
    const range = `${sheetName}!B17`;

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        const value = response.data.values[0][0];
        console.log('Value:', value);
        return value;
    } catch (err) {
        console.error('The API returned an error: ' + err);
    }
}

async function getInfoKhitan(auth, sheetName) {
    const spreadsheetId = '1E1Kj_gn5BlbeytGhCqQKKsRvdGJnfVpriQfHn8lPM7E';
    const sheets = google.sheets({ version: 'v4', auth });
    const range = `${sheetName}!B30`;

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        const value = response.data.values[0][0];
        console.log('Value:', value);
        return value;
    } catch (err) {
        console.error('The API returned an error: ' + err);
    }
}



function convertTo24Hour(time) {
    const [hours, minutes] = time.split(':');
    const hoursIn24 = (hours % 12) + (time.includes('pm') ? 12 : 0);
    return `${hoursIn24}:${minutes.replace('am', 'wib').replace('pm', 'wib')}`;
}

function adjustTime(time, minutesToAdd) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(parseInt(minutes.replace('wib', '')) + minutesToAdd);
    const formattedMinutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return `${date.getHours()}:${formattedMinutes} wib`;
}




module.exports = {
    generateResponseAsCS,
    chatWithBot,
    generateSlogan,
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
};