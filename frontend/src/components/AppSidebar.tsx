import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Banknote,
  Award,
  ShieldAlert,
  Settings,
  Activity,
  List,
  Package,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const AppSidebar = () => {
  const { open } = useSidebar();
  const { t } = useLanguage();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center text-white font-semibold">
          AF
        </div>
        {open && (
          <h1 className="text-lg font-semibold mt-2 tracking-tight">
            {t("agrifinance")}
          </h1>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("overview")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={t("dashboard")}
                  isActive={window.location.pathname === "/"}
                  asChild
                >
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <LayoutDashboard className="shrink-0" />
                    <span>{t("dashboard")}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={t("farmers")}
                  isActive={window.location.pathname === "/farmers"}
                  asChild
                >
                  <NavLink
                    to="/farmers"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <Users className="shrink-0" />
                    <span>{t("farmers")}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={t("loan_applications")}
                  isActive={window.location.pathname === "/loan-applications"}
                  asChild
                >
                  <NavLink
                    to="/loan-applications"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <List className="shrink-0" />
                    <span>{t("loan_applications")}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("reports")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t("analytics")} asChild>
                  <Link to="/coming-soon">
                    <BarChart3 className="shrink-0" />
                    <span>{t("analytics")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t("market_data")} asChild>
                  <Link to="/coming-soon">
                    <PieChart className="shrink-0" />
                    <span>{t("market_data")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t("credit_scoring")} asChild>
                  <Link to="/coming-soon">
                    <Award className="shrink-0" />
                    <span>{t("credit_scoring")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t("disbursements")} asChild>
                  <Link to="/coming-soon">
                    <Banknote className="shrink-0" />
                    <span>{t("disbursements")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t("settings")} asChild>
                  <Link to="/coming-soon">
                    <Settings className="shrink-0" />
                    <span>{t("settings")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
