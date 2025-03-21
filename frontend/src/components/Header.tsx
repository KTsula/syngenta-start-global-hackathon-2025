import React from "react";
import { farmerProfileData } from "../data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="w-full py-6 px-8 bg-white border-b border-slate-100 flex justify-between items-center animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center text-white font-semibold">
          AF
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("agrifinance")}
        </h1>
      </div>

      <div className="flex items-center">
        <div className="mr-8">
          <div className="text-sm text-muted-foreground">{t("farmer_id")}</div>
          <div className="font-medium">{farmerProfileData.id}</div>
        </div>

        <div className="mr-8">
          <div className="text-sm text-muted-foreground">{t("name")}</div>
          <div className="font-medium">{farmerProfileData.name}</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">{t("location")}</div>
          <div className="font-medium">
            {farmerProfileData.location.village},{" "}
            {farmerProfileData.location.district}
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-6"></div>

        <div className="flex items-center space-x-1.5">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-sm font-medium">AO</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
