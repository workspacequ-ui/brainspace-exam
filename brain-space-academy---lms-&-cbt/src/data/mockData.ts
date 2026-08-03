import {
  User,
  ClassItem,
  ExamCategory,
  LearningMaterial,
  Exam,
  MarketplaceProduct,
  MarketplaceCategory,
  ExamResult,
  FeaturedProgram
} from '../types';


export const INITIAL_MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: 'mcat1', name: 'Buku Cetak', description: 'Buku pelajaran fisik dan soal latihan' },
  { id: 'mcat2', name: 'Paket Tryout Premium', description: 'Paket tryout online bersistem IRT' },
  { id: 'mcat3', name: 'Akses Bimbel VIP', description: 'Bimbingan belajar live interaktif' },
  { id: 'mcat4', name: 'Merchandising', description: 'Atribut & pernak-pernik resmi Brain Space' }
];

export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'c1', name: 'XII-UTBK', code: 'XII-UTBK', description: 'Kelas Intensif Persiapan SNBT & UTBK' },
  { id: 'c2', name: 'XI-IPA', code: 'XI-IPA', description: 'Kelas MIPA Semester 1 & 2' },
  { id: 'c3', name: 'XI-IPS', code: 'XI-IPS', description: 'Kelas IPS Semester 1 & 2' },
  { id: 'c4', name: 'X-IPA', code: 'X-IPA', description: 'Kelas Sepuluh MIPA' },
  { id: 'c5', name: 'Masuk Labschool', code: 'LABSCHOOL', description: 'Program Khusus Seleksi Labschool' }
];

