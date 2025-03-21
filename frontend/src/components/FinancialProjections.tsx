import React from "react";
import { financialProjectionsData } from "../data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const FinancialProjections: React.FC = () => {
  const { t } = useLanguage();
  const {
    projectedYield,
    marketValue,
    productionCosts,
    profitMargins,
    loanAnalysis,
  } = financialProjectionsData;

  // Process data for charts
  const productionCostsForChart = productionCosts.map((item) => ({
    name: item.item,
    value: item.amount,
  }));

  const COST_COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--info))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--accent-foreground))",
    "hsl(var(--muted-foreground))",
  ];

  const totalCosts = productionCosts.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return "₹" + value.toLocaleString();
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{t("financial_projections")}</h2>
        <div className="status-pill status-pill-success">{t("profitable")}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">
            {t("projected_yield")}
          </div>
          <div className="text-2xl font-medium">{projectedYield} t/ha</div>
          <div className="text-xs text-muted-foreground">
            {t("expected_this_season")}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">
            {t("market_value")}
          </div>
          <div className="text-2xl font-medium">
            ₹{marketValue.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">{t("per_ton")}</div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm font-medium mb-2">
          {t("production_costs_breakdown")}
        </div>
        <div className="flex">
          <div className="w-1/2">
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionCostsForChart}
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {productionCostsForChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COST_COLORS[index % COST_COLORS.length]}
                      />
                    ))}
                    <Label
                      value={formatCurrency(totalCosts)}
                      position="center"
                      className="text-xs font-medium"
                      fontSize={12}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-center text-xs">
            {productionCosts.map((cost, index) => (
              <div key={index} className="flex items-center mb-1.5">
                <div
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{
                    backgroundColor: COST_COLORS[index % COST_COLORS.length],
                  }}
                ></div>
                <div className="flex-1 flex justify-between">
                  <span>{t(cost.item.toLowerCase().replace(/\s+/g, "_"))}</span>
                  <span>₹{cost.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm font-medium mb-2">{t("profit_margins")}</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">{t("revenue")}</div>
            <div className="text-sm font-medium">
              ₹{profitMargins.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">
              {t("net_profit")}
            </div>
            <div className="text-sm font-medium">
              ₹{profitMargins.netProfit.toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">
              {t("profit_margin")}
            </div>
            <div className="text-sm font-medium">
              {profitMargins.profitMarginPercentage}%
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">{t("loan_analysis")}</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground">
              {t("requested_amount")}
            </div>
            <div className="text-lg font-medium">
              ₹{loanAnalysis.requestedAmount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("loan_to_value_ratio")}
            </div>
            <div className="text-sm">
              {(loanAnalysis.loanToValueRatio * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground">
              {t("recommended_max_loan")}
            </div>
            <div className="text-lg font-medium">
              ₹{loanAnalysis.recommendedMaxLoan.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t("collateral_value")}
            </div>
            <div className="text-sm">
              ₹{loanAnalysis.collateralValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProjections;
