import React, { useState, useEffect } from 'react';
import { User, ClassItem, FeaturedProgram, MarketplaceProduct } from '../../types';
import { getFeaturedPrograms, getProducts } from '../../utils/storage';
import { PendingApprovalView } from './PendingApprovalView';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  IdCard,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Search,
  Tag,
  Package,
  Store,
  Check
} from 'lucide-react';

interface LandingAuthProps {
  onLoginSuccess: (user: User) => void;
  onRegisterSubmit: (newUser: Omit<User, 'id' | 'createdAt'>) => User;
  classes: ClassItem[];
  users: User[];
  pendingUser?: User | null;
  onLogoutPending?: () => void;
}

export const LandingAuth: React.FC<LandingAuthProps> = ({
  onLoginSuccess,
  onRegisterSubmit,
  classes,
  users,
  pendingUser,
  onLogoutPending
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regNis, setRegNis] = useState('');
  const [regName, setRegName] = useState('');
  const [regClass, setRegClass] = useState(classes[0]?.name || 'XII-UTBK');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Local feedback message
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Featured Programs & Marketplace Products state for auto-sliding banner
  const [featuredPrograms] = useState<FeaturedProgram[]>(() => getFeaturedPrograms().filter(p => p.isPublished !== false));
  const [products] = useState<MarketplaceProduct[]>(() => getProducts());
  const [slideIdx, setSlideIdx] = useState(0);

  // Marketplace Modal View State
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [mktSearch, setMktSearch] = useState('');
  const [mktCategory, setMktCategory] = useState('SEMUA');

  // Detail Modal for selected slide item
  const [selectedDetailItem, setSelectedDetailItem] = useState<FeaturedProgram | MarketplaceProduct | null>(null);

  // Auto-scroll Featured Programs & Products every 5 seconds
  useEffect(() => {
    if (featuredPrograms.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIdx(prev => (prev >= featuredPrograms.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredPrograms.length]);

  const prevSlide = () => {
    setSlideIdx(prev => (prev === 0 ? Math.max(0, featuredPrograms.length - 1) : prev - 1));
  };

  const nextSlide = () => {
    setSlideIdx(prev => (prev >= featuredPrograms.length - 1 ? 0 : prev + 1));
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const activeSlideItem = featuredPrograms[slideIdx] || featuredPrograms[0];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(mktSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(mktSearch.toLowerCase());
    const matchesCategory = mktCategory === 'SEMUA' || p.category === mktCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Login Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Silakan isi email dan password Anda.');
      return;
    }

    const foundUser = users.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.password === loginPassword
    );

    if (!foundUser) {
      setErrorMessage('Kredensial tidak valid. Silakan periksa email dan password.');
      return;
    }

    if (foundUser.status === 'REJECTED') {
      setErrorMessage('Akun Anda telah ditolak atau diblokir oleh Administrator.');
      return;
    }

    onLoginSuccess(foundUser);
  };

  // Quick Demo Login Helper
  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      onLoginSuccess(foundUser);
    }
  };

  // Handle Registration Submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regNis || !regName || !regEmail || !regPassword) {
      setErrorMessage('Semua bidang registrasi wajib diisi!');
      return;
    }

    // Check duplicate NIS or Email
    const existingEmail = users.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existingEmail) {
      setErrorMessage('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      return;
    }

    const existingNis = users.find(u => u.nis === regNis.trim());
    if (existingNis) {
      setErrorMessage('NIS sudah terdaftar dalam sistem.');
      return;
    }

    const newUser = onRegisterSubmit({
      nis: regNis.trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: 'student',
      className: regClass,
      status: 'PENDING',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
    });

    onLoginSuccess(newUser);
  };

  // If user is PENDING, show "Halaman Tunggu Validation" with Catalog & Marketplace slides
  if (pendingUser && pendingUser.status === 'PENDING') {
    return (
      <PendingApprovalView
        user={pendingUser}
        onLogout={onLogoutPending || (() => {})}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        
        {/* Sisi Kiri (Branding Area) */}
        <div className="lg:col-span-7 bg-slate-900 border-r border-slate-800 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-blue-600 to-blue-700 p-0.5 shadow-xl shadow-blue-900/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow">
                <span className="text-red-500">BRAIN</span> <span className="text-blue-400">SPACE</span> <span className="text-white">ACADEMY</span>
              </h1>
              <p className="text-xs text-blue-300 font-semibold tracking-wider uppercase">
                LMS & Online Exam System (CBT)
              </p>
            </div>
          </div>

          {/* SLIDE DINAMIS PRODUK UNGGULAN (BERGULIR OTOMATIS EVERY 5s) */}
          <div className="relative z-10 my-6 space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-200 text-xs font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Katalog Program & Produk Unggulan</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full animate-pulse border border-amber-500/40">
                  Gulir Otomatis 5s
                </span>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Slide Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Slide Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Card Display */}
            {activeSlideItem && (
              <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-all duration-500 group">
                <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                  <img
                    src={activeSlideItem.thumbnail}
                    alt={activeSlideItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Award className="w-3 h-3" /> {activeSlideItem.badge || 'PRODUK UNGGULAN'}
                  </span>

                  {/* Auto Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                    <div className="h-full bg-amber-400 animate-pulse w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      {activeSlideItem.category}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Item #{slideIdx + 1} dari {featuredPrograms.length}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white leading-snug group-hover:text-amber-300 transition-colors">
                    {activeSlideItem.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {activeSlideItem.shortDesc}
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailItem(activeSlideItem)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Detail Silabus
                    </button>

                    {activeSlideItem.registerUrl && (
                      <a
                        href={activeSlideItem.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
                      >
                        Daftar Program <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Dot Indicators */}
                <div className="flex items-center justify-center gap-1.5 pt-4">
                  {featuredPrograms.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIdx(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === slideIdx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Menu Tombol Marketplace Toko Sekolah */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowMarketplaceModal(true)}
                className="w-full p-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 border border-blue-500/40 hover:border-cyan-400/60 rounded-2xl shadow-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600/30 text-blue-300 rounded-xl group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        Katalog Marketplace & Toko Sekolah
                      </h4>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                        Toko Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Klik untuk melihat daftar produk buku, paket tryout, & merchandise sekolah
                    </p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 rounded-xl transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <p>© 2026 Brain Space Academy. Hak Cipta Dilindungi.</p>
            <p className="font-medium text-slate-300">CBT & LMS Portal</p>
          </div>

        </div>

        {/* Sisi Kanan (Form Area) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-10 lg:p-12 flex flex-col justify-start items-center pt-6 sm:pt-10 lg:pt-12">
          <div className="w-full max-w-md space-y-5">

            {/* Tab Toggle Login / Register */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`py-2.5 font-bold text-sm rounded-xl transition-all ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Masuk / Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`py-2.5 font-bold text-sm rounded-xl transition-all ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Registrasi Siswa
              </button>
            </div>

            {/* Messages */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-xs text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* FORM LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-100">Masuk Akun Platform</h3>
                  <p className="text-xs text-slate-400">Gunakan email dan password terdaftar Anda.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        placeholder="contoh: budi@student.com"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Kata Sandi / Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all text-sm flex items-center justify-center gap-2 mt-4"
                >
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORM REGISTRASI */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-100">Pendaftaran Siswa Baru</h3>
                  <p className="text-xs text-slate-400">Isi formulir dengan data diri asli Anda.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nomor Induk Siswa (NIS)
                    </label>
                    <div className="relative">
                      <IdCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={regNis}
                        onChange={e => setRegNis(e.target.value)}
                        placeholder="20261005"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Pilihan Kelas
                    </label>
                    <select
                      value={regClass}
                      onChange={e => setRegClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap Siswa
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Nama lengkap sesuai ijazah"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alamat Email Active
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="email.aktif@gmail.com"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                  ℹ️ Akun pendaftaran baru akan berstatus <strong className="text-amber-400">PENDING</strong> dan memerlukan persetujuan Administrator sebelum bisa digunakan.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all text-xs flex items-center justify-center gap-2 mt-2"
                >
                  <span>Daftar Siswa Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Feature Highlights Grid placed directly under the form */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">LJK Digital & PDF Split</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Ujian dengan tampilan dokumen PDF berdampingan LJK instan.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">Kalkulasi Skor Otomatis</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Hasil ujian, pembahasan soal, dan perangkingan real-time.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL MARKETPLACE / TOKO SEKOLAH */}
      {showMarketplaceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    Katalog Marketplace Pendidikan & Toko Sekolah
                  </h3>
                  <p className="text-xs text-slate-400">
                    Satu tempat untuk membeli modul, buku cetak, paket tryout premium, dan merchandise official Brain Space.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMarketplaceModal(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Controls */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={mktSearch}
                  onChange={e => setMktSearch(e.target.value)}
                  placeholder="Cari produk toko..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['SEMUA', 'Buku Cetak', 'Paket Tryout Premium', 'Akses Bimbel VIP', 'Merchandising'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMktCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      mktCategory === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <Package className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">Tidak ada produk ditemukan sesuai pencarian.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(prod => (
                    <div
                      key={prod.id}
                      className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
                    >
                      <div>
                        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                          <img
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-cyan-300 font-bold text-[10px] rounded-lg border border-slate-700 uppercase">
                            {prod.category}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 space-y-3">
                        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-500 block font-bold uppercase">Harga Resmi</span>
                            <span className="text-base font-extrabold text-amber-400">
                              {formatRupiah(prod.price)}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded-md">
                            Tersedia
                          </span>
                        </div>

                        {prod.externalLink && (
                          <a
                            href={prod.externalLink}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <span>Beli / Pesan Sekarang</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <p>Menampilkan {filteredProducts.length} produk dari Toko Brain Space Academy.</p>
              <button
                type="button"
                onClick={() => setShowMarketplaceModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                Tutup Katalog
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETAIL PROGRAM / SILABUS */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold rounded-full uppercase">
                  {selectedDetailItem.category}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">
                  {selectedDetailItem.title || (selectedDetailItem as any).name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
              {(selectedDetailItem as FeaturedProgram).articleContent ? (
                <div className="whitespace-pre-line">
                  {(selectedDetailItem as FeaturedProgram).articleContent}
                </div>
              ) : (
                <p>{(selectedDetailItem as any).description}</p>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>

              {((selectedDetailItem as FeaturedProgram).registerUrl || (selectedDetailItem as MarketplaceProduct).externalLink) && (
                <a
                  href={(selectedDetailItem as FeaturedProgram).registerUrl || (selectedDetailItem as MarketplaceProduct).externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  Daftar / Beli Sekarang <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
