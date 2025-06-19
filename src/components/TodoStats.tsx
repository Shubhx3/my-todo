// TodoStats Component
// This component displays statistics about the todos
// It helps students understand derived state and data visualization

interface TodoStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export const TodoStats = ({ stats }: TodoStatsProps) => {
  // Calculate completion percentage
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  // Don't show stats if there are no todos
  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-orange-600">{stats.active}</div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-600">Done</div>
        </div>
      </div>

      {/* Motivational message */}
      {stats.completed > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {stats.completed === stats.total 
              ? "🎉 All tasks completed! Great job!" 
              : `🚀 ${stats.completed} task${stats.completed === 1 ? '' : 's'} done! Keep going!`
            }
          </p>
        </div>
      )}
    </div>
  );
}; 