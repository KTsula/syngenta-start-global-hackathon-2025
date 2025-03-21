
import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import Dashboard from '../components/Dashboard';
import AppSidebar from '../components/AppSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SearchBar from '@/components/SearchBar';

const Index: React.FC = () => {
  const { t } = useLanguage();
  
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality here
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="px-0">
          <div className="h-16 border-b bg-white p-4 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <SidebarTrigger className="mr-4" />
              <SearchBar 
                placeholder={t("search_dashboard")} 
                onSearch={handleSearch} 
              />
            </div>
            <LanguageSwitcher />
          </div>
          <div className="p-0">
            <Dashboard />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
