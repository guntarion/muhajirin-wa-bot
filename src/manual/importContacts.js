const fs = require('fs');
const csv = require('csv-parser');

const {
    updateContactFromCSV,
} = require('../data/mysqldb');



fs.createReadStream('./src/manual/ListPanitia.csv')
    .pipe(csv())
    .on('data', async (row) => {
        try {
            await updateContactFromCSV(row);
        } catch (error) {
            console.error('Error saving contact personal:', error);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });