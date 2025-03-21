import React from 'react';
import { Farmer } from '@/data/farmersData';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';

interface FarmersKanbanViewProps {
  farmers: Farmer[];
}

const FarmersKanbanView: React.FC<FarmersKanbanViewProps> = ({ farmers }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const columns: { title: string, status: Farmer['status'] }[] = [
    { title: 'New Applications', status: 'new' },
    { title: 'Reviewing', status: 'reviewing' },
    { title: 'Pending', status: 'pending' },
    { title: 'Approved', status: 'approved' },
    { title: 'Rejected', status: 'rejected' }
  ];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusColor = (status: Farmer['status']) => {
    switch (status) {
      case 'new': return 'bg-sun-orange-bright/20';
      case 'reviewing': return 'bg-air-blue-bright/20';
      case 'pending': return 'bg-sun-orange-mid/20';
      case 'approved': return 'bg-plant-green-bright/20';
      case 'rejected': return 'bg-energy-pink-bright/20';
      default: return 'bg-slate-100';
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {columns.map((column) => {
          const statusFarmers = farmers.filter(f => f.status === column.status);
          if (statusFarmers.length === 0) return null;
          
          return (
            <div key={column.status} className={`rounded-lg p-4 ${getStatusColor(column.status)}`}>
              <h3 className="font-medium mb-4 flex items-center justify-between">
                <span>{column.title}</span>
                <span className="bg-white text-xs px-2 py-0.5 rounded-full">
                  {statusFarmers.length}
                </span>
              </h3>
              
              <div className="space-y-3">
                {statusFarmers.map(farmer => (
                  <Card 
                    key={farmer.id}
                    className="kanban-card p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/farmer/${farmer.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {farmer.name.split(' ').map(name => name[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{farmer.name}</div>
                          <div className="text-xs text-muted-foreground">{farmer.location}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{farmer.id}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Loan Amount</div>
                        <div className="font-medium">{formatCurrency(farmer.loanAmount)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Credit Score</div>
                        <div className="font-medium flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            farmer.creditScore > 700 ? 'bg-plant-green-mid' :
                            farmer.creditScore > 650 ? 'bg-sun-orange-mid' :
                            'bg-energy-pink-mid'
                          }`}></span>
                          {farmer.creditScore}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-260px)]">
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max px-2">
          {columns.map((column) => (
            <div 
              key={column.status} 
              className={`kanban-column rounded-lg p-4 ${getStatusColor(column.status)} flex-shrink-0 w-72`}
            >
              <h3 className="font-medium mb-4 flex items-center justify-between">
                <span>{column.title}</span>
                <span className="bg-white text-xs px-2 py-0.5 rounded-full">
                  {farmers.filter(f => f.status === column.status).length}
                </span>
              </h3>
              
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-350px)] pr-1">
                {farmers
                  .filter(farmer => farmer.status === column.status)
                  .map(farmer => (
                    <Card 
                      key={farmer.id}
                      className="kanban-card p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/farmer/${farmer.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {farmer.name.split(' ').map(name => name[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{farmer.name}</div>
                            <div className="text-xs text-muted-foreground">{farmer.location}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{farmer.id}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">Loan Amount</div>
                          <div className="font-medium">{formatCurrency(farmer.loanAmount)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Credit Score</div>
                          <div className="font-medium flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              farmer.creditScore > 700 ? 'bg-plant-green-mid' :
                              farmer.creditScore > 650 ? 'bg-sun-orange-mid' :
                              'bg-energy-pink-mid'
                            }`}></span>
                            {farmer.creditScore}
                          </div>
                        </div>
                      </div>
                    </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmersKanbanView;
