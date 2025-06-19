import { useState } from 'react';
import { useFormStatus } from 'react-dom';

// TodoInput Component
// This component handles adding new todos
// It's separated from the main app to make the code more modular

interface TodoInputProps {
  onAddTodo: (text: string) => void;
  placeholder?: string;
}

// React 19: Form component to use useFormStatus
const TodoForm = ({ onAddTodo, placeholder }: TodoInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const { pending } = useFormStatus();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    
    if (inputValue.trim()) {
      onAddTodo(inputValue);
      setInputValue(''); // Clear input after adding
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        {/* Main input field */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={pending}
          className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg 
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200
                     transition-all duration-200
                     placeholder:text-gray-400 bg-white/80 backdrop-blur-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add new todo"
        />
        
        {/* Add button - only show when there's text */}
        {inputValue.trim() && (
          <button
            type="submit"
            disabled={pending}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                       bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md
                       transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'Adding...' : 'Add'}
          </button>
        )}
      </div>
    </form>
  );
};

export const TodoInput = (props: TodoInputProps) => {
  return <TodoForm {...props} placeholder={props.placeholder || "Add a new task..."} />;
}; 