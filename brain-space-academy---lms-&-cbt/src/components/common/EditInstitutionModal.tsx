import React, { useState } from 'react';
import { InstitutionInfo } from '../../types';
import { Building2, X, Upload, Check, GraduationCap, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

interface EditInstitutionModalProps {
  institution: InstitutionInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: InstitutionInfo) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const EditInstitutionModal: React.FC<EditInstitutionModalProps> = ({
  institution,
  isOpen,
  onClose,
  onSave,
  onShowToast
}) => {
  const [name, setName] = useState(institution.name || 'BRAIN SPACE ACADEMY');
  const [subtitle, setSubtitle] = useState(institution.subtitle || 'CBT & LMS SMART ACADEMY');
  const [logoUrl, setLogoUrl] = useState(institution.logoUrl || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        onShowToast?.('Ukuran file foto logo maksimal 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        onShowToast?.('Logo lembaga berhasil dimuat', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefaultLogo = () => {
    setLogoUrl('');
    setName('BRAIN SPACE ACADEMY');
    setSubtitle('CBT & LMS SMART ACADEMY');
    onShowToast?.('Logo dan nama lembaga dikembalikan ke bawaan', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast?.('Nama lembaga wajib diisi', 'error');
      return;
    }
    const updated: InstitutionInfo = {
      name: name.trim(),
      subtitle: subtitle.trim(),
      logoUrl: logoUrl.trim()
    };
    onSave(updated);
    onShowToast?.('Logo & Identitas Lembaga Berhasil Diperbarui!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/80">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Pengaturan Logo & Lembaga</h3>
              <p className="text-xs text-slate-400">Ubah logo dan nama instansi yang tampil di seluruh sistem</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo Preview & Upload */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-300">Preview Logo Lembaga</label>
            
            <div className="flex items-center gap-4">
              {/* Logo Box */}
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-lg relative group">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Lembaga"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 text-center p-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <span className="text-[9px] font-bold text-slate-400 mt-1">Logo Default</span>
                  </div>
                )}
              </div>

              {/* Upload & Action Controls */}
              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-blue-600/20">
                  <Upload className="w-4 h-4" /> Upload Logo Baru
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="block text-xs text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Hapus Logo Kustom
                  </button>
                )}

                <p className="text-[10px] text-slate-400">
                  Format: PNG, JPG, SVG, WebP. Maksimal 3MB.
                </p>
              </div>
            </div>

            {/* Direct URL Option */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Atau Paste URL Logo (Opsional):
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={logoUrl.startsWith('data:') ? '' : logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://domain.com/logo.png"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Name Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nama Lembaga / Sekolah *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: SMA NEGERI 1 SMART ACADEMY"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Sub-Judul / Slogan Lembaga
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Contoh: CBT & LMS SMART ACADEMY"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={handleResetDefaultLogo}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Default
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Check className="w-4 h-4" /> Simpan & Singkron
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
