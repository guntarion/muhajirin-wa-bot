const db = require('../db/database');

function createCustomer(data, callback) {
    const { nama_lengkap, nama_panggilan, nama_whatsapp, institusi, gender, nomer_handphone, email, alamat, kategori, status, chat, history, info_lain } = data;
    const query = 'INSERT INTO customers (nama_lengkap, nama_panggilan, nama_whatsapp, institusi, gender, nomer_handphone, email, alamat, kategori, status, chat, history, info_lain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.run(query, [nama_lengkap, nama_panggilan, nama_whatsapp, institusi, gender, nomer_handphone, email, alamat, kategori, status, chat, history, info_lain], function(err) {
        callback(err, { id: this.lastID });
    });
}

function getCustomer(id, callback) {
    db.get('SELECT * FROM customers WHERE id = ?', [id], function(err, row) {
        callback(err, row);
    });
}

// Define updateCustomer and deleteCustomer functions with similar parameter handling

module.exports = {
    createCustomer,
    getCustomer,
    // export other functions similarly
};
