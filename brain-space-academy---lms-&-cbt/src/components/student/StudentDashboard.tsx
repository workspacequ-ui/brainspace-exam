import React, { useState, useEffect } from 'react';
import { User, LearningMaterial, Exam, MarketplaceProduct, ExamResult, FeaturedProgram, Question } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart as PieChartIcon,
  Pie,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  BookOpen,
  FileCheck2,
  ShoppingBag,
  History,
  Key,
  Lock,
  Globe,
  PlayCircle,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Sparkles,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Check,
  Award,
  TrendingUp,
  Filter,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BarChart3,
  Layers
} from 'lucide-react';

// Default Fallback Featured Programs if none published
const defaultProgramsList: FeaturedProgram[] = [
  {
    id: 'prog-demo-1',
    title: 'Bimbel Intensif UTBK-SNBT 2026',
    category: 'UTBK / SNBT',
    shortDesc: 'Program bimbingan komprehensif TPS, Literasi Bahasa, dan Penalaran Matematika dengan Tryout CBT Standar BPPP.',
    articleContent: 'Program unggulan UTBK-SNBT dirancang khusus dengan ribuan latihan soal HOTS dan pembahasan video interaktif bersama Master Teacher.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    badge: 'PROGRAM UNGGULAN #1',
    registerUrl: 'https://brainspace.id',
    isPublished: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'prog-demo-2',
    title: 'Garansi Lulus Kedinasan & CPNS 2026',
    category: 'CPNS & Kedinasan',
    shortDesc: 'Persiapan SKD, TKD, BUMN & Sekolah Kedinasan (STIS, STAN, IPDN) dengan simulasi CAT BKN.',
    articleContent: 'Bimbingan tatap muka & online untuk menembus ambang batas Tes Karakteristik Pribadi & Wawasan Kebangsaan secara konsisten.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    badge: 'SUPER INTENSIF',
    registerUrl: 'https://brainspace.id',
    isPublished: true,
    createdAt: '2026-01-02'
  },
  {
    id: 'prog-demo-3',
    title: 'Bimbel Spesialis Fakultas Kedokteran',
    category: 'Kedokteran',
    shortDesc: 'Pendampingan khusus lolos Ujian Mandiri & SNBT Fakultas Kedokteran PTN Favorit Indonesia.',
    articleContent: 'Metode belajar terpadu Biologi Medik, Kimia Organik, dan Keterampilan Klinis Dasar dengan tutor berpengalaman.',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    badge: 'EXCLUSIVE VIP',
    registerUrl: 'https://brainspace.id',
    isPublished: true,
    createdAt: '2026-01-03'
  }
];

