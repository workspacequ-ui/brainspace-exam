import React, { useState, useEffect } from 'react';
import {
  User,
  ClassItem,
  ExamCategory,
  LearningMaterial,
  Exam,
  MarketplaceProduct,
  ExamResult,
  FeaturedProgram
} from './types';
import {
  initStorage,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  saveUsers,
  updateUserStatus,
  saveUser,
  deleteUser,
  getClasses,
  saveClasses,
  getCategories,
  saveCategories,
  getMaterials,
  saveMaterials,
  getExams,
  saveExams,
  getProducts,
  saveProducts,
  getMarketplaceCategories,
  saveMarketplaceCategories,
  getResults,
  saveResults,
  addExamResult,
  getFeaturedPrograms,
  saveFeaturedPrograms
} from './utils/storage';


// Toast System
import { ToastContainer, ToastMessage } from './components/common/Toast';

// Layout Components
import { HeaderNavbar } from './components/common/HeaderNavbar';
import { Sidebar, SidebarTab } from './components/common/Sidebar';
import { EditProfileModal } from './components/common/EditProfileModal';

// Auth & Landing
import { LandingAuth } from './components/auth/LandingAuth';

// Admin Views
import { UserValidation } from './components/admin/UserValidation';
import { StudentManagement } from './components/admin/StudentManagement';
import { AdminManagement } from './components/admin/AdminManagement';
import { ClassAndCategory } from './components/admin/ClassAndCategory';
import { MaterialManagement } from './components/admin/MaterialManagement';
import { ExamManagement } from './components/admin/ExamManagement';
import { MarketplaceManagement } from './components/admin/MarketplaceManagement';
import { ProgramManagement } from './components/admin/ProgramManagement';
import { ExamReports } from './components/admin/ExamReports';


// Student View
import { StudentDashboard } from './components/student/StudentDashboard';

// Exam Engine
import { ExamEngine } from './components/exam/ExamEngine';

