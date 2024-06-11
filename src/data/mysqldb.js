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

// async function saveContactPersonal(data) {
//     const sqlInsert = `
//         INSERT INTO contact_personal (userId, number, name, profilePicUrl, isBusiness, isMyContact)
//         VALUES (?, ?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE 
//             number = VALUES(number), 
//             name = VALUES(name),
//             profilePicUrl = VALUES(profilePicUrl),
//             isBusiness = VALUES(isBusiness),
//             isMyContact = VALUES(isMyContact)
//     `;

//     try {
//         await pool.query(sqlInsert, [
//             data.userId,
//             data.number,
//             data.name,
//             data.profilePicUrl || 'No profile picture',
//             data.isBusiness,
//             data.isMyContact,
//         ]);
//     } catch (error) {
//         console.error('Error saving contact personal:', error);
//         throw error;
//     }
// }

async function contactExists(contactId) {
    const sqlCheck = 'SELECT 1 FROM contact_personal WHERE contactId = ? LIMIT 1';
    const [rows] = await pool.query(sqlCheck, [contactId]);
    return rows.length > 0;
}

async function saveContactPersonal(data) {
    const sqlInsert = `
        INSERT INTO contact_personal (
            contactId, 
            contactNumber, 
            contactPlatform, 
            contactStoredName, 
            contactPicUrl, 
            contactPublishedName, 
            contactSavedName, 
            isBusiness, 
            isMyContact, 
            type_1, 
            type_2, 
            type_3
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            contactNumber = VALUES(contactNumber), 
            contactPlatform = VALUES(contactPlatform),
            contactStoredName = VALUES(contactStoredName),
            contactPicUrl = VALUES(contactPicUrl),
            contactPublishedName = VALUES(contactPublishedName),
            contactSavedName = VALUES(contactSavedName),
            isBusiness = VALUES(isBusiness),
            isMyContact = VALUES(isMyContact),
            type_1 = VALUES(type_1),
            type_2 = VALUES(type_2),
            type_3 = VALUES(type_3)
    `;

    try {
        await pool.query(sqlInsert, [
            data.contactId,
            data.contactNumber,
            data.contactPlatform,
            data.contactStoredName || 'Unknown',
            data.contactPicUrl,
            data.contactPublishedName,
            data.contactSavedName,
            data.isBusiness,
            data.isMyContact,
            data.type_1,
            data.type_2,
            data.type_3,
        ]);
    } catch (error) {
        console.error('Error saving contact personal:', error);
        throw error;
    }
}