interface StudentDashboardProps {
  user: User;
  materials: LearningMaterial[];
  exams: Exam[];
  products: MarketplaceProduct[];
  results: ExamResult[];
  featuredPrograms?: FeaturedProgram[];
  onStartExam: (exam: Exam) => void;
  activeTab: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  materials,
  exams,
  products,
  results,
  featuredPrograms = [],
  onStartExam,
  activeTab
}) => {
  // Token Input State for Private Exams
  const [tokenInputMap, setTokenInputMap] = useState<Record<string, string>>({});
  const [tokenErrorMap, setTokenErrorMap] = useState<Record<string, string>>({});

  // Material Preview Modal State
  const [previewMaterial, setPreviewMaterial] = useState<LearningMaterial | null>(null);

  // Marketplace Category Filter
  const [marketCatFilter, setMarketCatFilter] = useState('ALL');
  const [marketSearch, setMarketSearch] = useState('');

  // Featured Program Article Preview Modal State
  const [selectedArticleProgram, setSelectedArticleProgram] = useState<FeaturedProgram | null>(null);

  // Featured Program Slide Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Exam Result Review Modal State
  const [reviewResult, setReviewResult] = useState<ExamResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'CORRECT' | 'INCORRECT' | 'UNANSWERED'>('ALL');

  // Exam Performance Bar Chart Category Filter
  const [chartCategoryFilter, setChartCategoryFilter] = useState('ALL');

  // Filter materials by student class or SEMUA
  const studentMaterials = materials.filter(
    m => m.targetClass === 'SEMUA' || m.targetClass === user.className
  );

  // Filter exams by student class
  const studentExams = exams.filter(
    e => e.targetClass === 'SEMUA' || e.targetClass === user.className
  );

  // Filter results for this student
  const studentResults = results.filter(r => r.studentId === user.id);

  // Helper function to safely parse submittedAt timestamp
  const parseSubmittedTimestamp = (submittedAtStr?: string): number => {
    if (!submittedAtStr) return 0;
    if (!isNaN(Number(submittedAtStr))) {
      return Number(submittedAtStr);
    }
    const d = new Date(submittedAtStr);
    if (!isNaN(d.getTime())) {
      return d.getTime();
    }
    const isoTry = new Date(submittedAtStr.replace(' ', 'T'));
    if (!isNaN(isoTry.getTime())) {
      return isoTry.getTime();
    }
    const parts = submittedAtStr.split(/[/,.:\s]+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const hour = parts[3] ? parseInt(parts[3], 10) : 0;
      const min = parts[4] ? parseInt(parts[4], 10) : 0;
      const sec = parts[5] ? parseInt(parts[5], 10) : 0;
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1900) {
        return new Date(year, month, day, hour, min, sec).getTime();
      }
    }
    return 0;
  };

  // Map each attempt to attempt number and total attempts per exam
  const attemptInfoMap = new Map<string, { attemptNumber: number; totalAttempts: number }>();
  const examAttemptsMap = new Map<string, ExamResult[]>();

  studentResults.forEach(r => {
    const key = r.examId || r.examTitle;
    if (!examAttemptsMap.has(key)) {
      examAttemptsMap.set(key, []);
    }
    examAttemptsMap.get(key)!.push(r);
  });

  examAttemptsMap.forEach(attempts => {
    // Sort chronologically ascending by submission timestamp
    attempts.sort((a, b) => parseSubmittedTimestamp(a.submittedAt) - parseSubmittedTimestamp(b.submittedAt));
    attempts.forEach((r, idx) => {
      attemptInfoMap.set(r.id, { attemptNumber: idx + 1, totalAttempts: attempts.length });
    });
  });

  // Group by examId (or examTitle) and keep ONLY the latest attempt based on submission timestamp (waktu submit)
  const latestResultsMap = new Map<string, ExamResult>();
  studentResults.forEach(r => {
    const key = r.examId || r.examTitle;
    const existing = latestResultsMap.get(key);
    if (!existing) {
      latestResultsMap.set(key, r);
    } else {
      const existingTime = parseSubmittedTimestamp(existing.submittedAt);
      const newTime = parseSubmittedTimestamp(r.submittedAt);
      if (newTime >= existingTime) {
        latestResultsMap.set(key, r);
      }
    }
  });

  const latestStudentResults = Array.from(latestResultsMap.values());

  // Filter published featured programs or use default list
  const publishedPrograms = featuredPrograms.filter(p => p.isPublished);
  const activeProgramsList = publishedPrograms.length > 0 ? publishedPrograms : defaultProgramsList;

  // Slide Carousel Auto Advance Effect
  useEffect(() => {
    if (!isAutoPlay || activeProgramsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeProgramsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, activeProgramsList.length]);

  const handleNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % activeProgramsList.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((currentSlide - 1 + activeProgramsList.length) % activeProgramsList.length);
  };

  // Derive unique categories for Bar Chart Filter from latest results or exams
  const availableCategories = Array.from(
    new Set([
      ...latestStudentResults.map(r => r.examCategory),
      ...exams.map(e => e.category)
    ])
  ).filter(Boolean);

  // Filter student latest results based on chartCategoryFilter
  const filteredChartResults = latestStudentResults.filter(
    r => chartCategoryFilter === 'ALL' || r.examCategory === chartCategoryFilter
  );

  // Transform filtered results into Bar Chart data format with attempt details
  const barChartData = filteredChartResults.map(r => {
    const attInfo = attemptInfoMap.get(r.id) || { attemptNumber: 1, totalAttempts: 1 };
    return {
      name: r.examTitle.length > 15 ? r.examTitle.slice(0, 13) + '...' : r.examTitle,
      fullTitle: r.examTitle,
      category: r.examCategory,
      score: r.score,
      benar: r.correctCount,
      salah: r.incorrectCount,
      kosong: r.unansweredCount,
      isPassed: r.isPassed,
      submittedAt: r.submittedAt,
      attemptNumber: attInfo.attemptNumber,
      totalAttempts: attInfo.totalAttempts
    };
  });

  // Metrics for selected category
  const avgScoreCategory = filteredChartResults.length > 0
    ? Math.round(filteredChartResults.reduce((acc, r) => acc + r.score, 0) / filteredChartResults.length)
    : 0;

  const passedCountCategory = filteredChartResults.filter(r => r.isPassed).length;
  const passRateCategory = filteredChartResults.length > 0
    ? Math.round((passedCountCategory / filteredChartResults.length) * 100)
    : 0;


  // Custom Tooltip for Bar Chart
  const CustomBarChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-2xl shadow-2xl text-xs space-y-2.5 max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
            <p className="font-extrabold text-white leading-tight">{data.fullTitle}</p>
            {data.isPassed ? (
              <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full shrink-0">
                LULUS
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800 rounded-full shrink-0">
                TIDAK LULUS
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span>Kategori: <strong className="text-cyan-300">{data.category}</strong></span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800/80 font-extrabold text-[10px]">
              Percobaan Ke-{data.attemptNumber} (dari {data.totalAttempts}x)
            </span>
          </div>

          <div className="text-[10px] text-slate-500">
            Waktu Submit: {data.submittedAt}
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1 font-bold">
            <div className="bg-amber-950/40 border border-amber-800/40 p-2 rounded-xl text-amber-300">
              <span className="text-[10px] text-slate-400 block font-normal">Skor Akhir:</span>
              <span className="text-sm">{data.score} Poin</span>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-xl text-emerald-300">
              <span className="text-[10px] text-slate-400 block font-normal">Jawaban Benar:</span>
              <span className="text-sm">{data.benar} Soal</span>
            </div>
            <div className="bg-rose-950/40 border border-rose-800/40 p-2 rounded-xl text-rose-300">
              <span className="text-[10px] text-slate-400 block font-normal">Jawaban Salah:</span>
              <span className="text-sm">{data.salah} Soal</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-2 rounded-xl text-slate-300">
              <span className="text-[10px] text-slate-400 block font-normal">Tidak Dijawab:</span>
              <span className="text-sm">{data.kosong} Soal</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Launch Exam Validation
  const handleLaunchExam = (exam: Exam) => {
    // Check attempt limit
    const attemptsCount = studentResults.filter(r => r.examId === exam.id).length;
    const maxAttempts = exam.maxAttempts !== undefined ? exam.maxAttempts : 1;
    if (maxAttempts > 0 && attemptsCount >= maxAttempts) {
      alert(`Batas maksimal pengerjaan (${maxAttempts}x) untuk ujian "${exam.title}" telah terpenuhi.`);
      return;
    }

    // Check if private token required
    if (!exam.isTokenPublic) {
      const enteredToken = (tokenInputMap[exam.id] || '').trim().toUpperCase();
      if (enteredToken !== exam.token.toUpperCase()) {
        setTokenErrorMap({
          ...tokenErrorMap,
          [exam.id]: 'Token ujian tidak cocok! Silakan tanyakan token kepada pengawas.'
        });
        return;
      }
    }

    setTokenErrorMap({ ...tokenErrorMap, [exam.id]: '' });
    onStartExam(exam);
  };

  return (
    <div className="space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Kelas Terdaftar: {user.className}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Selamat Datang, <span className="text-cyan-400">{user.name}</span>!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Siapkan diri Anda untuk ujian dan pelajari modul berkualitas dari Master Teacher Brain Space Academy.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Ujian Aktif</p>
              <p className="text-xl font-extrabold text-cyan-400">{studentExams.length}</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Materi Kelas</p>
              <p className="text-xl font-extrabold text-blue-400">{studentMaterials.length}</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Ujian Selesai</p>
              <p className="text-xl font-extrabold text-emerald-400">{studentResults.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: MATERI SAYA */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg text-white">Materi Pembelajaran ({user.className})</h3>
            </div>
          </div>

          {studentMaterials.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Belum ada materi untuk kelas Anda saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentMaterials.map(m => (
                <div
                  key={m.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        {m.mediaType}
                      </span>
                      <span className="text-[11px] text-slate-500">{m.createdAt}</span>
                    </div>

                    <h4 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors">
                      {m.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-3">{m.description}</p>
                  </div>

                  <button
                    onClick={() => setPreviewMaterial(m)}
                    className="mt-5 w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Buka & Pelajari Materi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DAFTAR UJIAN SAYA */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg text-white">Daftar Ujian Aktif Kelas {user.className}</h3>
            </div>
          </div>

          {studentExams.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Belum ada ujian aktif untuk kelas Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentExams.map(exam => {
                const studentExamAttempts = studentResults.filter(r => r.examId === exam.id);
                const attemptsCount = studentExamAttempts.length;
                const maxAttempts = exam.maxAttempts !== undefined ? exam.maxAttempts : 1;
                const isLimitReached = maxAttempts > 0 && attemptsCount >= maxAttempts;

                return (
                  <div
                    key={exam.id}
                    className={`bg-slate-900 border rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xl transition-all ${
                      isLimitReached ? 'border-rose-900/40 opacity-90' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                            {exam.category}
                          </span>

                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            exam.mode === 'EMBED_DRIVE_PDF'
                              ? 'bg-blue-950 text-blue-300 border-blue-800/50'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                          }`}>
                            {exam.mode === 'EMBED_DRIVE_PDF' ? 'Mode PDF Split-View' : 'Mode Native CBT'}
                          </span>
                        </div>

                        {/* Attempt Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          isLimitReached
                            ? 'bg-rose-950 text-rose-300 border-rose-800/60'
                            : attemptsCount > 0
                            ? 'bg-amber-950 text-amber-300 border-amber-800/60'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                        }`}>
                          {maxAttempts === 0
                            ? `Bebas Akses (${attemptsCount}x Kerja)`
                            : `Pengerjaan: ${attemptsCount}/${maxAttempts}x`}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-100 text-lg leading-snug">
                        {exam.title}
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                        <div>Durasi: <strong className="text-slate-200">{exam.durationMinutes} Menit</strong></div>
                        <div>Jumlah Soal: <strong className="text-cyan-400">{exam.totalQuestions} Soal</strong></div>
                        <div>KKM Lulus: <strong className="text-amber-400">{exam.passingScore} Poin</strong></div>
                        <div>Max Akses: <strong className="text-emerald-400">{maxAttempts === 0 ? 'Unlimited' : `${maxAttempts}x`}</strong></div>
                      </div>

                      {/* Token Section */}
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                            <Key className="w-4 h-4 text-cyan-400" /> Token Ujian:
                          </span>

                          {exam.isTokenPublic ? (
                            <span className="font-mono font-extrabold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800/60 tracking-wider">
                              {exam.token} (PUBLIK)
                            </span>
                          ) : (
                            <span className="text-amber-400 text-[11px] font-semibold flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> Token Disembunyikan (Private)
                            </span>
                          )}
                        </div>

                        {!exam.isTokenPublic && !isLimitReached && (
                          <div>
                            <input
                              type="text"
                              placeholder="Masukkan token dari pengawas..."
                              value={tokenInputMap[exam.id] || ''}
                              onChange={e =>
                                setTokenInputMap({ ...tokenInputMap, [exam.id]: e.target.value })
                              }
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white uppercase font-mono tracking-widest placeholder-slate-500 focus:border-cyan-500"
                            />
                            {tokenErrorMap[exam.id] && (
                              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {tokenErrorMap[exam.id]}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {isLimitReached && (
                        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-[11px] text-rose-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>Anda telah mencapai batas maksimal pengerjaan ({maxAttempts}x) untuk ujian ini.</span>
                        </div>
                      )}
                    </div>

                    <button
                      disabled={isLimitReached}
                      onClick={() => handleLaunchExam(exam)}
                      className={`w-full py-3 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 ${
                        isLimitReached
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/30'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>
                        {isLimitReached
                          ? `Batas Pengerjaan Terpenuhi (${attemptsCount}/${maxAttempts}x)`
                          : attemptsCount > 0
                          ? `Kerjakan Ulang (${attemptsCount + 1}/${maxAttempts === 0 ? '∞' : maxAttempts}x)`
                          : 'Mulai Kerjakan Ujian'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MARKETPLACE / STORE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-lg text-white">Toko & Katalog Buku Pendidikan</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={marketSearch}
                  onChange={e => setMarketSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              <select
                value={marketCatFilter}
                onChange={e => setMarketCatFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Buku Cetak">Buku Cetak</option>
                <option value="Paket Tryout Premium">Paket Tryout Premium</option>
                <option value="Akses Bimbel VIP">Akses Bimbel VIP</option>
                <option value="Merchandising">Merchandising</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(p => p.status === 'ACTIVE')
              .filter(p => marketCatFilter === 'ALL' || p.category === marketCatFilter)
              .filter(p => p.name.toLowerCase().includes(marketSearch.toLowerCase()))
              .map(prod => (
                <div
                  key={prod.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/50">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors">
                        {prod.name}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-3">{prod.description}</p>

                      <p className="font-extrabold text-xl text-amber-400 pt-2">
                        {formatRupiah(prod.price)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 border-t border-slate-800">
                    <a
                      href={prod.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Beli Sekarang / Order</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 0: OVERVIEW - PROD UNGGULAN SLIDE (KIRI) & ANALISIS DIAGRAM BATANG (KANAN) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* HERO 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* COLUMN 1 (LEFT): TAMPILAN SLIDE PRODUK / PROGRAM UNGGULAN */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-4">
              
              {/* Slide Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-white text-base sm:text-lg">Program Unggulan</h3>
                    <p className="text-[11px] text-slate-400">Slide Informasi & Pendaftaran Program VIP</p>
                  </div>
                </div>

                {/* Slide Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    title={isAutoPlay ? 'Jeda Slide Otomatis' : 'Putar Slide Otomatis'}
                    className={`p-2 rounded-xl border text-xs transition-all ${
                      isAutoPlay
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800/80 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handlePrevSlide}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                    title="Slide Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-black text-cyan-400 font-mono px-1">
                    {currentSlide + 1}/{activeProgramsList.length}
                  </span>

                  <button
                    onClick={handleNextSlide}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                    title="Slide Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Card Content */}
              {activeProgramsList[currentSlide] && (() => {
                const prog = activeProgramsList[currentSlide];
                return (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    
                    {/* Banner Image */}
                    <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-inner">
                      <img
                        src={prog.thumbnail}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg">
                          {prog.badge || 'PROGRAM UNGGULAN'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/90 backdrop-blur-md text-cyan-300 border border-cyan-800/60">
                          {prog.category}
                        </span>
                      </div>

                      {/* Title & Short Description Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 space-y-1 z-10">
                        <h4 className="font-black text-white text-lg sm:text-xl drop-shadow-md leading-tight">
                          {prog.title}
                        </h4>
                        <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-sm font-medium">
                          {prog.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {activeProgramsList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentSlide
                              ? 'w-7 bg-cyan-400 shadow-sm shadow-cyan-500/50'
                              : 'w-2 bg-slate-700 hover:bg-slate-500'
                          }`}
                          title={`Ke Slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => setSelectedArticleProgram(prog)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span>Lihat Selengkapnya</span>
                      </button>

                      <a
                        href={prog.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Daftar Sekarang</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                );
              })()}

            </div>

            {/* COLUMN 2 (RIGHT): GRAFIK (DIAGRAM BATANG) ANALISIS PERFORMA UJIAN */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4">
              
              {/* Header & Category Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-white text-base sm:text-lg">Analisis Performa Ujian</h3>
                    <p className="text-[11px] text-slate-400">Hasil Percobaan Terakhir Per Ujian Dalam Kategori</p>
                  </div>
                </div>

                {/* Category Filter Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <select
                    value={chartCategoryFilter}
                    onChange={e => setChartCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold rounded-xl px-3 py-1.5 focus:border-cyan-500 outline-none w-full sm:w-auto"
                  >
                    <option value="ALL">Semua Kategori ({latestStudentResults.length})</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat} ({latestStudentResults.filter(r => r.examCategory === cat).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary Metrics Bar for Category */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <div className="p-1.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Rata-rata Skor</p>
                  <p className="text-base sm:text-lg font-black text-amber-400 mt-0.5">{avgScoreCategory} Poin</p>
                </div>
                <div className="p-1.5 border-x border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Ujian Selesai</p>
                  <p className="text-base sm:text-lg font-black text-cyan-400 mt-0.5">{filteredChartResults.length} Ujian</p>
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Kelulusan</p>
                  <p className={`text-base sm:text-lg font-black mt-0.5 ${passRateCategory >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passRateCategory}% ({passedCountCategory} Lulus)
                  </p>
                </div>
              </div>

              {/* Diagram Batang (Bar Chart) Visual */}
              {barChartData.length > 0 ? (
                <div className="h-64 sm:h-72 w-full bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80 pt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} />
                      <YAxis stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} domain={[0, 'auto']} />
                      <RechartsTooltip content={<CustomBarChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar dataKey="score" name="Skor Akhir" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="benar" name="Benar" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="salah" name="Salah" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="kosong" name="Kosong" fill="#64748b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                /* Empty State when no results for category */
                <div className="h-64 sm:h-72 w-full bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
                    <BarChart3 className="w-8 h-8 text-cyan-500/50" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <p className="text-xs font-bold text-slate-300">Belum Ada Data Ujian pada Kategori Ini</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Selesaikan ujian pada kategori <span className="text-cyan-400 font-semibold">{chartCategoryFilter === 'ALL' ? 'apapun' : chartCategoryFilter}</span> untuk menampilkan grafik diagram batang skor, benar, salah & status kelulusan.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* ALL PUBLISHED PROGRAMS GRID BELOW HERO SECTION */}
          {activeProgramsList.length > 1 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Katalog Semua Program Bimbingan ({activeProgramsList.length})
                </h4>
                <p className="text-xs text-slate-400">Pilih program unggulan untuk masa depan Anda</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeProgramsList.map((prog, idx) => (
                  <div
                    key={prog.id || idx}
                    className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                      idx === currentSlide
                        ? 'border-cyan-500/80 shadow-lg shadow-cyan-950/40 bg-slate-900/90'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {prog.category}
                        </span>
                        {idx === currentSlide && (
                          <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Sedang Tampil
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-white text-sm leading-snug">{prog.title}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2">{prog.shortDesc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <button
                        onClick={() => {
                          setCurrentSlide(idx);
                          setSelectedArticleProgram(prog);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                      >
                        <span>Detail Artikel</span> →
                      </button>

                      <a
                        href={prog.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <span>Daftar</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: HASIL & RIWAYAT UJIAN */}
      {activeTab === 'history' && (

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-lg text-white">Riwayat, Analisis Grafik & Pembahasan Hasil Ujian</h3>
            </div>
          </div>

          {studentResults.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <History className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Belum ada riwayat pengerjaan ujian.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Summary Analytics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Ujian Diikuti</p>
                    <p className="text-2xl font-black text-white">{studentResults.length} Ujian</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Rata-Rata Skor Saya</p>
                    <p className="text-2xl font-black text-amber-400">
                      {Math.round(studentResults.reduce((acc, r) => acc + r.score, 0) / studentResults.length)} Poin
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Status Lulus Ujian</p>
                    <p className="text-2xl font-black text-emerald-400">
                      {studentResults.filter(r => r.isPassed).length} / {studentResults.length} Lulus
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Exam Result List with Graphical Bar */}
              <div className="space-y-4">
                {studentResults.map(res => {
                  const attInfo = attemptInfoMap.get(res.id);
                  const totalQuestions = res.correctCount + res.incorrectCount + res.unansweredCount || 1;
                  const correctPct = Math.round((res.correctCount / totalQuestions) * 100);
                  const incorrectPct = Math.round((res.incorrectCount / totalQuestions) * 100);
                  const unansweredPct = Math.max(0, 100 - correctPct - incorrectPct);

                  return (
                    <div
                      key={res.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/50">
                              {res.examCategory}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800/80 shadow-sm">
                              Percobaan Ke-{attInfo?.attemptNumber || 1} (dari {attInfo?.totalAttempts || 1}x)
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">• {res.submittedAt}</span>
                          </div>

                          <h4 className="font-extrabold text-white text-lg">{res.examTitle}</h4>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Pass Status Badge */}
                          <div>
                            {res.isPassed ? (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-700/80 flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                LULUS
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-950 text-rose-400 border border-rose-700/80 flex items-center gap-1.5 shadow-sm">
                                <X className="w-4 h-4 text-rose-400" />
                                TIDAK LULUS
                              </span>
                            )}
                          </div>

                          {/* Score Badge */}
                          <div className="text-right pl-3 border-l border-slate-800">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Skor Akhir</p>
                            <p className="text-3xl font-black text-amber-400">{res.score}</p>
                          </div>
                        </div>
                      </div>

                      {/* Graphical Analysis Component */}
                      <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-300">Analisis Prosentase Hasil Soal:</span>
                          <div className="flex items-center gap-4 text-[11px]">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Benar: {res.correctCount} ({correctPct}%)
                            </span>
                            <span className="text-rose-400 flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Salah: {res.incorrectCount} ({incorrectPct}%)
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Kosong: {res.unansweredCount} ({unansweredPct}%)
                            </span>
                          </div>
                        </div>

                        {/* Stacked Progress Bar (Graphic) */}
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            style={{ width: `${correctPct}%` }}
                            className="bg-emerald-500 transition-all duration-500 h-full"
                            title={`Benar: ${correctPct}%`}
                          />
                          <div
                            style={{ width: `${incorrectPct}%` }}
                            className="bg-rose-500 transition-all duration-500 h-full"
                            title={`Salah: ${incorrectPct}%`}
                          />
                          <div
                            style={{ width: `${unansweredPct}%` }}
                            className="bg-slate-600 transition-all duration-500 h-full"
                            title={`Kosong: ${unansweredPct}%`}
                          />
                        </div>
                      </div>

                      {/* Bottom action button */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setReviewResult(res)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Buka Laporan Detail & Pembahasan Soal
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL PREVIEW MATERI */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full h-[85vh] flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{previewMaterial.title}</h3>
                <p className="text-xs text-slate-400">Target: {previewMaterial.targetClass} • Tipe: {previewMaterial.mediaType}</p>
              </div>
              <button onClick={() => setPreviewMaterial(null)} className="p-1.5 bg-slate-800 text-slate-300 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              {previewMaterial.mediaType === 'VIDEO' ? (
                <iframe
                  src={previewMaterial.url}
                  title={previewMaterial.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={
                    previewMaterial.url.includes('google.com') || previewMaterial.url.endsWith('.pdf')
                      ? previewMaterial.url
                      : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(previewMaterial.url)}`
                  }
                  title={previewMaterial.title}
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL REVIEW RESULTS & PEMBAHASAN */}
      {reviewResult && (() => {
        const matchingExam = exams.find(e => e.id === reviewResult.examId);
        const canShowDiscussion = matchingExam ? (matchingExam.showDiscussion !== false) : true;
        const totalQuestionsCount = reviewResult.correctCount + reviewResult.incorrectCount + reviewResult.unansweredCount || 1;
        const accuracyPct = Math.round((reviewResult.correctCount / totalQuestionsCount) * 100);

        const pieData = [
          { name: 'Benar', value: reviewResult.correctCount, color: '#10b981' },
          { name: 'Salah', value: reviewResult.incorrectCount, color: '#f43f5e' },
          { name: 'Kosong', value: reviewResult.unansweredCount, color: '#64748b' }
        ].filter(d => d.value > 0);

        // Helper to format answers for display
        const formatAnswerDisplay = (ans: any) => {
          if (!ans && ans !== 0) return '(Kosong / Tidak Dijawab)';
          if (Array.isArray(ans)) return ans.join(', ');
          if (typeof ans === 'object') {
            return Object.entries(ans)
              .map(([stmtId, val]) => {
                const statementObj = matchingExam?.questions?.flatMap(q => q.statements || []).find(s => s.id === stmtId);
                const textSnippet = statementObj ? statementObj.text.slice(0, 20) + '...' : stmtId;
                return `${textSnippet}: ${val === 'TRUE' ? 'BENAR' : 'SALAH'}`;
              })
              .join(' | ');
          }
          if (ans === 'TRUE') return 'BENAR';
          if (ans === 'FALSE') return 'SALAH';
          return String(ans);
        };

        // Questions to review
        const questionList: Question[] = matchingExam?.questions && matchingExam.questions.length > 0
          ? matchingExam.questions
          : Object.keys(reviewResult.answers).map((qId, i) => ({
              id: qId,
              number: i + 1,
              text: `Soal Nomor ${i + 1}`,
              questionType: 'SINGLE_CHOICE',
              weight: 1,
              correctAnswer: 'A',
              discussion: 'Pembahasan resmi Brain Space Academy.'
            }));

        return (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-4xl w-full max-h-[92vh] flex flex-col space-y-5 shadow-2xl relative overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                      {reviewResult.examCategory}
                    </span>
                    {(() => {
                      const att = attemptInfoMap.get(reviewResult.id);
                      return (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800/80 shadow-sm">
                          Percobaan Ke-{att?.attemptNumber || 1} (dari {att?.totalAttempts || 1}x)
                        </span>
                      );
                    })()}
                    <span className="text-xs text-slate-400 font-medium">• {reviewResult.submittedAt}</span>
                    {reviewResult.isPassed ? (
                      <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> LULUS
                      </span>
                    ) : (
                      <span className="px-3 py-0.5 rounded-full text-xs font-black bg-rose-950 text-rose-300 border border-rose-700/80 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" /> TIDAK LULUS
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-white text-lg sm:text-xl">{reviewResult.examTitle}</h3>
                </div>

                <button
                  onClick={() => setReviewResult(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
                
                {/* 1. VISUAL GRAFIK DATA & ANALISIS SKOR AKHIR */}
                <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-extrabold text-sm sm:text-base text-white">Visual Grafik Data & Ringkasan Hasil Ujian</h4>
                    </div>
                    <span className="text-xs text-cyan-400 font-bold bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/60">
                      Akurasi: {accuracyPct}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Donut Chart Visual */}
                    <div className="md:col-span-5 h-52 relative flex items-center justify-center bg-slate-900/60 rounded-2xl p-2 border border-slate-800/60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChartIcon>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#020617" strokeWidth={2} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                          />
                        </PieChartIcon>
                      </ResponsiveContainer>

                      {/* Center Gauge Text inside Donut */}
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Skor Akhir</span>
                        <span className="text-2xl font-black text-amber-400">{reviewResult.score}</span>
                        <span className="text-[9px] text-slate-500">Passing: {matchingExam?.passingScore || 70}</span>
                      </div>
                    </div>

                    {/* Metric Breakdown Cards Grid */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      
                      <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">Jawaban Benar</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-black text-emerald-300 mt-2">{reviewResult.correctCount} <span className="text-xs font-semibold text-emerald-500">Soal</span></p>
                      </div>

                      <div className="p-3.5 bg-rose-950/30 border border-rose-800/50 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-rose-400 font-bold uppercase">Jawaban Salah</span>
                          <XCircle className="w-4 h-4 text-rose-400" />
                        </div>
                        <p className="text-2xl font-black text-rose-300 mt-2">{reviewResult.incorrectCount} <span className="text-xs font-semibold text-rose-500">Soal</span></p>
                      </div>

                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Tidak Dijawab</span>
                          <HelpCircle className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-2xl font-black text-slate-300 mt-2">{reviewResult.unansweredCount} <span className="text-xs font-semibold text-slate-500">Soal</span></p>
                      </div>

                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Percobaan Ke</span>
                        <p className="text-xl font-black text-amber-300 mt-2">
                          Ke-{attemptInfoMap.get(reviewResult.id)?.attemptNumber || 1} <span className="text-xs font-semibold text-slate-400">(dari {attemptInfoMap.get(reviewResult.id)?.totalAttempts || 1}x)</span>
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Soal</span>
                        <p className="text-xl font-black text-white mt-2">{totalQuestionsCount} Soal</p>
                      </div>

                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">KKM Lulus</span>
                        <p className="text-xl font-black text-amber-400 mt-2">{matchingExam?.passingScore || 70} Poin</p>
                      </div>

                      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Status Lulus</span>
                        <p className={`text-sm font-extrabold mt-2 ${reviewResult.isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {reviewResult.isPassed ? 'LULUS (MEMENUHI)' : 'TIDAK LULUS'}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 2. ANALISIS PER BUTIR SOAL & PEMBAHASAN */}
                {canShowDiscussion ? (
                  <div className="space-y-4">
                    
                    {/* Header + Filter Tabs for Questions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <h4 className="font-extrabold text-base text-white">Analisis Jawaban & Pembahasan Per Soal</h4>
                      </div>

                      {/* Filter Buttons */}
                      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                        <button
                          onClick={() => setReviewFilter('ALL')}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            reviewFilter === 'ALL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Semua ({questionList.length})
                        </button>
                        <button
                          onClick={() => setReviewFilter('CORRECT')}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            reviewFilter === 'CORRECT' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Benar ({reviewResult.correctCount})
                        </button>
                        <button
                          onClick={() => setReviewFilter('INCORRECT')}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            reviewFilter === 'INCORRECT' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Salah ({reviewResult.incorrectCount})
                        </button>
                        <button
                          onClick={() => setReviewFilter('UNANSWERED')}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            reviewFilter === 'UNANSWERED' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Kosong ({reviewResult.unansweredCount})
                        </button>
                      </div>
                    </div>

                    {/* Question List */}
                    <div className="space-y-4">
                      {questionList
                        .filter((q) => {
                          const studentAnsObj = reviewResult.answers[q.id];
                          const rawAns = studentAnsObj?.answer;
                          const isUnanswered = rawAns === undefined || rawAns === null || rawAns === '' || (Array.isArray(rawAns) && rawAns.length === 0);

                          let isCorrect = false;
                          if (q.questionType === 'SINGLE_CHOICE') {
                            isCorrect = String(rawAns).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
                          } else if (q.questionType === 'COMPLEX_CHOICE') {
                            const studentArr = Array.isArray(rawAns) ? rawAns : [rawAns];
                            const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
                            const sortedS = [...studentArr].map(s => String(s).trim().toUpperCase()).sort().join(',');
                            const sortedC = [...correctArr].map(c => String(c).trim().toUpperCase()).sort().join(',');
                            isCorrect = sortedS === sortedC;
                          } else if (q.questionType === 'TRUE_FALSE') {
                            if (q.statements && q.statements.length > 0) {
                              const ansObj = (typeof rawAns === 'object' && !Array.isArray(rawAns)) ? rawAns : {};
                              let matches = 0;
                              q.statements.forEach(s => {
                                if (ansObj[s.id] === s.correctAnswer) matches++;
                              });
                              isCorrect = matches === q.statements.length;
                            } else {
                              isCorrect = String(rawAns).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
                            }
                          } else if (q.questionType === 'ESSAY') {
                            const expected = String(q.correctAnswer).trim().toLowerCase();
                            const actual = String(rawAns).trim().toLowerCase();
                            isCorrect = actual.length > 0 && actual.includes(expected);
                          }

                          if (reviewFilter === 'CORRECT') return !isUnanswered && isCorrect;
                          if (reviewFilter === 'INCORRECT') return !isUnanswered && !isCorrect;
                          if (reviewFilter === 'UNANSWERED') return isUnanswered;
                          return true;
                        })
                        .map((q, idx) => {
                          const studentAnsObj = reviewResult.answers[q.id];
                          const rawAns = studentAnsObj?.answer;
                          const isUnanswered = rawAns === undefined || rawAns === null || rawAns === '' || (Array.isArray(rawAns) && rawAns.length === 0);

                          let status: 'CORRECT' | 'INCORRECT' | 'UNANSWERED' = 'INCORRECT';
                          if (isUnanswered) {
                            status = 'UNANSWERED';
                          } else if (q.questionType === 'SINGLE_CHOICE') {
                            if (String(rawAns).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase()) {
                              status = 'CORRECT';
                            }
                          } else if (q.questionType === 'COMPLEX_CHOICE') {
                            const studentArr = Array.isArray(rawAns) ? rawAns : [rawAns];
                            const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
                            const sortedS = [...studentArr].map(s => String(s).trim().toUpperCase()).sort().join(',');
                            const sortedC = [...correctArr].map(c => String(c).trim().toUpperCase()).sort().join(',');
                            if (sortedS === sortedC) status = 'CORRECT';
                          } else if (q.questionType === 'TRUE_FALSE') {
                            if (q.statements && q.statements.length > 0) {
                              const ansObj = (typeof rawAns === 'object' && !Array.isArray(rawAns)) ? rawAns : {};
                              let matches = 0;
                              q.statements.forEach(s => {
                                if (ansObj[s.id] === s.correctAnswer) matches++;
                              });
                              if (matches === q.statements.length) status = 'CORRECT';
                            } else {
                              if (String(rawAns).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase()) status = 'CORRECT';
                            }
                          } else if (q.questionType === 'ESSAY') {
                            const expected = String(q.correctAnswer).trim().toLowerCase();
                            const actual = String(rawAns).trim().toLowerCase();
                            if (actual.length > 0 && actual.includes(expected)) status = 'CORRECT';
                          }

                          return (
                            <div
                              key={q.id || idx}
                              className={`p-5 bg-slate-950 border rounded-3xl space-y-4 shadow-lg transition-all ${
                                status === 'CORRECT'
                                  ? 'border-emerald-900/60 hover:border-emerald-700/80'
                                  : status === 'UNANSWERED'
                                  ? 'border-slate-800 hover:border-slate-700'
                                  : 'border-rose-900/60 hover:border-rose-700/80'
                              }`}
                            >
                              {/* Question Top Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                                    Soal Nomor {q.number || idx + 1}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                                    Bobot: {q.weight || 1} Poin
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                                    Tipe: {q.questionType}
                                  </span>
                                </div>

                                {/* Question Status Badge */}
                                <div>
                                  {status === 'CORRECT' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      JAWABAN BENAR
                                    </span>
                                  )}
                                  {status === 'INCORRECT' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-950 text-rose-300 border border-rose-700/80 flex items-center gap-1.5">
                                      <XCircle className="w-4 h-4 text-rose-400" />
                                      JAWABAN SALAH
                                    </span>
                                  )}
                                  {status === 'UNANSWERED' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1.5">
                                      <HelpCircle className="w-4 h-4 text-slate-500" />
                                      TIDAK DIJAWAB
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Question Text & Image */}
                              <div className="space-y-3">
                                <p className="text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                                  {q.text}
                                </p>
                                {q.imageUrl && (
                                  <img
                                    src={q.imageUrl}
                                    alt={`Gambar Soal ${q.number}`}
                                    className="max-h-60 rounded-2xl object-contain border border-slate-800 bg-slate-900 p-2"
                                  />
                                )}
                              </div>

                              {/* Answer Analysis Box */}
                              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                                <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                  <BarChart2 className="w-4 h-4 text-cyan-400" /> Analisis Evaluasi Jawaban:
                                </p>

                                {/* TRUE_FALSE STATEMENT TABLE REVIEW */}
                                {q.questionType === 'TRUE_FALSE' && q.statements && q.statements.length > 0 ? (
                                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                                          <th className="p-2.5 w-8 text-center">#</th>
                                          <th className="p-2.5">Pernyataan</th>
                                          <th className="p-2.5 text-center">Jawaban Anda</th>
                                          <th className="p-2.5 text-center">Kunci Benar</th>
                                          <th className="p-2.5 text-center">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-800/60">
                                        {q.statements.map((stmt, sIdx) => {
                                          const ansObj = (typeof rawAns === 'object' && !Array.isArray(rawAns)) ? rawAns : {};
                                          const stdVal = ansObj[stmt.id];
                                          const isStmtCorrect = stdVal === stmt.correctAnswer;

                                          return (
                                            <tr key={stmt.id || sIdx}>
                                              <td className="p-2.5 text-center font-bold text-cyan-400">{sIdx + 1}</td>
                                              <td className="p-2.5 text-slate-200">{stmt.text}</td>
                                              <td className="p-2.5 text-center font-bold">
                                                {stdVal ? (stdVal === 'TRUE' ? <span className="text-emerald-400">BENAR</span> : <span className="text-rose-400">SALAH</span>) : <span className="text-slate-500">(Kosong)</span>}
                                              </td>
                                              <td className="p-2.5 text-center font-bold text-emerald-400">
                                                {stmt.correctAnswer === 'TRUE' ? 'BENAR' : 'SALAH'}
                                              </td>
                                              <td className="p-2.5 text-center font-bold">
                                                {isStmtCorrect ? (
                                                  <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">✓ TEPAT</span>
                                                ) : (
                                                  <span className="text-rose-400 text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-800">✗ SALAH</span>
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  /* STANDARD OPTIONS REVIEW */
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                                      <span className="text-[10px] text-slate-400 uppercase font-bold">Jawaban Siswa:</span>
                                      <p className={`font-bold ${status === 'CORRECT' ? 'text-emerald-400' : status === 'UNANSWERED' ? 'text-slate-500' : 'text-rose-400'}`}>
                                        {formatAnswerDisplay(rawAns)}
                                      </p>
                                    </div>

                                    <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-1">
                                      <span className="text-[10px] text-emerald-400 uppercase font-bold">Kunci Jawaban Resmi:</span>
                                      <p className="font-bold text-emerald-300">
                                        {formatAnswerDisplay(q.correctAnswer)}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Official Explanation Box */}
                              <div className="p-4 bg-cyan-950/30 border border-cyan-800/50 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                                  <Sparkles className="w-4 h-4 text-cyan-400" />
                                  <span>Pembahasan & Analisis Soal Resmi:</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                                  {q.discussion || 'Pembahasan resmi Brain Space Academy: Pilihan jawaban di atas dihitung secara sistematis sesuai standar kunci evaluasi ujian.'}
                                </p>
                              </div>

                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  /* HIDDEN DISCUSSION NOTICE BANNER */
                  <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl text-center space-y-4 shadow-xl">
                    <div className="p-4 bg-rose-950/50 border border-rose-800/60 rounded-2xl w-max mx-auto text-rose-400">
                      <EyeOff className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="text-base font-extrabold text-white">Pembahasan Detail Per Soal Dibatasi Penguji</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Penguji/Admin Sekolah menonaktifkan tampilan pembahasan detail per butir soal untuk ujian ini. Anda dapat melihat grafik statistik nilai akhir, akurasi, dan status kelulusan Anda pada diagram di atas.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL LIHAT SELENGKAPNYA (ARTIKEL DESKRIPSI PROGRAM UNGGULAN) */}
      {selectedArticleProgram && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full my-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedArticleProgram(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-full border border-slate-800 transition-all hover:bg-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Image & Titles */}
            <div className="h-64 w-full rounded-2xl overflow-hidden relative bg-slate-950">
              <img
                src={selectedArticleProgram.thumbnail}
                alt={selectedArticleProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-blue-600 text-white w-max mb-2">
                  {selectedArticleProgram.badge || 'PROGRAM UNGGULAN'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedArticleProgram.title}</h2>
                <p className="text-xs text-cyan-300 font-semibold">{selectedArticleProgram.category}</p>
              </div>
            </div>

            {/* Formatted Article Content Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 whitespace-pre-line bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
              {selectedArticleProgram.articleContent || selectedArticleProgram.shortDesc}
            </div>

            {/* Registration Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Segera bergabung bersama Brain Space Academy untuk persiapan maksimal!
              </p>

              <a
                href={selectedArticleProgram.registerUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
              >
                <span>Daftar Program Sekarang</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

