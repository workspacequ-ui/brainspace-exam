import React from 'react';
import { UserRole } from '../../types';
import {
  UserCheck,
  Users,
  ShieldCheck,
  Layers,
  BookOpen,
  FileCheck2,
  ShoppingBag,
  BarChart3,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  X,
  History,
  Sparkles
} from 'lucide-react';

export type SidebarTab =
  | 'overview'
  | 'validation'
  | 'students'
  | 'admins'
  | 'classes'
  | 'materials'
  | 'exams'
  | 'marketplace'
  | 'programs'
  | 'reports'
  | 'history';


interface SidebarProps {
  role: UserRole;
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  pendingCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onSelectTab,
  pendingCount = 0,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const adminMenuItems = [
    { id: 'overview', label: 'Dashboard Utama', icon: LayoutDashboard },
    {
      id: 'validation',
      label: 'Validasi User Baru',
      icon: UserCheck,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: 'students', label: 'Pengelola Data Siswa', icon: Users },
    { id: 'admins', label: 'Data Pengelola Admin', icon: ShieldCheck },
    { id: 'classes', label: 'Kelas & Kategori Ujian', icon: Layers },
    { id: 'materials', label: 'Materi Pembelajaran', icon: BookOpen },
    { id: 'exams', label: 'Bank Ujian & LJK', icon: FileCheck2 },
    { id: 'marketplace', label: 'Toko Marketplace', icon: ShoppingBag },
    { id: 'programs', label: 'Program Unggulan', icon: Sparkles },
    { id: 'reports', label: 'Laporan & Hasil Ujian', icon: BarChart3 }
  ];


  const studentMenuItems = [
    { id: 'overview', label: 'Dashboard Siswa', icon: LayoutDashboard },
    { id: 'materials', label: 'Materi Saya', icon: BookOpen },
    { id: 'exams', label: 'Daftar Ujian', icon: FileCheck2 },
    { id: 'marketplace', label: 'Marketplace / Store', icon: ShoppingBag },
    { id: 'history', label: 'Riwayat & Hasil', icon: History }
  ];

  const menuItems = role === 'admin' ? adminMenuItems : studentMenuItems;

  const handleItemClick = (id: SidebarTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:z-20 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header inside Mobile Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span className="font-extrabold text-white text-sm tracking-tight">
              <span className="text-red-500">BRAIN</span> <span className="text-blue-400">SPACE</span>
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <div className={`px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'hidden lg:block text-center' : ''}`}>
            {isCollapsed ? '•••' : role === 'admin' ? 'PANEL ADMINISTRATOR' : 'PANEL SISWA'}
          </div>

          {(menuItems as Array<{ id: string; label: string; icon: any; badge?: number }>).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id as SidebarTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active Bar Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-red-500 to-blue-500 rounded-r-full shadow-lg shadow-red-500/50" />
                )}

                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-blue-400 scale-110' : 'text-slate-400 group-hover:scale-105'}`} />

                <span className={`truncate text-left ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                  {item.label}
                </span>

                {/* Badge for Pending Approval Counter */}
                {item.badge !== undefined && (
                  <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse ${isCollapsed ? 'lg:absolute lg:top-2 lg:right-2 lg:p-1 lg:text-[10px]' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Fold/Collapse Toggle (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between p-3 border-t border-slate-800 bg-slate-950/40">
          {!isCollapsed && (
            <span className="text-xs text-slate-500 font-medium px-2">
              Versi 2.5 • BSA CBT
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'w-full flex justify-center' : ''
            }`}
            title={isCollapsed ? 'Perluas Sidebar' : 'Lipat Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};
