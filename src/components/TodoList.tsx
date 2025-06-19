import type { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

// TodoList Component
// This component renders a list of todos
// It also handles the empty state when there are no todos

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onEditTodo: (id: number, newText: string) => void;
}

export const TodoList = ({ todos, onToggleTodo, onDeleteTodo, onEditTodo }: TodoListProps) => {
  // Empty state when no todos
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-3 text-gray-300">
          {/* Empty state icon */}
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-500 mb-1">No tasks yet</h3>
        <p className="text-gray-400 text-sm">Add your first task above to get started</p>
      </div>
    );
  }

  // Render the list of todos
  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onEdit={onEditTodo}
        />
      ))}
    </div>
  );
}; 