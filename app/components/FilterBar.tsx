import { Category, Priority, CATEGORIES, PRIORITIES } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Radix UI Select or similar
import { Input } from '@/components/ui/input'; // Assuming Radix UI Input or similar
import { Button } from '@/components/ui/button'; // Assuming Radix UI Button or similar
import { PlusCircle } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
  selectedPriority: Priority | 'All';
  setSelectedPriority: (priority: Priority | 'All') => void;
  onAddTask: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FilterBar = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  onAddTask,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Add Task Button */}
      <Button onClick={onAddTask} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2">
        <PlusCircle size={20} />
        Add Task
      </Button>

      {/* Search Input */}
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 min-w-[150px] max-w-[250px] p-2 border border-gray-300 rounded-lg shadow-sm"
      />

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={(value: Category | 'All') => setSelectedCategory(value)}>
        <SelectTrigger className="w-[160px] p-2 border border-gray-300 rounded-lg shadow-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {CATEGORIES.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select value={selectedPriority} onValueChange={(value: Priority | 'All') => setSelectedPriority(value)}>
        <SelectTrigger className="w-[160px] p-2 border border-gray-300 rounded-lg shadow-sm">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Priorities</SelectItem>
          {PRIORITIES.map(priority => (
            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
