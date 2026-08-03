import React, { useState, useEffect } from 'react';
import { Exam, User, StudentAnswer, ExamResult } from '../../types';
import { formatGoogleDriveEmbedUrl, getGoogleDriveDirectViewUrl } from '../../utils/drive';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  FileText,
  ListOrdered,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  LogOut,
  ExternalLink,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

interface ExamEngineProps {
  exam: Exam;
  user: User;
  onSubmitExam: (result: ExamResult) => void;
  onCancelExam: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  exam,
  user,
  onSubmitExam,
  onCancelExam
}) => {
  // Timer State in seconds
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);

  // Student Answers State: Record<questionId, StudentAnswer>
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});

  // Active Question Index for Native CBT Mode or LJK Focus
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Modal Submit Confirmation
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // PDF Frame Zoom level (for PDF mode)
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);

  // PDF Viewer Mode Fallback
  const [useDocsViewerFallback, setUseDocsViewerFallback] = useState(false);

  // Countdown Timer Hook
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleFinalSubmit(); // Auto Submit on timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  // Format Timer mm:ss or hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam.questions[activeQuestionIndex];
  const isCatMode = exam.mode === 'NATIVE_CBT' && !!exam.isCatEnabled;

  // CAT Difficulty Helper
  const getDifficultyVal = (diff?: string): number => {
    if (diff === 'mudah') return 1;
    if (diff === 'sedang') return 2;
    if (diff === 'sulit') return 3;
    if (diff === 'hots') return 4;
    return 2;
  };

  // Check correctness of current question
  const checkIsQuestionCorrect = (q: any, studentAns: any): boolean => {
    if (studentAns === undefined || studentAns === '' || (Array.isArray(studentAns) && studentAns.length === 0)) {
      return false;
    }
    if (q.questionType === 'COMPLEX_CHOICE') {
      const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      const studentArr = Array.isArray(studentAns) ? studentAns : [studentAns];
      return correctArr.length === studentArr.length && correctArr.every((val: any) => studentArr.includes(val));
    } else if (q.questionType === 'TRUE_FALSE' && q.statements && q.statements.length > 0) {
      let matched = 0;
      q.statements.forEach((stmt: any) => {
        const choice = (studentAns as Record<string, 'TRUE' | 'FALSE'>)?.[stmt.id];
        if (choice && choice === stmt.correctAnswer) matched++;
      });
      return matched === q.statements.length;
    } else if (q.questionType === 'ESSAY') {
      const expected = String(q.correctAnswer).trim().toLowerCase();
      const given = String(studentAns).trim().toLowerCase();
      return given.includes(expected) || expected.includes(given);
    } else {
      return String(studentAns).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase();
    }
  };

  // CAT Adaptive Next Question Handler
  const handleNextQuestion = () => {
    if (!isCatMode) {
      if (activeQuestionIndex < exam.questions.length - 1) {
        setActiveQuestionIndex(prev => prev + 1);
      } else {
        setIsSubmitModalOpen(true);
      }
      return;
    }

    // CAT Mode Logic
    const isCorrect = checkIsQuestionCorrect(currentQuestion, answers[currentQuestion.id]?.answer);
    const currLevelVal = getDifficultyVal(currentQuestion.difficulty);
    // Correct -> Increase level (max 4), Wrong -> Decrease level (min 1)
    const targetLevelVal = isCorrect ? Math.min(4, currLevelVal + 1) : Math.max(1, currLevelVal - 1);

    // Find remaining unanswered questions
    const unansweredIndices = exam.questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q, idx }) => {
        if (idx === activeQuestionIndex) return false; // exclude current question
        const ans = answers[q.id]?.answer;
        return ans === undefined || ans === '' || (Array.isArray(ans) && ans.length === 0);
      });

    if (unansweredIndices.length === 0) {
      // All questions attempted/answered -> trigger submit modal
      setIsSubmitModalOpen(true);
      return;
    }

    // Pick unanswered question closest to target level
    let bestItem = unansweredIndices[0];
    let minDiff = Math.abs(getDifficultyVal(bestItem.q.difficulty) - targetLevelVal);

    for (const item of unansweredIndices) {
      const diff = Math.abs(getDifficultyVal(item.q.difficulty) - targetLevelVal);
      if (diff < minDiff) {
        minDiff = diff;
        bestItem = item;
      }
    }

    setActiveQuestionIndex(bestItem.idx);
  };

  // Handle Select Answer
  const handleSelectOption = (questionId: string, value: string, isComplex = false) => {
    const existing = answers[questionId];

    if (isComplex) {
      // Checkbox multi-select logic
      const currentList = Array.isArray(existing?.answer) ? existing.answer : [];
      let updatedList: string[];
      if (currentList.includes(value)) {
        updatedList = currentList.filter(item => item !== value);
      } else {
        updatedList = [...currentList, value];
      }

      setAnswers({
        ...answers,
        [questionId]: {
          questionId,
          answer: updatedList,
          isDoubtful: existing?.isDoubtful || false
        }
      });
    } else {
      // Single Radio / True-False / Essay (If clicked again, toggle off / reset)
      const isAlreadySelected = existing?.answer === value;
      setAnswers({
        ...answers,
        [questionId]: {
          questionId,
          answer: isAlreadySelected ? '' : value,
          isDoubtful: existing?.isDoubtful || false
        }
      });
    }
  };

  // Reset / Kosongkan Jawaban untuk Soal Tertentu
  const handleResetAnswer = (questionId: string) => {
    const existing = answers[questionId];
    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        answer: '',
        isDoubtful: false
      }
    });
  };

  // Handle True/False Multi-Statement Table Answer
  const handleSelectTrueFalseStatement = (questionId: string, statementId: string, value: 'TRUE' | 'FALSE') => {
    const existing = answers[questionId];
    const currentObj = (typeof existing?.answer === 'object' && !Array.isArray(existing?.answer) && existing?.answer !== null)
      ? { ...(existing.answer as Record<string, 'TRUE' | 'FALSE'>) }
      : {};

    currentObj[statementId] = value;

    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        answer: currentObj,
        isDoubtful: existing?.isDoubtful || false
      }
    });
  };

  // Toggle Ragu-ragu (Doubtful)
  const handleToggleDoubtful = (questionId: string) => {
    const existing = answers[questionId] || { questionId, answer: '' };
    setAnswers({
      ...answers,
      [questionId]: {
        ...existing,
        isDoubtful: !existing.isDoubtful
      }
    });
  };

  // Automatic Score Calculation Logic
  const handleFinalSubmit = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalScore = 0;
    let totalMaxScore = 0;

    exam.questions.forEach(q => {
      const weight = q.weight || 1;
      totalMaxScore += weight;

      const studentAns = answers[q.id]?.answer;

      if (studentAns === undefined || studentAns === '' || (Array.isArray(studentAns) && studentAns.length === 0)) {
        unansweredCount++;
      } else {
        // Compare with correct answer
        let isCorrect = false;

        if (q.questionType === 'COMPLEX_CHOICE') {
          // Compare array of choices
          const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
          const studentArr = Array.isArray(studentAns) ? studentAns : [studentAns];

          if (
            correctArr.length === studentArr.length &&
            correctArr.every(val => studentArr.includes(val))
          ) {
            isCorrect = true;
          }
        } else if (q.questionType === 'TRUE_FALSE' && q.statements && q.statements.length > 0) {
          // Multi-statement True/False table
          let matchedStmts = 0;
          q.statements.forEach(stmt => {
            const studentChoice = (studentAns as Record<string, 'TRUE' | 'FALSE'>)?.[stmt.id];
            if (studentChoice && studentChoice === stmt.correctAnswer) {
              matchedStmts++;
            }
          });

          if (matchedStmts === q.statements.length) {
            isCorrect = true;
          } else if (matchedStmts > 0) {
            // Partial score proportional to statements matched
            const partial = (matchedStmts / q.statements.length) * weight;
            totalScore += partial;
          }
        } else if (q.questionType === 'ESSAY') {
          // Compare case-insensitive substring
          const expected = String(q.correctAnswer).trim().toLowerCase();
          const given = String(studentAns).trim().toLowerCase();
          if (given.includes(expected) || expected.includes(given)) {
            isCorrect = true;
          }
        } else {
          // Single choice or Fallback True/False
          if (String(studentAns).trim().toUpperCase() === String(q.correctAnswer).trim().toUpperCase()) {
            isCorrect = true;
          }
        }

        if (isCorrect) {
          correctCount++;
          totalScore += weight;
        } else {
          incorrectCount++;
        }
      }
    });

    // Scale final score to 0 - 100
    const finalScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
    const isPassed = finalScore >= exam.passingScore;

    const result: ExamResult = {
      id: `res-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      examCategory: exam.category,
      studentId: user.id,
      studentNis: user.nis,
      studentName: user.name,
      studentClass: user.className,
      answers,
      correctCount,
      incorrectCount,
      unansweredCount,
      score: finalScore,
      maxScore: 100,
      percentage: finalScore,
      isPassed,
      submittedAt: new Date().toISOString(),
      durationSpentSeconds: exam.durationMinutes * 60 - timeLeftSeconds
    };

    onSubmitExam(result);
  };

  // Helper matrix counts
  const totalQuestions = exam.questions.length;
  const answerList = Object.values(answers) as StudentAnswer[];
  const answeredCount = answerList.filter(
    a => a.answer !== undefined && a.answer !== '' && (!Array.isArray(a.answer) || a.answer.length > 0)
  ).length;
  const doubtfulCount = answerList.filter(a => a.isDoubtful).length;
  const remainingCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden">
      
      {/* HEADER UJIAN (BAR ATAS) */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        {/* Bio Siswa & Judul Ujian */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shrink-0">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
              alt={user.name}
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{user.name}</span>
              <span className="text-xs text-cyan-400 font-mono font-semibold">({user.nis})</span>
              <span className="px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/50">
                {user.className}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
              {exam.title} • {exam.category}
            </p>
          </div>
        </div>

        {/* Real-time Timer Count-down & Exit/Submit Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`px-3 sm:px-4 py-2 rounded-2xl border flex items-center gap-2 font-mono font-extrabold text-xs sm:text-base shadow-inner ${
            timeLeftSeconds < 300
              ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
              : 'bg-slate-950 border-slate-800 text-cyan-400'
          }`}>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Explicit Exit Preview / Keluar Ujian Button */}
          {onCancelExam && (
            <button
              type="button"
              onClick={onCancelExam}
              className="px-3 sm:px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 hover:scale-105"
              title="Keluar dari Tampilan Ujian / Exit Preview"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar Pratinjau</span>
              <span className="sm:hidden">Exit</span>
            </button>
          )}

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Ujian</span>
          </button>
        </div>
      </header>

      {/* MAIN EXAM BODY (SPLIT VIEW vs NATIVE CBT) */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* MODE 1: EMBED GOOGLE DRIVE PDF SPLIT-SCREEN VIEW */}
        {exam.mode === 'EMBED_DRIVE_PDF' ? (
          <>
            {/* Left Column: Embed PDF Drive Document */}
            <div className={`lg:col-span-7 bg-slate-950 border-r border-slate-800 flex flex-col h-full relative ${
              isPdfExpanded ? 'fixed inset-0 z-40 bg-slate-950' : ''
            }`}>
              <div className="bg-slate-900 px-3 sm:px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                    <FileText className="w-4 h-4" /> Dokumen Naskah Soal PDF
                  </span>
                  <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Split-Screen LJK
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Switch Viewer Mode */}
                  <button
                    type="button"
                    onClick={() => setUseDocsViewerFallback(!useDocsViewerFallback)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all flex items-center gap-1 ${
                      useDocsViewerFallback
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-cyan-300'
                    }`}
                    title="Ganti Mode Reader jika PDF Google Drive tidak langsung muncul"
                  >
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    <span>{useDocsViewerFallback ? 'Mode: Docs Viewer' : 'Mode: Native Drive'}</span>
                  </button>

                  {/* Open PDF in New Tab */}
                  <a
                    href={getGoogleDriveDirectViewUrl(exam.pdfDriveUrl || 'https://drive.google.com/file/d/1Bzx7tT3i82xR1y9O0-G6kQ1h7U63N_f2/view')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg flex items-center gap-1 text-[10px] sm:text-[11px] font-bold transition-all shadow-sm"
                    title="Buka naskah PDF di tab/window baru jika iframe diblokir oleh browser"
                  >
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                    <span className="hidden md:inline">Buka di Tab Baru</span>
                    <span className="md:hidden">Tab Baru</span>
                  </a>

                  <button
                    onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 text-[11px]"
                  >
                    {isPdfExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span>{isPdfExpanded ? 'Kecilkan' : 'Perbesar'}</span>
                  </button>
                </div>
              </div>

              {/* PDF Frame Container */}
              <div className="flex-1 w-full h-full bg-slate-950 relative">
                <iframe
                  src={formatGoogleDriveEmbedUrl(
                    exam.pdfDriveUrl || 'https://drive.google.com/file/d/1Bzx7tT3i82xR1y9O0-G6kQ1h7U63N_f2/preview',
                    useDocsViewerFallback
                  )}
                  title="Naskah Soal PDF Ujian"
                  className="w-full h-full border-0"
                  allow="autoplay"
                />
              </div>

              {/* Helper Footer Banner */}
              <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">
                  💡 <strong>Petunjuk PDF</strong>: Jika PDF tidak muncul, pastikan akses Google Drive diatur ke <strong>Public (Public Viewer)</strong> atau klik <strong>&quot;Buka di Tab Baru&quot;</strong>.
                </span>
              </div>
            </div>

            {/* Right Column: LJK Digital Auto-Generated Answer Sheet */}
            <div className="lg:col-span-5 bg-slate-900 flex flex-col h-full overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4" /> Lembar Jawaban Komputer (LJK Digital)
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <span>Terjawab:</span>
                    <strong className="text-emerald-400 font-bold">{answeredCount}/{totalQuestions}</strong>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-extrabold border border-emerald-800/80">
                      {totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%
                    </span>
                  </div>
                </div>

                {/* Grafik Bar Horizontal Persentase Pengerjaan LJK (Warna Hijau) */}
                <div className="space-y-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Progress Pengerjaan Soal:
                    </span>
                    <span className="font-mono font-extrabold text-emerald-400">
                      {totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm shadow-emerald-500/50 flex items-center justify-end"
                      style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
                    >
                      {answeredCount > 0 && (
                        <div className="w-2 h-2 rounded-full bg-emerald-200 mr-0.5 shadow-sm animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* LJK Grid Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {exam.questions.map((q, idx) => {
                  const studentAns = answers[q.id]?.answer;
                  const isDoubtful = answers[q.id]?.isDoubtful || false;
                  const hasAnswer = studentAns !== undefined && studentAns !== '' && (!Array.isArray(studentAns) || studentAns.length > 0) && (typeof studentAns !== 'object' || Object.keys(studentAns).length > 0);
                  const optionsToRender = q.options && q.options.length > 0 ? q.options.map(o => o.key) : ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <div
                      key={q.id || idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDoubtful
                          ? 'bg-amber-950/40 border-amber-500/50'
                          : hasAnswer
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-bold text-slate-100 text-xs flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-300 flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          Nomor {idx + 1}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Menu Reset Jawaban */}
                          <button
                            type="button"
                            onClick={() => handleResetAnswer(q.id)}
                            disabled={!hasAnswer && !isDoubtful}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                              hasAnswer || isDoubtful
                                ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-800 text-rose-300 hover:text-rose-100 shadow-sm'
                                : 'bg-slate-900/60 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-40'
                            }`}
                            title="Reset & Kosongkan Jawaban Nomor Ini"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>Reset Jawaban</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleDoubtful(q.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              isDoubtful
                                ? 'bg-amber-500 text-slate-950 border-amber-400'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-300'
                            }`}
                          >
                            {isDoubtful ? '★ Ragu-Ragu' : 'Ragu-ragu?'}
                          </button>
                        </div>
                      </div>

                      {/* Options Buttons */}
                      <div className="flex items-center gap-2">
                        {optionsToRender.map(opt => {
                          const isSelected = Array.isArray(studentAns)
                            ? studentAns.includes(opt)
                            : studentAns === opt;

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt, q.questionType === 'COMPLEX_CHOICE')}
                              className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 ring-2 ring-cyan-400'
                                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* MODE 2: NATIVE CBT STANDARD (SINGLE QUESTION PER SLIDE + MATRIX GRID) */
          <>
            {/* Left/Center Column: Single Question View */}
            <div className="lg:col-span-8 bg-slate-900 p-6 sm:p-8 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar border-r border-slate-800">
              
              <div className="space-y-6 max-w-3xl mx-auto w-full">
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {isCatMode ? (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-950 text-purple-300 border border-purple-800/80 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Mode CAT Adaptif
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                          currentQuestion.difficulty === 'mudah' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                          currentQuestion.difficulty === 'sedang' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                          currentQuestion.difficulty === 'sulit' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                          'bg-purple-950 text-purple-300 border-purple-800'
                        }`}>
                          Level: {currentQuestion.difficulty ? currentQuestion.difficulty.toUpperCase() : 'SEDANG'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                          Soal Nomor {activeQuestionIndex + 1} dari {totalQuestions}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
                          Bobot: {currentQuestion.weight || 1} Poin
                        </span>
                      </>
                    )}
                  </div>

                  {!isCatMode && (
                    <button
                      onClick={() => handleToggleDoubtful(currentQuestion.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        answers[currentQuestion.id]?.isDoubtful
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-300'
                      }`}
                    >
                      {answers[currentQuestion.id]?.isDoubtful ? '★ RAGU-RAGU (DITANDAI)' : 'RAGU-RAGU?'}
                    </button>
                  )}
                </div>

                {/* Question Text & Image */}
                <div className="space-y-4">
                  <div
                    className={`text-base sm:text-lg text-slate-100 font-medium leading-relaxed ${
                      currentQuestion.textAlign === 'center' ? 'text-center' :
                      currentQuestion.textAlign === 'right' ? 'text-right' :
                      currentQuestion.textAlign === 'justify' ? 'text-justify' : 'text-left'
                    }`}
                    dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                  />

                  {currentQuestion.imageUrl && (
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Gambar Soal"
                      className="max-h-64 rounded-2xl object-cover border border-slate-800"
                    />
                  )}
                </div>

                {/* Answer Inputs Based on Question Type */}
                <div className="space-y-3 pt-4">
                  
                  {/* SINGLE CHOICE */}
                  {currentQuestion.questionType === 'SINGLE_CHOICE' && currentQuestion.options && (
                    <div className="space-y-2.5">
                      {currentQuestion.options.map(opt => {
                        const isSelected = answers[currentQuestion.id]?.answer === opt.key;

                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {opt.key}
                            </span>
                            <div className="flex-1">
                              {opt.text && <span className="text-sm font-medium block leading-snug" dangerouslySetInnerHTML={{ __html: opt.text }} />}
                              {opt.imageUrl && (
                                <img
                                  src={opt.imageUrl}
                                  alt={`Gambar Opsi ${opt.key}`}
                                  className="mt-2 max-h-40 rounded-xl object-contain border border-slate-800 bg-slate-950 p-1"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* COMPLEX MULTI-SELECT */}
                  {currentQuestion.questionType === 'COMPLEX_CHOICE' && currentQuestion.options && (
                    <div className="space-y-2.5">
                      <p className="text-xs text-cyan-400 font-semibold mb-2">Pilih lebih dari satu jawaban jika benar:</p>
                      {currentQuestion.options.map(opt => {
                        const currentAnsList = Array.isArray(answers[currentQuestion.id]?.answer)
                          ? (answers[currentQuestion.id]?.answer as string[])
                          : [];
                        const isChecked = currentAnsList.includes(opt.key);

                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectOption(currentQuestion.id, opt.key, true)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                              isChecked
                                ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                              isChecked ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-slate-700 bg-slate-900'
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                              {opt.text && <span className="text-sm font-medium block leading-snug" dangerouslySetInnerHTML={{ __html: opt.text }} />}
                              {opt.imageUrl && (
                                <img
                                  src={opt.imageUrl}
                                  alt={`Gambar Opsi ${opt.key}`}
                                  className="mt-2 max-h-40 rounded-xl object-contain border border-slate-800 bg-slate-950 p-1"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* TRUE / FALSE TABLE STATEMENTS */}
                  {currentQuestion.questionType === 'TRUE_FALSE' && (
                    currentQuestion.statements && currentQuestion.statements.length > 0 ? (
                      <div className="space-y-3 pt-2">
                        <p className="text-xs text-cyan-400 font-semibold mb-2">
                          Pilihlah Benar atau Salah untuk setiap pernyataan pada tabel berikut:
                        </p>

                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                          <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                              <tr className="bg-slate-900/90 text-cyan-300 font-bold border-b border-slate-800">
                                <th className="p-3.5 w-12 text-center">#</th>
                                <th className="p-3.5">Pernyataan</th>
                                <th className="p-3.5 w-28 text-center">BENAR</th>
                                <th className="p-3.5 w-28 text-center">SALAH</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {currentQuestion.statements.map((stmt, sIdx) => {
                                const currentAnsObj = answers[currentQuestion.id]?.answer;
                                const studentVal = (typeof currentAnsObj === 'object' && !Array.isArray(currentAnsObj) && currentAnsObj !== null)
                                  ? (currentAnsObj as Record<string, 'TRUE' | 'FALSE'>)[stmt.id]
                                  : undefined;

                                return (
                                  <tr key={stmt.id || sIdx} className="hover:bg-slate-900/40 transition-colors">
                                    <td className="p-3.5 text-center font-bold text-cyan-400">{sIdx + 1}</td>
                                    <td className="p-3.5 text-slate-200 font-medium leading-relaxed">{stmt.text}</td>
                                    <td className="p-3.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleSelectTrueFalseStatement(currentQuestion.id, stmt.id, 'TRUE')}
                                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                                          studentVal === 'TRUE'
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                                      </button>
                                    </td>
                                    <td className="p-3.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleSelectTrueFalseStatement(currentQuestion.id, stmt.id, 'FALSE')}
                                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                                          studentVal === 'FALSE'
                                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                      >
                                        <X className="w-3.5 h-3.5" /> Salah
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <button
                          onClick={() => handleSelectOption(currentQuestion.id, 'TRUE')}
                          className={`p-5 rounded-2xl border font-bold text-base transition-all flex items-center justify-center gap-2 ${
                            answers[currentQuestion.id]?.answer === 'TRUE'
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" /> BENAR
                        </button>

                        <button
                          onClick={() => handleSelectOption(currentQuestion.id, 'FALSE')}
                          className={`p-5 rounded-2xl border font-bold text-base transition-all flex items-center justify-center gap-2 ${
                            answers[currentQuestion.id]?.answer === 'FALSE'
                              ? 'bg-rose-950 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <X className="w-5 h-5" /> SALAH
                        </button>
                      </div>
                    )
                  )}

                  {/* ESSAY / FILL IN */}
                  {currentQuestion.questionType === 'ESSAY' && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Ketikkan Jawaban Anda secara singkat dan jelas:
                      </label>
                      <textarea
                        rows={4}
                        value={(answers[currentQuestion.id]?.answer as string) || ''}
                        onChange={e => handleSelectOption(currentQuestion.id, e.target.value)}
                        placeholder="Tuliskan jawaban essay di sini..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-4 text-sm text-white placeholder-slate-600"
                      />
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6 max-w-3xl mx-auto w-full">
                {!isCatMode ? (
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold rounded-2xl text-xs flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Sebelumnya
                  </button>
                ) : (
                  <div className="text-[11px] text-purple-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> CAT: Navigasi Kembali Non-Aktif
                  </div>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
                >
                  <span>{answeredCount >= totalQuestions - 1 ? 'Lanjut / Selesai' : 'Lanjut Ke Soal Adaptif'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: Question Number Matrix Grid or CAT Adaptive Info Panel */}
            <div className="lg:col-span-4 bg-slate-950 p-6 flex flex-col justify-between h-full overflow-y-auto border-l border-slate-800/80">
              {isCatMode ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-950/80 to-slate-900 border border-purple-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-purple-300 border-b border-purple-800/60 pb-3">
                      <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                      <h3 className="font-extrabold text-sm text-white">Sistem Computer Adaptive Test (CAT)</h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Progress Pengerjaan Soal:</span>
                        <strong className="text-purple-300 font-bold text-sm">{answeredCount} / {totalQuestions} Soal</strong>
                      </div>

                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-purple-900/60">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                          style={{ width: `${Math.round((answeredCount / totalQuestions) * 100)}%` }}
                        />
                      </div>

                      <div className="p-3 bg-purple-950/50 rounded-2xl border border-purple-800/50 text-[11px] text-purple-200/90 leading-relaxed space-y-1.5">
                        <p className="font-bold text-purple-300 flex items-center gap-1">
                          ⚡ Karakteristik Sistem CAT:
                        </p>
                        <p>• Nomor togel/grid soal disembunyikan.</p>
                        <p>• Tidak dapat memilih atau kembali ke soal sebelumnya.</p>
                        <p>• Tingkat kesulitan soal disesuaikan secara real-time berdasarkan akurasi jawaban Anda.</p>
                        <p>• Jawaban benar atau salah disembunyikan selama ujian berlangsung.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ListOrdered className="w-4 h-4 text-cyan-400" /> Matrix Nomor Soal
                  </h3>

                  {/* Status Color Legend */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" /> Terjawab
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" /> Ragu
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-slate-700 shrink-0" /> Belum
                    </div>
                  </div>

                  {/* Matrix Grid Buttons */}
                  <div className="grid grid-cols-5 gap-2.5 pt-2">
                    {exam.questions.map((q, idx) => {
                      const ans = answers[q.id];
                      const isAnswered = ans?.answer !== undefined && ans?.answer !== '' && (!Array.isArray(ans.answer) || ans.answer.length > 0);
                      const isDoubtful = ans?.isDoubtful || false;
                      const isActive = activeQuestionIndex === idx;

                      return (
                        <button
                          key={q.id || idx}
                          onClick={() => setActiveQuestionIndex(idx)}
                          className={`aspect-square rounded-2xl font-bold text-xs transition-all relative flex items-center justify-center ${
                            isActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105' : ''
                          } ${
                            isDoubtful
                              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                              : isAnswered
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit trigger button */}
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Selesaikan & Submit Ujian
              </button>
            </div>
          </>
        )}

      </div>

      {/* POP-UP MODAL SUBMIT CONFIRMATION */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl text-center relative">
            
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
              <Send className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-xl text-white">Konfirmasi Submit Ujian</h3>
              <p className="text-xs text-slate-400">
                Apakah Anda yakin ingin menyelesaikan dan mengirimkan jawaban ujian ini?
              </p>
            </div>

            {/* Answer Summary Card */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div>
                <p className="text-slate-500 text-[10px]">Terjawab</p>
                <p className="text-lg font-bold text-emerald-400">{answeredCount}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Ragu-ragu</p>
                <p className="text-lg font-bold text-amber-400">{doubtfulCount}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Belum Diisi</p>
                <p className="text-lg font-bold text-rose-400">{remainingCount}</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Periksa Kembali
              </button>

              <button
                onClick={handleFinalSubmit}
                className="w-1/2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30"
              >
                Ya, Submit Ujian
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING EXIT PREVIEW BUTTON FOR ADMIN / PREVIEW MODE */}
      {(user.role === 'ADMIN' || user.id.includes('preview')) && onCancelExam && (
        <button
          type="button"
          onClick={onCancelExam}
          className="fixed bottom-6 right-6 z-[80] px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-full text-xs shadow-2xl border border-rose-300/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          title="Keluar dari mode pratinjau"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Preview</span>
        </button>
      )}

    </div>
  );
};
