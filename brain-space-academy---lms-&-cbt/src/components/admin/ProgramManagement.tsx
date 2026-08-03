import React, { useState } from 'react';
import { FeaturedProgram } from '../../types';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  X,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  BookOpen,
  Link2,
  Tag
} from 'lucide-react';

interface ProgramManagementProps {
  programs: FeaturedProgram[];
  onSaveProgram: (program: FeaturedProgram) => void;
  onDeleteProgram: (programId: string) => void;
}

export const ProgramManagement: React.FC<ProgramManagementProps> = ({
  programs,
  onSaveProgram,
  onDeleteProgram
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<FeaturedProgram | null>(null);

  // Article Reader Modal State
  const [previewProgram, setPreviewProgram] = useState<FeaturedProgram | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('PROGRAM UNGGULAN');
  const [thumbnail, setThumbnail] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [registerUrl, setRegisterUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Preset Image Options for fast fill
  const PRESET_IMAGES = [
    { label: 'Kampus PTN', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80' },
    { label: 'Belajar & TKA', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80' },
    { label: 'Gedung Sekolah', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
    { label: 'Kantor / CPNS', url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80' }
  ];

  const openFormModal = (prog?: FeaturedProgram) => {
    if (prog) {
      setEditingProgram(prog);
      setTitle(prog.title);
      setCategory(prog.category);
      setBadge(prog.badge || 'PROGRAM UNGGULAN');
      setThumbnail(prog.thumbnail);
      setShortDesc(prog.shortDesc);
      setArticleContent(prog.articleContent);
      setRegisterUrl(prog.registerUrl);
      setIsPublished(prog.isPublished);
    } else {
      setEditingProgram(null);
      setTitle('');
      setCategory('Persiapan UTBK - SNBT 2026');
      setBadge('PROGRAM UNGGULAN');
      setThumbnail(PRESET_IMAGES[0].url);
      setShortDesc('');
      setArticleContent('');
      setRegisterUrl('https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20tertarik%20mendaftar%20Program%20Unggulan');
      setIsPublished(true);
    }
    setIsFormModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim() || !registerUrl.trim()) return;

    const newProgram: FeaturedProgram = {
      id: editingProgram ? editingProgram.id : `prog-${Date.now()}`,
      title,
      category,
      badge,
      thumbnail: thumbnail || PRESET_IMAGES[0].url,
      shortDesc,
      articleContent,
      registerUrl,
      isPublished,
      createdAt: editingProgram ? editingProgram.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveProgram(newProgram);
    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, progTitle: string) => {
    if (window.confirm(`Sumbu hapus program unggulan "${progTitle}"?`)) {
      onDeleteProgram(id);
    }
  };

  const filteredPrograms = programs.filter(
    p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Manajemen Katalog Program Unggulan</h2>
          </div>
          <p className="text-xs text-slate-400">
            Kelola program unggulan (Lolos PTN, Raih Nilai TKA, Masuk Sekolah Impian, Lolos CPNS) yang ditampilkan di Dashboard Siswa.
          </p>
        </div>

        <button
          onClick={() => openFormModal()}
          className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari judul program atau deskripsi..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500"
          />
        </div>

        <p className="text-xs text-slate-400">
          Total Terdaftar: <strong className="text-white">{programs.length} Program</strong> ({programs.filter(p => p.isPublished).length} Aktif Dipublikasikan)
        </p>
      </div>

      {/* Katalog Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Belum ada program unggulan yang cocok.</p>
            <p className="text-xs text-slate-500">Klik tombol "Tambah Program Baru" di atas untuk menambahkan program.</p>
          </div>
        ) : (
          filteredPrograms.map(prog => (
            <div
              key={prog.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group relative"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="h-52 w-full relative overflow-hidden bg-slate-950">
                  <img
                    src={prog.thumbnail}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-md">
                      {prog.badge || 'PROGRAM UNGGULAN'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/50">
                      {prog.category}
                    </span>
                  </div>

                  {/* Publication Status Badge */}
                  <div className="absolute top-3 right-3">
                    {prog.isPublished ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700 flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dipublikasikan
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-slate-400 border border-slate-700 flex items-center gap-1 shadow-md">
                        <XCircle className="w-3 h-3 text-slate-500" /> Draf (Sembunyi)
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-3">
                  <h3 className="font-extrabold text-white text-xl group-hover:text-cyan-300 transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {prog.shortDesc}
                  </p>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] truncate max-w-[220px]">
                      <Link2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{prog.registerUrl}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">{prog.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setPreviewProgram(prog)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Lihat Selengkapnya (Artikel)
                  </button>

                  <a
                    href={prog.registerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Daftar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openFormModal(prog)}
                    className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all"
                    title="Edit Program"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prog.id, prog.title)}
                    className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-all"
                    title="Hapus Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORM MODAL ADD / EDIT PROGRAM */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full my-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base">
                  {editingProgram ? 'Edit Program Unggulan' : 'Tambah Program Unggulan Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Judul Program <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Contoh: Lolos PTN Impian, Raih Nilai TKA..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Program <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="Contoh: UTBK SNBT 2026, TKA Saintek, CPNS..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    placeholder="PROGRAM UNGGULAN, TERFAVORIT, POPULER..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Link Pendaftaran (WA / Google Form) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={registerUrl}
                    onChange={e => setRegisterUrl(e.target.value)}
                    placeholder="https://wa.me/62812... atau https://forms.google.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              {/* Thumbnail Photo Upload & Preset Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  URL Foto Thumbnail Program <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={e => setThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>

                {/* Preset Fast Selection */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">Pilihan Gambar Contoh:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbnail(preset.url)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-semibold rounded-lg border border-slate-700 transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Image Live Preview */}
                {thumbnail && (
                  <div className="mt-2 h-32 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                    <img
                      src={thumbnail}
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-[10px] text-emerald-400 px-2 py-0.5 rounded-md font-bold border border-emerald-800">
                      Pratinjau Foto Aktif
                    </span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ringkasan Singkat (Tampil di Kartu Thumbnail) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={e => setShortDesc(e.target.value)}
                  placeholder="Ringkasan 2-3 kalimat mengenai keunggulan program..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              {/* Full Article Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Artikel Lengkap (Tampil di "Lihat Selengkapnya")
                </label>
                <textarea
                  rows={6}
                  value={articleContent}
                  onChange={e => setArticleContent(e.target.value)}
                  placeholder="Tuliskan artikel silabus, kurikulum, fasilitas, serta keunggulan lengkap program di sini..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="pub-check" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Tampilkan & Publikasikan di Dashboard Siswa
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/30"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL (Preview Lihat Selengkapnya) */}
      {previewProgram && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full my-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewProgram(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-full border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Image */}
            <div className="h-64 w-full rounded-2xl overflow-hidden relative bg-slate-950">
              <img
                src={previewProgram.thumbnail}
                alt={previewProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-red-600 text-white w-max mb-2">
                  {previewProgram.badge || 'PROGRAM UNGGULAN'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{previewProgram.title}</h2>
                <p className="text-xs text-cyan-300 font-semibold">{previewProgram.category}</p>
              </div>
            </div>

            {/* Article Content Render */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 whitespace-pre-line bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
              {previewProgram.articleContent || previewProgram.shortDesc}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Tertarik mengikuti program ini? Klik tombol pendaftaran untuk terhubung langsung dengan Tim Pendaftaran.
              </p>

              <a
                href={previewProgram.registerUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
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
