import type { FilterType } from '../types/Todo';

// TodoFilters Component
// This component provides filter buttons to show different views of todos
// Students can learn about conditional rendering and state management

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  isPending?: boolean; // React 19: Pending state from useTransition
  onClearCompleted: () => void;
}

export const TodoFilters = ({ 
  currentFilter, 
  onFilterChange, 
  stats, 
  isPending = false,
  onClearCompleted 
}: TodoFiltersProps) => {
  
  // Filter button data
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 transition-opacity duration-200 ${isPending ? 'opacity-70' : ''}`}>
      
      {/* Filter buttons */}
      <div className="flex gap-1 bg-gray-100 rounded-md p-1">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            disabled={isPending}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                       ${currentFilter === filter.key
                         ? 'bg-white text-blue-600 shadow-sm'
                         : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                       }
                       ${isPending ? 'cursor-wait' : 'cursor-pointer'}`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs
                               ${currentFilter === filter.key
                                 ? 'bg-blue-100 text-blue-600'
                                 : 'bg-gray-200 text-gray-600'
                               }`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Clear completed button */}
      {stats.completed > 0 && (
        <button
          onClick={onClearCompleted}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 
                     rounded-md transition-colors duration-200
                     ${isPending ? 'cursor-wait opacity-50' : ''}`}
        >
          Clear ({stats.completed})
        </button>
      )}
    </div>
  );
}; 