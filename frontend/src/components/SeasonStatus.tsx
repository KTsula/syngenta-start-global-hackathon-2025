
import React from 'react';
import { currentSeasonData } from '../data/mockData';
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';

const SeasonStatus: React.FC = () => {
  const { cropDetails, fieldConditions, issues } = currentSeasonData;
  const { t } = useLanguage();
  
  // Calculate days since sowing
  const sowingDate = new Date(cropDetails.dateOfSowing);
  const harvestDate = new Date(cropDetails.expectedHarvest);
  const currentDate = new Date();
  const totalDays = Math.round((harvestDate.getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.round((currentDate.getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  
  const getHealthClass = (score: number) => {
    if (score >= 80) return 'progress-high';
    if (score >= 60) return 'progress-medium';
    return 'progress-low';
  };
  
  const getMoistureClass = (value: number) => {
    if (value >= 70) return 'progress-high';
    if (value >= 50) return 'progress-medium';
    return 'progress-low';
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{t("current_season_status")}</h2>
        <div className="status-pill status-pill-success">{t("on_schedule")}</div>
      </div>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-medium">{cropDetails.type} ({cropDetails.variety})</span>
            <span className="text-sm text-muted-foreground">{cropDetails.growthStage} {t("stage")}</span>
          </div>
          
          <div className="mb-1">
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("sowing")}: {new Date(cropDetails.dateOfSowing).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span>{cropDetails.daysToHarvest} {t("days_to_harvest")}</span>
            <span>{t("harvest")}: {new Date(cropDetails.expectedHarvest).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
        
        <div className="pt-2 grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">{t("crop_health")}</span>
              <span className="text-sm font-medium">{cropDetails.healthScore}%</span>
            </div>
            <Progress value={cropDetails.healthScore} className={`h-2 ${getHealthClass(cropDetails.healthScore)}`} />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">{t("soil_moisture")}</span>
              <span className="text-sm font-medium">{fieldConditions.soilMoisture}%</span>
            </div>
            <Progress value={fieldConditions.soilMoisture} className={`h-2 ${getMoistureClass(fieldConditions.soilMoisture)}`} />
          </div>
        </div>
        
        <div className="pt-2">
          <div className="text-sm font-medium mb-2">{t("field_conditions")}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">{t("recent_rainfall")}</div>
              <div className="text-lg font-medium">{fieldConditions.recentRainfall} mm</div>
              <div className="text-xs text-muted-foreground">{t("last_7_days")}</div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">{t("temperature")}</div>
              <div className="text-lg font-medium">{fieldConditions.temperature.current}°C</div>
              <div className="text-xs text-muted-foreground">
                {fieldConditions.temperature.deviation > 0 ? '+' : ''}
                {fieldConditions.temperature.deviation}°C {t("from_normal")}
              </div>
            </div>
          </div>
        </div>
        
        {issues.length > 0 && (
          <div className="pt-2">
            <div className="text-sm font-medium mb-2">{t("issues_recommendations")}</div>
            {issues.map((issue, index) => (
              <div key={index} className="bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">{t(issue.type.toLowerCase())} {t("issue")}</div>
                  <div className={`status-pill ${issue.type === 'Minor' ? 'status-pill-warning' : 'status-pill-danger'}`}>
                    {t(issue.type.toLowerCase())}
                  </div>
                </div>
                <div className="text-sm mt-1">{issue.description}</div>
                <div className="text-sm text-success mt-1">{issue.recommendation}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonStatus;
