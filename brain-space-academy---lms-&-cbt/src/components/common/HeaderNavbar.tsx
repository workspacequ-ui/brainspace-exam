import React from 'react';
import { User, InstitutionInfo } from '../../types';
import { Menu, LogOut, ShieldCheck, GraduationCap, Sparkles, Camera, Building2, Database } from 'lucide-react';

interface HeaderNavbarProps {
  user: User;
  institution?: InstitutionInfo;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
  onEditProfile?: () => void;
  onEditInstitution?: () => void;
  onOpenNeonDb?: () => void;
  activeMenuTitle?: string;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  user,
  institution,
  onLogout,
  onToggleMobileSidebar,
  onEditProfile,
  onEditInstitution,
  onOpenNeonDb,
  activeMenuTitle = 'Dashboard'
}) => {
  const instName = institution?.name || 'BRAIN SPACE ACADEMY';
  const instSubtitle = institution?.subtitle || 'CBT & LMS SMART ACADEMY';
  const logoUrl = institution?.logoUrl;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left Side: Mobile Menu Button & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            title="Buka Navigasi"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Institution Logo */}
            <button
              onClick={user.role === 'admin' ? onEditInstitution : undefined}
              className={`relative rounded-xl overflow-hidden shrink-0 transition-transform ${user.role === 'admin' ? 'hover:scale-105 cursor-pointer group' : ''}`}
              title={user.role === 'admin' ? 'Klik untuk ubah Logo & Nama Lembaga' : instName}
            >
              {logoUrl ? (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 p-1 border border-slate-700/80 shadow-lg shadow-blue-950/40 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt={instName}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 via-blue-600 to-blue-700 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              )}
              {user.role === 'admin' && (
                <span className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                  <Building2 className="w-4 h-4 text-white" />
                </span>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-white drop-shadow-sm truncate">
                  {instName}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-700/60 shadow-sm shrink-0">
                  <Sparkles className="w-3 h-3 mr-1 text-red-400" /> CBT & LMS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate hidden sm:block">
                {activeMenuTitle} • {instSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Admin Logo Edit Button, User Profile Card & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {user.role === 'admin' && onOpenNeonDb && (
            <button
              onClick={onOpenNeonDb}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl transition-all shadow-sm focus:outline-none shrink-0"
              title="Status & Sinkronisasi Database Neon PostgreSQL"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Neon DB</span>
            </button>
          )}

          {user.role === 'admin' && onEditInstitution && (
            <button
              onClick={onEditInstitution}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-blue-950/70 hover:bg-blue-900/90 text-blue-300 border border-blue-700/60 rounded-xl transition-all shadow-sm focus:outline-none"
              title="Pengaturan Logo & Nama Lembaga"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Logo Lembaga</span>
            </button>
          )}

          {/* User Bio Card (Clickable to Edit Profile & Photo) */}
          <button
            type="button"
            onClick={onEditProfile}
            className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/60 rounded-2xl p-1.5 pr-3 sm:pr-4 shadow-sm transition-all group text-left focus:outline-none"
            title="Klik untuk ubah foto profil & data akun"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
                alt={user.name}
                className="w-full h-full rounded-xl object-cover aspect-square ring-2 ring-red-500/50 group-hover:ring-blue-500 transition-all"
              />
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-md shadow group-hover:scale-110 transition-all">
                <Camera className="w-2.5 h-2.5" />
              </span>
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-100 group-hover:text-blue-300 transition-colors truncate max-w-[140px] md:max-w-[180px]">
                  {user.name}
                </span>
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded">
                    Siswa
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>NIS: {user.nis}</span>
                <span>•</span>
                <span className="text-blue-400 font-medium">{user.className}</span>
              </div>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 rounded-xl transition-all shadow-sm focus:outline-none"
            title="Keluar dari sistem"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Keluar</span>
          </button>

        </div>

      </div>
    </header>
  );
};
