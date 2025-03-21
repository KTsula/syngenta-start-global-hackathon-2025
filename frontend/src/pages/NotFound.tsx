
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleSearch = (query: string) => {
    console.log('Search query from 404 page:', query);
    // Maybe navigate to search results when implemented
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md w-full mb-8">
        <SearchBar 
          placeholder={t("search_to_find")}
          onSearch={handleSearch}
          className="mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">{t("not_found")}</p>
        <Button onClick={() => navigate("/")} variant="default">
          {t("dashboard")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
