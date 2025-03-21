
import React from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AlertCircle, Calendar, Clock, Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppSidebar from '@/components/AppSidebar';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 700 },
  { name: 'Aug', value: 950 },
];

const pieData = [
  { name: 'Rice', value: 400, color: '#0ea5e9' },
  { name: 'Wheat', value: 300, color: '#22c55e' },
  { name: 'Corn', value: 300, color: '#eab308' },
  { name: 'Cotton', value: 200, color: '#ef4444' },
];

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

const barData = [
  { name: 'Q1', approved: 120, pending: 80, rejected: 40 },
  { name: 'Q2', approved: 180, pending: 60, rejected: 30 },
  { name: 'Q3', approved: 220, pending: 90, rejected: 50 },
  { name: 'Q4', approved: 280, pending: 100, rejected: 60 },
];

const lineData = [
  { month: 'Jan', risk: 65, return: 40 },
  { month: 'Feb', risk: 59, return: 45 },
  { month: 'Mar', risk: 80, return: 50 },
  { month: 'Apr', risk: 81, return: 65 },
  { month: 'May', risk: 56, return: 70 },
  { month: 'Jun', risk: 55, return: 75 },
];

const chartConfig = {
  growth: { color: '#10b981' },
  pending: { color: '#f59e0b' },
  rejected: { color: '#ef4444' },
  approved: { color: '#10b981' },
  risk: { color: '#ef4444' },
  return: { color: '#0ea5e9' },
};

const ComingSoon = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      
      <div className="relative flex-1 overflow-auto">
        {/* Blurry Overlay */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[5px] z-10"></div>
        
        {/* Content below the overlay */}
        <div className="relative z-5 w-full mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl">
            <Card className="col-span-1 shadow-md">
              <CardHeader>
                <CardTitle>{t("loan_performance")}</CardTitle>
                <CardDescription>{t("quarterly_trend")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="approved" fill="var(--color-approved)" name={t("approved")} />
                    <Bar dataKey="pending" fill="var(--color-pending)" name={t("pending")} />
                    <Bar dataKey="rejected" fill="var(--color-rejected)" name={t("rejected")} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 shadow-md">
              <CardHeader>
                <CardTitle>{t("crop_distribution")}</CardTitle>
                <CardDescription>{t("by_value")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 shadow-md">
              <CardHeader>
                <CardTitle>{t("monthly_growth")}</CardTitle>
                <CardDescription>{t("portfolio_performance")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="value" stroke="var(--color-growth)" fill="var(--color-growth)" fillOpacity={0.2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 shadow-md">
              <CardHeader>
                <CardTitle>{t("risk_return_profile")}</CardTitle>
                <CardDescription>{t("monthly_analysis")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="risk" stroke="var(--color-risk)" name={t("risk")} />
                    <Line type="monotone" dataKey="return" stroke="var(--color-return)" name={t("return")} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Coming Soon Banner (on top of the overlay) */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 mb-4">
            <Construction className="w-8 h-8 text-amber-500" />
            <Badge variant="outline" className="px-3 py-1 text-lg font-semibold bg-amber-50 border-amber-200">
              {t("coming_soon")}
            </Badge>
            <Construction className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">{t("feature_under_development")}</h1>
          <p className="text-muted-foreground text-center max-w-2xl mb-8">
            {t("coming_soon_description")}
          </p>
          
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">{t("check_back_soon")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t("estimated_completion")}: Q3 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
