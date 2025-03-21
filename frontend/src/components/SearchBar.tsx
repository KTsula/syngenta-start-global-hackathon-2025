
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = "",
  placeholder,
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Optional: Implement debounced search as user types
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative flex-1 max-w-md ${className}`}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder || t("search_placeholder")}
          className="pl-8 w-full bg-slate-50 border-slate-200 focus-visible:ring-slate-300 focus-visible:border-slate-300"
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default SearchBar;
