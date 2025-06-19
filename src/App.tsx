// Main App Component - Clean Todo Application
// Optimized for performance and clean design with React 19 features

import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { TodoStats } from './components/TodoStats';
import { Search } from './components/Search';

function App() {
  // Using our custom hook to manage all todo logic
  // This keeps our component clean and focused on rendering
  const {
    todos,
    filter,
    stats,
    isPending, // React 19: Transition pending state
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-2xl">
        
        {/* Clean header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Todo
          </h1>
          <p className="text-gray-600">
            Stay focused and organized
          </p>
        </header>

        {/* Main application */}
        <main className="space-y-6">
          
          {/* Add new todo */}
          <TodoInput 
            onAddTodo={addTodo} 
            placeholder="Add a new task..."
          />

          {/* Statistics - only when needed */}
          {stats.total > 0 && (
            <TodoStats stats={stats} />
          )}

          {/* Filters - only when needed */}
          {stats.total > 0 && (
            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              stats={stats}
              isPending={isPending} // React 19: Pass pending state
              onClearCompleted={clearCompleted}
            />
          )}

          {/* Search   */}
          <Search />

          {/* Todo list */}
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
          />

        </main>

      </div>
    </div>
  );
}

export default App;
