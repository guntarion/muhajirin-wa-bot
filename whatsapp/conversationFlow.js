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

const conversationDesainKaos = {
    type: 'desainKaos',
    steps: {
        askJenisKaos: {
            message:
                'Jenis kaos apa yang rencana Anda buat?\n(Silahkan merespon dg menulis angka 1 atau 2 atau 3)\n\n1 Kaos T-Shirt Biasa\n2 Kaos Berkerah (Polo)\n3 Kaos Raglan',
            nextStep: 'askWarnaKaos',
        },
        askWarnaKaos: {
            message:
                'Sebutkan warna bagian tubuhnya',
            nextStep: 'askWarnaLengan',
        },
        askWarnaLengan: {
            message:
                'Sebutkan warna bagian lengannya',
            nextStep: 'askDeskripsiSablon',
        },
        askDeskripsiSablon: {
            message: 'Deskripsikan gambar yang Anda inginkan tampak di kaosnya.',
            nextStep: null, // End of conversation
        },
    },
};

const conversationSizeFitting = {
    type: 'sizeFitting',
    steps: {
        askOrderPO: {
            message: 'Silahkan sebutkan kode order Anda',
            nextStep: 'askName',
        },
        askName: {
            message: 'Silahkan tuliskan nama Anda',
            nextStep: 'askSize',
        },
        askSize: {
            message: 'Silahkan infokan Size Anda\n\nS\nM\nL\nXL\nXXL\nXXXL',
            nextStep: 'askModSizeBadan',
        },
        askModSizeBadan: {
            message: 'Silahkan infokan jarak tambahan BADAN',
            nextStep: 'askModSizeLengan',
        },
        askModSizeLengan: {
            message: 'Silahkan infokan jarak tambahan LENGAN',
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
    conversationDesainKaos,
    conversationSizeFitting,
};
