const nasehatList = [
    {
        advice: 'Keadilan harus diutamakan dalam semua urusan, dan jangan biarkan kebencian terhadap suatu kaum membuat kamu berlaku tidak adil.',
        reference:
            'Al-Ma\'idah (5:8): "Hai orang-orang yang beriman, hendaklah kamu menjadi penegak keadilan, menjadi saksi karena Allah, walaupun terhadap diri sendiri atau orang tua dan kerabatmu. Janganlah kebencian terhadap suatu kaum mendorong kamu untuk tidak berlaku adil. Berlaku adillah, karena adil itu lebih dekat kepada takwa, dan bertakwalah kepada Allah; sesungguhnya Allah Maha Mengetahui apa yang kamu kerjakan."',
    },
    {
        advice: 'Bersedekah dan membantu yang membutuhkan adalah tanda iman yang sejati dan membawa keberkahan.',
        reference:
            'Al-Baqarah (2:274): "Orang-orang yang menafkahkan hartanya di malam dan siang hari secara sembunyi dan terang-terangan, mereka mendapatkan pahala di sisi Tuhan mereka. Tidak ada kekhawatiran atas mereka dan tidak (pula) mereka bersedih hati."',
    },
    {
        advice: 'Memiliki kesadaran yang tinggi terhadap kehidupan setelah kematian mendorong perilaku yang bertanggung jawab.',
        reference:
            'Al-Hashr (59:18): "Hai orang-orang yang beriman, bertakwalah kepada Allah dan hendaklah setiap diri memperhatikan apa yang telah diperbuatnya untuk hari esok (akhirat), dan bertakwalah kepada Allah; sesungguhnya Allah Maha Mengetahui apa yang kamu kerjakan."',
    },
    {
        advice: 'Keteguhan dan ketabahan dalam menghadapi tantangan adalah kunci mencapai kesuksesan dan bantuan dari Allah.',
        reference:
            'Ali \'Imran (3:200): "Hai orang-orang yang beriman, bersabarlah dan kuatkanlah kesabaranmu dan tetaplah bersiap siaga (di perbatasan negerimu) dan bertakwalah kepada Allah, agar kamu beruntung."',
    },
    {
        advice: 'Keberhasilan sejati hanya dapat dicapai melalui iman, amal saleh, kebenaran, dan kesabaran.',
        reference:
            'Al-Asr (103:1-3): "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan amal saleh, dan nasehat-menasehati supaya mentaati kebenaran dan nasehat-menasehati supaya menetapi kesabaran."',
    },
    {
        advice: 'Sesungguhnya manusia itu setara dan ukuran kemuliaan seseorang dilihat dari takwanya.',
        reference:
            'Al-Hujurat (49:13) "Hai manusia, sesungguhnya Kami menciptakan kamu dari seorang laki-laki dan seorang perempuan dan menjadikan kamu berbangsa-bangsa dan bersuku-suku supaya kamu saling mengenal. Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah ialah orang yang paling takwa di antara kamu. Sesungguhnya Allah Maha Mengetahui lagi Maha Mengenal."',
    },
    {
        advice: 'Tanggung jawab pribadi dan keadilan Allah dalam membebani manusia sesuai dengan kemampuannya.',
        reference:
            'Al-Baqarah (2:286): "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Ia mendapat pahala (dari kebajikan) yang diusahakannya dan ia mendapat siksa (dari kejahatan) yang dikerjakannya..."',
    },
    {
        advice: 'Kewajiban mendirikan shalat, melakukan kebaikan, mencegah kemungkaran, dan bersabar dalam menghadapi cobaan adalah prinsip-prinsip penting dalam kehidupan.',
        reference:
            'Luqman (31:17): "Hai anakku, dirikanlah shalat, perintahkanlah yang ma\'ruf dan cegahlah dari yang munkar, dan bersabarlah terhadap apa yang menimpa kamu. Sesungguhnya yang demikian itu termasuk urusan yang penting."',
    },
    {
        advice: 'Berbuat baik kepada kedua orang tua, khususnya saat mereka berumur lanjut, adalah tuntunan yang mulia.',
        reference:
            'Al-Isra (17:23-24): "Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah kamu berbuat baik kepada kedua orang tua. Jika salah seorang di antara keduanya atau keduanya sampai berumur lanjut dalam pemeliharaanmu, maka sekali-kali janganlah kamu mengatakan kepada keduanya perkataan \'ah\' dan janganlah kamu membentak mereka dan ucapkanlah kepada mereka perkataan yang mulia."',
    },
    {
        advice: 'Kesabaran dan mempercayai rencana Allah adalah kunci menghadapi kesulitan dalam hidup.',
        reference:
            'Al-Baqarah (2:153): "Hai orang-orang yang beriman, mintalah pertolongan (kepada Allah) dengan sabar dan shalat. Sesungguhnya Allah beserta orang-orang yang sabar."',
    },
    {
        advice: 'Menjaga lisan dan memperbanyak ingatan kepada Allah adalah perlindungan dari perbuatan sia-sia.',
        reference:
            'Al-Mu\'minun (23:1-3): "Sesungguhnya beruntunglah orang-orang yang beriman, (yaitu) orang-orang yang khusyu\' dalam shalatnya, dan orang-orang yang menjauhi (perbuatan dan perkataan) yang tidak berguna."',
    },
    {
        advice: 'Mencari ilmu dan bertindak berdasarkan pengetahuan adalah fundamental dalam Islam.',
        reference:
            'Taha (20:114): "Maha Tinggi Allah, Raja Yang Sebenar-benar, dan janganlah kamu tergesa-gesa dengan Al-Quran sebelum sempurna wahyunya kepadamu, dan katakanlah, \'Ya Tuhanku, tambahkanlah kepadaku ilmu.\'"',
    },
    {
        advice: 'Ketulusan dalam ibadah dan menghindari perbuatan riya adalah esensi dari keimanan yang sejati.',
        reference:
            'Al-Baqarah (2:264): "Hai orang-orang yang beriman, janganlah kamu menghilangkan (pahala) sedekahmu dengan menyebut-nyebutnya dan menyakiti (perasaan penerima), seperti orang yang menafkahkan hartanya karena riya kepada manusia dan tidak beriman kepada Allah dan hari kemudian. Maka perumpamaannya adalah seperti batu licin yang di atasnya ada tanah, kemudian batu itu ditimpa hujan lebat, maka tinggallah ia menjadi licin. Mereka tidak menguasai sesuatu apa pun dari apa yang mereka usahakan. Dan Allah tidak memberi petunjuk kepada orang-orang kafir."',
    },
    {
        advice: 'Kemurahan hati dan kelembutan dalam pergaulan mendatangkan kecintaan dan keharmonisan.',
        reference:
            'Ali \'Imran (3:159): "Maka disebabkan rahmat dari Allah-lah kamu berlaku lemah lembut terhadap mereka. Dan sekiranya kamu bersikap kasar lagi keras hati, niscaya mereka menjauhkan diri dari sekelilingmu. Maka maafkanlah mereka dan mintalah ampun bagi mereka dan bermusyawarahlah dengan mereka dalam urusan itu. Kemudian apabila kamu telah membulatkan tekad, maka bertawakallah kepada Allah. Sesungguhnya Allah menyukai orang-orang yang bertawakal kepada-Nya."',
    },
    {
        advice: 'Keadilan sosial dan kepedulian terhadap kaum yang kurang mampu adalah tanggung jawab setiap individu.',
        reference:
            'Al-Ma\'un (107:1-3): "Tahukah kamu orang yang mendustakan agama? Itulah orang yang menghardik anak yatim dan tidak mendorong memberi makan orang miskin."',
    },
    {
        advice: 'Kesetiaan dan ketepatan dalam janji adalah ciri khas seorang mukmin.',
        reference:
            'Al-Isra (17:34): "Dan penuhilah janji, karena sesungguhnya janji itu akan dimintai pertanggungjawaban."',
    },
    {
        advice: 'Menghindari spekulasi dan gosip membantu dalam membangun komunitas yang kuat dan saling percaya.',
        reference:
            'Al-Hujurat (49:12): "Hai orang-orang yang beriman, jauhilah kebanyakan dari prasangka, sesungguhnya sebagian prasangka itu dosa. Dan janganlah kalian mencari-cari kesalahan orang lain dan janganlah sebagian kalian menggunjing sebagian yang lain. Apakah salah seorang di antara kalian suka memakan daging saudaranya yang sudah mati? Maka tentulah kamu merasa jijik kepadanya. Dan bertakwalah kepada Allah; sesungguhnya Allah adalah Penerima tobat, Maha Penyayang."',
    },
    {
        advice: 'Menjaga keadilan bahkan dalam situasi yang sulit adalah dasar moral yang tidak boleh terganggu.',
        reference:
            'An-Nisa (4:135): "Hai orang-orang yang beriman, jadilah kamu orang yang selalu menegakkan keadilan, menjadi saksi karena Allah, meskipun terhadap diri sendiri, atau orang tua dan kerabatmu. Jika dia kaya atau miskin, Allah lebih berhak atas keduanya. Maka janganlah kamu mengikuti hawa nafsu untuk menyimpang dari keadilan. Dan jika kamu memutar balikkan (kebenaran) atau menghindar dari memberi kesaksian, maka sesungguhnya Allah adalah Maha Mengetahui apa yang kamu lakukan."',
    },
    {
        advice: 'Kesediaan untuk memaafkan dan melupakan kesalahan orang lain membantu membangun masyarakat yang penuh cinta dan perdamaian.',
        reference:
            'An-Nur (24:22): "Dan janganlah orang-orang yang mempunyai kemuliaan dan kelapangan di antara kamu bersumpah tidak akan memberi (bantuan) kepada kerabatnya, orang-orang miskin, dan orang-orang yang berhijrah di jalan Allah. Hendaklah mereka memaafkan dan berlapang dada. Apakah kamu tidak ingin bahwa Allah mengampuni kamu? Dan Allah adalah Maha Pengampun, Maha Penyayang."',
    },
    {
        advice: 'Kejujuran dalam perdagangan dan transaksi adalah fundamental dari kehidupan sosial dan ekonomi yang adil.',
        reference:
            'Al-Mutaffifin (83:1-3): "Celakalah bagi orang-orang yang curang, (yaitu) orang-orang yang apabila menerima takaran dari orang lain, mereka minta dipenuhi, dan apabila mereka menakar atau menimbang untuk orang lain, mereka mengurangi."',
    },
    {
        advice: 'Memiliki sikap yang rendah hati dan menghindari keangkuhan adalah ciri dari orang yang benar-benar beriman.',
        reference:
            'Luqman (31:18): "Dan janganlah kamu memalingkan mukamu dari manusia (karena sombong) dan janganlah kamu berjalan di bumi dengan angkuh. Sesungguhnya Allah tidak menyukai setiap orang yang sombong dan membanggakan diri."',
    },
    {
        advice: 'Menghormati dan menjaga lingkungan alam adalah tanggung jawab yang diberikan Allah kepada manusia.',
        reference:
            'Al-A\'raf (7:31): "Hai anak Adam, pakailah pakaianmu yang indah di setiap (memasuki) masjid, dan makan dan minumlah, dan janganlah berlebih-lebihan. Sesungguhnya Dia tidak menyukai orang-orang yang berlebih-lebihan."',
    },
    {
        advice: 'Pentingnya persatuan dan kerjasama dalam komunitas untuk menghindari perpecahan dan konflik.',
        reference:
            'Al-Imran (3:103): "Dan berpeganglah kamu semuanya kepada tali (agama) Allah, dan janganlah kamu bercerai-berai dan ingatlah nikmat Allah kepadamu ketika kamu dulunya bermusuhan, lalu Dia mempersatukan hatimu, sehingga dengan nikmat-Nya kamu menjadi bersaudara, dan kamu telah berada di tepi jurang neraka, lalu Dia menyelamatkan kamu daripadanya. Demikianlah Allah menerangkan ayat-ayat-Nya kepadamu, agar kamu mendapat petunjuk."',
    },
    {
        advice: 'Menjauhi kebohongan dan sikap hipokrit adalah kunci integritas pribadi dan keharmonisan sosial.',
        reference:
            'At-Taubah (9:119): "Hai orang-orang yang beriman, bertakwalah kepada Allah dan hendaklah kamu bersama orang-orang yang benar."',
    },
    {
        advice: 'Pentingnya pengendalian diri dan menghindari amarah untuk menjaga ketenangan dan keadilan.',
        reference:
            'Al-Ma\'idah (5:2): "Dan janganlah sekali-kali kebencianmu terhadap suatu kaum karena mereka menghalangi kamu dari Masjidil Haram, mendorong kamu untuk berlaku aniaya (kepada mereka). Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan pelanggaran. Dan bertakwalah kepada Allah, sesungguhnya Allah sangat keras hukumannya."',
    },
    {
        advice: 'Kemurahan hati, terutama dalam memberi, adalah sifat yang sangat dianjurkan dan berbuah pahala.',
        reference:
            'Al-Baqarah (2:261): "Perumpamaan (nafkah yang dikeluarkan oleh) orang-orang yang menafkahkan hartanya di jalan Allah adalah serupa dengan sebutir benih yang menumbuhkan tujuh bulir, pada tiap-tiap bulir seratus biji. Allah melipatgandakan (ganjaran) bagi siapa yang Dia kehendaki. Dan Allah Maha Luas (karunia-Nya) lagi Maha Mengetahui."',
    },
    {
        advice: 'Kejujuran dalam semua urusan adalah dasar dari kepercayaan dan kestabilan dalam hubungan antarpersonal dan bisnis.',
        reference:
            'Al-Anfal (8:27): "Hai orang-orang yang beriman, janganlah kamu mengkhianati Allah dan Rasul dan (juga) janganlah kamu mengkhianati amanat-amanatmu, sedangkan kamu mengetahui."',
    },
    {
        advice: 'Memelihara ketenangan dan kesabaran saat dihadapkan pada cobaan adalah sifat yang mulia dan dicintai oleh Allah.',
        reference:
            'Al-Baqarah (2:153): "Hai orang-orang yang beriman, mintalah pertolongan (kepada Allah) dengan sabar dan shalat. Sesungguhnya Allah beserta orang-orang yang sabar."',
    },
    {
        advice: 'Menghindari fitnah dan tidak terlibat dalam menyebarkan informasi tanpa verifikasi adalah tanggung jawab moral setiap individu.',
        reference:
            'Al-Hujurat (49:6): "Hai orang-orang yang beriman, jika datang kepadamu orang fasik membawa suatu berita, maka periksalah dengan teliti, agar kamu tidak menimpakan musibah kepada suatu kaum tanpa mengetahui keadaannya yang menyebabkan kamu menyesal atas perbuatanmu itu."',
    },
    {
        advice: 'Mencari pengetahuan dan menjadi pribadi yang terus menerus belajar adalah jalan menuju kebijaksanaan dan peningkatan diri.',
        reference:
            'Al-Mujadila (58:11): "Hai orang-orang yang beriman, apabila dikatakan kepadamu, \'Berlapang-lapanglah dalam majelis\', maka lapangkanlah, niscaya Allah akan memberikan kelapangan untukmu. Dan apabila dikatakan, \'Bangkitlah\', maka bangkitlah, Allah akan meninggikan derajat orang-orang yang beriman di antara kamu dan orang-orang yang diberi ilmu beberapa derajat. Dan Allah Maha Mengetahui apa yang kamu kerjakan."',
    },
    {
        advice: 'Kesetiaan dan keadilan dalam semua perjanjian dan kesepakatan adalah dasar dari kepercayaan dan keadilan sosial.',
        reference:
            'Al-Ma\'idah (5:1): "Hai orang-orang yang beriman, penuhilah akad-akad itu. Dihalalkan bagimu binatang ternak, kecuali yang akan dibacakan kepadamu. Sesungguhnya Allah menghukum apa yang Dia kehendaki."',
    },
    {
        advice: 'Menjaga martabat dan menghindari menghina atau meremehkan orang lain adalah prinsip dasar kesopanan dan hormat.',
        reference:
            'Al-Hujurat (49:11): "Hai orang-orang yang beriman, janganlah suatu kaum menghina kaum lainnya, boleh jadi mereka lebih baik dari mereka. Dan jangan perempuan (sebagian) menghina perempuan lainnya, boleh jadi perempuan itu lebih baik dari perempuan lainnya. Dan janganlah kamu mencela dirimu sendiri dan janganlah kamu panggil memanggil dengan gelar-gelar yang buruk. Seburuk-buruk nama adalah (nama) kefasikan setelah iman. Dan barangsiapa yang tidak bertobat, maka mereka itulah orang-orang yang zalim."',
    },
    {
        advice: 'Memperhatikan dan membantu orang-orang yang membutuhkan, khususnya yatim piatu dan kaum miskin, adalah tugas keagamaan yang sangat dianjurkan.',
        reference:
            'Al-Baqarah (2:177): "Bukanlah menghadapkan wajahmu ke arah timur dan barat itu suatu kebajikan, tetapi sesungguhnya kebajikan itu adalah orang yang beriman kepada Allah, hari kemudian, malaikat-malaikat, kitab-kitab, dan nabi-nabi; dan memberikan hartanya pada cinta kepada kerabat, anak yatim, orang miskin, musafir, orang yang meminta-minta, dan untuk membebaskan budak; yang mendirikan shalat dan menunaikan zakat; dan orang-orang yang menepati janjinya apabila mereka berjanji; dan orang-orang yang sabar dalam kesempitan, penderitaan dan pada waktu peperangan. Mereka itulah orang-orang yang benar (iman nya); dan mereka itulah orang-orang yang bertakwa."',
    },
    {
        advice: 'Keharmonisan dan keadilan dalam kehidupan keluarga adalah fondasi untuk masyarakat yang stabil dan harmonis.',
        reference:
            'An-Nisa (4:1): "Hai manusia, bertakwalah kepada Tuhanmu yang telah menciptakan kamu dari jiwa yang satu dan dari jiwa itu Dia ciptakan pasangannya, dan dari keduanya Dia sebarkan banyak laki-laki dan perempuan. Dan bertakwalah kepada Allah, yang dengan (menyebut) nama-Nya kamu saling meminta satu sama lain, dan (peliharalah) hubungan silaturahmi. Sesungguhnya Allah selalu mengawasi kamu."',
    },
    {
        advice: 'Memelihara kejujuran dan transparansi dalam urusan keuangan adalah prinsip yang mencegah ketidakadilan dan korupsi.',
        reference:
            'Al-Baqarah (2:282): "Hai orang-orang yang beriman, apabila kamu bermuamalat tidak secara tunai untuk waktu yang ditentukan, hendaklah kamu menuliskannya. Dan hendaklah seorang penulis di antara kamu menulis dengan benar. Dan janganlah penulis enggan menulis sebagaimana Allah telah mengajarkan kepadanya, maka hendaklah ia menulis dan hendaklah orang yang berhutang itu mengarahkan (tangan penulis itu), dan hendaklah ia bertakwa kepada Allah, Tuhannya, dan janganlah ia mengurangi apa pun dari utangnya. Jika yang berhutang itu orang yang lemah akal atau lemah (keadaannya) atau dia sendiri tidak mampu mengarahkan (tangan penulis), maka hendaklah walinya mengarahkan dengan jujur. Dan persaksikanlah dengan dua orang saksi dari orang-orang lelaki (di antaramu). Jika tidak ada dua orang lelaki, maka (boleh) seorang lelaki dan dua orang perempuan dari saksi-saksi yang kamu ridhai, supaya jika seorang (dari keduanya) lupa, yang seorang lagi mengingatkannya."',
    },
];

module.exports = nasehatList;