export const INITIAL_CATEGORIES: ExamCategory[] = [
  { id: 'cat1', name: 'SNBT 2026', description: 'Seleksi Nasional Berdasarkan Tes' },
  { id: 'cat2', name: 'TKA Saintek', description: 'Tes Kemampuan Akademik Saintek' },
  { id: 'cat3', name: 'Ujian Sekolah', description: 'Penilaian Akhir Semester & Ujian Sekolah' },
  { id: 'cat4', name: 'Masuk Labschool', description: 'Seleksi Penerimaan Siswa Baru Labschool' },
  { id: 'cat5', name: 'Tryout Premium', description: 'Paket Tryout Eksklusif Brain Space' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    nis: 'ADMIN001',
    name: 'Dr. Hendra Wijaya, M.Pd.',
    email: 'admin@brainspace.id',
    password: 'admin123',
    role: 'admin',
    className: 'SEMUA',
    status: 'ACTIVE',
    createdAt: '2026-01-10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  },
  {
    id: 'u-s1',
    nis: '20261001',
    name: 'Budi Santoso',
    email: 'budi@student.com',
    password: 'user123',
    role: 'student',
    className: 'XII-UTBK',
    status: 'ACTIVE',
    createdAt: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80'
  },
  {
    id: 'u-s2',
    nis: '20261002',
    name: 'Siti Rahmawati',
    email: 'siti@student.com',
    password: 'user123',
    role: 'student',
    className: 'XI-IPA',
    status: 'ACTIVE',
    createdAt: '2026-01-18',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
  },
  {
    id: 'u-p1',
    nis: '20261003',
    name: 'Rian Hidayat',
    email: 'rian@pending.com',
    password: 'user123',
    role: 'student',
    className: 'XII-UTBK',
    status: 'PENDING',
    createdAt: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
  },
  {
    id: 'u-p2',
    nis: '20261004',
    name: 'Anisa Putri',
    email: 'anisa@pending.com',
    password: 'user123',
    role: 'student',
    className: 'XI-IPS',
    status: 'PENDING',
    createdAt: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'
  }
];

export const INITIAL_MATERIALS: LearningMaterial[] = [
  {
    id: 'm1',
    title: 'Modul Ringkas Penalaran Matematika SNBT 2026',
    description: 'Panduan lengkap rumus cepat, trik eliminasi opsi, dan pembahasan soal HOTS Penalaran Matematika.',
    targetClass: 'XII-UTBK',
    mediaType: 'PDF',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-01-20'
  },
  {
    id: 'm2',
    title: 'Video Strategi Membedah Soal PPU & Literasi Bahasa Indonesia',
    description: 'Trik menemukan ide pokok paragraf dalam waktu 30 detik untuk ujian SNBT.',
    targetClass: 'XII-UTBK',
    mediaType: 'VIDEO',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    createdAt: '2026-01-22'
  },
  {
    id: 'm3',
    title: 'Slide Presentasi Fisika: Kinematika & Hukum Newton',
    description: 'Materi interaktif gerak lurus beraturan, gerak parabola, dan dinamika gerak.',
    targetClass: 'XI-IPA',
    mediaType: 'PPT',
    url: 'https://docs.google.com/gview?embedded=true&url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-01-25'
  },
  {
    id: 'm4',
    title: 'Ringkasan Materi Ekonomi & Akuntansi Dasar',
    description: 'Pembahasan siklus akuntansi perusahaan jasa dan perhitungan jurnal penyesuaian.',
    targetClass: 'XI-IPS',
    mediaType: 'PDF',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-01-28'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-pdf-1',
    title: 'Simulasi SNBT 2026 - Kemampuan Penalaran Umum (KPU)',
    category: 'SNBT 2026',
    targetClass: 'XII-UTBK',
    durationMinutes: 30,
    mode: 'EMBED_DRIVE_PDF',
    pdfDriveUrl: 'https://drive.google.com/file/d/1Bzx7tT3i82xR1y9O0-G6kQ1h7U63N_f2/preview',
    token: 'SNBT2026',
    isTokenPublic: true,
    shuffleQuestions: false,
    passingScore: 70,
    allowRetake: true,
    maxAttempts: 2,
    deadline: '2026-12-31 23:59',
    totalQuestions: 10,
    createdAt: '2026-01-20',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: `q-pdf-${i + 1}`,
      number: i + 1,
      text: `Nomor ${i + 1}: Silakan cermati lembar soal PDF di panel sebelah kiri untuk menjawab soal nomor ${i + 1}.`,
      questionType: 'SINGLE_CHOICE',
      options: [
        { key: 'A', text: 'Pilihan A' },
        { key: 'B', text: 'Pilihan B' },
        { key: 'C', text: 'Pilihan C' },
        { key: 'D', text: 'Pilihan D' },
        { key: 'E', text: 'Pilihan E' }
      ],
      correctAnswer: ['A', 'B', 'C', 'D', 'E'][i % 5],
      weight: 10,
      discussion: `Pembahasan Nomor ${i + 1}: Berdasarkan analisis data pada dokumen PDF halaman ${Math.floor(i / 3) + 1}, opsi yang paling tepat adalah kunci jawaban yang tertera.`
    }))
  },
  {
    id: 'exam-cbt-1',
    title: 'Tryout TKA Saintek - Matematika & Fisika Interaktif',
    category: 'TKA Saintek',
    targetClass: 'XII-UTBK',
    durationMinutes: 40,
    mode: 'NATIVE_CBT',
    token: 'TKASAIN',
    isTokenPublic: false, // Private token requirement
    shuffleQuestions: true,
    passingScore: 75,
    allowRetake: false,
    maxAttempts: 1,
    deadline: '2026-12-31 23:59',
    totalQuestions: 5,
    createdAt: '2026-01-25',
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Diketahui persamaan kuadrat x² - (k + 2)x + 16 = 0 memiliki dua akar real yang sama. Berapakah nilai positif dari k?',
        questionType: 'SINGLE_CHOICE',
        options: [
          { key: 'A', text: 'k = 4' },
          { key: 'B', text: 'k = 6' },
          { key: 'C', text: 'k = 8' },
          { key: 'D', text: 'k = 10' },
          { key: 'E', text: 'k = 12' }
        ],
        correctAnswer: 'B',
        weight: 20,
        discussion: 'Syarat akar sama adalah Diskriminan D = 0. b² - 4ac = 0 => (k+2)² - 4(1)(16) = 0 => (k+2)² = 64 => k + 2 = 8 => k = 6.'
      },
      {
        id: 'q2',
        number: 2,
        text: 'Manakah dari pernyataan berikut yang merupakan Sifat-Sifat Gelombang Elektromagnetik? (PILIH LEBIH DARI SATU JAWABAN)',
        questionType: 'COMPLEX_CHOICE',
        options: [
          { key: 'A', text: 'Merupakan gelombang transversal' },
          { key: 'B', text: 'Memerlukan medium materi untuk merambat' },
          { key: 'C', text: 'Dapat mengalami peristiwa polarisasi' },
          { key: 'D', text: 'Laju rambatnya di ruang hampa bernilai konstan (c = 3 x 10⁸ m/s)' },
          { key: 'E', text: 'Bermuatan listrik negatif saat melewati medan magnet' }
        ],
        correctAnswer: ['A', 'C', 'D'],
        weight: 20,
        discussion: 'Gelombang elektromagnetik adalah gelombang transversal yang tidak memerlukan medium dan dapat merambat di ruang hampa dengan kecepatan c serta dapat terpolarisasi.'
      },
      {
        id: 'q3',
        number: 3,
        text: 'Tentukan kebenaran dari pernyataan berikut: "Suatu benda yang bergerak melingkar beraturan mengalami percepatan sentripetal yang arahnya selalu menuju ke pusat lingkaran."',
        questionType: 'TRUE_FALSE',
        correctAnswer: 'TRUE',
        weight: 20,
        discussion: 'BENAR. Percepatan sentripetal senantiasa tegak lurus dengan arah kecepatan linier dan selalu mengarah ke titik pusat lintasan lingkaran.'
      },
      {
        id: 'q4',
        number: 4,
        text: 'Sebutkan organel sel tumbuhan yang berfungsi sebagai tempat terjadinya proses fotosintesis!',
        questionType: 'ESSAY',
        correctAnswer: 'Kloroplas',
        weight: 20,
        discussion: 'Fotosintesis terjadi di organel Kloroplas yang mengandung pigmen klorofil untuk menangkap energi cahaya matahari.'
      },
      {
        id: 'q5',
        number: 5,
        text: 'Sebuah mobil bermassa 1000 kg bergerak dengan kecepatan 20 m/s. Hitunglah energi kinetik mobil tersebut!',
        questionType: 'SINGLE_CHOICE',
        options: [
          { key: 'A', text: '100 kJ' },
          { key: 'B', text: '150 kJ' },
          { key: 'C', text: '200 kJ' },
          { key: 'D', text: '250 kJ' },
          { key: 'E', text: '400 kJ' }
        ],
        correctAnswer: 'C',
        weight: 20,
        discussion: 'Ek = 1/2 * m * v² = 1/2 * 1000 * (20)² = 500 * 400 = 200.000 Joule = 200 kJ.'
      }
    ]
  }
];

