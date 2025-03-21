import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { recentActivitiesData } from "../data/advisorData";
import { useLanguage } from "@/contexts/LanguageContext";

const RecentActivities: React.FC = () => {
  const { t } = useLanguage();

  // Function to return the appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Loan Approval":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Loan Rejection":
        return <XCircle className="h-4 w-4 text-danger" />;
      case "Risk Alert":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "Document Verification":
        return <FileText className="h-4 w-4 text-primary" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Function to translate activity type
  const getTranslatedType = (type: string) => {
    switch (type) {
      case "Loan Approval":
        return t("loan_approval");
      case "Loan Rejection":
        return t("loan_rejection");
      case "Risk Alert":
        return t("risk_alert");
      case "Document Verification":
        return t("document_verification");
      default:
        return type;
    }
  };

  // Function to translate activity description
  const getTranslatedDescription = (description: string) => {
    if (description.includes("Approved loan application for")) {
      const farmerName = description.split("for ")[1];
      return t("approved_loan_for").replace("{farmer}", farmerName);
    }
    if (description.includes("Rejected loan application due to")) {
      return t("rejected_loan_creditworthiness");
    }
    if (description.includes("New alert for")) {
      const farmerName = description.split("for ")[1].split(" - ")[0];
      return (
        t("new_alert_for").replace("{farmer}", farmerName) +
        " - " +
        t("irrigation_water_shortage")
      );
    }
    if (description.includes("Verified land documents for")) {
      const farmerName = description.split("for ")[1];
      return t("verified_land_documents_for").replace("{farmer}", farmerName);
    }
    return description;
  };

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const currentLang = document.documentElement.lang || "en";

    // Use the appropriate locale based on the current language
    const locale = currentLang === "hi" ? "hi-IN" : "en-US";

    return (
      date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) +
      ", " +
      date.toLocaleDateString(locale, { day: "numeric", month: "short" })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recent_activities")}</CardTitle>
        <CardDescription>{t("latest_actions")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivitiesData.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {getTranslatedType(activity.type)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTranslatedDescription(activity.description)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
