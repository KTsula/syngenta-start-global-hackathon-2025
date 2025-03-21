
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SummaryData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

interface LoanApplicationsSummaryProps {
  data: SummaryData;
}

const LoanApplicationsSummary: React.FC<LoanApplicationsSummaryProps> = ({ data }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard 
        title={t("total_requests")} 
        value={data.totalRequests}
        icon={<FileText />}
        description={t("loan_applications_received")}
        className="border-l-4 border-l-primary"
      />
      
      <SummaryCard 
        title={t("pending_review")} 
        value={data.pendingRequests}
        icon={<Clock />}
        description={t("awaiting_assessment")}
        className="border-l-4 border-l-warning"
      />
      
      <SummaryCard 
        title={t("approved")} 
        value={data.approvedRequests}
        percentage={Math.round((data.approvedRequests / data.totalRequests) * 100)}
        icon={<CheckCircle />}
        description={t("approval_rate")}
        className="border-l-4 border-l-success"
      />
      
      <SummaryCard 
        title={t("rejected")} 
        value={data.rejectedRequests}
        percentage={Math.round((data.rejectedRequests / data.totalRequests) * 100)}
        icon={<XCircle />}
        description={t("rejection_rate")}
        className="border-l-4 border-l-destructive"
      />
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: number;
  percentage?: number;
  icon: React.ReactNode;
  description: string;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  percentage, 
  icon, 
  description,
  className
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-4 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold mt-1">{value}</p>
            {percentage !== undefined && (
              <p className="text-sm text-muted-foreground mb-1">({percentage}%)</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-5 w-5 text-primary" 
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationsSummary;
