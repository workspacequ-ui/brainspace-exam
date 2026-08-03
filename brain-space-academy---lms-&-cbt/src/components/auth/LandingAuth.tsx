import React, { useState } from 'react';
import { User, ClassItem } from '../../types';
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
  IdCard
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

  // If user is PENDING, show "Halaman Tunggu Validation"
  if (pendingUser && pendingUser.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/30 rounded-3xl flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10 animate-bounce">
            <Clock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Pendaftaran Menunggu Validasi
            </h2>
            <p className="text-sm text-slate-400">
              Halo, <span className="text-slate-200 font-semibold">{pendingUser.name}</span> (NIS: {pendingUser.nis}).
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-left text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" /> Status Akun: PENDING
            </div>
            <p>
              Akun Anda telah berhasil terdaftar untuk kelas <strong className="text-cyan-300">{pendingUser.className}</strong>.
            </p>
            <p className="text-slate-400">
              Sesuai kebijakan keamanan Brain Space Academy, administrator akan memverifikasi data pendaftaran Anda sebelum memberikan akses penuh ke dashboard siswa.
            </p>
          </div>

          <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs text-blue-200 text-left">
            💡 <strong>Saran Pengujian:</strong> Untuk menyetujui akun ini, silakan klik tombol keluar di bawah, lalu login sebagai <strong>Admin</strong> (admin@brainspace.id) untuk membuka menu Validasi User!
          </div>

          <button
            onClick={onLogoutPending}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all text-sm flex items-center justify-center gap-2"
          >
            Kembali ke Halaman Utama / Logout
          </button>
        </div>
      </div>
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

          {/* Hero Slogan & Illustration */}
          <div className="relative z-10 my-12 lg:my-0 space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-700/60 text-blue-200 text-xs font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-red-400" />
              Platform Ujian Digital & Pembelajaran Masa Depan
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Empowering Minds, <br />
              <span className="bg-gradient-to-r from-red-500 via-blue-400 to-white bg-clip-text text-transparent">
                Shaping the Future
              </span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Selamat datang di ekosistem ujian dan pembelajaran terintegrasi Brain Space Academy. Dilengkapi dengan LJK Digital Auto-Generated, Google Drive PDF Split View, Bank Soal CBT Interaktif, dan Katalog Marketplace Pendidikan.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">LJK Digital & PDF Split</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Ujian dengan tampilan dokumen PDF berdampingan LJK instan.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">Kalkulasi Skor Otomatis</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Hasil ujian, pembahasan soal, dan perangkingan real-time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <p>© 2026 Brain Space Academy. Hak Cipta Dilindungi.</p>
            <p className="font-medium text-slate-300">CBT & LMS Portal</p>
          </div>

        </div>

        {/* Sisi Kanan (Form Area) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-6">

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

          </div>
        </div>

      </div>
    </div>
  );
};
