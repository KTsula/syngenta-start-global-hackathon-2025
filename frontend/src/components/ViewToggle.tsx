
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Kanban, List } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ViewToggleProps {
  view: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  // No need to translate "Kanban" as it's a proper noun, but we could add it to translations if needed
  
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => {
      if (value === 'kanban' || value === 'list') {
        onViewChange(value);
      }
    }}>
      <ToggleGroupItem value="kanban" aria-label="Toggle kanban view" className="px-3">
        <Kanban className="h-4 w-4 mr-1" />
        <span className="text-sm">Kanban</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Toggle list view" className="px-3">
        <List className="h-4 w-4 mr-1" />
        <span className="text-sm">List</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
