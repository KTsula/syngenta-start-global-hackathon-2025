import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Check, X, Clock, FileText, User, Landmark, Map, Calendar, Edit, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useDatabase, LoanApplication } from '@/services/mockDatabaseService';

interface LoanApplicationDetailsModalProps {
  application: LoanApplication;
  isOpen: boolean;
  onClose: () => void;
}

const LoanApplicationDetailsModal: React.FC<LoanApplicationDetailsModalProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const updateApplicationStatus = useDatabase(state => state.updateApplicationStatus);
  const [isEditing, setIsEditing] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [editedAmount, setEditedAmount] = useState(application.amount);
  const [advisorNotes, setAdvisorNotes] = useState('');
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground border-success';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground border-destructive';
      case 'pending':
        return 'bg-warning text-warning-foreground border-warning';
      default:
        return '';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const handleAction = (action: 'approved' | 'rejected' | 'pending_approval') => {
    if (action === 'pending_approval') {
      setIsPendingApproval(true);
      
      toast({
        title: t("application_pending_approval"),
        description: `${application.id} - ${application.farmerName}`,
        variant: "default"
      });
      
      return;
    }
    
    updateApplicationStatus(application.id, action);
    
    const messages = {
      'approved': { title: t("application_approved"), variant: "success" },
      'rejected': { title: t("application_rejected"), variant: "destructive" },
      'pending_approval': { title: t("application_pending_approval"), variant: "default" }
    };
    
    toast({
      title: messages[action].title,
      description: `${application.id} - ${application.farmerName}`,
      variant: messages[action].variant as any
    });
    
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    
    toast({
      title: t("changes_saved"),
      description: t("loan_amount_updated"),
      variant: "default"
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t("loan_application")}: {application.id}</span>
            <Badge 
              className={`flex items-center gap-1 ${getStatusBadgeVariant(isPendingApproval ? 'pending_approval' : application.status)} pointer-events-none`}
            >
              {getStatusIcon(isPendingApproval ? 'pending_approval' : application.status)}
              <span>{isPendingApproval ? t("pending_approval") : t(application.status)}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {t("submitted")} {format(new Date(application.date), 'PPP')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
            <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
            <TabsTrigger value="history">{t("history")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-4">
            {isPendingApproval && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-medium">{t("pending_final_approval")}</h3>
                </div>
                <p className="text-sm text-amber-700">{t("review_changes_before_final_approval")}</p>
                
                <div className="mt-4">
                  <Label htmlFor="advisor-notes" className="text-amber-800">{t("advisor_notes")}</Label>
                  <Textarea 
                    id="advisor-notes"
                    value={advisorNotes}
                    onChange={(e) => setAdvisorNotes(e.target.value)}
                    placeholder={t("add_notes_for_approval")}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    {t("applicant_information")}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">{t("full_name")}</Label>
                      <p className="text-sm font-medium">{application.farmerName}</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("contact")}</Label>
                      <p className="text-sm font-medium">+91 98765 43210</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("address")}</Label>
                      <p className="text-sm font-medium">123 Farm Lane, Agriville, Karnataka</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground mb-2">
                    <Map className="h-4 w-4" />
                    {t("farm_details")}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">{t("land_size")}</Label>
                      <p className="text-sm font-medium">5.2 {t("hectares")}</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("land_ownership")}</Label>
                      <p className="text-sm font-medium">{t("owned")}</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("crops_grown")}</Label>
                      <p className="text-sm font-medium">Rice, Wheat, Vegetables</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground mb-2">
                    <Landmark className="h-4 w-4" />
                    {t("loan_information")}
                    {application.status === 'pending' && !isPendingApproval && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto h-7 px-2"
                        onClick={handleEdit}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        {t("edit")}
                      </Button>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">{t("loan_type")}</Label>
                      <p className="text-sm font-medium">{t("crop_loan")}</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("requested_amount")}</Label>
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input 
                            type="number" 
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(Number(e.target.value))}
                            className="h-8"
                          />
                          <Button 
                            size="sm" 
                            className="h-8"
                            onClick={handleSaveChanges}
                          >
                            {t("save")}
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium">
                          ₹{editedAmount.toLocaleString()}
                          {editedAmount !== application.amount && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({t("original")}: ₹{application.amount.toLocaleString()})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">{t("purpose")}</Label>
                      <p className="text-sm font-medium">{t("seeds_fertilizers_equipment")}</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("repayment_term")}</Label>
                      <p className="text-sm font-medium">12 {t("months")}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {t("credit_information")}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">{t("credit_score")}</Label>
                      <p className="text-sm font-medium">{application.creditScore} / 100</p>
                    </div>
                    <div>
                      <Label className="text-xs">{t("previous_loans")}</Label>
                      <p className="text-sm font-medium">2 ({t("all_repaid")})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t("land_ownership_documents")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md bg-slate-50 h-24 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">{t("document")} 1.pdf</p>
                  </div>
                  <div className="border rounded-md bg-slate-50 h-24 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">{t("document")} 2.pdf</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t("identity_proof")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md bg-slate-50 h-24 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">{t("aadhaar_card")}.pdf</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t("bank_statements")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded-md bg-slate-50 h-24 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">{t("statement")} 1.pdf</p>
                  </div>
                  <div className="border rounded-md bg-slate-50 h-24 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">{t("statement")} 2.pdf</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4 relative">
                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-primary"></div>
                <p className="text-sm font-medium">{t("application_submitted")}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(application.date), 'PPpp')}</p>
              </div>
              
              <div className="border-l-2 border-muted pl-4 relative">
                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-muted border-2 border-background"></div>
                <p className="text-sm font-medium">{t("documents_reviewed")}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(new Date(application.date).getTime() + 24 * 60 * 60 * 1000), 'PPpp')}
                </p>
              </div>
              
              <div className="border-l-2 border-muted pl-4 relative">
                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-muted border-2 border-background"></div>
                <p className="text-sm font-medium">{t("credit_assessment_completed")}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(new Date(application.date).getTime() + 2 * 24 * 60 * 60 * 1000), 'PPpp')}
                </p>
              </div>
              
              {isPendingApproval && (
                <div className="border-l-2 border-warning pl-4 relative">
                  <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-warning border-2 border-background"></div>
                  <p className="text-sm font-medium">{t("pending_final_approval")}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(), 'PPpp')}
                  </p>
                </div>
              )}
              
              {application.status !== 'pending' && (
                <div className={`border-l-2 border-${application.status === 'approved' ? 'success' : 'destructive'} pl-4 relative`}>
                  <div className={`absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-${application.status === 'approved' ? 'success' : 'destructive'}`}></div>
                  <p className="text-sm font-medium">
                    {application.status === 'approved' ? t("application_approved") : t("application_rejected")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(new Date(application.date).getTime() + 3 * 24 * 60 * 60 * 1000), 'PPpp')}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0">
          {application.status === 'pending' && !isPendingApproval && (
            <>
              <Button 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => handleAction('rejected')}
              >
                <X className="h-4 w-4 mr-2" />
                {t("reject")}
              </Button>
              <Button 
                variant="outline"
                className="border-warning text-warning hover:bg-warning/10"
                onClick={() => handleAction('pending_approval')}
              >
                <Clock className="h-4 w-4 mr-2" />
                {t("pending_approval")}
              </Button>
              <Button 
                className="bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => handleAction('approved')}
              >
                <Check className="h-4 w-4 mr-2" />
                {t("approve")}
              </Button>
            </>
          )}
          
          {isPendingApproval && (
            <>
              <Button 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => handleAction('rejected')}
              >
                <X className="h-4 w-4 mr-2" />
                {t("reject")}
              </Button>
              <Button 
                className="bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => handleAction('approved')}
              >
                <Check className="h-4 w-4 mr-2" />
                {t("final_approve")}
              </Button>
            </>
          )}
          
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoanApplicationDetailsModal;
