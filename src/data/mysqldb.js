const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql
    .createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    })
    .promise();

async function saveContactPersonal(data) {
    const sqlInsert = `
        INSERT INTO contact_personal (userId, number, name, profilePicUrl, isBusiness, isMyContact)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            number = VALUES(number), 
            name = VALUES(name),
            profilePicUrl = VALUES(profilePicUrl),
            isBusiness = VALUES(isBusiness),
            isMyContact = VALUES(isMyContact)
    `;

    try {
        await pool.query(sqlInsert, [
            data.userId,
            data.number,
            data.name,
            data.profilePicUrl || 'No profile picture',
            data.isBusiness,
            data.isMyContact,
        ]);
    } catch (error) {
        console.error('Error saving contact personal:', error);
        throw error;
    }
}

async function saveContact(data) {
    const {
        dateTime,
        updatedTime,
        contactNumber,
        contactPlatform,
        contactPublishedName,
        contactSavedName,
    } = data;

    const sanitizedContactSavedName = contactSavedName || ''; // Replace null with an empty string

    const sqlCheck = 'SELECT id FROM contact WHERE contactNumber = ?';
    const sqlInsert = `
        INSERT INTO contact (dateTime, updatedTime, contactNumber, contactPlatform, contactPublishedName, contactSavedName)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const sqlUpdate = `
        UPDATE contact SET updatedTime = ?, contactPlatform = ?, contactPublishedName = ?, contactSavedName = ?
        WHERE contactNumber = ?
    `;

    try {
        const [rows] = await pool.query(sqlCheck, [contactNumber]);
        if (rows.length === 0) {
            // Insert a new contact
            const [insertResult] = await pool.query(sqlInsert, [
                dateTime,
                updatedTime,
                contactNumber,
                contactPlatform,
                contactPublishedName,
                sanitizedContactSavedName,
            ]);
            return insertResult.insertId;
        } else {
            // Update the existing contact
            // eslint-disable-next-line no-unused-vars
            const [updateResult] = await pool.query(sqlUpdate, [
                updatedTime,
                contactPlatform,
                contactPublishedName,
                sanitizedContactSavedName,
                contactNumber,
            ]);
            return rows[0].id;
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        throw error;
    }
}

async function saveRegistration(contactId, data) {
    const sql = `
        INSERT INTO panitia_registrations (contactId, namaLengkap, dateTime, panggilan, gender, size, alamat, usia, catatan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        contactId,
        data.namaLengkap,
        data.dateTime,
        data.panggilan,
        data.gender,
        data.size,
        data.alamat,
        data.usia,
        data.catatan,
    ];

    try {
        const [result] = await pool.query(sql, values);
        return result;
    } catch (error) {
        console.error('Error saving registration:', error);
        throw error;
    }
}

async function saveMessage(data) {
    const { dateTime, msgTimestamp, msgFrom, msgTo, msgBody, contactId } = data;
    await pool.query(
        `INSERT INTO chat_personal (dateTime, msgTimestamp, msgFrom, msgTo, msgBody, contactId)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [dateTime, msgTimestamp, msgFrom, msgTo, msgBody, contactId]
    );
}

module.exports = {
    saveContactPersonal, 
    saveContact,
    saveRegistration,
    saveMessage,
};