export const INITIAL_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    name: 'Buku Super Master SNBT 2026 + Akses Bank Soal 10.000+',
    category: 'Buku Cetak',
    price: 149000,
    description: 'Buku cetak fisik eksklusif terbitan Brain Space Academy berisi strategi lolos PTN, bedah pola soal 5 tahun terakhir, dan barcode QR latihan interaktif.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    externalLink: 'https://shopee.co.id',
    status: 'ACTIVE',
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-2',
    name: 'Paket Bundling Tryout Premium 15x Simulasi SNBT Realistic',
    category: 'Paket Tryout Premium',
    price: 99000,
    description: 'Akses 15 kali Tryout Online dengan sistem IRT (Item Response Theory), pemeringkatan nasional, dan analisis kelemahan per subtes.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
    externalLink: 'https://tokopedia.com',
    status: 'ACTIVE',
    createdAt: '2026-01-12'
  },
  {
    id: 'prod-3',
    name: 'Bimbel Online Intensive VIP Brain Space (1 Bulan)',
    category: 'Akses Bimbel VIP',
    price: 350000,
    description: 'Program bimbingan belajar live via Zoom 4x seminggu bersama Master Teacher, konsultasi jurusan 1-on-1, dan akses rekam kelas.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
    externalLink: 'https://wa.me/6281234567890?text=Halo%20Brain%20Space%20Academy,%20saya%20ingin%20mendaftar%20Bimbel%20VIP',
    status: 'ACTIVE',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-4',
    name: 'Jaket & Merchandise Official Brain Space Academy',
    category: 'Merchandising',
    price: 185000,
    description: 'Jaket Hoodie kualitas premium katun fleece hangat, bordir logo presisi, bonus stiker dan gantungan kunci Brain Space.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    externalLink: 'https://shopee.co.id',
    status: 'ACTIVE',
    createdAt: '2026-01-18'
  }
];

