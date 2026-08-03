import React, { useState } from 'react';
import { ExamResult, ClassItem, ExamCategory } from '../../types';
import {
  BarChart3,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Trophy,
  Award,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  FileCheck2,
  Eye,
  TrendingUp,
  Clock,
  User,
  BookOpen,
  BarChart2,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface ExamReportsProps {
  results: ExamResult[];
  classes: ClassItem[];
  categories: ExamCategory[];
  onSaveResult?: (result: ExamResult) => void;
  onDeleteResult?: (resultId: string) => void;
}

export const ExamReports: React.FC<ExamReportsProps> = ({
  results,
  classes,
  categories,
  onSaveResult,
  onDeleteResult
}) => {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedPassStatus, setSelectedPassStatus] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByScore, setSortByScore] = useState(true);

  // Detail Modal & CRUD Modal State
  const [selectedDetailResult, setSelectedDetailResult] = useState<ExamResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentNis, setStudentNis] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [score, setScore] = useState(75);
  const [isPassed, setIsPassed] = useState(true);

  // Helper function to parse submittedAt timestamp safely
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

  // Calculate attempt numbers per student per exam
  const attemptInfoMap = new Map<string, { attemptNumber: number; totalAttempts: number }>();
  const studentExamAttemptsMap = new Map<string, ExamResult[]>();

  results.forEach(r => {
    const studentKey = r.studentId || r.studentNis || r.studentName;
    const examKey = r.examId || r.examTitle;
    const combinedKey = `${studentKey}___${examKey}`;

    if (!studentExamAttemptsMap.has(combinedKey)) {
      studentExamAttemptsMap.set(combinedKey, []);
    }
    studentExamAttemptsMap.get(combinedKey)!.push(r);
  });

  studentExamAttemptsMap.forEach(attempts => {
    // Sort chronologically ascending
    attempts.sort((a, b) => parseSubmittedTimestamp(a.submittedAt) - parseSubmittedTimestamp(b.submittedAt));
    attempts.forEach((r, idx) => {
      attemptInfoMap.set(r.id, { attemptNumber: idx + 1, totalAttempts: attempts.length });
    });
  });

  const openFormModal = (res?: ExamResult) => {
    if (res) {
      setEditingResult(res);
      setStudentName(res.studentName);
      setStudentNis(res.studentNis);
      setStudentClass(res.studentClass);
      setExamTitle(res.examTitle);
      setExamCategory(res.examCategory);
      setCorrectCount(res.correctCount);
      setIncorrectCount(res.incorrectCount);
      setUnansweredCount(res.unansweredCount);
      setScore(res.score);
      setIsPassed(res.isPassed);
    } else {
      setEditingResult(null);
      setStudentName('');
      setStudentNis('');
      setStudentClass(classes[0]?.name || 'XII-UTBK');
      setExamTitle('Simulasi SNBT 2026 - Kemampuan Penalaran Umum');
      setExamCategory(categories[0]?.name || 'SNBT 2026');
      setCorrectCount(8);
      setIncorrectCount(2);
      setUnansweredCount(0);
      setScore(80);
      setIsPassed(true);
    }
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !examTitle.trim()) return;

    const newResult: ExamResult = {
      id: editingResult ? editingResult.id : `res-${Date.now()}`,
      examId: editingResult ? editingResult.examId : `exam-${Date.now()}`,
      examTitle,
      examCategory,
      studentId: editingResult ? editingResult.studentId : `std-${Date.now()}`,
      studentNis: studentNis || '20261000',
      studentName,
      studentClass,
      answers: editingResult ? editingResult.answers : {},
      correctCount: Number(correctCount),
      incorrectCount: Number(incorrectCount),
      unansweredCount: Number(unansweredCount),
      score: Number(score),
      maxScore: 100,
      percentage: Number(score),
      isPassed,
      submittedAt: editingResult ? editingResult.submittedAt : new Date().toLocaleString('id-ID'),
      durationSpentSeconds: editingResult ? editingResult.durationSpentSeconds : 1800
    };

    if (onSaveResult) {
      onSaveResult(newResult);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus data hasil ujian untuk siswa "${name}"?`)) {
      if (onDeleteResult) {
        onDeleteResult(id);
      }
    }
  };

  // Filter & Sorting
  const filtered = results.filter(r => {
    const matchesClass = selectedClass === 'ALL' || r.studentClass === selectedClass;
    const matchesCat = selectedCat === 'ALL' || r.examCategory === selectedCat;
    const matchesPass =
      selectedPassStatus === 'ALL' ||
      (selectedPassStatus === 'PASSED' && r.isPassed) ||
      (selectedPassStatus === 'FAILED' && !r.isPassed);
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentNis.includes(searchTerm) ||
      r.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesCat && matchesPass && matchesSearch;
  });

  const sortedResults = [...filtered].sort((a, b) => {
    if (sortByScore) return b.score - a.score;
    return parseSubmittedTimestamp(b.submittedAt) - parseSubmittedTimestamp(a.submittedAt);
  });

  // Calculate High-level Analytics
  const totalSubmissions = results.length;
  const passedCount = results.filter(r => r.isPassed).length;
  const avgScore = totalSubmissions > 0
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions)
    : 0;

  // CSV Export Handler
  const exportToCSV = () => {
    const headers = ['Nama Siswa', 'NIS', 'Kelas', 'Ujian', 'Kategori', 'Percobaan Ujian', 'Benar', 'Salah', 'Kosong', 'Skor Akhir', 'Status', 'Waktu Submit'];
    const rows = sortedResults.map(r => {
      const att = attemptInfoMap.get(r.id) || { attemptNumber: 1, totalAttempts: 1 };
      return [
        `"${r.studentName}"`,
        `"${r.studentNis}"`,
        `"${r.studentClass}"`,
        `"${r.examTitle}"`,
        `"${r.examCategory}"`,
        `"Percobaan Ke-${att.attemptNumber} (dari ${att.totalAttempts}x)"`,
        r.correctCount,
        r.incorrectCount,
        r.unansweredCount,
        r.score,
        r.isPassed ? 'LULUS' : 'TIDAK LULUS',
        `"${r.submittedAt}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Hasil_Ujian_BrainSpace_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Laporan Hasil & Analisis Ujian Siswa</h2>
          </div>
          <p className="text-xs text-slate-400">
            Rekapitulasi skor, perbandingan lulus/tidak lulus, kelola data hasil (CRUD), serta ekspor laporan ke PDF dan CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onSaveResult && (
            <button
              onClick={() => openFormModal()}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Hasil Manual
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Ekspor CSV / Excel
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Cetak PDF
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Peserta Submit</p>
            <h4 className="text-2xl font-extrabold text-white">{totalSubmissions} Siswa</h4>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Rata-Rata Skor Nasional</p>
            <h4 className="text-2xl font-extrabold text-emerald-400">{avgScore} Poin</h4>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tingkat Kelulusan</p>
            <h4 className="text-2xl font-extrabold text-blue-300">
              {totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0}% ({passedCount}/{totalSubmissions})
            </h4>
          </div>
        </div>
      </div>

      {/* Filters & Sorting Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari siswa, NIS, atau judul ujian..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-red-500 rounded-2xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-4 h-4" /> Kelas:
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            Kategori:
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            Kelulusan:
            <select
              value={selectedPassStatus}
              onChange={e => setSelectedPassStatus(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-semibold"
            >
              <option value="ALL">Semua Status</option>
              <option value="PASSED">✓ LULUS SAJA</option>
              <option value="FAILED">✗ TIDAK LULUS SAJA</option>
            </select>
          </div>

          <button
            onClick={() => setSortByScore(!sortByScore)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              sortByScore
                ? 'bg-blue-950 text-blue-300 border-blue-800'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {sortByScore ? 'Urutkan: Ranking Skor (Tinggi ke Rendah)' : 'Urutkan: Waktu Terbaru'}
          </button>
        </div>
      </div>

      {/* Report Printable Area & Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl print:border-none print:bg-white print:text-black">
        
        {/* Printable Header */}
        <div className="hidden print:block p-6 text-center border-b border-gray-300 space-y-1">
          <h1 className="text-xl font-bold text-black">BRAIN SPACE ACADEMY</h1>
          <h2 className="text-sm font-semibold text-gray-700">LAPORAN REKAPITULASI HASIL UJIAN SISWA (CBT)</h2>
          <p className="text-xs text-gray-500">Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 print:text-black">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800 print:bg-gray-100 print:text-black">
              <tr>
                <th className="p-4">Peringkat</th>
                <th className="p-4">Nama Siswa</th>
                <th className="p-4">NIS</th>
                <th className="p-4">Kelas</th>
                <th className="p-4">Nama Ujian & Kategori</th>
                <th className="p-4 text-center">Percobaan</th>
                <th className="p-4 text-center">B / S / K</th>
                <th className="p-4 text-center">Skor Akhir</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Waktu Submit</th>
                <th className="p-4 text-center print:hidden">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
              {sortedResults.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    Belum ada data hasil ujian yang masuk.
                  </td>
                </tr>
              ) : (
                sortedResults.map((res, index) => {
                  const att = attemptInfoMap.get(res.id) || { attemptNumber: 1, totalAttempts: 1 };
                  return (
                    <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold text-center">
                        {index === 0 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs">1</span>}
                        {index === 1 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 font-extrabold text-xs">2</span>}
                        {index === 2 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-extrabold text-xs">3</span>}
                        {index > 2 && <span className="text-slate-500">#{index + 1}</span>}
                      </td>

                      <td className="p-4 font-semibold text-slate-100 print:text-black">{res.studentName}</td>
                      <td className="p-4 font-mono text-cyan-400 font-semibold print:text-black">{res.studentNis}</td>
                      <td className="p-4">{res.studentClass}</td>
                      <td className="p-4 font-medium text-slate-300 print:text-black">
                        <div>{res.examTitle}</div>
                        <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">{res.examCategory}</div>
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-950/80 text-amber-300 border border-amber-800/80 shadow-sm print:bg-amber-100 print:text-amber-800">
                          Ke-{att.attemptNumber} <span className="font-medium text-slate-400 print:text-gray-600">({att.totalAttempts}x)</span>
                        </span>
                      </td>

                      <td className="p-4 text-center font-mono">
                        <span className="text-emerald-400 font-bold">{res.correctCount}</span> /{' '}
                        <span className="text-rose-400 font-bold">{res.incorrectCount}</span> /{' '}
                        <span className="text-slate-400">{res.unansweredCount}</span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="text-base font-extrabold text-amber-400">
                          {res.score}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        {res.isPassed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> LULUS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 print:bg-rose-100 print:text-rose-800">
                            <XCircle className="w-3 h-3" /> TIDAK LULUS
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right text-slate-500 text-[11px] print:text-black">{res.submittedAt}</td>

                      {/* Admin CRUD & Detail Action Buttons */}
                      <td className="p-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedDetailResult(res)}
                            className="px-2.5 py-1.5 bg-cyan-950 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-800/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Lihat Detail & Analisis Grafik"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat Detail
                          </button>
                          <button
                            onClick={() => openFormModal(res)}
                            className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all"
                            title="Edit Hasil"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(res.id, res.studentName)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-all"
                            title="Hapus Hasil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL RESULT MODAL WITH GRAPHICAL PERFORMANCE ANALYSIS */}
      {selectedDetailResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-800">
                    {selectedDetailResult.examCategory}
                  </span>
                  {(() => {
                    const att = attemptInfoMap.get(selectedDetailResult.id) || { attemptNumber: 1, totalAttempts: 1 };
                    return (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800">
                        Percobaan Ke-{att.attemptNumber} (dari {att.totalAttempts}x)
                      </span>
                    );
                  })()}
                  {selectedDetailResult.isPassed ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> LULUS
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-400" /> TIDAK LULUS
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-white">{selectedDetailResult.examTitle}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <strong className="text-slate-200">{selectedDetailResult.studentName}</strong> ({selectedDetailResult.studentNis}) • {selectedDetailResult.studentClass}
                </p>
              </div>

              <button
                onClick={() => setSelectedDetailResult(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Skor Akhir</span>
                <p className="text-2xl font-black text-amber-400 mt-1">{selectedDetailResult.score} <span className="text-xs font-normal text-slate-500">/ 100</span></p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Jawaban Benar</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{selectedDetailResult.correctCount} <span className="text-xs font-normal text-slate-500">Soal</span></p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Jawaban Salah</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{selectedDetailResult.incorrectCount} <span className="text-xs font-normal text-slate-500">Soal</span></p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Durasi Pengerjaan</span>
                <p className="text-lg font-black text-cyan-300 mt-1">
                  {Math.floor((selectedDetailResult.durationSpentSeconds || 0) / 60)}m {(selectedDetailResult.durationSpentSeconds || 0) % 60}s
                </p>
              </div>
            </div>

            {/* Graphical Performance Analysis */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <h4 className="font-extrabold text-white text-base">Analisis Grafik Hasil Ujian Siswa</h4>
              </div>

              {/* Bar Chart Breakdown for Selected Attempt */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-300">Rincian Komposisi Jawaban & Skor</p>
                  <span className="text-[11px] text-slate-500">Waktu Submit: {selectedDetailResult.submittedAt}</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Jawaban Benar', jumlah: selectedDetailResult.correctCount },
                        { name: 'Jawaban Salah', jumlah: selectedDetailResult.incorrectCount },
                        { name: 'Kosong/Unanswered', jumlah: selectedDetailResult.unansweredCount },
                        { name: 'Skor Akhir', jumlah: selectedDetailResult.score }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      />
                      <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                        <Cell fill="#10b981" />
                        <Cell fill="#f43f5e" />
                        <Cell fill="#64748b" />
                        <Cell fill="#f59e0b" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Historical Attempts Progress Comparison */}
              {(() => {
                const studentKey = selectedDetailResult.studentId || selectedDetailResult.studentNis || selectedDetailResult.studentName;
                const examKey = selectedDetailResult.examId || selectedDetailResult.examTitle;
                const historyList = results.filter(r => {
                  const sKey = r.studentId || r.studentNis || r.studentName;
                  const eKey = r.examId || r.examTitle;
                  return sKey === studentKey && eKey === examKey;
                }).sort((a, b) => parseSubmittedTimestamp(a.submittedAt) - parseSubmittedTimestamp(b.submittedAt));

                if (historyList.length <= 1) return null;

                const historyChartData = historyList.map((r, idx) => ({
                  name: `Percobaan #${idx + 1}`,
                  skor: r.score,
                  benar: r.correctCount,
                  salah: r.incorrectCount,
                  submittedAt: r.submittedAt,
                  isCurrent: r.id === selectedDetailResult.id
                }));

                return (
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <p className="text-xs font-bold text-amber-300">Grafik Progres Riwayat Percobaan Siswa ({historyList.length}x Percobaan)</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">Perkembangan Skor Multi-Percobaan</span>
                    </div>

                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-xs space-y-1 shadow-xl">
                                    <p className="font-extrabold text-amber-300">{d.name} {d.isCurrent ? '(Sedang Dilihat)' : ''}</p>
                                    <p className="text-white font-bold">Skor: {d.skor} Poin</p>
                                    <p className="text-emerald-400">Benar: {d.benar} | Salah: {d.salah}</p>
                                    <p className="text-[10px] text-slate-400">Submit: {d.submittedAt}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="skor" radius={[8, 8, 0, 0]}>
                            {historyChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#f59e0b' : '#3b82f6'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handlePrint()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak Laporan Detail
              </button>
              <button
                onClick={() => setSelectedDetailResult(null)}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-900/30"
              >
                Tutup Detail
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FORM MODAL ADD / EDIT EXAM RESULT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <FileCheck2 className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base">
                  {editingResult ? 'Edit Data Hasil Ujian' : 'Tambah Hasil Ujian Manual'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Siswa *</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">NIS Siswa</label>
                  <input
                    type="text"
                    value={studentNis}
                    onChange={e => setStudentNis(e.target.value)}
                    placeholder="20261001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kelas Siswa</label>
                  <select
                    value={studentClass}
                    onChange={e => setStudentClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Ujian</label>
                  <select
                    value={examCategory}
                    onChange={e => setExamCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Ujian *</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  placeholder="Simulasi SNBT 2026..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-400 mb-1">Benar</label>
                  <input
                    type="number"
                    value={correctCount}
                    onChange={e => setCorrectCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-rose-400 mb-1">Salah</label>
                  <input
                    type="number"
                    value={incorrectCount}
                    onChange={e => setIncorrectCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Kosong</label>
                  <input
                    type="number"
                    value={unansweredCount}
                    onChange={e => setUnansweredCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 mb-1">Skor Akhir</label>
                  <input
                    type="number"
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="passed-check"
                  checked={isPassed}
                  onChange={e => setIsPassed(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="passed-check" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Status Kelulusan: <span className={isPassed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{isPassed ? "LULUS" : "TIDAK LULUS"}</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/30"
                >
                  Simpan Hasil Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
