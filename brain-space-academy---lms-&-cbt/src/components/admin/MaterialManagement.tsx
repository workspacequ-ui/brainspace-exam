import React, { useState } from 'react';
import { LearningMaterial, ClassItem, MaterialType } from '../../types';
import {
  BookOpen,
  Plus,
  FileText,
  Video,
  Presentation,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  X
} from 'lucide-react';

interface MaterialManagementProps {
  materials: LearningMaterial[];
  classes: ClassItem[];
  onSaveMaterial: (material: LearningMaterial) => void;
  onDeleteMaterial: (materialId: string) => void;
}

export const MaterialManagement: React.FC<MaterialManagementProps> = ({
  materials,
  classes,
  onSaveMaterial,
  onDeleteMaterial
}) => {
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetClass, setTargetClass] = useState('SEMUA');
  const [mediaType, setMediaType] = useState<MaterialType>('PDF');
  const [url, setUrl] = useState('');

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<LearningMaterial | null>(null);

  const openFormModal = (item?: LearningMaterial) => {
    if (item) {
      setEditingMaterial(item);
      setTitle(item.title);
      setDescription(item.description);
      setTargetClass(item.targetClass);
      setMediaType(item.mediaType);
      setUrl(item.url);
    } else {
      setEditingMaterial(null);
      setTitle('');
      setDescription('');
      setTargetClass('SEMUA');
      setMediaType('PDF');
      setUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    }
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    onSaveMaterial({
      id: editingMaterial ? editingMaterial.id : `mat-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      targetClass,
      mediaType,
      url: url.trim(),
      createdAt: editingMaterial ? editingMaterial.createdAt : new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
  };

  const getMediaBadge = (type: MaterialType) => {
    switch (type) {
      case 'PDF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <FileText className="w-3 h-3" /> PDF Document
          </span>
        );
      case 'VIDEO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
            <Video className="w-3 h-3" /> YouTube Video
          </span>
        );
      case 'PPT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Presentation className="w-3 h-3" /> Slide PPT
          </span>
        );
      case 'DRIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <ExternalLink className="w-3 h-3" /> Google Drive
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Pengelola Materi Pembelajaran</h2>
          </div>
          <p className="text-xs text-slate-400">
            Unggah modul PDF, slide PPT, dan video instruksional berdasarkan kelas siswa.
          </p>
        </div>

        <button
          onClick={() => openFormModal()}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-600/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Unggah Materi Baru
        </button>
      </div>

      {/* Grid Materi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(item => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {getMediaBadge(item.mediaType)}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {item.targetClass}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Rilis: {item.createdAt}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="p-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded-xl text-xs flex items-center gap-1"
                  title="Preview Media Embed"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Preview</span>
                </button>

                <button
                  onClick={() => openFormModal(item)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs"
                  title="Edit Materi"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Hapus materi ${item.title}?`)) onDeleteMaterial(item.id);
                  }}
                  className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-xl text-xs"
                  title="Hapus Materi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM UPLOAD / EDIT */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingMaterial ? 'Edit Materi Pembelajaran' : 'Input / Unggah Materi Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judul Materi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Modul Intensif Penalaran Matematika..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kelas Tujuan
                  </label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="SEMUA">SEMUA KELAS</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipe Media
                  </label>
                  <select
                    value={mediaType}
                    onChange={e => setMediaType(e.target.value as MaterialType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">YouTube Video Embed</option>
                    <option value="PPT">Slide Presentation (PPT)</option>
                    <option value="DRIVE">Google Drive File Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL / Link Embed Materi
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/... atau link PDF Drive"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi / Petunjuk Belajar
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Penjelasan ringkas poin-poin penting materi..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/30"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW EMBED */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full h-[85vh] flex flex-col space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{previewItem.title}</h3>
                <p className="text-xs text-slate-400">Target: {previewItem.targetClass} • Tipe: {previewItem.mediaType}</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              {previewItem.mediaType === 'VIDEO' ? (
                <iframe
                  src={previewItem.url}
                  title={previewItem.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={
                    previewItem.url.includes('google.com') || previewItem.url.endsWith('.pdf')
                      ? previewItem.url
                      : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(previewItem.url)}`
                  }
                  title={previewItem.title}
                  className="w-full h-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
