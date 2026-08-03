import React, { useState } from 'react';
import { ClassItem, ExamCategory } from '../../types';
import { Layers, Plus, Edit2, Trash2, Tag, BookMarked, X } from 'lucide-react';

interface ClassAndCategoryProps {
  classes: ClassItem[];
  categories: ExamCategory[];
  onSaveClass: (classItem: ClassItem) => void;
  onDeleteClass: (classId: string) => void;
  onSaveCategory: (category: ExamCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const ClassAndCategory: React.FC<ClassAndCategoryProps> = ({
  classes,
  categories,
  onSaveClass,
  onDeleteClass,
  onSaveCategory,
  onDeleteCategory
}) => {
  // Modal state for Class
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classDesc, setClassDesc] = useState('');

  // Modal state for Category
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<ExamCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Open Class Modal
  const openClassModal = (item?: ClassItem) => {
    if (item) {
      setEditingClass(item);
      setClassName(item.name);
      setClassCode(item.code);
      setClassDesc(item.description);
    } else {
      setEditingClass(null);
      setClassName('');
      setClassCode('');
      setClassDesc('');
    }
    setIsClassModalOpen(true);
  };

  // Open Category Modal
  const openCatModal = (item?: ExamCategory) => {
    if (item) {
      setEditingCat(item);
      setCatName(item.name);
      setCatDesc(item.description);
    } else {
      setEditingCat(null);
      setCatName('');
      setCatDesc('');
    }
    setIsCatModalOpen(true);
  };

  // Save Class Handler
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) return;

    onSaveClass({
      id: editingClass ? editingClass.id : `cls-${Date.now()}`,
      name: className.trim(),
      code: classCode.trim() || className.trim().toUpperCase(),
      description: classDesc.trim() || 'Deskripsi kelas'
    });
    setIsClassModalOpen(false);
  };

  // Save Category Handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    onSaveCategory({
      id: editingCat ? editingCat.id : `cat-${Date.now()}`,
      name: catName.trim(),
      description: catDesc.trim() || 'Deskripsi kategori ujian'
    });
    setIsCatModalOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Manajemen Kelas & Kategori Ujian</h2>
        </div>
        <p className="text-xs text-slate-400">
          Atur tingkat kelas target dan kategori pelaksanaan ujian untuk pemilahan materi dan CBT.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BAGIAN 1: MANAJEMEN KELAS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <BookMarked className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-base text-white">Daftar Kelas</h3>
                <p className="text-[11px] text-slate-400">Tingkat kelas pendaftaran siswa</p>
              </div>
            </div>
            <button
              onClick={() => openClassModal()}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Kelas
            </button>
          </div>

          <div className="space-y-2.5">
            {classes.map(c => (
              <div
                key={c.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{c.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 font-mono text-[10px]">
                      {c.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openClassModal(c)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    title="Edit Kelas"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus kelas ${c.name}?`)) onDeleteClass(c.id);
                    }}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg text-xs"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BAGIAN 2: MANAJEMEN KATEGORI UJIAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-base text-white">Kategori Ujian</h3>
                <p className="text-[11px] text-slate-400">Klasifikasi ujian (SNBT, TKA, Labschool)</p>
              </div>
            </div>
            <button
              onClick={() => openCatModal()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Kategori
            </button>
          </div>

          <div className="space-y-2.5">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{cat.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openCatModal(cat)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus kategori ${cat.name}?`)) onDeleteCategory(cat.id);
                    }}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg text-xs"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL CLASS */}
      {isClassModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Kelas (misal: XII-UTBK, X-IPA)
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  placeholder="XII-UTBK"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kode Singkatan
                </label>
                <input
                  type="text"
                  value={classCode}
                  onChange={e => setClassCode(e.target.value)}
                  placeholder="UTBK"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  value={classDesc}
                  onChange={e => setClassDesc(e.target.value)}
                  placeholder="Kelas intensif persiapan ujian"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATEGORY */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingCat ? 'Edit Kategori' : 'Tambah Kategori Ujian'}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Kategori Ujian (misal: SNBT 2026, TKA)
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="SNBT 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Kategori
                </label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                  placeholder="Penilaian simulasi nasional"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
