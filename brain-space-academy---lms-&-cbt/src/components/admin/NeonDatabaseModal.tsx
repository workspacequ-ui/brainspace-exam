import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, RefreshCw, UploadCloud, DownloadCloud, Sparkles, X, Key, ShieldCheck, HelpCircle } from 'lucide-react';
import { checkNeonStatus, bulkSyncToNeon, bulkLoadFromNeon, NeonStatus } from '../../utils/neonClient';
import {
  getUsers,
  getExams,
  getResults,
  getClasses,
  getCategories,
  getMaterials,
  getProducts,
  getInstitutionInfo,
  saveUsers,
  saveExams,
  saveResults,
  saveClasses,
  saveCategories,
  saveMaterials,
  saveProducts,
  saveInstitutionInfo
} from '../../utils/storage';

interface NeonDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const NeonDatabaseModal: React.FC<NeonDatabaseModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [status, setStatus] = useState<NeonStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'guide'>('status');

  const fetchStatus = async () => {
    setLoading(true);
    const res = await checkNeonStatus();
    setStatus(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncToNeon = async () => {
    setSyncing(true);
    const payload = {
      bsa_users: getUsers(),
      bsa_exams: getExams(),
      bsa_results: getResults(),
      bsa_classes: getClasses(),
      bsa_categories: getCategories(),
      bsa_materials: getMaterials(),
      bsa_products: getProducts(),
      bsa_institution_info: getInstitutionInfo()
    };

    const res = await bulkSyncToNeon(payload);
    setSyncing(false);

    if (res.success) {
      onShowToast?.('Semua data lokal berhasil disingkronkan ke Database Neon PostgreSQL!', 'success');
      fetchStatus();
    } else {
      onShowToast?.(res.message || 'Gagal sinkronisasi data', 'error');
    }
  };

  const handleLoadFromNeon = async () => {
    setLoading(true);
    const remoteData = await bulkLoadFromNeon();
    setLoading(false);

    if (!remoteData || Object.keys(remoteData).length === 0) {
      onShowToast?.('Tidak ada data tersimpan di Neon DB atau koneksi gagal', 'error');
      return;
    }

    if (remoteData.bsa_users) saveUsers(remoteData.bsa_users);
    if (remoteData.bsa_exams) saveExams(remoteData.bsa_exams);
    if (remoteData.bsa_results) saveResults(remoteData.bsa_results);
    if (remoteData.bsa_classes) saveClasses(remoteData.bsa_classes);
    if (remoteData.bsa_categories) saveCategories(remoteData.bsa_categories);
    if (remoteData.bsa_materials) saveMaterials(remoteData.bsa_materials);
    if (remoteData.bsa_products) saveProducts(remoteData.bsa_products);
    if (remoteData.bsa_institution_info) saveInstitutionInfo(remoteData.bsa_institution_info);

    onShowToast?.('Data dari Neon DB berhasil diimpor & diperbarui di aplikasi!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/80 shadow-lg shadow-emerald-950/50">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Database Neon PostgreSQL</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Serverless DB
                </span>
              </div>
              <p className="text-xs text-slate-400">Penyimpanan cloud terpusat untuk ujian, siswa, dan hasil CBT</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'status'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" /> Status Koneksi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Panduan & Cara Pemasangan
          </button>
        </div>

        {activeTab === 'status' ? (
          <div className="space-y-5">
            {/* Connection Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              status?.connected
                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                : 'bg-rose-950/20 border-rose-900/60 text-rose-200'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {status?.connected ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-white">
                      {status?.connected ? 'Terhubung ke Neon PostgreSQL!' : 'Belum Terhubung ke Neon DB'}
                    </h4>
                    <p className="text-xs text-slate-300 opacity-90">
                      {status?.message || 'Memeriksa status koneksi...'}
                    </p>
                    {status?.connected && (
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-emerald-400">
                        <span>Database: <strong>{status.dbName}</strong></span>
                        <span>Server Time: {status.serverTime ? new Date(status.serverTime).toLocaleTimeString() : '-'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/80 transition-all shrink-0"
                  title="Cek Ulang Koneksi"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Sync Controls */}
            {status?.connected ? (
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Sinkronisasi Data Aplikasi
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Data aplikasi Anda dapat diunggah ke Neon DB agar tersimpan terpusat dan dapat diakses oleh seluruh pengguna.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleSyncToNeon}
                    disabled={syncing}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {syncing ? 'Mengunggah...' : 'Upload Data Lokal ke Neon DB'}
                  </button>

                  <button
                    onClick={handleLoadFromNeon}
                    disabled={loading}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    {loading ? 'Mengunduh...' : 'Tarik Data dari Neon DB'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Key className="w-4 h-4" /> Langkah Menghubungkan Neon DB:
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>Buka website gratis <strong>neon.tech</strong> dan buat akun.</li>
                  <li>Buat Project baru (misal: <i>Brain Space Academy</i>).</li>
                  <li>Salin String Koneksi (<strong>Connection String</strong>) PostgreSQL.</li>
                  <li>Di AI Studio, buka menu <strong>Settings / Secret Keys</strong>.</li>
                  <li>Tambah kunci baru: Name = <code className="text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">DATABASE_URL</code> dan Paste URL Neon Anda.</li>
                </ol>
              </div>
            )}
          </div>
        ) : (
          /* Guide Tab */
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Apa itu Database Neon PostgreSQL?
              </h4>
              <p>
                Neon adalah layanan Database PostgreSQL Cloud Serverless gratis. Dengan mengaktifkan Neon DB, seluruh data soal ujian, hasil pengerjaan siswa, akun user, dan foto profil akan tersimpan secara terpusat di Cloud sehingga tidak hilang saat browser dibersihkan.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-extrabold text-sm text-white">Langkah 1: Daftar Account Neon Gratis</h4>
              <p>1. Kunjungi <a href="https://neon.tech" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-bold">neon.tech</a> di browser Anda.</p>
              <p>2. Klik tombol <strong>Sign Up</strong> dan masuk dengan Google atau GitHub.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-extrabold text-sm text-white">Langkah 2: Buat Database & Salin Connection String</h4>
              <p>1. Klik <strong>Create Project</strong> (Beri nama misal: <code className="text-emerald-300">bsa-cbt-db</code>).</p>
              <p>2. Pada Dashboard Neon, temukan bagian <strong>Connection Details</strong>.</p>
              <p>3. Pilih mode <strong>Pooled</strong> atau <strong>Direct</strong> dan salin string berformat:</p>
              <div className="bg-slate-900 p-2.5 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                postgresql://neondb_owner:npg_xxxx@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-extrabold text-sm text-white">Langkah 3: Masukkan Key di AI Studio</h4>
              <p>1. Buka menu <strong>Settings / Environment Variables (Secrets)</strong> di pojok AI Studio.</p>
              <p>2. Tambahkan variabel baru:</p>
              <ul className="list-disc list-inside font-mono text-emerald-300 space-y-1 pl-2">
                <li>Key: DATABASE_URL</li>
                <li>Value: [Paste Connection String Neon Anda]</li>
              </ul>
              <p className="text-slate-400 text-[11px] pt-1">
                Sistem akan secara otomatis mendeteksi koneksi dan menginisialisasi tabel database Neon tanpa memerlukan penulisan ulang kode!
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
