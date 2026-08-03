import React, { useState } from 'react';
import { User } from '../../types';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  UserPlus,
  X,
  Mail,
  Lock,
  IdCard,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info
} from 'lucide-react';

interface AdminManagementProps {
  users: User[];
  currentUser: User;
  onSaveUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nis, setNis] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PENDING' | 'REJECTED'>('ACTIVE');

  // Filter list to only admins
  const adminUsers = users.filter(u => u.role === 'admin');
  const filteredAdmins = adminUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingAdmin(null);
    setName('');
    setNis(`ADM${Math.floor(100 + Math.random() * 900)}`);
    setEmail('');
    setPassword('');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin: User) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setNis(admin.nis);
    setEmail(admin.email);
    setPassword(admin.password || '••••••••');
    setStatus(admin.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !nis.trim()) {
      onShowToast('Mohon lengkapi semua field yang wajib diisi', 'error');
      return;
    }

    const adminData: User = {
      id: editingAdmin ? editingAdmin.id : `u-admin-${Date.now()}`,
      nis: nis.trim(),
      name: name.trim(),
      email: email.trim(),
      password: password ? password.trim() : 'admin123',
      role: 'admin',
      className: 'SEMUA',
      status,
      createdAt: editingAdmin ? editingAdmin.createdAt : new Date().toISOString().split('T')[0],
      avatar: editingAdmin?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80`
    };

    onSaveUser(adminData);
    setIsModalOpen(false);
    onShowToast(
      editingAdmin ? `Data admin ${adminData.name} berhasil diperbarui` : `Admin baru ${adminData.name} berhasil ditambahkan!`,
      'success'
    );
  };

  const handleDelete = (admin: User) => {
    if (admin.id === currentUser.id) {
      onShowToast('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif!', 'error');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus akses administrator ${admin.name}?`)) {
      onDeleteUser(admin.id);
      onShowToast(`Akun admin ${admin.name} berhasil dihapus`, 'info');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Disalin: ${label}`, 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-blue-600 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Data Pengelola Administrator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kelola daftar akun dengan hak akses Administrator penuh pada Brain Space Academy.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Admin Baru</span>
          </button>
        </div>
      </div>

      {/* Demo Credentials Info Box (Special Admin Access Panel) */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
            <KeyRound className="w-4 h-4 text-red-500" />
            <span>Informasi & Akses Kredensial Akun Demo Sistem</span>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-950 text-red-300 border border-red-800">
            KHUSUS PANEL ADMIN
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Gunakan daftar akun demo di bawah ini untuk kebutuhan pengujian sistem dan verifikasi alur kerja siswa & admin:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Admin Demo */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 relative group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
              </span>
              <button
                onClick={() => copyToClipboard('admin@brainspace.id | admin123', 'Email & Pass Admin')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Salin kredensial"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">admin@brainspace.id</p>
            <p className="text-[11px] text-slate-400">Pass: <span className="font-mono text-slate-200">admin123</span></p>
          </div>

          {/* Student Active Demo */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 relative group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Demo Siswa Aktif
              </span>
              <button
                onClick={() => copyToClipboard('budi@student.com | user123', 'Email & Pass Siswa Aktif')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Salin kredensial"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">budi@student.com</p>
            <p className="text-[11px] text-slate-400">Pass: <span className="font-mono text-slate-200">user123</span></p>
          </div>

          {/* Student Pending Demo */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 relative group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Demo Siswa Pending
              </span>
              <button
                onClick={() => copyToClipboard('rian@pending.com | user123', 'Email & Pass Siswa Pending')}
                className="text-slate-400 hover:text-white transition-colors"
                title="Salin kredensial"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">rian@pending.com</p>
            <p className="text-[11px] text-slate-400">Pass: <span className="font-mono text-slate-200">user123</span></p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari admin berdasarkan nama, NIP/NIS, atau email..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total: <strong className="text-white">{filteredAdmins.length} Administrator</strong>
        </div>
      </div>

      {/* Table List of Admin Accounts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Nama & Foto</th>
                <th className="py-3 px-4">ID / NIP</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Dibuat</th>
                <th className="py-3 px-4 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    Tidak ada data admin yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map(admin => {
                  const isCurrent = admin.id === currentUser.id;

                  return (
                    <tr key={admin.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={admin.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
                            alt={admin.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{admin.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">Role: Administrator</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                        {admin.nis}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {admin.email}
                      </td>

                      <td className="py-3 px-4">
                        {admin.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                            <AlertCircle className="w-3 h-3" /> NON-AKTIF
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {admin.createdAt}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(admin)}
                            className="p-1.5 rounded-lg bg-blue-950 text-blue-400 hover:bg-blue-900 border border-blue-800 transition-colors"
                            title="Edit Data Admin"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(admin)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCurrent
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                : 'bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800'
                            }`}
                            title={isCurrent ? 'Tidak dapat menghapus akun Anda sendiri' : 'Hapus Admin'}
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

      {/* Modal Add / Edit Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-base">
                  {editingAdmin ? 'Edit Data Administrator' : 'Tambah Admin Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap Admin <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Dr. Hendra Wijaya, M.Pd."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NIP / Kode Admin <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={nis}
                      onChange={e => setNis(e.target.value)}
                      placeholder="ADMIN001"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white font-mono placeholder-slate-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 px-3 text-xs text-white"
                  >
                    <option value="ACTIVE">AKTIF</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">NON-AKTIF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alamat Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@brainspace.id"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/40 transition-all"
                >
                  {editingAdmin ? 'Simpan Perubahan' : 'Tambah Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
