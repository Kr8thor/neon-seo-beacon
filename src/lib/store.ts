
interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface Audit {
  id: string;
  url: string;
  score: number;
  status: 'completed' | 'processing' | 'failed';
  date: Date;
  issues: {
    critical: number;
    warnings: number;
    recommendations: number;
  };
  duration?: number;
}

interface ProgressData {
  step: number;
  progress: number;
  message: string;
}

class AppStore {
  private listeners: Set<() => void> = new Set();

  // Auth state
  user: User | null = null;
  token: string | null = null;
  isAuthenticated: boolean = false;

  // Audit state
  currentAudit: Audit | null = null;
  audits: Audit[] = [];
  isAnalyzing: boolean = false;
  progress: ProgressData | null = null;

  // UI state
  theme: 'dark' | 'light' = 'dark';
  sidebarOpen: boolean = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const token = localStorage.getItem('seo_token');
      const user = localStorage.getItem('seo_user');
      const audits = localStorage.getItem('seo_audits');

      if (token) {
        this.token = token;
        this.isAuthenticated = true;
      }

      if (user) {
        this.user = JSON.parse(user);
      }

      if (audits) {
        this.audits = JSON.parse(audits).map((audit: any) => ({
          ...audit,
          date: new Date(audit.date)
        }));
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (this.token) {
        localStorage.setItem('seo_token', this.token);
      } else {
        localStorage.removeItem('seo_token');
      }

      if (this.user) {
        localStorage.setItem('seo_user', JSON.stringify(this.user));
      } else {
        localStorage.removeItem('seo_user');
      }

      localStorage.setItem('seo_audits', JSON.stringify(this.audits));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Auth actions
  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
    this.saveToStorage();
    this.notify();
  }

  setToken(token: string | null) {
    this.token = token;
    this.isAuthenticated = !!token;
    this.saveToStorage();
    this.notify();
  }

  logout() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.currentAudit = null;
    this.progress = null;
    this.isAnalyzing = false;
    localStorage.clear();
    this.notify();
  }

  // Audit actions
  addAudit(audit: Audit) {
    this.audits.unshift(audit);
    this.saveToStorage();
    this.notify();
  }

  updateAuditProgress(progress: ProgressData) {
    this.progress = progress;
    this.notify();
  }

  startAnalysis() {
    this.isAnalyzing = true;
    this.progress = null;
    this.notify();
  }

  completeAudit(auditId: string, results: Partial<Audit>) {
    const auditIndex = this.audits.findIndex(a => a.id === auditId);
    if (auditIndex !== -1) {
      this.audits[auditIndex] = { ...this.audits[auditIndex], ...results };
      this.saveToStorage();
    }
    this.isAnalyzing = false;
    this.progress = null;
    this.notify();
  }

  deleteAudit(auditId: string) {
    this.audits = this.audits.filter(a => a.id !== auditId);
    this.saveToStorage();
    this.notify();
  }

  // UI actions
  setTheme(theme: 'dark' | 'light') {
    this.theme = theme;
    this.notify();
  }

  setSidebarOpen(open: boolean) {
    this.sidebarOpen = open;
    this.notify();
  }
}

export const store = new AppStore();

// React hook for using the store
export const useStore = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return store;
};
