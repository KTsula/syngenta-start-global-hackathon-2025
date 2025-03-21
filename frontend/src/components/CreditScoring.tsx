
import React from 'react';
import { creditScoringData } from '../data/mockData';
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';

const CreditScoring: React.FC = () => {
  const { overallScore, recommendation, components, qualitativeFlags } = creditScoringData;
  const { t } = useLanguage();
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };
  
  // Get progress bar class based on score
  const getProgressClass = (score: number) => {
    if (score >= 80) return 'progress-high';
    if (score >= 60) return 'progress-medium';
    return 'progress-low';
  };
  
  // Get recommendation class and icon
  const getRecommendationDetails = (rec: string) => {
    switch (rec) {
      case 'Approve':
        return { class: 'status-pill-success', text: t("approve") };
      case 'Reject':
        return { class: 'status-pill-danger', text: t("reject") };
      default:
        return { class: 'status-pill-warning', text: t("review_needed") };
    }
  };
  
  const recDetails = getRecommendationDetails(recommendation);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{t("credit_scoring")}</h2>
        <div className={`status-pill ${recDetails.class}`}>{recDetails.text}</div>
      </div>
      
      <div className="space-y-5">
        <div className="flex items-center justify-center py-2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center">
              <div className="text-3xl font-bold tracking-tighter leading-none text-center">
                <span className={getScoreColor(overallScore)}>{overallScore}</span>
                <div className="text-xs font-normal text-muted-foreground mt-1">{t("credit_score")}</div>
              </div>
            </div>
            
            <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={overallScore >= 80 ? 'hsl(var(--success))' : overallScore >= 60 ? 'hsl(var(--warning))' : 'hsl(var(--danger))'}
                strokeWidth="8"
                strokeDasharray={`${(overallScore / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-3">{t("score_components")}</div>
          <div className="space-y-3">
            {components.map((component, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{component.name}</span>
                  <span className="text-sm font-medium">{component.score}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={component.score} className={`h-2 flex-1 ${getProgressClass(component.score)}`} />
                  <span className="text-xs text-muted-foreground">{(component.weight * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {qualitativeFlags.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">{t("risk_flags")}</div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <ul className="list-disc pl-4 text-sm space-y-1.5">
                {qualitativeFlags.map((flag, idx) => (
                  <li key={idx} className="text-danger">{flag}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="pt-3">
          <div className="text-sm font-medium mb-2">{t("recommendation")}</div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${recommendation === 'Approve' ? 'bg-success' : recommendation === 'Reject' ? 'bg-danger' : 'bg-warning'} mr-2`}></div>
              <div className="text-sm font-medium">{recommendation === 'Approve' ? t("approve") : recommendation === 'Reject' ? t("reject") : t("review_needed")}</div>
            </div>
            <div className="text-sm mt-2">
              {recommendation === 'Approve' 
                ? t("approve_message")
                : recommendation === 'Reject'
                  ? t("reject_message")
                  : t("review_message")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoring;
