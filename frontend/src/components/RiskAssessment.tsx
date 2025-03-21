
import React from 'react';
import { riskAssessmentData } from '../data/mockData';
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';

const RiskAssessment: React.FC = () => {
  const { weatherForecast, irrigationSource, soilQuality, insuranceCoverage, overallRiskScore } = riskAssessmentData;
  const { t } = useLanguage();
  
  // Helper to get risk color class
  const getRiskClass = (score: number) => {
    if (score <= 30) return 'progress-high';
    if (score <= 60) return 'progress-medium';
    return 'progress-low';
  };
  
  // Helper to get reliability color class
  const getReliabilityClass = (score: number) => {
    if (score >= 80) return 'progress-high';
    if (score >= 50) return 'progress-medium';
    return 'progress-low';
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{t("risk_assessment")}</h2>
        <div className="status-pill status-pill-success">{t("low_risk")}</div>
      </div>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{t("overall_risk_score")}</span>
            <span className="text-sm">{overallRiskScore}/100</span>
          </div>
          <Progress value={100 - overallRiskScore} className={`h-2 ${getRiskClass(overallRiskScore)}`} />
          <div className="mt-1 text-xs text-muted-foreground">{t("lower_risk_note")}</div>
        </div>
        
        <div className="pt-2">
          <div className="text-sm font-medium mb-2">{t("7_day_weather")}</div>
          <div className="flex space-x-1">
            {weatherForecast.next7Days.map((day, idx) => (
              <div key={idx} className="flex-1 bg-slate-50 p-2 rounded-lg text-center">
                <div className="text-xs font-medium">{day.day}</div>
                <div className="text-xs my-1">{day.temperature}°C</div>
                <div className="text-xs">{day.rainfall} mm</div>
              </div>
            ))}
          </div>
          
          {weatherForecast.warnings.length > 0 ? (
            <div className="mt-2 text-xs text-warning">
              {weatherForecast.warnings.join(', ')}
            </div>
          ) : (
            <div className="mt-2 text-xs text-success">{t("no_weather_warnings")}</div>
          )}
        </div>
        
        <div className="pt-2 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">{t("irrigation")}</div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">{t("primary_source")}</div>
              <div className="font-medium">{irrigationSource.primary}</div>
              <div className="mt-2 text-sm text-muted-foreground">{t("reliability")}</div>
              <div className="flex items-center mt-1">
                <Progress value={irrigationSource.reliability} className={`h-2 flex-1 ${getReliabilityClass(irrigationSource.reliability)}`} />
                <span className="text-xs ml-2">{irrigationSource.reliability}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">{t("soil_quality")}</div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">{t("type")}</div>
                  <div className="text-sm">{soilQuality.type}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("ph")}</div>
                  <div className="text-sm">{soilQuality.ph}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("organic_matter")}</div>
                  <div className="text-sm">{soilQuality.organicMatter}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("nutrient_status")}</div>
                  <div className="text-sm">{soilQuality.nutrientStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="text-sm font-medium mb-2">{t("insurance_coverage")}</div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">{t("policy")}</div>
                <div className="text-sm font-medium">{insuranceCoverage.policy}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("premium")}</div>
                <div className="text-sm">₹{insuranceCoverage.premium.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("coverage")}</div>
                <div className="text-sm">₹{insuranceCoverage.coverageAmount.toLocaleString()}</div>
              </div>
            </div>
            
            {insuranceCoverage.claimHistory.length > 0 ? (
              <div className="mt-2 text-xs">
                {t("previous_claims")}: {insuranceCoverage.claimHistory.length}
              </div>
            ) : (
              <div className="mt-2 text-xs text-success">{t("no_previous_claims")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
