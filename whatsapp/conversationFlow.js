const conversationPricingKaos = {
    type: 'pricingKaos',
    steps: {
        askJenisKaos: {
            message:
                'Jenis kaos apa yang rencana Anda buat?\n(Silahkan merespon dg menulis angka 1 atau 2 atau 3)\n\n1 Kaos Oblong\n2 Kaos Kerah\n3 Kaos Raglan',
            nextStep: 'askJenisSablon',
        },
        askJenisSablon: {
            message:
                'Jenis Sablon apa yang Anda inginkan?\n\n 1.Sablon Plastisol\n2.Sablon Rubber\n3. Sablon Discharge\n4. Belum Tahu',
            nextStep: 'askTitikSablon',
        },
        askTitikSablon: {
            message: 'Berapa perkiraan jumlah lokasi/titik sablonnya?',
            nextStep: 'askQuantityPesan',
        },
        askQuantityPesan: {
            message: 'Berapa rencana jumlah pcs pembuatannya?',
            nextStep: null, // End of conversation
        },
    }
};

const conversationTestimoni = {
    type: 'testimoni',
    steps: {
        askAlasanMemilih: {
            message:
                'Apa yang membuat Anda memilih Vido?\n\n1. Atas rekomendasi teman/relasi\n2. Review yang banyak dan bagus\n3. Lokasi mudah ditemukan\n4. Mendapat masukan bermanfaat\n5. Mendapat rekomendasi bagus\n6. Banyak referensi pilihan\n7. Harganya kompetitif',
            nextStep: 'askYangBerkesanApa',
        },
        askYangBerkesanApa: {
            message:
                'Layanan mana yang berkesan atau positif bagi Anda?\n1. Lokasi cukup nyaman\n2. Pilihan desain/bahan/warna beragam\n3. Proses pra produksi efektif & positif\n4. Mendapatkan harga terbaik\n5. Hasil jahitan rapi/kuat\n6. Hasil sablonan/bordiran bagus\n7. Ketepatan waktu delivery\n8. Penanganan komplain baik',
            nextStep: 'askKesanTambahan',
        },
        askKesanTambahan: {
            message:
                'Komentar atau kesan Anda atas Vido Garment, atau lainnya yang belum tercakup di atas; termasuk bila Anda memiliki saran perbaikan?',
            nextStep: 'askMerekomendasikan',
        },
        askMerekomendasikan: {
            message:
                'Di antara 1-10, seberapa Anda ingin merekomendasikan Vido ke rekan/orang lain?',
            nextStep: null, // End of conversation
        },
    },
};



const conversationDaftarPanitiaSizeKaos = {
    type: 'daftarPanitiaUkuranKaos',
    steps: {
        askNamaLengkap: {
            message: '*Registrasi Kepanitiaan Idul Qurban*\n\nNama lengkap Anda?',
            nextStep: 'askPanggilan',
        },
        askPanggilan: {
            message: 'Nama panggilan Anda?',
            nextStep: 'askGender',
        },
        askGender: {
            message: 'Gender.\nPilih angka 1 atau 2:\n\n1 Laki-laki \n2 Perempuan',
            nextStep: 'askSize',
        },
        askSize: {
            message:
                'Ukuran Kaos Anda?\n\nS\nM\nL\nXL\n2XL\n3XL\n4XL',
            nextStep: 'askAlamat',
        },
        askAlamat: {
            message: 'Alamat tinggal Anda?',
            nextStep: 'askUsia',
        },
        askUsia: {
            message: 'Usia Anda?\n_(Silahkan tulis angka [tanpa tulisan tahun] - untuk kami gunakan dalam pertimbangan tugas di kepanitiaan)_',
            nextStep: 'askCatatan',
        },
        askCatatan: {
            message: 'Sampaikan informasi tambahan atau catatan khusus untuk kami.\n_Misal, bila Anda punya fobia pada darah atau daging mentah, atau lainnya yg membatasi Anda dalam tugas kepanitiaan._',
            nextStep: null, // End of conversation
        },
    },
};

function getNextStepMessage(conversation, step) {
    if (!conversation.steps[step]) {
        console.error('Invalid step:', step);
        return 'Error: Invalid conversation step. Please contact support.';
    }
    return conversation.steps[step].message;
}

module.exports = {
    getNextStepMessage,
    conversationPricingKaos,
    conversationTestimoni,
    conversationDaftarPanitiaSizeKaos,
};
