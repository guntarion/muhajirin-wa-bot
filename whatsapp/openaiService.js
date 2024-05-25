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

// Function to describe an image using OpenAI Vision API
async function describeImageWithBase64(imageBase64) {
    try {
        // Read the image file and convert to base64
        // const imageBuffer = fs.readFileSync(imagePath);
        // const imageBase64 = imageBuffer.toString('base64');

        // Create the payload for the API request
        const payload = {
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'system',
                    content:
                        'User will give you a picture of a shirt, or a person using a shirt. Please focus on the shirt, completely ignore the person; describe the shirt and suggest, in what occasion it can be worn.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_base64',
                            content: `data:image/jpeg;base64,${imageBase64}`,
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

async function suggestSuitableOccasionOfShirt(imageUrl) {
    try {
        // Create the payload for the API request
        const payload = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'Given a picture of a shirt, analyze the shirt in detail while completely ignoring any person present in the image. Provide a thorough description of the shirt, including its color, pattern, material, style, and any distinctive features such as buttons, collars, cuffs, or embroidery. Based on these characteristics, suggest suitable occasions where the shirt would be appropriately worn. Consider a range of scenarios, from casual to formal events, and specify why the shirt\'s design and style make it ideal for these occasions. Also, consider the versatility of the shirt and if it can be adapted to different settings with various accessories or complementary clothing items. Lastly, suggest complementary colors that would go well with the shirt, helping the user create a cohesive outfit. Translate or provide your response in Bahasa Indonesia.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);
        const responseString = response.choices[0].message.content;
        // Replace all occurrences of '**' with '*'
        const modifiedResponse = responseString.replace(/\*\*/g, '*');

        // Log the response from the API
        // console.log('Description:', response.choices[0].message.content);
        return modifiedResponse;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}

async function suggestSuitableOccasionOfShirtBase64Input(base64Image) {
    try {
        // Create the payload for the API request
        const payload = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'Given a picture of a shirt, analyze the shirt in detail while completely ignoring any person present in the image. Provide a thorough description of the shirt, including its color, pattern, material, style, and any distinctive features such as buttons, collars, cuffs, or embroidery. Based on these characteristics, suggest suitable occasions where the shirt would be appropriately worn. Consider a range of scenarios, from casual to formal events, and specify why the shirt\'s design and style make it ideal for these occasions. Also, consider the versatility of the shirt and if it can be adapted to different settings with various accessories or complementary clothing items. Lastly, suggest complementary colors that would go well with the shirt, helping the user create a cohesive outfit. Translate or provide your response in Bahasa Indonesia.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);
        const responseString = response.choices[0].message.content;
        // Replace all occurrences of '**' with '*'
        const modifiedResponse = responseString.replace(/\*\*/g, '*');

        // Log the response from the API
        // console.log('Description:', response.choices[0].message.content);
        return modifiedResponse;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}

async function suggestDesignFromLogo(imageUrl) {
    try {
        // Create the payload for the API request
        const payload = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'Given the logo provided by the user: 1. Describe the prominent or unique shape of the logo 2. Describe the colors contained within the logo. Identify the primary, secondary, and any accent colors present. Based on those informations, create a design recommendation (in text) for a shirt that: 1) Contains prominent or unique shapes from the logo that can be effectively translated into embroidery or screen printing on the shirt. Prioritize shapes, not letter, that are easily recognizable and carry the essence of the brand’s visual identity. 2)  Incorporates the provided information of colors composition analysis of a logo of the user\'s company. Provide a detailed description of the t-shirt design, including the placement and proportion of each color. This design will help in creating merchandise that aligns closely with the brand\'s visual identity. Translate or provide your response in Bahasa Indonesia. ',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);
        const responseString = response.choices[0].message.content;
        // Replace all occurrences of '**' with '*'
        const modifiedResponse = responseString.replace(/\*\*/g, '*');

        // Log the response from the API
        // console.log('Description:', response.choices[0].message.content);
        return modifiedResponse;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}


async function suggestDesignFromLogoBase64Input(base64Image) {
    try {
        // Create the payload for the API request
        const payload = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'Given the logo provided by the user: 1. Describe the prominent or unique shape of the logo 2. Describe the colors contained within the logo. Identify the primary, secondary, and any accent colors present. Based on those informations, create a design recommendation (in text) for a shirt that: 1) Contains prominent or unique shapes from the logo that can be effectively translated into embroidery or screen printing on the shirt. Prioritize shapes, not letter, that are easily recognizable and carry the essence of the brand’s visual identity. 2)  Incorporates the provided information of colors composition analysis of a logo of the user\'s company. Provide a detailed description of the t-shirt design, including the placement and proportion of each color. This design will help in creating merchandise that aligns closely with the brand\'s visual identity. Translate or provide your responses in Bahasa Indonesia. ',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);
        const responseString = response.choices[0].message.content;
        // Replace all occurrences of '**' with '*'
        const modifiedResponse = responseString.replace(/\*\*/g, '*');

        // Log the response from the API
        // console.log('Description:', response.choices[0].message.content);
        return modifiedResponse;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}

async function suggestHowToTakeCareOfShirt(base64Image) {
    try {
        const payload = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'Given a picture of a shirt, analyze the shirt in detail and completely ignore any person present in the image. Provide specific care and maintenance tips that will help ensure the shirt stays in good condition. Identify the material and style of the shirt from the image and suggest appropriate washing instructions, ironing tips, and general fabric care based on these characteristics. These recommendations should help prolong the life and appearance of the shirt. Translate or provide your responses in Bahasa Indonesia. ',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);
        const responseString = response.choices[0].message.content;
        // Replace all occurrences of '**' with '*'
        const modifiedResponse = responseString.replace(/\*\*/g, '*');

        // Log the response from the API
        // console.log('Description:', response.choices[0].message.content);
        return modifiedResponse;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}

async function suggestHowToTakeCareOfShirtFromLabel(base64Image) {
    try {
        const payload = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'Given an image of symbols on clothing labels, analyze the symbols and ignore any person or unrelated elements in the image. Provide a detailed explanation of each symbol, focusing on their meaning regarding the proper care of the shirt. If the label also includes information about the fabric type, integrate this into your care recommendations to ensure they are specific and tailored to the material of the shirt. Offer comprehensive care instructions based on the symbols to help maintain the shirt\'s condition over time. Translate or provide your responses in Bahasa Indonesia.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        };

        // Send the request to OpenAI API
        const response = await openai.chat.completions.create(payload);
        const responseString = response.choices[0].message.content;
        // Replace all occurrences of '**' with '*'
        const modifiedResponse = responseString.replace(/\*\*/g, '*');

        // Log the response from the API
        // console.log('Description:', response.choices[0].message.content);
        return modifiedResponse;
    } catch (error) {
        console.error('Error describing the image:', error);
    }
}


async function generateResponseAsCS(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'Anda adalah customer service yang ramah dari Vido Garment, perusahaan yang bergerak di pembuatan seragam untuk berbagai kebutuhan. Untuk pertanyaan atau permintaan yang di luar konteks lingkup bisnis vido garment dan wawasan di luar lini bisnis konfeksi atau garment atau apapun di luar pembahasan di lingkup industri tekstil, Anda sampaikan maaf tidak bisa memberi tanggapan atasnya.',
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

async function generateLogoBordir(requirement) {
    const myPrompt =
        'Create a professional-looking logo design, in one image, depicting: ' +
        requirement +
        '. The logo should have a solid background color, with no gradients or shadows. The design should be simple, yet distinctive and memorable. The logo should be scalable to various sizes without losing its clarity. The design should be created using a limited color palette, with a maximum of 4 colors. The logo should be designed in a way that it can be easily embroidered on various fabrics, including cotton, polyester, and blends. The design should be clean, crisp, and visually appealing. The design should be simple enough to be easily recognizable and memorable, yet unique enough to stand out from other logos. The design should be created with the intention of being used on embroidery.';
    console.log('My Logo Bordir Prompt:', myPrompt);
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            // model: 'dall-e-2',
            prompt: myPrompt,
            n: 1,
            size: '1024x1024',
        });

        const imageUrl = response.data[0].url;

        return imageUrl;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while generating the image');
    }
}

async function generateDesainSablon(requirement) {
    const myPrompt =
        'Create an image of ' +
        requirement +
        '. The design should be clear, bold, with sharp lines, minimal details, and also minimal gradients.  The colors used should be distinct and separable, avoiding overly complex shading or color blending. The background should be simple or non-existent to emphasize the main design. This image should be creative and capable of being a standout piece on merchandise.';
    console.log('My Desain Sablon Prompt:', myPrompt);
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            // model: 'dall-e-2',
            prompt: myPrompt,
            n: 1,
            size: '1024x1024',
        });

        const imageUrl = response.data[0].url;

        return imageUrl;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while generating the image');
    }
}


async function generateDesainKaos(myPrompt) {
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            // model: 'dall-e-2',
            prompt: myPrompt,
            n: 1,
            size: '1024x1024', // the minimum size for DaLL-E-3
            // size: '512x512', // the minimum size for DaLL-E-2
        });
        const imageUrl = response.data[0].url;
        console.log('Image URL:', imageUrl);
        return imageUrl;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while generating the image');
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


module.exports = {
    generateResponseAsCS,
    chatWithBot,
    generateLogoBordir,
    generateDesainSablon,
    generateSlogan,
    generateDesainKaos,
    generateTestimonial,
    appendToGoogleSheet,
    describeImageWithBase64,
    suggestSuitableOccasionOfShirt,
    suggestDesignFromLogo,
    suggestDesignFromLogoBase64Input,
    suggestSuitableOccasionOfShirtBase64Input,
    suggestHowToTakeCareOfShirt,
    suggestHowToTakeCareOfShirtFromLabel,
    googleAuth,
};