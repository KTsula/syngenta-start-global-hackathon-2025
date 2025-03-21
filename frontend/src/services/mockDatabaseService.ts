
import { create } from 'zustand';
import { loanRequestsData as initialData } from '@/data/advisorData';

export interface LoanApplication {
  id: string;
  farmerName: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  creditScore: number;
}

interface DatabaseState {
  loanRequests: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    recentRequests: LoanApplication[];
  };
  updateApplicationStatus: (applicationId: string, newStatus: 'pending' | 'approved' | 'rejected') => void;
}

export const useDatabase = create<DatabaseState>((set) => ({
  loanRequests: initialData,
  updateApplicationStatus: (applicationId, newStatus) => 
    set((state) => {
      // Find the application to update
      const updatedRecentRequests = state.loanRequests.recentRequests.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );

      // Count the new totals
      const pendingRequests = updatedRecentRequests.filter(app => app.status === 'pending').length;
      const approvedRequests = updatedRecentRequests.filter(app => app.status === 'approved').length;
      const rejectedRequests = updatedRecentRequests.filter(app => app.status === 'rejected').length;
      
      return {
        loanRequests: {
          ...state.loanRequests,
          pendingRequests,
          approvedRequests,
          rejectedRequests,
          recentRequests: updatedRecentRequests,
        }
      };
    }),
}));