async function updateContactFromCSV(data) {
    const sqlInsert = `
        INSERT INTO contact_personal (
            contactId,
            contactNumber,
            contactPlatform,
            contactSebutan,
            contactStoredName,
            contactPicUrl,
            contactPublishedName,
            contactSavedName,
            isBusiness,
            isMyContact,
            type_1,
            type_2,
            type_3,
            contactAddress,
            contactRW,
            contactRT,
            note_1,
            note_2,
            contactGender
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            type_1 = VALUES(type_1),
            type_2 = VALUES(type_2),
            note_1 = VALUES(note_1),
            note_2 = VALUES(note_2)
    `;

    try {
        await pool.query(sqlInsert, [
            data.contactId,
            data.contactNumber,
            data.contactPlatform,
            data.contactSebutan,
            data.contactStoredName || 'Unknown',
            data.contactPicUrl,
            data.contactPublishedName,
            data.contactSavedName,
            data.isBusiness,
            data.isMyContact,
            data.type_1,
            data.type_2,
            data.type_3,
            data.contactAddress,
            data.contactRW,
            data.contactRT,
            data.note_1,
            data.note_2,
            data.contactGender,
        ]);
    } catch (error) {
        console.error('Error updating contact personal:', error);
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

    const sanitizedContactPublishedName = contactPublishedName || ''; // Replace null with an empty string
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
                sanitizedContactPublishedName,
                sanitizedContactSavedName,
            ]);
            return insertResult.insertId;
        } else {
            // Update the existing contact
            // eslint-disable-next-line no-unused-vars
            const [updateResult] = await pool.query(sqlUpdate, [
                updatedTime,
                contactPlatform,
                sanitizedContactPublishedName,
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

async function getAllContactsPersonal() {
    const sql = 'SELECT * FROM contact_personal';
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error('Error fetching contact personal:', error);
        throw error;
    }
}


// async function fetchGroupBroadcast() {
//     const sql =
//         'SELECT groupId, groupName, groupDescription FROM group_broadcast';
//     try {
//         const [rows] = await pool.query(sql);
//         return rows;
//     } catch (error) {
//         console.error('Error fetching groups:', error);
//         throw error;
//     }
// }

// async function fetchGroupBroadcast(groupId = null) {
//     let sql =
//         'SELECT groupId, groupName, groupDescription FROM group_broadcast';
//     const params = [];
//     if (groupId) {
//         sql += ' WHERE groupId = ?';
//         params.push(groupId);
//     }
//     try {
//         const [rows] = await pool.query(sql, params);
//         return groupId ? rows[0] : rows;
//     } catch (error) {
//         console.error('Error fetching groups:', error);
//         throw error;
//     }
// }

// Save Group
async function saveGroupBroadcast(groupName, groupDescription) {
    const sqlInsert =
        'INSERT INTO group_broadcast (groupName, groupDescription) VALUES (?, ?)';
    try {
        const [result] = await pool.query(sqlInsert, [groupName, groupDescription]);
        return result.insertId;
    } catch (error) {
        console.error('Error saving group:', error);
        throw error;
    }
}

// Save Group Members
async function saveGroupBroadcastMember(groupId, contactId) {
    const sqlInsert =
        'INSERT INTO group_broadcast_members (groupId, contactId) VALUES (?, ?)';
    try {
        await pool.query(sqlInsert, [groupId, contactId]);
    } catch (error) {
        console.error('Error saving group member:', error);
        throw error;
    }
}

async function fetchGroupBroadcast() {
    const sql =
        'SELECT groupId, groupName, groupDescription FROM group_broadcast';
    try {
        const [rows] = await pool.query(sql);
        // console.log('Fetched groups:', rows); 
        return rows;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
}

async function fetchGroupBroadcastMembers(groupId) {
    const sql = `
        SELECT gm.groupId, c.contactId, c.contactNumber, c.contactStoredName 
        FROM group_broadcast_members gm
        JOIN contact_personal c ON gm.contactId = c.contactId
        WHERE gm.groupId = ?
    `;
    try {
        const [rows] = await pool.query(sql, [groupId]);
        return rows;
    } catch (error) {
        console.error('Error fetching group members:', error);
        throw error;
    }
}

// Fetch Group Members' Phone Numbers
async function fetchGroupMembersPhoneNumbers(groupId) {
    const sql = `
        SELECT c.contactNumber 
        FROM group_broadcast_members gm
        JOIN contact_personal c ON gm.contactId = c.contactId
        WHERE gm.groupId = ?
    `;
    try {
        const [rows] = await pool.query(sql, [groupId]);
        return rows.map(row => row.contactNumber);
    } catch (error) {
        console.error('Error fetching group members phone numbers:', error);
        throw error;
    }
}

// Function to fetch group members details
async function fetchGroupMembersDetails(groupId) {
    const sql = `
        SELECT c.contactNumber, c.contactStoredName, c.contactSebutan, c.isBusiness, c.isMyContact,
               c.type_1, c.type_2, c.type_3, c.contactAddress, c.contactRW, c.contactRT,
               c.note_1, c.note_2, c.contactGender
        FROM group_broadcast_members gm
        JOIN contact_personal c ON gm.contactId = c.contactId
        WHERE gm.groupId = ?
    `;
    try {
        const [rows] = await pool.query(sql, [groupId]);
        return rows;
    } catch (error) {
        console.error('Error fetching group members details:', error);
        throw error;
    }
}



async function deleteGroupBroadcastMember(groupId, contactId) {
    const sqlDelete =
        'DELETE FROM group_broadcast_members WHERE groupId = ? AND contactId = ?';
    try {
        // console.log(`Executing SQL: ${sqlDelete} with params [${groupId}, ${contactId}]`);
        await pool.query(sqlDelete, [groupId, contactId]);
    } catch (error) {
        console.error('Error deleting group member:', error);
        throw error;
    }
}

async function deleteGroup(groupId) {
    const sqlDeleteMembers =
        'DELETE FROM group_broadcast_members WHERE groupId = ?';
    const sqlDeleteGroup = 'DELETE FROM group_broadcast WHERE groupId = ?';
    try {
        console.log(`Executing SQL: ${sqlDeleteMembers} with param [${groupId}]`);
        await pool.query(sqlDeleteMembers, [groupId]);
        console.log(`Executing SQL: ${sqlDeleteGroup} with param [${groupId}]`);
        await pool.query(sqlDeleteGroup, [groupId]);
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}

async function getGroupById(groupId) {
    const sql = 'SELECT groupName FROM group_broadcast WHERE groupId = ?';
    try {
        const [rows] = await pool.query(sql, [groupId]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching group by id:', error);
        throw error;
    }
}

// Function to store the broadcast log
async function storeBroadcastLog({ dateTime, broadcastNama, contactNumber, contactStoredName }) {
    const sqlInsert = `
        INSERT INTO broadcast_message_logs (dateTime, broadcastNama, contactNumber, contactStoredName)
        VALUES (?, ?, ?, ?)
    `;
    try {
        await pool.query(sqlInsert, [dateTime, broadcastNama, contactNumber, contactStoredName]);
    } catch (error) {
        console.error('Error storing broadcast log:', error);
        throw error;
    }
}

const storeProgress = async (broadcastNama, progress) => {
    const sql = `
        INSERT INTO broadcast_progress (broadcastNama, current, total, contactStoredName, contactNumber)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            current = VALUES(current),
            total = VALUES(total),
            contactStoredName = VALUES(contactStoredName),
            contactNumber = VALUES(contactNumber)
    `;
    try {
        await pool.query(sql, [
            broadcastNama,
            progress.current,
            progress.total,
            progress.contactStoredName,
            progress.contactNumber,
        ]);
    } catch (error) {
        console.error('Error storing progress:', error);
        throw error;
    }
};

const getProgress = async (broadcastNama) => {
    const sql = `
        SELECT current, total, contactStoredName, contactNumber
        FROM broadcast_progress
        WHERE broadcastNama = ?
    `;
    try {
        const [rows] = await pool.query(sql, [broadcastNama]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching progress:', error);
        throw error;
    }
};

async function insertTemplateMessage(data) {
    const sqlInsert = `
        INSERT INTO template_message (templateName, templateNote, contentType, categoryEvent, categorySegment, templateContent)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
        await pool.query(sqlInsert, [
            data.templateName,
            data.templateNote,
            data.contentType,
            data.categoryEvent,
            data.categorySegment,
            data.templateContent,
        ]);
    } catch (error) {
        console.error('Error inserting template message:', error);
        throw error;
    }
}

async function updateTemplate(templateName, data) {
    const sqlUpdate = `
        UPDATE template_message
        SET templateNote = ?, contentType = ?, categoryEvent = ?, categorySegment = ?, templateContent = ?
        WHERE templateName = ?
    `;
    try {
        await pool.query(sqlUpdate, [
            data.templateNote,
            data.contentType,
            data.categoryEvent,
            data.categorySegment,
            data.templateContent,
            templateName,
        ]);
    } catch (error) {
        console.error('Error updating template:', error);
        throw error;
    }
}

async function deleteTemplate(templateName) {
    const sqlDelete = 'DELETE FROM template_message WHERE templateName = ?';
    try {
        await pool.query(sqlDelete, [templateName]);
    } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
    }
}


async function getTemplateByName(templateName) {
    const sql = 'SELECT * FROM template_message WHERE templateName = ?';
    try {
        const [rows] = await pool.query(sql, [templateName]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching template by name:', error);
        throw error;
    }
}

async function fetchAllTemplates() {
    const sql = 'SELECT templateName FROM template_message';
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error('Error fetching all templates:', error);
        throw error;
    }
}

module.exports = {
    contactExists,
    saveContactPersonal,
    updateContactFromCSV,
    saveContact,
    saveRegistration,
    saveMessage,
    getAllContactsPersonal,
    saveGroupBroadcast,
    saveGroupBroadcastMember,
    deleteGroupBroadcastMember,
    fetchGroupBroadcast,
    fetchGroupBroadcastMembers,
    fetchGroupMembersPhoneNumbers,
    fetchGroupMembersDetails,
    deleteGroup,
    getGroupById,
    storeBroadcastLog,
    storeProgress,
    getProgress,
    insertTemplateMessage,
    updateTemplate,
    deleteTemplate,
    getTemplateByName,
    fetchAllTemplates,
};
