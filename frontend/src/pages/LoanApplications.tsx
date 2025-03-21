
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SearchBar from '@/components/SearchBar';
import LoanApplicationsTable from '@/components/LoanApplicationsTable';
import LoanApplicationsSummary from '@/components/LoanApplicationsSummary';
import { useDatabase } from '@/services/mockDatabaseService';

const LoanApplications: React.FC = () => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const loanRequestsData = useDatabase(state => state.loanRequests);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="px-0 w-full overflow-hidden">
          <div className="h-16 border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <SidebarTrigger className="mr-4" />
              <SearchBar 
                placeholder={t("search_loan_applications")} 
                onSearch={handleSearch} 
              />
            </div>
            <LanguageSwitcher />
          </div>
          <div className="p-4 md:p-8 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
            <LoanApplicationsSummary data={loanRequestsData} />
            
            <Card className="mt-6 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between w-full">
                  <div className="flex flex-wrap gap-2">
                    <StatusFilterButton 
                      status="all" 
                      label={t("all")}
                      currentFilter={statusFilter} 
                      setStatusFilter={setStatusFilter} 
                    />
                    <StatusFilterButton 
                      status="pending" 
                      label={t("pending_review")}
                      currentFilter={statusFilter} 
                      setStatusFilter={setStatusFilter} 
                    />
                    <StatusFilterButton 
                      status="approved" 
                      label={t("approved")}
                      currentFilter={statusFilter} 
                      setStatusFilter={setStatusFilter} 
                    />
                    <StatusFilterButton 
                      status="rejected" 
                      label={t("rejected")}
                      currentFilter={statusFilter} 
                      setStatusFilter={setStatusFilter} 
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 px-2 sm:px-6">
                <LoanApplicationsTable 
                  data={loanRequestsData.recentRequests} 
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                />
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

interface StatusFilterButtonProps {
  status: string;
  label: string;
  currentFilter: string;
  setStatusFilter: (status: string) => void;
}

const StatusFilterButton: React.FC<StatusFilterButtonProps> = ({ 
  status, 
  label, 
  currentFilter, 
  setStatusFilter 
}) => {
  const isActive = currentFilter === status;
  
  return (
    <button
      onClick={() => setStatusFilter(status)}
      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary hover:bg-secondary/80'
      }`}
    >
      {label}
    </button>
  );
};

export default LoanApplications;
