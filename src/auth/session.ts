import type { DemoUser } from './demoUsers';

const SESSION_KEY = 'agriscore_demo_session';

export const sessionService = {
  login: (user: DemoUser) => {
    // Avoid storing passwords in session
    const { demoPassword: _, ...userWithoutPassword } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): DemoUser | null => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!sessionService.getCurrentUser();
  },

  isInstitution: (): boolean => {
    return sessionService.getCurrentUser()?.role === 'institution';
  },

  isProducer: (): boolean => {
    return sessionService.getCurrentUser()?.role === 'producer';
  }
};
