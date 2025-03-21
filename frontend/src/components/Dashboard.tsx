
import React from 'react';
import RequestsSummary from './RequestsSummary';
import RiskMonitoring from './RiskMonitoring';
import RecentActivities from './RecentActivities';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">      
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-plant-green-dark">{t("financial_advisor_dashboard")}</h2>
          <p className="text-muted-foreground text-sm">{t("monitor_loan_requests")}</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-air-blue-core to-air-blue-bright/20 p-6 rounded-lg shadow-sm border border-air-blue-bright/30">
            <RequestsSummary />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-gradient-to-br from-plant-green-core to-plant-green-bright/10 p-6 rounded-lg shadow-sm border border-plant-green-bright/20">
              <RiskMonitoring />
            </div>
          </div>
          
          {/* Recent Activities as full width section */}
          <div className="bg-gradient-to-br from-sun-orange-core to-sun-orange-bright/10 p-6 rounded-lg shadow-sm border border-sun-orange-bright/20">
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
