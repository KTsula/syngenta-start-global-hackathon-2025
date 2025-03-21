import React from "react";
import { marketIndicatorsData } from "../data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useRicePriceData } from "@/hooks/useRicePriceData";
import { useLanguage } from "@/contexts/LanguageContext";

const MarketIndicators: React.FC = () => {
  const { priceData, isLoading, error } = useRicePriceData();
  const { t } = useLanguage();
  const { minimumSupportPrice, policyChanges, procurementInfo } =
    marketIndicatorsData;

  // Filter to show only the most recent 12 data points
  const displayData = priceData.slice(0, 12).reverse();

  // Calculate current market price (most recent data point)
  const currentPrice = priceData.length > 0 ? priceData[0].price : 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 hover-lift h-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">{t("market_indicators")}</h2>
        <div className="status-pill status-pill-warning">{t("neutral")}</div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="text-sm font-medium mb-2">
            {t("rice_price_trends")} ($ {t("per_ton")})
          </div>
          {isLoading ? (
            <div className="h-56 w-full flex items-center justify-center bg-slate-50 rounded-md">
              <p className="text-sm text-muted-foreground">
                {t("loading_price_data")}...
              </p>
            </div>
          ) : error ? (
            <div className="h-56 w-full flex items-center justify-center bg-slate-50 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={displayData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => value.split(" ")[1]}
                  />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #f0f0f0",
                      borderRadius: "6px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    formatter={(value: any) => [
                      `$${value.toFixed(2)}`,
                      t("price"),
                    ]}
                    labelFormatter={(label) => label}
                  />
                  <ReferenceLine
                    y={14}
                    stroke="hsl(var(--success))"
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-1 flex justify-between items-center text-xs">
            <div className="text-muted-foreground">
              {t("current_market_price")}: ${currentPrice.toFixed(2)}
            </div>
            <div className="flex items-center">
              <span className="block w-3 h-[1px] bg-success mr-1.5"></span>
              <span className="text-success">MSP: $14.00</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-sm font-medium mb-2">{t("policy_changes")}</div>
          {policyChanges.length > 0 ? (
            policyChanges.map((policy, index) => (
              <div key={index} className="bg-slate-50 p-3 rounded-lg mb-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    {t(policy.description.toLowerCase().replace(/\s+/g, "_"))}
                  </div>
                  <div
                    className={`status-pill ${
                      policy.type === "Positive"
                        ? "status-pill-success"
                        : "status-pill-warning"
                    }`}
                  >
                    {t(policy.type.toLowerCase())}
                  </div>
                </div>
                <div className="text-sm mt-1">
                  {t(policy.impact.toLowerCase().replace(/\s+/g, "_"))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 p-3 rounded-lg text-sm">
              {t("no_major_policy_changes")}
            </div>
          )}
        </div>

        <div className="pt-2">
          <div className="text-sm font-medium mb-2">
            {t("procurement_infrastructure")}
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">
                  {t("mandi")}
                </div>
                <div className="text-sm">
                  {procurementInfo.procurementCenter}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {t("distance")}
                </div>
                <div className="text-sm">{procurementInfo.distance} km</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {t("status")}
                </div>
                <div
                  className={`text-sm ${
                    procurementInfo.active ? "text-success" : "text-danger"
                  }`}
                >
                  {t(procurementInfo.active ? "active" : "inactive")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIndicators;