export const INITIAL_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    examId: 'exam-pdf-1',
    examTitle: 'Simulasi SNBT 2026 - Kemampuan Penalaran Umum (KPU)',
    examCategory: 'SNBT 2026',
    studentId: 'u-s1',
    studentNis: '20261001',
    studentName: 'Budi Santoso',
    studentClass: 'XII-UTBK',
    answers: {
      'q-pdf-1': { questionId: 'q-pdf-1', answer: 'A' },
      'q-pdf-2': { questionId: 'q-pdf-2', answer: 'B' },
      'q-pdf-3': { questionId: 'q-pdf-3', answer: 'C' },
      'q-pdf-4': { questionId: 'q-pdf-4', answer: 'D' },
      'q-pdf-5': { questionId: 'q-pdf-5', answer: 'E' },
      'q-pdf-6': { questionId: 'q-pdf-6', answer: 'A' },
      'q-pdf-7': { questionId: 'q-pdf-7', answer: 'B' },
      'q-pdf-8': { questionId: 'q-pdf-8', answer: 'C' }
    },
    correctCount: 8,
    incorrectCount: 0,
    unansweredCount: 2,
    score: 80,
    maxScore: 100,
    percentage: 80,
    isPassed: true,
    submittedAt: '2026-01-28 14:30',
    durationSpentSeconds: 1420
  },
  {
    id: 'res-2',
    examId: 'exam-pdf-1',
    examTitle: 'Simulasi SNBT 2026 - Kemampuan Penalaran Umum (KPU)',
    examCategory: 'SNBT 2026',
    studentId: 'u-s2',
    studentNis: '20261002',
    studentName: 'Siti Rahmawati',
    studentClass: 'XI-IPA',
    answers: {
      'q-pdf-1': { questionId: 'q-pdf-1', answer: 'A' },
      'q-pdf-2': { questionId: 'q-pdf-2', answer: 'B' },
      'q-pdf-3': { questionId: 'q-pdf-3', answer: 'A' },
      'q-pdf-4': { questionId: 'q-pdf-4', answer: 'C' },
      'q-pdf-5': { questionId: 'q-pdf-5', answer: 'E' },
      'q-pdf-6': { questionId: 'q-pdf-6', answer: 'A' }
    },
    correctCount: 4,
    incorrectCount: 2,
    unansweredCount: 4,
    score: 40,
    maxScore: 100,
    percentage: 40,
    isPassed: false,
    submittedAt: '2026-01-29 09:15',
    durationSpentSeconds: 1680
  }
];

