
import React from 'react';
import { farmerProfileData } from '../data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const FarmerProfile: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{t("farmer_profile")}</h2>
        <div className="status-pill status-pill-info text-xs whitespace-nowrap">{t("profile_complete")}</div>
      </div>
      
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-sm text-muted-foreground">{t("full_name")}</span>
          <span className="font-medium mt-1 sm:mt-0">{farmerProfileData.name}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-sm text-muted-foreground">{t("contact")}</span>
          <span className="font-medium mt-1 sm:mt-0">{farmerProfileData.contact}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-sm text-muted-foreground">{t("address")}</span>
          <span className="font-medium mt-1 sm:mt-0 text-right">
            {farmerProfileData.location.village}, {farmerProfileData.location.district}, {farmerProfileData.location.state}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-sm text-muted-foreground">{t("land_size")}</span>
          <span className="font-medium mt-1 sm:mt-0">{farmerProfileData.land.size} {t("hectares")}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-sm text-muted-foreground">{t("land_ownership")}</span>
          <span className="font-medium mt-1 sm:mt-0">{farmerProfileData.land.ownership} ({farmerProfileData.land.tenure} {t("years")})</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-sm text-muted-foreground">{t("crops_grown")}</span>
          <span className="font-medium mt-1 sm:mt-0">{farmerProfileData.crops.join(", ")}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("farming_experience")}</span>
          <span className="font-medium mt-1 sm:mt-0">{farmerProfileData.farmingExperience} {t("years")}</span>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
