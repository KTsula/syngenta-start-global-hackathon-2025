
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Farmer } from '@/data/farmersData';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from './ui/card';

interface FarmersListProps {
  farmers: Farmer[];
}

const FarmersList: React.FC<FarmersListProps> = ({ farmers }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const getStatusClass = (status: Farmer['status']) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'reviewing': return 'status-reviewing';
      case 'pending': return 'status-pending';
      case 'new': return 'status-new';
      default: return '';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mobile view with cards instead of table
  if (isMobile) {
    return (
      <div className="space-y-4">
        {farmers.map((farmer) => (
          <Card 
            key={farmer.id} 
            className="cursor-pointer hover:bg-slate-50 p-4"
            onClick={() => navigate(`/farmer/${farmer.id}`)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-xs font-medium">
                  {farmer.name.split(' ').map(name => name[0]).join('')}
                </span>
              </div>
              <div>
                <div className="font-medium">{farmer.name}</div>
                <div className="text-xs text-muted-foreground">{farmer.id}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Location</span>
                  <div>{farmer.location}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Application Date</span>
                  <div>{formatDate(farmer.applicationDate)}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Loan Amount</span>
                  <div>{formatCurrency(farmer.loanAmount)}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Credit Score</span>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      farmer.creditScore > 700 ? 'bg-plant-green-mid' :
                      farmer.creditScore > 650 ? 'bg-sun-orange-mid' :
                      'bg-energy-pink-mid'
                    }`}></span>
                    {farmer.creditScore}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Status</span>
                  <div>
                    <Badge className={getStatusClass(farmer.status)}>
                      {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Last Activity</span>
                  <div>{formatDate(farmer.lastActivity)}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop view with table
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Farmer</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead>Loan Amount</TableHead>
            <TableHead>Credit Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {farmers.map((farmer) => (
            <TableRow 
              key={farmer.id} 
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => navigate(`/farmer/${farmer.id}`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {farmer.name.split(' ').map(name => name[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{farmer.name}</div>
                    <div className="text-xs text-muted-foreground">{farmer.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{farmer.location}</TableCell>
              <TableCell>{formatDate(farmer.applicationDate)}</TableCell>
              <TableCell>{formatCurrency(farmer.loanAmount)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    farmer.creditScore > 700 ? 'bg-plant-green-mid' :
                    farmer.creditScore > 650 ? 'bg-sun-orange-mid' :
                    'bg-energy-pink-mid'
                  }`}></span>
                  {farmer.creditScore}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusClass(farmer.status)}>
                  {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(farmer.lastActivity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FarmersList;
