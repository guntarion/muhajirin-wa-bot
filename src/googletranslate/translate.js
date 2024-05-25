// https://github.com/iamtraction/google-translate

const translate = require('./index.js');

translate('Kucing warna hitam sedang bermain bola bersama dua anjing', {from: 'id', to: 'en'}).then(result => {
    console.log(result.text); // Outputs: 'Hola mundo'
});