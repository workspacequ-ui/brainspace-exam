import React, { useState, useEffect } from 'react';
import { User, FeaturedProgram, MarketplaceProduct } from '../../types';
import { getFeaturedPrograms, getProducts } from '../../utils/storage';
import {
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  BookOpen,
  LogOut,
  Award,
  GraduationCap,
  X,
  CheckCircle2
} from 'lucide-react';

interface PendingApprovalViewProps {
  user: User;
  onLogout: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ user, onLogout }) => {
  const [featuredPrograms] = useState<FeaturedProgram[]>(() =>
    getFeaturedPrograms().filter(p => p.isPublished)
  );
  const [products] = useState<MarketplaceProduct[]>(() =>
    getProducts().filter(p => p.status === 'ACTIVE')
  );

  // Carousel Indices
  const [programIdx, setProgramIdx] = useState(0);
  const [productIdx, setProductIdx] = useState(0);

  // Detail Modal State
  const [selectedProgram, setSelectedProgram] = useState<FeaturedProgram | null>(null);

  // Auto-scroll Featured Programs every 5 seconds
  useEffect(() => {
    if (featuredPrograms.length <= 1) return;
    const interval = setInterval(() => {
      setProgramIdx(prev => (prev >= featuredPrograms.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredPrograms.length]);

  // Auto-scroll Products every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setProductIdx(prev => (prev >= products.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const prevProgram = () => {
    setProgramIdx(prev => (prev === 0 ? Math.max(0, featuredPrograms.length - 1) : prev - 1));
  };

  const nextProgram = () => {
    setProgramIdx(prev => (prev >= featuredPrograms.length - 1 ? 0 : prev + 1));
  };

  const prevProduct = () => {
    setProductIdx(prev => (prev === 0 ? Math.max(0, products.length - 1) : prev - 1));
  };

  const nextProduct = () => {
    setProductIdx(prev => (prev >= products.length - 1 ? 0 : prev + 1));
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const currentProg = featuredPrograms[programIdx] || featuredPrograms[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Brand & Pending Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/50 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center shrink-0 text-amber-400 shadow-xl shadow-amber-500/10 animate-pulse">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> STATUS AKUN: PENDING VALIDASI
                </span>
                <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold rounded-full">
                  Kelas Target: {user.className}
                </span>
              </div>

              {/* Student Name prominently visible */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">NAMA SISWA PENDAFTAR</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
                  Selamat Datang, <span className="text-amber-300 underline decoration-amber-500/60 decoration-2 underline-offset-4">{user.name}</span>!
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Pendaftaran akun Anda (NIS: <strong className="text-amber-400 font-mono text-sm">{user.nis}</strong>) berhasil tersimpan di database. Tim Administrator sedang memverifikasi data pendaftaran Anda.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-2xl text-[11px] text-blue-200 space-y-1 max-w-xs">
              <p className="font-bold flex items-center gap-1 text-cyan-300">
                <GraduationCap className="w-4 h-4" /> Bantuan Verifikasi?
              </p>
              <p className="text-slate-300">
                Gunakan kreden <strong>admin@brainspace.id</strong> untuk menyetujui akun ini di menu Validasi User Baru.
              </p>
            </div>

            <button
              onClick={onLogout}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
            >
              <LogOut className="w-4 h-4 text-rose-400" /> Logout / Keluar
            </button>
          </div>

        </div>
      </div>

      {/* KATALOG PROGRAM UNGGULAN - SLIDE BERGANTI OTOMATIS 5 DETIK & GAMBAR BESAR DI KIRI + DESKRIPSI KANAN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" /> Katalog Program Unggulan
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-full animate-pulse">
                Gulir Otomatis 5s
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Program bimbingan belajar intensif, persiapan SNBT UTBK, dan bimbingan kedinasan favorit.
            </p>
          </div>

          {featuredPrograms.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevProgram}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-all hover:border-amber-500/50"
                title="Program Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-amber-400 px-2">
                {programIdx + 1} / {featuredPrograms.length}
              </span>
              <button
                onClick={nextProgram}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-all hover:border-amber-500/50"
                title="Program Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Program Layout: Big Image on Left + Description & Menu on Right */}
        {featuredPrograms.length === 0 ? (
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
            Belum ada katalog program unggulan yang dipublikasikan.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Space Gambar Besar di Sebelah Kiri */}
              <div className="lg:col-span-6 relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-xl">
                <img
                  src={currentProg.thumbnail || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'}
                  alt={currentProg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {currentProg.badge && (
                  <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-amber-500 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> {currentProg.badge}
                  </span>
                )}

                {/* Progress bar indicator for 5s timer */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                  <div className="h-full bg-amber-400 animate-pulse w-full" />
                </div>
              </div>

              {/* Deskripsi & Menu Tombol di Sebelah Kanan Gambar */}
              <div className="lg:col-span-6 space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {currentProg.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Program Keunggulan #{programIdx + 1}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {currentProg.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentProg.shortDesc}
                  </p>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                    <p className="font-bold text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fasilitas & Fitur Kelas:
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      Latihan CBT Berkelanjutan, pembahasan soal via video & dokumen PDF, tryout nasional, serta konsultasi jurusan perguruan tinggi.
                    </p>
                  </div>
                </div>

                {/* Menu Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedProgram(currentProg)}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl border border-slate-700 text-xs transition-all flex items-center gap-2 shadow-lg"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" /> Detail Silabus & Kurikulum
                  </button>

                  {currentProg.registerUrl && (
                    <a
                      href={currentProg.registerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-2xl text-xs transition-all shadow-xl flex items-center gap-2"
                    >
                      Daftar Program <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Thumbnails Indicator */}
                <div className="flex items-center gap-2 pt-2">
                  {featuredPrograms.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setProgramIdx(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === programIdx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
                      }`}
                      title={p.title}
                    />
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}
      </div>

      {/* MARKETPLACE & PRODUK UNGGULAN SLIDE */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-cyan-400" /> Marketplace & Produk Unggulan
            </h2>
            <p className="text-xs text-slate-400">
              Buku cetak, modul soal, paket tryout premium, dan atribut resmi sekolah.
            </p>
          </div>

          {products.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevProduct}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-all hover:border-cyan-500/50"
                title="Produk Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-cyan-400 px-2">
                {productIdx + 1} / {products.length}
              </span>
              <button
                onClick={nextProduct}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-all hover:border-cyan-500/50"
                title="Produk Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Products Slide Display */}
        {products.length === 0 ? (
          <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
            Belum ada produk marketplace tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(productIdx, productIdx + 4).concat(
              products.slice(0, Math.max(0, 4 - (products.length - productIdx)))
            ).slice(0, Math.min(4, products.length)).map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={prod.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-cyan-300 font-bold text-[10px] rounded-full border border-slate-700">
                    {prod.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <span className="font-extrabold text-amber-400 text-sm">
                      {formatRupiah(prod.price)}
                    </span>

                    <a
                      href={prod.externalLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
                    >
                      Beli <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {selectedProgram.category}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedProgram.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-56 rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={selectedProgram.thumbnail}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
              {selectedProgram.articleContent}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>

              {selectedProgram.registerUrl && (
                <a
                  href={selectedProgram.registerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
                >
                  Daftar Sekarang <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
