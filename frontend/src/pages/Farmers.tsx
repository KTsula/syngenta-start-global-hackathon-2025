
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ViewToggle from '@/components/ViewToggle';
import FarmersList from '@/components/FarmersList';
import FarmersKanbanView from '@/components/FarmersKanbanView';
import { farmersList } from '@/data/farmersData';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SearchBar from '@/components/SearchBar';

const Farmers: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list');
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality here
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
                placeholder={t("search_farmers")} 
                onSearch={handleSearch} 
              />
            </div>
            <LanguageSwitcher />
          </div>
          <div className="p-4 md:p-8 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">{t("farmers")}</h2>
              <p className="text-muted-foreground text-sm">{t("view_manage_farmers")}</p>
            </div>
            
            <Card className="overflow-hidden">
              <CardHeader className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row items-center justify-between space-y-0'} pb-2`}>
                <ViewToggle view={viewMode} onViewChange={setViewMode} />
              </CardHeader>
              <CardContent className={`${viewMode === 'kanban' ? 'pt-6 px-2 sm:px-4' : 'pt-6 px-2 sm:px-6'}`}>
                {viewMode === 'list' ? (
                  <FarmersList farmers={farmersList} />
                ) : (
                  <FarmersKanbanView farmers={farmersList} />
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Farmers;
