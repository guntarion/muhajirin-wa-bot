const express = require('express');
const router = express.Router();
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
    fetchGroupBroadcast,
    fetchGroupBroadcastMembers,
    fetchGroupMembersPhoneNumbers,
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

// Utility function to add a random delay between 5 to 10 seconds
const randomDelay = () => {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 6000) + 5000));
};

// Route for sending a broadcast message to a group
router.post('/send-group-message', async (req, res) => {
    const { groupId, message } = req.body;
    console.log('On Process on sending group message to group ID =====', groupId, message);

    if (!groupId || !message) {
        return res.status(400).json({ error: 'Group ID and message are required' });
    }

    try {
        const phoneNumbers = await fetchGroupMembersPhoneNumbers(groupId);
        const responses = [];

        for (const number of phoneNumbers) {
            const chatId = `${number}@c.us`;
            const response = await sendMessage(chatId, message);
            console.log(`Sending to: ${chatId} \nMessage: ${message}`);
            responses.push(response);
            await randomDelay(); // Add random delay between 5 to 10 seconds
        }

        res.json({ success: true, responses });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ error: 'Failed to send group message' });
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

// OpenAI API route for chats page - summary respon berdasarkan history chat
router.post('/openai-chat-summary', async (req, res) => {
    const { chatContent, lastSender } = req.body;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'Berdasarkan rekaman teks hasil pembicaraan chat antara customer service dengan klien atau calon klien, buatlah ringkasan yang jelas dan padat. Ringkasan ini dimaksudkan untuk digunakan oleh supervisor dari agen customer service untuk memahami status terakhir dari setiap prospek atau klien. Pastikan untuk mencakup poin-poin utama seperti: 1. Identitas Klien/Calon Klien: Sebutkan nama dan detail relevan lainnya tentang klien atau calon klien. 2. Tujuan Pembicaraan: Jelaskan secara singkat tujuan utama dari pembicaraan tersebut, misalnya permintaan informasi produk, keluhan, atau permintaan layanan. 3. Isu Utama yang Dibahas: Ringkaskan isu-isu utama yang dibahas selama chat, termasuk pertanyaan yang diajukan oleh klien atau calon klien dan jawaban yang diberikan oleh customer service. 4. Status Terakhir: Berikan detail tentang status terakhir dari interaksi tersebut, termasuk setiap tindak lanjut yang telah dijanjikan atau masalah yang masih belum terselesaikan. 5. Tindakan yang Direkomendasikan: Sertakan rekomendasi tindakan selanjutnya yang perlu diambil oleh customer service atau departemen lain yang terkait, berdasarkan isi pembicaraan. Berikut adalah rekaman chat yang perlu diringkas: ' + chatContent,
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    const isiRespon = completion.choices[0].message.content + '\n\nYang terakhir berbicara adalah: ' + lastSender;

    res.json({ message: isiRespon });
});

// OpenAI API route for chats page - rekomendasi respon berdasarkan history chat
router.post('/openai-response-recommendation', async (req, res) => {
    const { chatContent, lastSender } = req.body;

    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: 'system', 
                content: lastSender === 'Clients' 
                    ? 'Anda adalah customer service yang ramah dari Vido Garment, perusahaan yang bergerak di pembuatan seragam. Tugas Anda adalah memberi respon atas pesan terakhir yang disampaikan Client. Perhatikan isi percakapan sebelum-sebelumnya, untuk memahami konteksnya.' + chatContent 
                    : 'Anda adalah customer service yang ramah dari Vido Garment, perusahaan yang bergerak di pembuatan seragam. Tugas Anda adalah melanjutkan pesan yang sudah disampaikan Customer Service. Perhatikan isi percakapan sebelum-sebelumnya, untuk memahami konteksnya.' + chatContent 
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    res.json({ message: completion.choices[0].message.content });
});

router.post('/openai-improvement-pesan', async (req, res) => {
    const { userDraft, previousMessage, userInstruction, useEmoji } = req.body;

    let content = 'Anda adalah customer service yang ramah dari Vido Garment. Lakukan penyempurnaan dari draft pesan yang diberikan user: pahami intensinya terlebih dahulu, lalu perbaiki tata bahasanya dan kembangkan untuk memenuhi intensi yang dimaksud.' + userDraft;

    if (previousMessage) {
        content += ' Draft pesan user ini merupakan tanggapan dari pesan atau situasi berikut: ' + previousMessage;
    }

    if (userInstruction) {
        content += ' User memberikan arahan terkait atas bagaimana bentuk penyempurnaan yg bisa Anda lakukan, yakni berikut ini: ' + userInstruction;
    }

    if (useEmoji) {
        content += ' Harap sertakan emoji yang relevan';
    }

    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: 'system', 
                content: content
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    res.json({ message: completion.choices[0].message.content });
});


router.post('/openai-shirt-generation', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await openai.images.generate({
            // model: 'dall-e-3',
            model: 'dall-e-2',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
        });

        const imageUrl = response.data[0].url;

        res.json({ imageUrl: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the image' });
    }
});


router.post('/openai-rekomendasi-seragam', async (req, res) => {
    const { seometadata, kontenfrontpage } = req.body;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'Untuk perusahaan berikut' +
                    seometadata +
                    ' dan konten frontpage' +
                    kontenfrontpage +
                    ' Berdasarkan informasi profil perusahaan yang telah diperoleh dari frontpage website perusahaan melalui proses scraping, silakan identifikasi jenis dan nature dari usaha perusahaan tersebut. Gunakan informasi yang tersedia untuk memahami sektor industri, lingkungan kerja, dan nilai-nilai perusahaan. Setelah memahami konteks bisnisnya, buatlah rekomendasi tentang jenis seragam yang paling sesuai untuk karyawan perusahaan tersebut. Rekomendasikan salah satu atau beberapa dari jenis seragam berikut berdasarkan nature usahanya: 1. Seragam Jaket Bomber: Biasanya digunakan di lingkungan kerja yang memerlukan ketahanan terhadap cuaca dingin dan angin, seperti di lapangan terbuka atau di area dengan suhu yang lebih rendah. Jaket ini juga sering dipilih untuk pekerjaan yang memerlukan mobilitas tinggi karena memberikan kehangatan tanpa mengorbankan gerak. 2. Wearpack - untuk usaha yang melibatkan pekerjaan berisiko tinggi dan memerlukan perlindungan serta kepatuhan terhadap regulasi keselamatan. 3. Seragam Retail dengan model Polo Kasual - untuk perusahaan ritel yang ingin menonjolkan branding toko dan menciptakan tampilan yang profesional namun santai. 4. Seragam Jaket Hoodie: Cocok untuk lingkungan kerja kasual yang memerlukan kenyamanan dan fleksibilitas. Jaket hoodie sering digunakan di industri kreatif, startup, atau perusahaan teknologi, di mana suasana yang lebih santai dan tidak terlalu formal dihargai. 5. Seragam Jaket Biasa: Ideal untuk lingkungan kerja luar ruangan yang membutuhkan perlindungan dari cuaca, tetapi tidak seintens jaket bomber. Bisa juga digunakan dalam setting kasual di kantor yang memiliki suhu yang sejuk akibat penggunaan AC. 6. Seragam Kaos Raglan: Kaos dengan lengan yang sering berbeda warna dari bagian badan kaos. Kaos ini nyaman dan memberikan keleluasaan gerak yang baik, cocok untuk lingkungan kerja yang aktif atau untuk acara perusahaan yang lebih santai. 7. Seragam Kaos T-shirt: untuk industri yang tampak padat karya dan membutuhkan kenyamanan serta fleksibilitas. Cocok untuk pekerjaan dalam ruangan atau cuaca hangat, serta dalam event promosi atau sebagai seragam harian yang praktis dan nyaman. 8. Seragam Kaos Polo: Menawarkan tampilan yang lebih rapi dibandingkan kaos t-shirt biasa dan sering digunakan di lingkungan yang membutuhkan tampilan semi-formal seperti di perbankan, hotel, atau acara perusahaan. Juga populer di industri jasa dan ritel. 9. Seragam Kemeja Lengan Pendek: Sesuai untuk lingkungan kerja yang semi-formal dan cuaca panas. Sering digunakan di kantor atau oleh pekerja lapangan yang membutuhkan kesan rapi namun tetap ingin kenyamanan dalam cuaca yang lebih hangat. 10. Seragam Kemeja Lengan Panjang: Pilihan untuk lingkungan kerja formal. Memberikan tampilan yang profesional dan sering diwajibkan dalam setting bisnis tradisional, pertemuan penting, atau acara resmi perusahaan.'
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    res.json({ message: completion.choices[0].message.content });
});

router.post('/openai-buat-penawaran', async (req, res) => {
    const { seometadata, rekomendasiproduk } = req.body;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'Buatkan surat penawaran resmi dari Vido Garment Indonesia, sebuah perusahaan yang berpengalaman selama 14 tahun dalam pembuatan seragam, dengan ulasan positif dari lebih dari 1000 reviewer di Google. Surat ini ditujukan kepada' +
                    seometadata +
                    ' dengan tujuan mengajukan penawaran untuk pembuatan seragam yang telah disesuaikan berdasarkan profil usaha mereka, yakni sebagai berikut: ' +
                    rekomendasiproduk +
                    'Surat harus ditulis dalam bahasa Indonesia dengan gaya bahasa yang sangat ramah dan menarik. Sertakan penjelasan bahwa seragam yang direkomendasikan oleh Vido Garment adalah hasil pengamatan cermat terhadap profil usaha klien untuk memastikan seragam tersebut mendukung kebutuhan spesifik mereka. Alasan utama pembuatan seragam ini harus mencakup, tetapi tidak terbatas pada Peningkatan Citra Perusahaan, Pemersatu Karyawan, Promosi dan Branding, Keamanan dan Keselamatan, Identifikasi Mudah, Kenyamanan dan Fungsionalitas, Persyaratan Regulasi, Pengurangan Biaya untuk Karyawan. Akhir surat harus menawarkan untuk menjawab pertanyaan lebih lanjut atau mengatur pertemuan untuk mendiskusikan detail lebih lanjut. Berikan informasi kontak Vido Garment untuk menghubungi customer service di nomor 08123456789. Pastikan surat tersebut mencerminkan profesionalisme dan dedikasi Vido Garment dalam memberikan pelayanan terbaik kepada klien mereka.',
            },
        ],
        model: 'gpt-3.5-turbo',
    });

    res.json({ message: completion.choices[0].message.content });
});




router.post('/send-message', sendMessage);
router.post('/send-messages', sendMessages);

module.exports = router;