export default function App() {
  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Global App State
  const [currentUser, setCurrentUserSession] = useState<User | null>(null);
  const [users, setUsersList] = useState<User[]>([]);
  const [classes, setClassesList] = useState<ClassItem[]>([]);
  const [categories, setCategoriesList] = useState<ExamCategory[]>([]);
  const [materials, setMaterialsList] = useState<LearningMaterial[]>([]);
  const [exams, setExamsList] = useState<Exam[]>([]);
  const [products, setProductsList] = useState<MarketplaceProduct[]>([]);
  const [marketplaceCategories, setMarketplaceCategoriesList] = useState<import('./types').MarketplaceCategory[]>([]);
  const [results, setResultsList] = useState<ExamResult[]>([]);
  const [featuredPrograms, setFeaturedProgramsList] = useState<FeaturedProgram[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active Exam Launcher State
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  // Edit Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Initialize Data on Mount
  useEffect(() => {
    initStorage();
    setUsersList(getUsers());
    setClassesList(getClasses());
    setCategoriesList(getCategories());
    setMaterialsList(getMaterials());
    setExamsList(getExams());
    setProductsList(getProducts());
    setMarketplaceCategoriesList(getMarketplaceCategories());
    setResultsList(getResults());
    setFeaturedProgramsList(getFeaturedPrograms());

    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUserSession(savedUser);
    }
  }, []);


  // Sync Current User with Storage
  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUserSession(user);
    setCurrentUser(user);
  };

  const handleSaveProfile = (updatedUser: User) => {
    handleSetCurrentUser(updatedUser);
    const updatedList = saveUser(updatedUser);
    setUsersList(updatedList);
  };

  // Auth Callbacks
  const handleLoginSuccess = (user: User) => {
    handleSetCurrentUser(user);
    setActiveTab('overview');

    if (user.status === 'PENDING') {
      addToast('info', 'Pendaftaran Anda berstatus PENDING. Menunggu validasi Admin.');
    } else {
      addToast('success', `Selamat datang kembali, ${user.name}!`);
    }
  };

  const handleRegisterSubmit = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const createdUser: User = {
      ...newUser,
      id: `u-reg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedList = saveUser(createdUser);
    setUsersList(updatedList);
    addToast('info', 'Pendaftaran berhasil! Akun Anda kini berstatus PENDING.');
    return createdUser;
  };

  const handleLogout = () => {
    handleSetCurrentUser(null);
    setActiveExam(null);
    addToast('info', 'Anda telah keluar dari sistem.');
  };

  // Admin User Validation
  const handleApproveUser = (userId: string) => {
    const updatedUsers = updateUserStatus(userId, 'ACTIVE');
    setUsersList(updatedUsers);
    addToast('success', 'User berhasil disetujui! Akun siswa kini aktif.');
  };

  const handleRejectUser = (userId: string) => {
    const updatedUsers = updateUserStatus(userId, 'REJECTED');
    setUsersList(updatedUsers);
    addToast('error', 'Pendaftaran user ditolak.');
  };

  // Student & Admin User CRUD
  const handleSaveStudent = (student: User) => {
    const updatedUsers = saveUser(student);
    setUsersList(updatedUsers);
    if (currentUser && currentUser.id === student.id) {
      handleSetCurrentUser(student);
    }
    addToast('success', 'Data siswa berhasil disimpan.');
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedUsers = deleteUser(studentId);
    setUsersList(updatedUsers);
    addToast('info', 'Data siswa berhasil dihapus.');
  };

  const handleSaveUser = (user: User) => {
    const updatedUsers = saveUser(user);
    setUsersList(updatedUsers);
    if (currentUser && currentUser.id === user.id) {
      handleSetCurrentUser(user);
    }
    addToast('success', `Data ${user.role === 'admin' ? 'admin' : 'siswa'} berhasil disimpan.`);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = deleteUser(userId);
    setUsersList(updatedUsers);
    addToast('info', 'Pengguna berhasil dihapus.');
  };

  // Class CRUD
  const handleSaveClass = (classItem: ClassItem) => {
    const existingIdx = classes.findIndex(c => c.id === classItem.id);
    let updated: ClassItem[];
    if (existingIdx >= 0) {
      updated = [...classes];
      updated[existingIdx] = classItem;
    } else {
      updated = [classItem, ...classes];
    }
    setClassesList(updated);
    saveClasses(updated);
    addToast('success', 'Data kelas berhasil disimpan.');
  };

  const handleDeleteClass = (classId: string) => {
    const updated = classes.filter(c => c.id !== classId);
    setClassesList(updated);
    saveClasses(updated);
    addToast('info', 'Kelas dihapus.');
  };

  // Category CRUD
  const handleSaveCategory = (cat: ExamCategory) => {
    const existingIdx = categories.findIndex(c => c.id === cat.id);
    let updated: ExamCategory[];
    if (existingIdx >= 0) {
      updated = [...categories];
      updated[existingIdx] = cat;
    } else {
      updated = [cat, ...categories];
    }
    setCategoriesList(updated);
    saveCategories(updated);
    addToast('success', 'Kategori ujian disimpan.');
  };

  const handleDeleteCategory = (catId: string) => {
    const updated = categories.filter(c => c.id !== catId);
    setCategoriesList(updated);
    saveCategories(updated);
    addToast('info', 'Kategori ujian dihapus.');
  };

  // Material CRUD
  const handleSaveMaterial = (mat: LearningMaterial) => {
    const existingIdx = materials.findIndex(m => m.id === mat.id);
    let updated: LearningMaterial[];
    if (existingIdx >= 0) {
      updated = [...materials];
      updated[existingIdx] = mat;
    } else {
      updated = [mat, ...materials];
    }
    setMaterialsList(updated);
    saveMaterials(updated);
    addToast('success', 'Materi pembelajaran disimpan.');
  };

  const handleDeleteMaterial = (matId: string) => {
    const updated = materials.filter(m => m.id !== matId);
    setMaterialsList(updated);
    saveMaterials(updated);
    addToast('info', 'Materi dihapus.');
  };

  // Exam CRUD
  const handleSaveExam = (exam: Exam) => {
    const existingIdx = exams.findIndex(e => e.id === exam.id);
    let updated: Exam[];
    if (existingIdx >= 0) {
      updated = [...exams];
      updated[existingIdx] = exam;
    } else {
      updated = [exam, ...exams];
    }
    setExamsList(updated);
    saveExams(updated);
    addToast('success', 'Paket ujian & LJK Digital berhasil disimpan.');
  };

  const handleDeleteExam = (examId: string) => {
    const updated = exams.filter(e => e.id !== examId);
    setExamsList(updated);
    saveExams(updated);
    addToast('info', 'Paket ujian dihapus.');
  };

  // Product CRUD
  const handleSaveProduct = (prod: MarketplaceProduct) => {
    const existingIdx = products.findIndex(p => p.id === prod.id);
    let updated: MarketplaceProduct[];
    if (existingIdx >= 0) {
      updated = [...products];
      updated[existingIdx] = prod;
    } else {
      updated = [prod, ...products];
    }
    setProductsList(updated);
    saveProducts(updated);
    addToast('success', 'Produk marketplace berhasil disimpan.');
  };

  const handleDeleteProduct = (prodId: string) => {
    const updated = products.filter(p => p.id !== prodId);
    setProductsList(updated);
    saveProducts(updated);
    addToast('info', 'Produk marketplace dihapus.');
  };

  // Marketplace Category CRUD
  const handleSaveMarketplaceCategory = (cat: import('./types').MarketplaceCategory) => {
    const existingIdx = marketplaceCategories.findIndex(c => c.id === cat.id);
    let updated: import('./types').MarketplaceCategory[];
    if (existingIdx >= 0) {
      updated = [...marketplaceCategories];
      updated[existingIdx] = cat;
    } else {
      updated = [...marketplaceCategories, cat];
    }
    setMarketplaceCategoriesList(updated);
    saveMarketplaceCategories(updated);
    addToast('success', `Kategori produk ${cat.name} berhasil disimpan.`);
  };

  const handleDeleteMarketplaceCategory = (catId: string) => {
    const updated = marketplaceCategories.filter(c => c.id !== catId);
    setMarketplaceCategoriesList(updated);
    saveMarketplaceCategories(updated);
    addToast('info', 'Kategori produk dihapus.');
  };

  // Featured Programs CRUD
  const handleSaveFeaturedProgram = (prog: FeaturedProgram) => {
    const existingIdx = featuredPrograms.findIndex(p => p.id === prog.id);
    let updated: FeaturedProgram[];
    if (existingIdx >= 0) {
      updated = [...featuredPrograms];
      updated[existingIdx] = prog;
    } else {
      updated = [prog, ...featuredPrograms];
    }
    setFeaturedProgramsList(updated);
    saveFeaturedPrograms(updated);
    addToast('success', `Program Unggulan "${prog.title}" berhasil disimpan.`);
  };

  const handleDeleteFeaturedProgram = (progId: string) => {
    const updated = featuredPrograms.filter(p => p.id !== progId);
    setFeaturedProgramsList(updated);
    saveFeaturedPrograms(updated);
    addToast('info', 'Program Unggulan berhasil dihapus.');
  };

  // Exam Result CRUD for Admin Laporan
  const handleSaveExamResult = (res: ExamResult) => {
    const existingIdx = results.findIndex(r => r.id === res.id);
    let updated: ExamResult[];
    if (existingIdx >= 0) {
      updated = [...results];
      updated[existingIdx] = res;
    } else {
      updated = [res, ...results];
    }
    setResultsList(updated);
    saveResults(updated);
    addToast('success', `Data hasil ujian "${res.studentName}" berhasil disimpan.`);
  };

  const handleDeleteExamResult = (resultId: string) => {
    const updated = results.filter(r => r.id !== resultId);
    setResultsList(updated);
    saveResults(updated);
    addToast('info', 'Data hasil ujian berhasil dihapus.');
  };

  // Exam Result Submit Callback
  const handleSubmitExamResult = (res: ExamResult) => {
    const updatedResults = addExamResult(res);
    setResultsList(updatedResults);
    setActiveExam(null);
    setActiveTab('history');
    addToast('success', `Ujian selesai! Skor Anda: ${res.score} Poin (${res.isPassed ? 'LULUS' : 'TIDAK LULUS'}).`);
  };


  // Active Pending Users Count
  const pendingUsersCount = users.filter(u => u.status === 'PENDING').length;

  // Render Exam Engine if Exam is active
  if (activeExam && currentUser) {
    return (
      <ExamEngine
        exam={activeExam}
        user={currentUser}
        onSubmitExam={handleSubmitExamResult}
        onCancelExam={() => setActiveExam(null)}
      />
    );
  }

  // Render Landing & Auth if not logged in or pending
  if (!currentUser || currentUser.status === 'PENDING') {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <LandingAuth
          onLoginSuccess={handleLoginSuccess}
          onRegisterSubmit={handleRegisterSubmit}
          classes={classes}
          users={users}
          pendingUser={currentUser}
          onLogoutPending={handleLogout}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Header Navbar */}
      <HeaderNavbar
        user={currentUser}
        onLogout={handleLogout}
        onEditProfile={() => setIsEditProfileModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        activeMenuTitle={
          currentUser.role === 'admin'
            ? activeTab === 'validation'
              ? 'Validasi User Baru'
              : activeTab === 'students'
              ? 'Pengelola Data Siswa'
              : activeTab === 'classes'
              ? 'Kelas & Kategori Ujian'
              : activeTab === 'materials'
              ? 'Pengelola Materi Pembelajaran'
              : activeTab === 'exams'
              ? 'Bank Ujian & LJK'
              : activeTab === 'marketplace'
              ? 'Toko Marketplace Sekolah'
              : activeTab === 'programs'
              ? 'Manajemen Program Unggulan'
              : activeTab === 'reports'
              ? 'Laporan Hasil Ujian'

              : 'Dashboard Utama Admin'
            : activeTab === 'materials'
            ? 'Materi Pembelajaran Saya'
            : activeTab === 'exams'
            ? 'Daftar Ujian Aktif'
            : activeTab === 'marketplace'
            ? 'Toko & Marketplace Sekolah'
            : activeTab === 'history'
            ? 'Riwayat & Hasil Ujian'
            : 'Dashboard Siswa'
        }
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar
          role={currentUser.role}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingCount={pendingUsersCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Body Area */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 min-w-0 ${
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          {/* ROLE: ADMIN DASHBOARD VIEWS */}
          {currentUser.role === 'admin' && (
            <>
              {/* OVERVIEW / DASHBOARD UTAMA ADMIN */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                      onClick={() => setActiveTab('validation')}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-xl"
                    >
                      <p className="text-xs text-slate-400 font-medium">Siswa Pending Validasi</p>
                      <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingUsersCount} Siswa</h3>
                      <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                        <span>Klik untuk validasi</span> →
                      </p>
                    </div>

                    <div
                      onClick={() => setActiveTab('students')}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all shadow-xl"
                    >
                      <p className="text-xs text-slate-400 font-medium">Total Siswa Aktif</p>
                      <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">
                        {users.filter(u => u.role === 'student' && u.status === 'ACTIVE').length} Siswa
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-2">Terdaftar di {classes.length} kelas</p>
                    </div>

                    <div
                      onClick={() => setActiveTab('exams')}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all shadow-xl"
                    >
                      <p className="text-xs text-slate-400 font-medium">Paket Ujian CBT & PDF</p>
                      <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{exams.length} Ujian</h3>
                      <p className="text-[11px] text-slate-500 mt-2">Tersedia untuk pengerjaan</p>
                    </div>

                    <div
                      onClick={() => setActiveTab('reports')}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all shadow-xl"
                    >
                      <p className="text-xs text-slate-400 font-medium">Laporan Submit Ujian</p>
                      <h3 className="text-3xl font-extrabold text-blue-400 mt-1">{results.length} Laporan</h3>
                      <p className="text-[11px] text-slate-500 mt-2">Perangkingan & Analisis</p>
                    </div>
                  </div>

                  {/* Render Validation Section on main view too if pending users exist */}
                  {pendingUsersCount > 0 && (
                    <UserValidation
                      users={users}
                      onApprove={handleApproveUser}
                      onReject={handleRejectUser}
                    />
                  )}

                  <StudentManagement
                    users={users}
                    classes={classes}
                    onSaveStudent={handleSaveStudent}
                    onDeleteStudent={handleDeleteStudent}
                  />
                </div>
              )}

              {activeTab === 'validation' && (
                <UserValidation
                  users={users}
                  onApprove={handleApproveUser}
                  onReject={handleRejectUser}
                />
              )}

              {activeTab === 'students' && (
                <StudentManagement
                  users={users}
                  classes={classes}
                  onSaveStudent={handleSaveStudent}
                  onDeleteStudent={handleDeleteStudent}
                />
              )}

              {activeTab === 'admins' && (
                <AdminManagement
                  users={users}
                  currentUser={currentUser}
                  onSaveUser={handleSaveUser}
                  onDeleteUser={handleDeleteUser}
                  onShowToast={(msg, type) => addToast(type, msg)}
                />
              )}

              {activeTab === 'classes' && (
                <ClassAndCategory
                  classes={classes}
                  categories={categories}
                  onSaveClass={handleSaveClass}
                  onDeleteClass={handleDeleteClass}
                  onSaveCategory={handleSaveCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              )}

              {activeTab === 'materials' && (
                <MaterialManagement
                  materials={materials}
                  classes={classes}
                  onSaveMaterial={handleSaveMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                />
              )}

              {activeTab === 'exams' && (
                <ExamManagement
                  exams={exams}
                  classes={classes}
                  categories={categories}
                  onSaveExam={handleSaveExam}
                  onDeleteExam={handleDeleteExam}
                />
              )}

              {activeTab === 'marketplace' && (
                <MarketplaceManagement
                  products={products}
                  categories={marketplaceCategories}
                  onSaveProduct={handleSaveProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onSaveCategory={handleSaveMarketplaceCategory}
                  onDeleteCategory={handleDeleteMarketplaceCategory}
                />
              )}

              {activeTab === 'programs' && (
                <ProgramManagement
                  programs={featuredPrograms}
                  onSaveProgram={handleSaveFeaturedProgram}
                  onDeleteProgram={handleDeleteFeaturedProgram}
                />
              )}

              {activeTab === 'reports' && (
                <ExamReports
                  results={results}
                  classes={classes}
                  categories={categories}
                  onSaveResult={handleSaveExamResult}
                  onDeleteResult={handleDeleteExamResult}
                />
              )}
            </>
          )}

          {/* ROLE: STUDENT DASHBOARD VIEWS */}
          {currentUser.role === 'student' && (
            <StudentDashboard
              user={currentUser}
              materials={materials}
              exams={exams}
              products={products}
              results={results}
              featuredPrograms={featuredPrograms}
              onStartExam={exam => setActiveExam(exam)}
              activeTab={activeTab}
            />
          )}

        </main>

      </div>

      {/* Edit Profile Modal */}
      {currentUser && (
        <EditProfileModal
          user={currentUser}
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={handleSaveProfile}
          onShowToast={(msg, type) => addToast(type, msg)}
        />
      )}
    </div>
  );
}
