
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { historicalPerformanceData } from '../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HistoricalPerformance: React.FC = () => {
  const [activeTab, setActiveTab] = useState("yield");
  
  const renderYieldChart = () => {
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historicalPerformanceData.yieldHistory} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #f0f0f0', 
                borderRadius: '6px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
              }} 
            />
            <ReferenceLine y={5.5} stroke="#FFA500" strokeDasharray="3 3" />
            <Bar dataKey="yieldTonsPerHa" name="Yield (tons/ha)" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderLoanChart = () => {
    return (
      <div className="mt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalPerformanceData.loanRepaymentHistory} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '6px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
                }} 
                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Loan Amount']}
              />
              <Bar dataKey="amount" name="Loan Amount (₹)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 flex justify-center">
          <div className="status-pill status-pill-success flex items-center space-x-1.5">
            <span className="block w-2 h-2 rounded-full bg-success"></span>
            <span>All loans repaid on time</span>
          </div>
        </div>
      </div>
    );
  };

  const renderIncomeChart = () => {
    return (
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={historicalPerformanceData.incomeHistory} 
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            stackOffset="sign"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #f0f0f0', 
                borderRadius: '6px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
              }} 
              formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
            />
            <Bar dataKey="farming" name="Farming Income" stackId="a" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="nonFarming" name="Non-Farming Income" stackId="a" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Historical Performance</h2>
        <div className="status-pill status-pill-success">Strong Performance</div>
      </div>
      
      <Tabs defaultValue="yield" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="yield" className="text-xs sm:text-sm">Yield History</TabsTrigger>
          <TabsTrigger value="loans" className="text-xs sm:text-sm">Loan History</TabsTrigger>
          <TabsTrigger value="income" className="text-xs sm:text-sm">Income History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="yield" className="mt-2">
          {renderYieldChart()}
          <div className="mt-3 text-sm text-center text-muted-foreground">
            Last 5-year average yield: <span className="font-medium">5.82 tons/ha</span> (above district average)
          </div>
        </TabsContent>
        
        <TabsContent value="loans" className="mt-2">
          {renderLoanChart()}
        </TabsContent>
        
        <TabsContent value="income" className="mt-2">
          {renderIncomeChart()}
          <div className="mt-3 text-sm text-center text-muted-foreground">
            Consistent farming income with supplementary non-farming sources
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoricalPerformance;
