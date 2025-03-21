import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { riskMonitoringData } from "../data/advisorData";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RiskMonitoring: React.FC = () => {
  const { t } = useLanguage();

  // Prepare data for the pie chart
  const riskFactorsData = [
    {
      name: t("weather"),
      value: riskMonitoringData.riskTrends.weatherRelated,
      color: "hsl(var(--primary))",
    },
    {
      name: t("market"),
      value: riskMonitoringData.riskTrends.marketRelated,
      color: "hsl(var(--warning))",
    },
    {
      name: t("disease"),
      value: riskMonitoringData.riskTrends.cropDisease,
      color: "hsl(var(--danger))",
    },
    {
      name: t("other"),
      value: riskMonitoringData.riskTrends.other,
      color: "hsl(var(--muted))",
    },
  ];

  // Helper function to get risk class
  const getRiskClass = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Helper function to translate risk factors
  const translateRiskFactor = (factor: string) => {
    if (factor.includes("Weather alert")) return t("weather_alert_rainfall");
    if (factor.includes("Moderate pest")) return t("moderate_pest_infestation");
    if (factor.includes("Irrigation water shortage"))
      return t("irrigation_water_shortage");
    if (factor.includes("Previous loan repayment delayed"))
      return t("loan_repayment_delayed");
    if (factor.includes("Market price dropped"))
      return t("market_price_dropped");
    if (factor.includes("Two consecutive"))
      return t("lower_than_average_yields");
    return factor;
  };

  // Helper function to translate recommended actions
  const translateRecommendedAction = (action: string) => {
    if (action.includes("Contact local extension agent"))
      return t("contact_extension_agent");
    if (action.includes("Schedule call to discuss irrigation"))
      return t("schedule_irrigation_call");
    if (action.includes("Review repayment schedule"))
      return t("review_repayment_schedule");
    return action;
  };

  // Custom rendering for pie chart labels to prevent overlap
  const renderCustomizedLabel = ({
    name,
    percent,
  }: {
    name: string;
    percent: number;
  }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("farmers_at_risk")}</CardTitle>
            <CardDescription>{t("requiring_attention")}</CardDescription>
          </div>
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskMonitoringData.farmersAtRisk.map((farmer) => (
              <div key={farmer.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-3 w-3 rounded-full ${getRiskClass(
                        farmer.riskScore
                      )}`}
                    ></div>
                    <div className="font-medium">{farmer.name}</div>
                    <span className="text-xs text-muted-foreground">
                      {farmer.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {t("risk_score")}: {farmer.riskScore}
                    </span>
                    <Progress
                      value={farmer.riskScore}
                      className={`h-2 w-16 ${
                        farmer.riskScore >= 80
                          ? "bg-red-200"
                          : farmer.riskScore >= 60
                          ? "bg-yellow-200"
                          : "bg-green-200"
                      }`}
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-1">
                  {farmer.village}, {farmer.district} • Loan: ₹
                  {farmer.loanAmount.toLocaleString()}
                </div>

                <div className="space-y-1 mb-2">
                  {farmer.riskFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning mr-1 mt-0.5 shrink-0" />
                      <span>{translateRiskFactor(factor)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-success">
                  {translateRecommendedAction(farmer.recommendedAction)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("risk_breakdown")}</CardTitle>
          <CardDescription>{t("contributing_factors")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskFactorsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  dataKey="value"
                  labelLine={false}
                  label={false}
                >
                  {riskFactorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-xs text-center text-muted-foreground">
            {t("weather_related_risks")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskMonitoring;
