import React, { useState } from 'react';
import { Exam, ClassItem, ExamCategory, ExamMode, Question, QuestionType, User } from '../../types';
import { CbtRichTextEditor } from '../common/CbtRichTextEditor';
import { ExamEngine } from '../exam/ExamEngine';
import { formatGoogleDriveEmbedUrl, getGoogleDriveDirectViewUrl } from '../../utils/drive';
import {
  FileCheck2,
  Plus,
  Key,
  Lock,
  Globe,
  Sliders,
  FileText,
  ListOrdered,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Shuffle,
  Eye,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface ExamManagementProps {
  exams: Exam[];
  classes: ClassItem[];
  categories: ExamCategory[];
  onSaveExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamManagement: React.FC<ExamManagementProps> = ({
  exams,
  classes,
  categories,
  onSaveExam,
  onDeleteExam
}) => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Preview Exam State
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);

  // Handle Preview from Form State
  const handlePreviewFromForm = () => {
    const examPreview: Exam = {
      id: editingExam ? editingExam.id : `preview-${Date.now()}`,
      title: title.trim() || 'Pratinjau Ujian Brain Space Academy',
      category: category || 'SNBT 2026',
      targetClass: targetClass || 'XII-UTBK',
      durationMinutes: Number(durationMinutes) || 30,
      mode,
      pdfDriveUrl: mode === 'EMBED_DRIVE_PDF' ? formatGoogleDriveEmbedUrl(pdfDriveUrl.trim() || 'https://drive.google.com/file/d/1Bzx7tT3i82xR1y9O0-G6kQ1h7U63N_f2/preview') : undefined,
      token: token.trim().toUpperCase() || 'PREVIEW',
      isTokenPublic,
      shuffleQuestions,
      passingScore: Number(passingScore) || 70,
      allowRetake: maxAttempts !== 1,
      maxAttempts: Number(maxAttempts) || 1,
      showDiscussion,
      isCatEnabled: mode === 'NATIVE_CBT' ? isCatEnabled : false,
      catQuestionCount: mode === 'NATIVE_CBT' && isCatEnabled ? Math.max(1, Number(catQuestionCount)) : undefined,
      deadline: deadline || '2026-12-31 23:59',
      questions: questions.length > 0 ? questions : [
        {
          id: 'q-preview-1',
          number: 1,
          text: 'Soal Pratinjau Standar',
          questionType: 'SINGLE_CHOICE',
          options: [
            { key: 'A', text: 'Pilihan A' },
            { key: 'B', text: 'Pilihan B' },
            { key: 'C', text: 'Pilihan C' },
            { key: 'D', text: 'Pilihan D' },
            { key: 'E', text: 'Pilihan E' }
          ],
          correctAnswer: 'A',
          weight: 1
        }
      ],
      totalQuestions: questions.length || 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPreviewExam(examPreview);
  };

  // Form Basic Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'SNBT 2026');
  const [targetClass, setTargetClass] = useState(classes[0]?.name || 'XII-UTBK');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [mode, setMode] = useState<ExamMode>('EMBED_DRIVE_PDF');
  const [pdfDriveUrl, setPdfDriveUrl] = useState('');
  const [token, setToken] = useState('SNBT2026');
  const [isTokenPublic, setIsTokenPublic] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [passingScore, setPassingScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState<number>(1);
  const [showDiscussion, setShowDiscussion] = useState(true);
  const [isCatEnabled, setIsCatEnabled] = useState(false);
  const [catQuestionCount, setCatQuestionCount] = useState<number>(10);
  const [deadline, setDeadline] = useState('2026-12-31 23:59');

  // Questions / Bulk LJK State
  const [totalQuestionsInput, setTotalQuestionsInput] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingExam(null);
    setTitle('');
    setCategory(categories[0]?.name || 'SNBT 2026');
    setTargetClass(classes[0]?.name || 'XII-UTBK');
    setDurationMinutes(30);
    setMode('EMBED_DRIVE_PDF');
    setPdfDriveUrl('https://drive.google.com/file/d/1Bzx7tT3i82xR1y9O0-G6kQ1h7U63N_f2/preview');
    setToken(`BSA${Math.floor(1000 + Math.random() * 9000)}`);
    setIsTokenPublic(true);
    setShuffleQuestions(false);
    setPassingScore(70);
    setMaxAttempts(1);
    setShowDiscussion(true);
    setIsCatEnabled(false);
    setCatQuestionCount(10);
    setDeadline('2026-12-31 23:59');
    setTotalQuestionsInput(10);

    // Auto-generate 10 default LJK rows
    generateBulkLJK(10);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setTitle(exam.title);
    setCategory(exam.category);
    setTargetClass(exam.targetClass);
    setDurationMinutes(exam.durationMinutes);
    setMode(exam.mode);
    setPdfDriveUrl(exam.pdfDriveUrl || '');
    setToken(exam.token);
    setIsTokenPublic(exam.isTokenPublic);
    setShuffleQuestions(exam.shuffleQuestions);
    setPassingScore(exam.passingScore);
    setMaxAttempts(exam.maxAttempts !== undefined ? exam.maxAttempts : 1);
    setShowDiscussion(exam.showDiscussion !== undefined ? exam.showDiscussion : true);
    setIsCatEnabled(exam.isCatEnabled || false);
    setCatQuestionCount(exam.catQuestionCount || exam.questions.length || 10);
    setDeadline(exam.deadline);
    setQuestions(exam.questions);
    setTotalQuestionsInput(exam.questions.length);
    setIsModalOpen(true);
  };

  // Bulk LJK Generator Function
  const generateBulkLJK = (count: number) => {
    const num = Math.max(1, Math.min(100, count));
    const difficulties: ('mudah' | 'sedang' | 'sulit' | 'hots')[] = ['mudah', 'sedang', 'sulit', 'hots'];
    const newQuestions: Question[] = Array.from({ length: num }, (_, i) => {
      // Preserve existing if present
      if (questions[i]) return questions[i];

      return {
        id: `q-gen-${i + 1}`,
        number: i + 1,
        text: `Soal Nomor ${i + 1}`,
        imageUrl: '',
        questionType: 'SINGLE_CHOICE',
        options: [
          { key: 'A', text: 'Pilihan A', imageUrl: '' },
          { key: 'B', text: 'Pilihan B', imageUrl: '' },
          { key: 'C', text: 'Pilihan C', imageUrl: '' },
          { key: 'D', text: 'Pilihan D', imageUrl: '' },
          { key: 'E', text: 'Pilihan E', imageUrl: '' }
        ],
        correctAnswer: ['A', 'B', 'C', 'D', 'E'][i % 5],
        weight: 1,
        discussion: `Pembahasan Soal Nomor ${i + 1}`,
        difficulty: difficulties[i % 4]
      };
    });

    setQuestions(newQuestions);
  };

  // Add individual Native CBT Question
  const handleAddQuestion = () => {
    const newNumber = questions.length + 1;
    const difficulties: ('mudah' | 'sedang' | 'sulit' | 'hots')[] = ['mudah', 'sedang', 'sulit', 'hots'];
    const newQ: Question = {
      id: `q-native-${Date.now()}-${newNumber}`,
      number: newNumber,
      text: `Soal Nomor ${newNumber}`,
      imageUrl: '',
      questionType: 'SINGLE_CHOICE',
      options: [
        { key: 'A', text: 'Pilihan A', imageUrl: '' },
        { key: 'B', text: 'Pilihan B', imageUrl: '' },
        { key: 'C', text: 'Pilihan C', imageUrl: '' },
        { key: 'D', text: 'Pilihan D', imageUrl: '' },
        { key: 'E', text: 'Pilihan E', imageUrl: '' }
      ],
      correctAnswer: 'A',
      weight: 1,
      discussion: '',
      difficulty: difficulties[(newNumber - 1) % 4]
    };
    setQuestions([...questions, newQ]);
  };

  // Remove individual Native CBT Question
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index).map((q, i) => ({
      ...q,
      number: i + 1
    }));
    setQuestions(updated);
  };

  // Update Individual Question Key / Weight / Discussion
  const updateQuestion = (index: number, updatedFields: Partial<Question>) => {
    const copy = [...questions];
    let q = { ...copy[index], ...updatedFields };
    if (updatedFields.questionType === 'TRUE_FALSE' && (!q.statements || q.statements.length === 0)) {
      q.statements = [
        { id: `stmt-${Date.now()}-1`, text: 'Pernyataan 1: (Contoh pernyataan pertama)', correctAnswer: 'TRUE' },
        { id: `stmt-${Date.now()}-2`, text: 'Pernyataan 2: (Contoh pernyataan kedua)', correctAnswer: 'FALSE' }
      ];
    }
    copy[index] = q;
    setQuestions(copy);
  };

  // True/False Statement Table Functions
  const handleAddStatement = (questionIdx: number) => {
    const copy = [...questions];
    const targetQ = { ...copy[questionIdx] };
    const stmts = targetQ.statements ? [...targetQ.statements] : [];
    stmts.push({
      id: `stmt-${Date.now()}-${stmts.length + 1}`,
      text: `Pernyataan ${stmts.length + 1}`,
      correctAnswer: 'TRUE'
    });
    targetQ.statements = stmts;
    copy[questionIdx] = targetQ;
    setQuestions(copy);
  };

  const handleUpdateStatement = (questionIdx: number, stmtIdx: number, field: 'text' | 'correctAnswer', val: any) => {
    const copy = [...questions];
    const targetQ = { ...copy[questionIdx] };
    if (!targetQ.statements) return;
    const stmts = [...targetQ.statements];
    stmts[stmtIdx] = { ...stmts[stmtIdx], [field]: val };
    targetQ.statements = stmts;
    copy[questionIdx] = targetQ;
    setQuestions(copy);
  };

  const handleRemoveStatement = (questionIdx: number, stmtIdx: number) => {
    const copy = [...questions];
    const targetQ = { ...copy[questionIdx] };
    if (!targetQ.statements || targetQ.statements.length <= 1) return;
    targetQ.statements = targetQ.statements.filter((_, i) => i !== stmtIdx);
    copy[questionIdx] = targetQ;
    setQuestions(copy);
  };

  // Update Option Text or Image for Native CBT Question
  const updateQuestionOption = (questionIdx: number, optionKey: string, field: 'text' | 'imageUrl', val: string) => {
    const copy = [...questions];
    const targetQ = { ...copy[questionIdx] };
    const opts = targetQ.options ? [...targetQ.options] : [
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' },
      { key: 'E', text: '' }
    ];

    const optIdx = opts.findIndex(o => o.key === optionKey);
    if (optIdx >= 0) {
      opts[optIdx] = { ...opts[optIdx], [field]: val };
    } else {
      opts.push({ key: optionKey, text: field === 'text' ? val : '', imageUrl: field === 'imageUrl' ? val : '' });
    }

    targetQ.options = opts;
    copy[questionIdx] = targetQ;
    setQuestions(copy);
  };

  // Save Exam
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const savedExam: Exam = {
      id: editingExam ? editingExam.id : `exam-${Date.now()}`,
      title: title.trim(),
      category,
      targetClass,
      durationMinutes: Number(durationMinutes),
      mode,
      pdfDriveUrl: mode === 'EMBED_DRIVE_PDF' ? formatGoogleDriveEmbedUrl(pdfDriveUrl) : undefined,
      token: token.trim().toUpperCase(),
      isTokenPublic,
      shuffleQuestions,
      passingScore: Number(passingScore),
      allowRetake: maxAttempts !== 1,
      maxAttempts: Number(maxAttempts),
      showDiscussion,
      isCatEnabled: mode === 'NATIVE_CBT' ? isCatEnabled : false,
      catQuestionCount: mode === 'NATIVE_CBT' && isCatEnabled ? Math.max(1, Number(catQuestionCount)) : undefined,
      deadline,
      questions,
      totalQuestions: questions.length,
      createdAt: editingExam ? editingExam.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveExam(savedExam);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Bank Ujian & Bulk LJK Generator</h2>
          </div>
          <p className="text-xs text-slate-400">
            Atur mode ujian (Drive PDF vs Native CBT), kuis LJK massal, token akses, dan kunci jawaban.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Buat Paket Ujian Baru
        </button>
      </div>

      {/* Grid Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map(exam => (
          <div
            key={exam.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {exam.targetClass}
                </span>

                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  exam.mode === 'EMBED_DRIVE_PDF'
                    ? 'bg-blue-950 text-blue-300 border-blue-800/50'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                }`}>
                  {exam.mode === 'EMBED_DRIVE_PDF' ? 'Mode: Google Drive PDF' : 'Mode: Native CBT'}
                </span>

                {exam.isCatEnabled && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-950 text-purple-300 border border-purple-800/80 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-purple-400" /> Sistem CAT
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-100 text-lg leading-snug">
                {exam.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
                <div>
                  <span>Kategori:</span> <strong className="text-slate-200">{exam.category}</strong>
                </div>
                <div>
                  <span>Durasi:</span> <strong className="text-slate-200">{exam.durationMinutes} Menit</strong>
                </div>
                <div>
                  <span>Jumlah Soal:</span> <strong className="text-cyan-400 font-bold">{exam.totalQuestions} Nomor</strong>
                </div>
                <div>
                  <span>KKM Lulus:</span> <strong className="text-amber-400">{exam.passingScore} Poin</strong>
                </div>
              </div>

              {/* Token Info */}
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 text-xs">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">Token Ujian:</span>
                  <span className="font-mono font-extrabold text-cyan-300 tracking-wider bg-slate-950 px-2 py-0.5 rounded-lg border border-cyan-800/50">
                    {exam.token}
                  </span>
                </div>

                {exam.isTokenPublic ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <Globe className="w-3 h-3" /> Token Publik
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                    <Lock className="w-3 h-3" /> Private (Manual)
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Batas: {exam.deadline}</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewExam(exam)}
                  className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all"
                  title="Lihat Simulasi Tampilan Siswa"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Pratinjau Ujian
                </button>

                <button
                  onClick={() => openEditModal(exam)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit & Kunci LJK
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus ujian ${exam.title}?`)) onDeleteExam(exam.id);
                  }}
                  className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-xl text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM CREATE / EDIT EXAM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full h-[90vh] flex flex-col space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-lg">
                  {editingExam ? 'Edit Pengaturan Ujian & Kunci LJK' : 'Buat Ujian & LJK Generator Massal'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviewFromForm}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Eye className="w-4 h-4" /> Pratinjau Ujian
                </button>

                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              
              {/* SECTION 1: SETTING DASAR UJIAN */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-4">
                <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> 1. Pengaturan Utama Ujian
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Ujian</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Simulasi SNBT 2026 - Kemampuan Penalaran Umum"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Ujian</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kelas Akses Target</label>
                    <select
                      value={targetClass}
                      onChange={e => setTargetClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Durasi Pengerjaan (Menit)</label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={e => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">KKM / Passing Score</label>
                    <input
                      type="number"
                      value={passingScore}
                      onChange={e => setPassingScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Batas Pengerjaan Ujian (Siswa)
                    </label>
                    <select
                      value={maxAttempts}
                      onChange={e => setMaxAttempts(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-semibold"
                    >
                      <option value={1}>1 Kali Pengerjaan (Standar)</option>
                      <option value={2}>2 Kali Pengerjaan</option>
                      <option value={3}>3 Kali Pengerjaan</option>
                      <option value={0}>Tidak Terbatas (Unlimited / Kuis Bebas)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: OPSI MODE UJIAN & TOKEN */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-4">
                <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 2. Mode Tampilan & Pengaturan Token
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Mode Ujian</label>
                    <select
                      value={mode}
                      onChange={e => setMode(e.target.value as ExamMode)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold"
                    >
                      <option value="EMBED_DRIVE_PDF">1. MODE EMBED GOOGLE DRIVE PDF (Split-Screen View)</option>
                      <option value="NATIVE_CBT">2. MODE NATIVE CBT (Soal Teks & Gambar Per Nomor)</option>
                    </select>
                  </div>

                  {mode === 'EMBED_DRIVE_PDF' && (
                    <div className="space-y-2 col-span-1 md:col-span-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-cyan-300">
                          Link Embed PDF Google Drive Naskah Soal
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Auto Format ke /preview Ready
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={pdfDriveUrl}
                          onChange={e => setPdfDriveUrl(e.target.value)}
                          onBlur={() => {
                            if (pdfDriveUrl) {
                              setPdfDriveUrl(formatGoogleDriveEmbedUrl(pdfDriveUrl));
                            }
                          }}
                          placeholder="Tempelkan link Google Drive PDF (contoh: https://drive.google.com/file/d/1Bzx7tT3.../view?usp=sharing)"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                          required={mode === 'EMBED_DRIVE_PDF'}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (pdfDriveUrl) {
                              setPdfDriveUrl(formatGoogleDriveEmbedUrl(pdfDriveUrl));
                            }
                          }}
                          className="px-3 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-sm"
                          title="Format otomatis URL ke Google Drive /preview"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Format URL</span>
                        </button>
                      </div>

                      {/* URL Format & External Link Helper */}
                      {pdfDriveUrl && (
                        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-slate-300">
                              URL Embed yang Digunakan Sistem:
                            </span>
                            <a
                              href={getGoogleDriveDirectViewUrl(pdfDriveUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Uji Buka PDF di Tab Baru
                            </a>
                          </div>
                          <p className="font-mono text-[11px] text-cyan-300 break-all bg-slate-950 p-2 rounded-lg border border-slate-800/80 select-all">
                            {formatGoogleDriveEmbedUrl(pdfDriveUrl)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            💡 <strong>Petunjuk Google Drive</strong>: Pastikan opsi berbagi file di Google Drive diatur ke <strong>&quot;Siapa saja yang memiliki link dapat melihat&quot; (Public Viewer)</strong> agar naskah soal tampil sempurna di layar siswa.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Token Ujian</label>
                    <input
                      type="text"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono uppercase font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-5 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                      <input
                        type="checkbox"
                        checked={isTokenPublic}
                        onChange={e => setIsTokenPublic(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <span>Tampilkan Token Publik di Dashboard Siswa</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={e => setShuffleQuestions(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <span className="flex items-center gap-1">
                        <Shuffle className="w-3.5 h-3.5 text-cyan-400" /> Acak Soal
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={showDiscussion}
                        onChange={e => setShowDiscussion(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <span className="flex items-center gap-1 font-semibold text-cyan-300">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" /> Tampilkan Analisis & Pembahasan Per Soal ke Siswa
                      </span>
                    </label>

                    {mode === 'NATIVE_CBT' && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200 bg-purple-950/60 hover:bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-800/80 transition-all">
                        <input
                          type="checkbox"
                          checked={isCatEnabled}
                          onChange={e => setIsCatEnabled(e.target.checked)}
                          className="rounded bg-slate-900 border-purple-800 text-purple-500 focus:ring-0"
                        />
                        <span className="flex items-center gap-1 font-extrabold text-purple-300">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Sistem Computer Adaptive Test (CAT)
                        </span>
                      </label>
                    )}
                  </div>
                  {mode === 'NATIVE_CBT' && isCatEnabled && (
                    <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl text-xs text-purple-200 space-y-2 mt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-900/40 p-2.5 rounded-lg border border-purple-800/80">
                        <label className="font-extrabold text-xs text-purple-200 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          Pengaturan Jumlah Soal CAT yang Dikeluarkan ke Siswa:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={questions.length || 100}
                            value={catQuestionCount}
                            onChange={e => setCatQuestionCount(Math.max(1, Number(e.target.value)))}
                            className="w-20 bg-slate-900 border border-purple-700/80 rounded-lg py-1 px-2 text-center text-xs font-bold text-white focus:outline-none focus:border-purple-400"
                          />
                          <span className="text-[11px] text-purple-300/80 font-medium">
                            / {questions.length} Soal Tersedia
                          </span>
                        </div>
                      </div>

                      <p className="font-bold flex items-center gap-1 text-purple-300">
                        <Sparkles className="w-4 h-4 text-purple-400" /> Ketentuan Sistem Computer Adaptive Test (CAT) Berjalan:
                      </p>
                      <ul className="list-disc list-inside text-[11px] text-purple-300/80 space-y-0.5">
                        <li>Nomor togel / grid navigasi soal disembunyikan dari siswa.</li>
                        <li>Siswa tidak dapat kembali ke soal sebelumnya (Back di-nonaktifkan).</li>
                        <li>Komposisi soal yang tampil diatur sistem CAT tergantung jawaban siswa (BENAR → level naik, SALAH → level turun/tetap).</li>
                        <li>Siswa tidak dapat melihat kunci/jawaban benar-salah selama ujian berlangsung.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: EDITOR SOAL (NATIVE CBT vs GOOGLE DRIVE PDF BULK LJK) */}
              {mode === 'NATIVE_CBT' ? (
                <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                        <ListOrdered className="w-4 h-4" /> 3. Input Soal Teks/Gambar & Opsi Jawaban (Native CBT)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Kelola naskah soal (teks & gambar) beserta pilihan jawaban A-E (teks & gambar) per nomor.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Soal
                      </button>
                    </div>
                  </div>

                  {/* Native Question List Editor */}
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                    {questions.map((q, idx) => (
                      <div key={q.id || idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs">
                        {/* Question Header: Number, Question Type, Delete */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-300 font-extrabold flex items-center justify-center text-xs">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-100 text-xs">Soal Nomor {idx + 1}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-slate-400 font-medium">Tipe:</span>
                              <select
                                value={q.questionType}
                                onChange={e => updateQuestion(idx, { questionType: e.target.value as QuestionType })}
                                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-semibold text-cyan-300 focus:outline-none"
                              >
                                <option value="SINGLE_CHOICE">Pilihan Ganda (Single Choice)</option>
                                <option value="COMPLEX_CHOICE">Pilihan Kompleks (Multi Choice)</option>
                                <option value="TRUE_FALSE">Benar / Salah (True False)</option>
                                <option value="ESSAY">Essay / Isian Singkat</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-slate-400 font-medium">Level:</span>
                              <select
                                value={q.difficulty || 'sedang'}
                                onChange={e => updateQuestion(idx, { difficulty: e.target.value as any })}
                                className={`bg-slate-950 border rounded-lg px-2 py-1 text-[11px] font-extrabold focus:outline-none ${
                                  q.difficulty === 'mudah' ? 'text-emerald-400 border-emerald-800' :
                                  q.difficulty === 'sedang' ? 'text-blue-400 border-blue-800' :
                                  q.difficulty === 'sulit' ? 'text-amber-400 border-amber-800' :
                                  'text-purple-400 border-purple-800'
                                }`}
                              >
                                <option value="mudah">Mudah</option>
                                <option value="sedang">Sedang</option>
                                <option value="sulit">Sulit</option>
                                <option value="hots">HOTS</option>
                              </select>
                            </div>

                            {questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(idx)}
                                className="p-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800/50"
                                title="Hapus Soal Ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Question Text & Question Image URL */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-8 space-y-1.5">
                            <CbtRichTextEditor
                              label={`Naskah / Teks Soal Nomor ${idx + 1}`}
                              value={q.text}
                              onChange={newVal => updateQuestion(idx, { text: newVal })}
                              placeholder={`Tuliskan pertanyaan/soal nomor ${idx + 1}...`}
                              textAlign={q.textAlign || 'left'}
                              onTextAlignChange={align => updateQuestion(idx, { textAlign: align })}
                              rows={3}
                            />
                          </div>

                          <div className="sm:col-span-4 space-y-1.5">
                            <label className="block text-[11px] font-semibold text-slate-300">URL Gambar Soal (Opsional)</label>
                            <input
                              type="url"
                              value={q.imageUrl || ''}
                              onChange={e => updateQuestion(idx, { imageUrl: e.target.value })}
                              placeholder="https://.../gambar-soal.png"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] text-white placeholder-slate-600"
                            />

                            {q.imageUrl && (
                              <div className="space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
                                  <span>Ukuran:</span>
                                  <div className="flex gap-1">
                                    {(['small', 'medium', 'large', 'full'] as const).map(size => (
                                      <button
                                        key={size}
                                        type="button"
                                        onClick={() => updateQuestion(idx, { imageWidth: size })}
                                        className={`px-1 rounded text-[9px] font-bold uppercase ${
                                          (q.imageWidth || 'medium') === size ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                                        }`}
                                      >
                                        {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : size === 'large' ? 'Besar' : 'Penuh'}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
                                  <span>Posisi:</span>
                                  <div className="flex gap-1">
                                    {(['left', 'center', 'right'] as const).map(pos => (
                                      <button
                                        key={pos}
                                        type="button"
                                        onClick={() => updateQuestion(idx, { imageAlign: pos })}
                                        className={`px-1 rounded text-[9px] font-bold uppercase ${
                                          (q.imageAlign || 'center') === pos ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                                        }`}
                                      >
                                        {pos === 'left' ? 'Kiri' : pos === 'center' ? 'Tengah' : 'Kanan'}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="h-16 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center p-1">
                                  <img src={q.imageUrl} alt="Preview Soal" className="max-h-full object-contain" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* TRUE_FALSE STATEMENT TABLE EDITOR */}
                        {q.questionType === 'TRUE_FALSE' && (
                          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <label className="text-[11px] font-bold text-cyan-300">
                                Tabel Pernyataan Benar / Salah (Beberapa Pernyataan Per Soal):
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddStatement(idx)}
                                className="px-2.5 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 rounded-lg text-[10px] font-bold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Tambah Pernyataan
                              </button>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                                    <th className="p-2 w-10 text-center">#</th>
                                    <th className="p-2">Teks Pernyataan</th>
                                    <th className="p-2 w-36 text-center">Kunci Jawaban</th>
                                    <th className="p-2 w-12 text-center">Hapus</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                  {(q.statements && q.statements.length > 0
                                    ? q.statements
                                    : [
                                        { id: `s-${q.id}-1`, text: 'Pernyataan 1', correctAnswer: 'TRUE' as const },
                                        { id: `s-${q.id}-2`, text: 'Pernyataan 2', correctAnswer: 'FALSE' as const }
                                      ]
                                  ).map((stmt, sIdx) => (
                                    <tr key={stmt.id || sIdx} className="hover:bg-slate-900/50">
                                      <td className="p-2 text-center font-bold text-cyan-400">{sIdx + 1}</td>
                                      <td className="p-2">
                                        <input
                                          type="text"
                                          value={stmt.text}
                                          onChange={e => handleUpdateStatement(idx, sIdx, 'text', e.target.value)}
                                          placeholder={`Tuliskan pernyataan ${sIdx + 1}...`}
                                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white placeholder-slate-600"
                                        />
                                      </td>
                                      <td className="p-2 text-center">
                                        <div className="flex justify-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateStatement(idx, sIdx, 'correctAnswer', 'TRUE')}
                                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                                              stmt.correctAnswer === 'TRUE'
                                                ? 'bg-emerald-500 text-white shadow'
                                                : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                          >
                                            BENAR
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateStatement(idx, sIdx, 'correctAnswer', 'FALSE')}
                                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                                              stmt.correctAnswer === 'FALSE'
                                                ? 'bg-rose-500 text-white shadow'
                                                : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                          >
                                            SALAH
                                          </button>
                                        </div>
                                      </td>
                                      <td className="p-2 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveStatement(idx, sIdx)}
                                          className="p-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded border border-rose-800/50"
                                          title="Hapus Pernyataan"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Options Inputs A, B, C, D, E for SINGLE_CHOICE and COMPLEX_CHOICE */}
                        {(q.questionType === 'SINGLE_CHOICE' || q.questionType === 'COMPLEX_CHOICE') && (
                          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
                            <label className="block text-[11px] font-bold text-cyan-300">
                              Pilihan Opsi Jawaban (Teks & Gambar A - E):
                            </label>

                            <div className="space-y-2">
                              {['A', 'B', 'C', 'D', 'E'].map(optKey => {
                                const currentOpt = q.options?.find(o => o.key === optKey) || { key: optKey, text: '', imageUrl: '' };

                                return (
                                  <div key={optKey} className="space-y-1 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-slate-800 font-bold text-cyan-400 text-xs flex items-center justify-center shrink-0 border border-slate-700">
                                        {optKey}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-300">Teks / Formula Opsi {optKey}</span>
                                    </div>

                                    {/* Option Rich Text Editor */}
                                    <CbtRichTextEditor
                                      value={currentOpt.text}
                                      onChange={newVal => updateQuestionOption(idx, optKey, 'text', newVal)}
                                      placeholder={`Tuliskan pilihan jawaban ${optKey}...`}
                                      compact={true}
                                    />

                                    {/* Option Image URL Input */}
                                    <div className="flex items-center gap-2 pt-1">
                                      <input
                                        type="url"
                                        value={currentOpt.imageUrl || ''}
                                        onChange={e => updateQuestionOption(idx, optKey, 'imageUrl', e.target.value)}
                                        placeholder={`URL Gambar Tambahan Opsi ${optKey} (Opsional)...`}
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-[11px] text-slate-300 placeholder-slate-600"
                                      />

                                      {currentOpt.imageUrl && (
                                        <img src={currentOpt.imageUrl} alt={`Preview Opsi ${optKey}`} className="w-8 h-8 rounded-lg border border-slate-700 object-cover shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Key & Weight & Discussion row */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-slate-800/60 items-center">
                          <div className="sm:col-span-5 flex items-center gap-2">
                            <span className="text-[11px] font-bold text-emerald-400">Kunci Jawaban:</span>

                            {q.questionType === 'SINGLE_CHOICE' && (
                              <div className="flex gap-1">
                                {['A', 'B', 'C', 'D', 'E'].map(optKey => (
                                  <button
                                    key={optKey}
                                    type="button"
                                    onClick={() => updateQuestion(idx, { correctAnswer: optKey })}
                                    className={`w-6 h-6 rounded font-bold text-xs ${
                                      q.correctAnswer === optKey
                                        ? 'bg-cyan-500 text-white shadow-md'
                                        : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {optKey}
                                  </button>
                                ))}
                              </div>
                            )}

                            {q.questionType === 'COMPLEX_CHOICE' && (
                              <div className="flex gap-1">
                                {['A', 'B', 'C', 'D', 'E'].map(optKey => {
                                  const currentArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
                                  const isChecked = currentArr.includes(optKey);

                                  return (
                                    <button
                                      key={optKey}
                                      type="button"
                                      onClick={() => {
                                        let nextArr: string[];
                                        if (isChecked) {
                                          nextArr = currentArr.filter(x => x !== optKey);
                                        } else {
                                          nextArr = [...currentArr, optKey];
                                        }
                                        updateQuestion(idx, { correctAnswer: nextArr });
                                      }}
                                      className={`w-6 h-6 rounded font-bold text-xs ${
                                        isChecked
                                          ? 'bg-emerald-500 text-white shadow-md'
                                          : 'bg-slate-800 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {optKey}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {q.questionType === 'TRUE_FALSE' && (
                              <select
                                value={String(q.correctAnswer)}
                                onChange={e => updateQuestion(idx, { correctAnswer: e.target.value })}
                                className="bg-slate-950 border border-slate-800 rounded-lg p-1 text-[11px] font-bold text-emerald-300"
                              >
                                <option value="TRUE">BENAR (TRUE)</option>
                                <option value="FALSE">SALAH (FALSE)</option>
                              </select>
                            )}

                            {q.questionType === 'ESSAY' && (
                              <input
                                type="text"
                                value={String(q.correctAnswer || '')}
                                onChange={e => updateQuestion(idx, { correctAnswer: e.target.value })}
                                placeholder="Kata Kunci Jawaban Essay..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                              />
                            )}
                          </div>

                          <div className="sm:col-span-3 flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400">Bobot Nilai:</span>
                            <input
                              type="number"
                              value={q.weight}
                              onChange={e => updateQuestion(idx, { weight: Number(e.target.value) })}
                              className="w-16 bg-slate-950 border border-slate-800 rounded-lg p-1 text-center text-xs font-bold text-amber-300"
                            />
                          </div>

                          <div className="sm:col-span-12 pt-2">
                            <CbtRichTextEditor
                              label={`Pembahasan Soal Nomor ${idx + 1} (Opsional)`}
                              value={q.discussion || ''}
                              onChange={newVal => updateQuestion(idx, { discussion: newVal })}
                              placeholder={`Tuliskan pembahasan / penjelasan jawaban nomor ${idx + 1}...`}
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* EMBED GOOGLE DRIVE PDF MODE - BULK LJK GENERATOR */
                <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                        <ListOrdered className="w-4 h-4" /> 3. Bulk LJK Generator & Kunci Jawaban (Mode PDF Drive)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Tentukan jumlah nomor soal untuk membuat LJK digital instan & atur kunci jawaban.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">Jumlah Soal:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={totalQuestionsInput}
                        onChange={e => setTotalQuestionsInput(Number(e.target.value))}
                        className="w-16 bg-slate-900 border border-slate-800 rounded-xl p-1.5 text-center text-xs font-bold text-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => generateBulkLJK(totalQuestionsInput)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md"
                      >
                        Generate LJK
                      </button>
                    </div>
                  </div>

                  {/* Question LJK Rows List */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                    {questions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 font-bold flex items-center justify-center text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-200">Kunci Jawaban:</span>
                          </div>

                          {/* Option Select */}
                          <div className="flex items-center gap-1.5">
                            {['A', 'B', 'C', 'D', 'E'].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => updateQuestion(idx, { correctAnswer: opt })}
                                className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                                  q.correctAnswer === opt
                                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">Level:</span>
                            <select
                              value={q.difficulty || 'sedang'}
                              onChange={e => updateQuestion(idx, { difficulty: e.target.value as any })}
                              className="bg-slate-950 border border-slate-800 rounded-lg p-1 text-[11px] font-bold text-cyan-300"
                            >
                              <option value="mudah">Mudah</option>
                              <option value="sedang">Sedang</option>
                              <option value="sulit">Sulit</option>
                              <option value="hots">HOTS</option>
                            </select>

                            <span className="text-[11px] text-slate-400 ml-1">Bobot:</span>
                            <input
                              type="number"
                              value={q.weight}
                              onChange={e => updateQuestion(idx, { weight: Number(e.target.value) })}
                              className="w-12 bg-slate-950 border border-slate-800 rounded-lg p-1 text-center text-xs text-white font-bold"
                            />
                          </div>
                        </div>

                        {/* Discussion Input */}
                        <div>
                          <input
                            type="text"
                            value={q.discussion || ''}
                            onChange={e => updateQuestion(idx, { discussion: e.target.value })}
                            placeholder={`Pembahasan Singkat Soal Nomor ${idx + 1}...`}
                            className="w-full bg-slate-950 border border-slate-800/80 rounded-lg p-2 text-[11px] text-slate-300 placeholder-slate-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit & Preview Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="sm:w-1/4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl text-xs"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handlePreviewFromForm}
                  className="sm:w-2/4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="w-4 h-4" /> Pratinjau Tampilan Ujian (Siswa)
                </button>

                <button
                  type="submit"
                  className="sm:w-2/4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan Paket Ujian & LJK Digital
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL PRATINJAU UJIAN UNTUK ADMIN */}
      {previewExam && (
        <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-lg flex flex-col">
          {/* Header Banner Mode Pratinjau */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-cyan-950 border-b border-purple-500/30 px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse shrink-0">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black rounded-md uppercase tracking-wider">
                    PRATINJAU TAMPILAN UJIAN (ADMIN PREVIEW MODE)
                  </span>
                  <span className="text-xs text-white font-bold">{previewExam.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Ini adalah simulasi presisi antarmuka pengerjaan ujian siswa (Mode: {previewExam.mode === 'EMBED_DRIVE_PDF' ? 'PDF Split View + LJK Digital' : 'Native CBT Soal Teks/Gambar'}).
                </p>
              </div>
            </div>

            <button
              onClick={() => setPreviewExam(null)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all shrink-0"
            >
              <X className="w-4 h-4" /> Tutup Pratinjau
            </button>
          </div>

          {/* Exam Engine Rendered in Full */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            <ExamEngine
              exam={previewExam}
              user={{
                id: 'admin-preview-user',
                name: 'Administrator (Preview Mode)',
                nis: '00000',
                role: 'ADMIN',
                className: previewExam.targetClass,
                status: 'APPROVED'
              }}
              onSubmitExam={(result) => {
                alert(`[MODE PRATINJAU] Simulasi Ujian Selesai! Skor: ${result.score} (${result.percentage}%)`);
                setPreviewExam(null);
              }}
              onCancelExam={() => setPreviewExam(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