export const INITIAL_FEATURED_PROGRAMS: FeaturedProgram[] = [
  {
    id: 'prog-1',
    title: 'Lolos PTN Impian',
    category: 'Persiapan UTBK - SNBT & Mandiri PTN',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    shortDesc: 'Program akselerasi intensif tembus PTN Favorit (UI, ITB, UGM, ITS, Unpad) dengan analisis rasionalisasi nilai SNBT & tryout berkala IRT.',
    articleContent: `### Program Akselerasi Lolos PTN Impian 2026

Selamat datang di **Program Lolos PTN Impian Brain Space Academy**! Program ini dirancang khusus untuk siswa SMA/K kelas 12 dan alumni (gap year) yang memiliki target lulus di Perguruan Tinggi Negeri papan atas di Indonesia.

#### Keunggulan Utama Program:
1. **Tryout CBT Sistem IRT Presisi High-Accuracy**: Pemeringkatan nasional menggunakan algoritma Item Response Theory (IRT) persis standar SNPMB.
2. **Bedah Soal HOTS & Triks Cepat Penalaran**: Pengajaran konsep dasar matematika penalaran, literasi bahasa, serta penalaran umum tanpa hafalan rumit.
3. **Konsultasi & Rasionalisasi Jurusan**: Didampingi mentor akademik berpengalaman untuk analisis peluang kelulusan berdasarkan statistik historis kampus.
4. **Modul Digital & Akses Rekaman Video**: Materi dapat diakses 24/7 kapan pun dan di mana pun melalui portal platform siswa.

#### Fasilitas Tambahan:
- Grup diskusi WhatsApp bersama Tutor Master 24 Jam.
- Bank soal prediksi SNBT terbaru tahun 2026.
- Garansi pendampingan hingga Ujian Mandiri PTN.`,
    registerUrl: 'https://wa.me/6281234567890?text=Halo%20Admin%20Brain%20Space,%20saya%20tertarik%20mendaftar%20Program%20Lolos%20PTN%20Impian',
    badge: 'PROGRAM UNGGULAN',
    isPublished: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'prog-2',
    title: 'Raih Nilai TKA Terbaik',
    category: 'Tes Kemampuan Akademik Saintek & Soshum',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    shortDesc: 'Pendalaman materi komprehensif Matematika, Fisika, Kimia, Biologi, Ekonomi, Geografi, dan Sosiologi untuk meraih nilai akademik tertinggi.',
    articleContent: `### Program Kuasai TKA (Tes Kemampuan Akademik) Terbaik

Program **Raih Nilai TKA Terbaik** disiapkan untuk mempertajam pemahaman konseptual dan tingkat literasi sains/sosial siswa dalam menghadapi TKA Sekolah, Seleksi Mandiri PTN, dan Olimpiade Akademik.

#### Kurikulum & Pembelajaran:
- **Peta Konsep Konseptual**: Memahami konsep dasar hingga deep problem solving.
- **Pembahasan Latihan Soal Variatif**: Tingkat kesulitan dari easy, medium, hingga HOTS (Higher Order Thinking Skills).
- **Simulasi Nilai Ujian Berkala**: Evaluasi perkembangan belajar setiap pekan dengan grafik perkembangan siswa.

#### Cocok Untuk:
- Siswa Kelas 10, 11, dan 12 SMA/MA MIPA & IPS.
- Persiapan Olimpiade Sains & Seleksi Mandiri Kampus Negeri.`,
    registerUrl: 'https://forms.google.com',
    badge: 'TERFAVORIT',
    isPublished: true,
    createdAt: '2026-01-12'
  },
  {
    id: 'prog-3',
    title: 'Masuk Sekolah Impian',
    category: 'Seleksi SMA Favorit & Labschool 2026',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    shortDesc: 'Bimbingan khusus lulus seleksi pendaftaran Labschool, SMA Taruna Nusantara, SMA Pradita Dirgantara, dan SMA Negeri Unggulan.',
    articleContent: `### Bimbingan Seleksi Masuk Sekolah Impian (Labschool & SMA Unggulan)

Raih impian menembus jenjang sekolah menengah atas terbaik dan favorit di Indonesia bersama **Brain Space Academy**.

#### Cakupan Materi Seleksi:
1. **Tes Potensi Akademik (TPA) & Kemampuan Skolastik**.
2. **Tes Bahasa Inggris & Literasi Bahasa Indonesia**.
3. **Tes Matematika & Penalaran Logika**.
4. **Latihan Wawancara & Psikotes Dasar**.

#### Layanan Spesial:
- Modul eksklusif kumpulan soal seleksi Labschool & SMA Unggulan 5 tahun terakhir.
- Simulasi ujian CBT bertimer persis kondisi ujian asli.`,
    registerUrl: 'https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20daftar%20Program%20Masuk%20Sekolah%20Impian',
    badge: 'POPULER',
    isPublished: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'prog-4',
    title: 'Lolos CPNS & Kedinasan',
    category: 'Persiapan SKD, STIS, IPDN, PKN STAN & CPNS',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    shortDesc: 'Strategi pemantapan SKD (TWK, TIU, TKP) berstandar BKN dengan sistem CAT realistis, passing grade otomatis, dan pembahasan lengkap.',
    articleContent: `### Program Bimbingan Lolos Seleksi CPNS & Sekolah Kedinasan 2026

Persiapkan diri Anda menghadapi persaingan seleksi Calon Pegawai Negeri Sipil (CPNS) serta Sekolah Kedinasan (PKN STAN, IPDN, STIS, Poltekip/Poltekim) secara matang.

#### Program Belajar SKD Lengkap:
- **Tes Wawasan Kebangsaan (TWK)**: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, dan Nasionalisme.
- **Tes Intelegensi Umum (TIU)**: Kemampuan Verbal, Numerik, Silogisme, Analitis, dan Figural dengan metode fast calculation.
- **Tes Karakteristik Pribadi (TKP)**: Strategi analisis poin tertinggi (skor 5) pada setiap opsi jawaban.

#### Fitur & Fasilitas:
- **Simulasi CAT BKN Realistis**: Sistem timer otomatis, pembobotan nilai akurat, dan laporan perangkingan nasional.
- **E-Book & Pembahasan Video HD**: Penjelasan mendalam dari Coach & Asesor tersertifikasi.`,
    registerUrl: 'https://forms.google.com',
    badge: 'INTENSIF',
    isPublished: true,
    createdAt: '2026-01-18'
  }
];

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Sesuaikan path relative ke file supabase.ts

export const DataComponent = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nama_tabel') // Ganti dengan nama tabel di Supabase Anda
      .select('*');

    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : items.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  );
};


import { supabase } from '../lib/supabase';

// --- TAMBAH DATA (INSERT) ---
export const addData = async (newItem: { title: string; description: string }) => {
  const { data, error } = await supabase
    .from('nama_tabel')
    .insert([newItem])
    .select(); // Mengembalikan data yang baru ditambahkan

  if (error) {
    console.error('Error adding data:', error.message);
    return null;
  }
  return data;
};

// --- EDIT DATA (UPDATE) ---
export const updateData = async (id: string | number, updatedFields: Partial<{ title: string; description: string }>) => {
  const { data, error } = await supabase
    .from('nama_tabel')
    .update(updatedFields)
    .eq('id', id) // Memilih baris berdasarkan ID
    .select();

  if (error) {
    console.error('Error updating data:', error.message);
    return null;
  }
  return data;
};

// --- HAPUS DATA (DELETE) ---
export const deleteData = async (id: string | number) => {
  const { error } = await supabase
    .from('nama_tabel')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting data:', error.message);
    return false;
  }
  return true;
};
