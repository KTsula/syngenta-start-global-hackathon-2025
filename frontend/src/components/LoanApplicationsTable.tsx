
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  Clock, 
  Info, 
  Eye, 
  MessageSquare, 
  AlertTriangle
} from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import LoanApplicationDetailsModal from './LoanApplicationDetailsModal';
import { useDatabase, LoanApplication } from '@/services/mockDatabaseService';

interface LoanApplicationsTableProps {
  data: LoanApplication[];
  searchQuery: string;
  statusFilter: string;
}

const LoanApplicationsTable: React.FC<LoanApplicationsTableProps> = ({ 
  data, 
  searchQuery,
  statusFilter 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const updateApplicationStatus = useDatabase(state => state.updateApplicationStatus);
  
  const itemsPerPage = 5;
  
  // Filter data based on search query and status filter
  const filteredData = data.filter(application => {
    const matchesSearch = application.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          application.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Paginate the filtered data
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
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
        return <Info className="h-4 w-4" />;
    }
  };
  
  const handleViewDetails = (application: LoanApplication) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };
  
  const handleLoanAction = (actionType: 'approve' | 'reject' | 'request-info', application: LoanApplication) => {
    const actions = {
      'approve': { message: t("application_approved"), variant: "success", newStatus: 'approved' as const },
      'reject': { message: t("application_rejected"), variant: "destructive", newStatus: 'rejected' as const },
      'request-info': { message: t("more_info_requested"), variant: "default", newStatus: 'pending' as const }
    };
    
    const action = actions[actionType];
    
    if (actionType === 'approve' || actionType === 'reject') {
      updateApplicationStatus(application.id, action.newStatus);
    }
    
    toast({
      title: action.message,
      description: `${application.id} - ${application.farmerName}`,
      variant: action.variant as any
    });
  };
  
  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("id")}</TableHead>
              <TableHead>{t("farmer_name")}</TableHead>
              <TableHead>{t("loan_amount")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("applied")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((application) => (
                <TableRow 
                  key={application.id}
                  className="cursor-pointer hover:bg-muted/60"
                  onClick={() => handleViewDetails(application)}
                >
                  <TableCell className="font-medium">{application.id}</TableCell>
                  <TableCell>{application.farmerName}</TableCell>
                  <TableCell>₹{application.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`flex items-center gap-1 ${getStatusBadgeVariant(application.status)} pointer-events-none`}
                    >
                      {getStatusIcon(application.status)}
                      <span>{t(application.status)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application.date), { addSuffix: true })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(application);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {application.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2 text-success border-success hover:bg-success/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoanAction('approve', application);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2 text-destructive border-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoanAction('reject', application);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoanAction('request-info', application);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertTriangle className="h-8 w-8 mb-2" />
                    <p>{t("no_applications_found")}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {pageCount > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {Array.from({ length: pageCount }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                className={currentPage === pageCount ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
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

export default LoanApplicationsTable;
