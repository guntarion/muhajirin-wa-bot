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

async function saveContact(data) {
    const {
        dateTime,
        updatedTime,
        contactNumber,
        contactPlatform,
        contactPublishedName,
        contactSavedName,
    } = data;
    const sqlCheck = `SELECT id FROM contact WHERE contactNumber = ?`;
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
            await pool.query(sqlInsert, [
                dateTime,
                updatedTime,
                contactNumber,
                contactPlatform,
                contactPublishedName,
                contactSavedName,
            ]);
        } else {
            await pool.query(sqlUpdate, [
                updatedTime,
                contactPlatform,
                contactPublishedName,
                contactSavedName,
                contactNumber,
            ]);
        }
        const [contactRows] = await pool.query(sqlCheck, [contactNumber]);
        return contactRows[0].id;
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


module.exports = { saveContact, saveRegistration, saveMessage };
