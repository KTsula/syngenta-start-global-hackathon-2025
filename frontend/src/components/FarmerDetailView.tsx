
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import FarmerProfile from './FarmerProfile';
import HistoricalPerformance from './HistoricalPerformance';
import SeasonStatus from './SeasonStatus';
import RiskAssessment from './RiskAssessment';
import FinancialProjections from './FinancialProjections';
import MarketIndicators from './MarketIndicators';
import CreditScoring from './CreditScoring';
import FarmMap from './FarmMap';
import { farmerProfileData } from '../data/mockData';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from '@/components/SearchBar';
import { useMapData } from '@/hooks/useMapData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Rajesh Kumar's farmer ID
const RAJESH_KUMAR_ID = 'FM-29834';

const FarmerDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { points, isLoading, error } = useMapData();
  
  // Check if the current farmer is Rajesh Kumar
  const [isRajeshKumar, setIsRajeshKumar] = useState(false);
  
  useEffect(() => {
    // Check if this is Rajesh Kumar's profile
    if (id === 'F001' || farmerProfileData.id === RAJESH_KUMAR_ID) {
      console.log('This is Rajesh Kumar\'s profile');
      setIsRajeshKumar(true);
    } else {
      console.log('This is not Rajesh Kumar\'s profile');
      setIsRajeshKumar(false);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/farmers');
  };

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
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 h-8" 
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("back_to_farmers")}
              </Button>
              <SearchBar 
                placeholder={t("search_farmer_details")} 
                onSearch={handleSearch} 
              />
            </div>
            <LanguageSwitcher />
          </div>
          
          <div className="p-3 sm:p-4 md:p-6 xl:p-8 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
            <div className="mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t("farmer_details")}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-semibold">{farmerProfileData.name}</h2>
                    <span className="text-xs md:text-sm bg-slate-200 px-2 py-0.5 rounded-full">
                      {t("id")}: {isRajeshKumar ? RAJESH_KUMAR_ID : farmerProfileData.id}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm">{farmerProfileData.location.village}, {farmerProfileData.location.district}</p>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-2 sm:mt-0">{t("last_updated")}: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            
            {/* Farm Map Section - Only shown for Rajesh Kumar */}
            {isRajeshKumar && (
              <Card className="mb-3 md:mb-4 xl:mb-6">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">{t("field_vegetation_map")}</h3>
                  <p className="text-sm text-muted-foreground">{t("ndvi_heatmap_visualization")}</p>
                </CardHeader>
                <CardContent>
                  <FarmMap points={points} isLoading={isLoading} />
                  {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("map_legend")}: <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> {t("healthy_vegetation")} 
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mx-1 ml-2"></span> {t("moderate_vegetation")}
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mx-1 ml-2"></span> {t("sparse_vegetation")}
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 xl:gap-6 mb-3 md:mb-4 xl:mb-6">
              <div className="lg:col-span-8">
                <CreditScoring />
              </div>
              <div className="lg:col-span-4">
                <FarmerProfile />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 xl:gap-6 mb-3 md:mb-4 xl:mb-6">
              <div className="lg:col-span-8">
                <HistoricalPerformance />
              </div>
              <div className="lg:col-span-4">
                <SeasonStatus />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 xl:gap-6">
              <div className="lg:col-span-6">
                <RiskAssessment />
              </div>
              <div className="lg:col-span-6">
                <div className="grid grid-cols-1 gap-3 md:gap-4 xl:gap-6">
                  <FinancialProjections />
                  <MarketIndicators />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default FarmerDetailView;
