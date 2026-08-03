import {
  User,
  ClassItem,
  ExamCategory,
  LearningMaterial,
  Exam,
  MarketplaceProduct,
  MarketplaceCategory,
  ExamResult,
  FeaturedProgram,
  InstitutionInfo
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_MATERIALS,
  INITIAL_EXAMS,
  INITIAL_PRODUCTS,
  INITIAL_MARKETPLACE_CATEGORIES,
  INITIAL_RESULTS,
  INITIAL_FEATURED_PROGRAMS
} from '../data/mockData';

const KEYS = {
  USERS: 'bsa_users',
  CLASSES: 'bsa_classes',
  CATEGORIES: 'bsa_categories',
  MATERIALS: 'bsa_materials',
  EXAMS: 'bsa_exams',
  PRODUCTS: 'bsa_products',
  MARKETPLACE_CATEGORIES: 'bsa_mkt_categories',
  RESULTS: 'bsa_results',
  FEATURED_PROGRAMS: 'bsa_featured_programs',
  CURRENT_USER: 'bsa_current_user',
  INSTITUTION: 'bsa_institution_info'
};


// Helper for initial load with fallback
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting ${key} in localStorage`, e);
  }
}

// Initialize default seed data if missing
export function initStorage(): void {
  if (!localStorage.getItem(KEYS.USERS)) {
    setStoredItem(KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(KEYS.CLASSES)) {
    setStoredItem(KEYS.CLASSES, INITIAL_CLASSES);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    setStoredItem(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.MATERIALS)) {
    setStoredItem(KEYS.MATERIALS, INITIAL_MATERIALS);
  }
  if (!localStorage.getItem(KEYS.EXAMS)) {
    setStoredItem(KEYS.EXAMS, INITIAL_EXAMS);
  }
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    setStoredItem(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(KEYS.MARKETPLACE_CATEGORIES)) {
    setStoredItem(KEYS.MARKETPLACE_CATEGORIES, INITIAL_MARKETPLACE_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.RESULTS)) {
    setStoredItem(KEYS.RESULTS, INITIAL_RESULTS);
  }
}

// Session User Management
export function getCurrentUser(): User | null {
  return getStoredItem<User | null>(KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
  setStoredItem(KEYS.CURRENT_USER, user);
}

// Users CRUD & Validation
export function getUsers(): User[] {
  return getStoredItem<User[]>(KEYS.USERS, INITIAL_USERS);
}

export function saveUsers(users: User[]): void {
  setStoredItem(KEYS.USERS, users);
}

export function updateUserStatus(userId: string, status: 'ACTIVE' | 'REJECTED'): User[] {
  const users = getUsers();
  const updated = users.map(u => (u.id === userId ? { ...u, status } : u));
  saveUsers(updated);
  return updated;
}

export function saveUser(user: User): User[] {
  const users = getUsers();
  const existingIdx = users.findIndex(u => u.id === user.id);
  let updated: User[];
  if (existingIdx >= 0) {
    updated = [...users];
    updated[existingIdx] = user;
  } else {
    updated = [user, ...users];
  }
  saveUsers(updated);
  return updated;
}

export function deleteUser(userId: string): User[] {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
  return users;
}

// Classes CRUD
export function getClasses(): ClassItem[] {
  return getStoredItem<ClassItem[]>(KEYS.CLASSES, INITIAL_CLASSES);
}

export function saveClasses(classes: ClassItem[]): void {
  setStoredItem(KEYS.CLASSES, classes);
}

// Categories CRUD
export function getCategories(): ExamCategory[] {
  return getStoredItem<ExamCategory[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategories(categories: ExamCategory[]): void {
  setStoredItem(KEYS.CATEGORIES, categories);
}

// Materials CRUD
export function getMaterials(): LearningMaterial[] {
  return getStoredItem<LearningMaterial[]>(KEYS.MATERIALS, INITIAL_MATERIALS);
}

export function saveMaterials(materials: LearningMaterial[]): void {
  setStoredItem(KEYS.MATERIALS, materials);
}

// Exams CRUD
export function getExams(): Exam[] {
  return getStoredItem<Exam[]>(KEYS.EXAMS, INITIAL_EXAMS);
}

export function saveExams(exams: Exam[]): void {
  setStoredItem(KEYS.EXAMS, exams);
}

// Products CRUD
export function getProducts(): MarketplaceProduct[] {
  return getStoredItem<MarketplaceProduct[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveProducts(products: MarketplaceProduct[]): void {
  setStoredItem(KEYS.PRODUCTS, products);
}

// Marketplace Categories CRUD
export function getMarketplaceCategories(): MarketplaceCategory[] {
  return getStoredItem<MarketplaceCategory[]>(KEYS.MARKETPLACE_CATEGORIES, INITIAL_MARKETPLACE_CATEGORIES);
}

export function saveMarketplaceCategories(categories: MarketplaceCategory[]): void {
  setStoredItem(KEYS.MARKETPLACE_CATEGORIES, categories);
}

// Results CRUD
export function getResults(): ExamResult[] {
  return getStoredItem<ExamResult[]>(KEYS.RESULTS, INITIAL_RESULTS);
}

export function saveResults(results: ExamResult[]): void {
  setStoredItem(KEYS.RESULTS, results);
}

export function addExamResult(result: ExamResult): ExamResult[] {
  const current = getResults();
  const updated = [result, ...current];
  saveResults(updated);
  return updated;
}

// Featured Programs CRUD
export function getFeaturedPrograms(): FeaturedProgram[] {
  return getStoredItem<FeaturedProgram[]>(KEYS.FEATURED_PROGRAMS, INITIAL_FEATURED_PROGRAMS);
}

export function saveFeaturedPrograms(programs: FeaturedProgram[]): void {
  setStoredItem(KEYS.FEATURED_PROGRAMS, programs);
}

export const DEFAULT_INSTITUTION: InstitutionInfo = {
  name: 'BRAIN SPACE ACADEMY',
  subtitle: 'CBT & LMS SMART ACADEMY',
  logoUrl: ''
};

export function getInstitutionInfo(): InstitutionInfo {
  return getStoredItem<InstitutionInfo>(KEYS.INSTITUTION, DEFAULT_INSTITUTION);
}

export function saveInstitutionInfo(info: InstitutionInfo): InstitutionInfo {
  setStoredItem(KEYS.INSTITUTION, info);
  return info;
}

