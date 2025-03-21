
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle, XCircle, Clock, Users, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDatabase, LoanApplication } from '@/services/mockDatabaseService';
import LoanApplicationDetailsModal from './LoanApplicationDetailsModal';

const RequestsSummary: React.FC = () => {
  const { t } = useLanguage();
  const loanRequestsData = useDatabase(state => state.loanRequests);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const handleViewDetails = (application: LoanApplication) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };
  
  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_requests")}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanRequestsData.totalRequests}</div>
            <p className="text-xs text-muted-foreground">{t("loan_applications_received")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pending_review")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanRequestsData.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">{t("awaiting_assessment")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("approved")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanRequestsData.approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((loanRequestsData.approvedRequests / loanRequestsData.totalRequests) * 100)}% {t("approval_rate")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("rejected")}</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanRequestsData.rejectedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((loanRequestsData.rejectedRequests / loanRequestsData.totalRequests) * 100)}% {t("rejection_rate")}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("recent_loan_requests")}</CardTitle>
            <CardDescription>{t("review_process_applications")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loanRequestsData.recentRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => handleViewDetails(request)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                      {request.farmerName.split(' ').map(name => name[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {request.farmerName}
                        <span className="text-xs text-muted-foreground ml-2">{request.id}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">₹{request.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">{new Date(request.date).toLocaleDateString()}</div>
                    <Badge 
                      variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'rejected' ? 'destructive' : 
                        'outline'
                      }
                      className="pointer-events-none"
                    >
                      {t(request.status)}
                    </Badge>
                    <div className="text-sm font-medium">
                      {t("score")}: {request.creditScore}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedApplication && (
        <LoanApplicationDetailsModal
          application={selectedApplication}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RequestsSummary;
