import { useState } from 'react';
import type { Todo } from '../types/Todo';

// TodoItem Component
// This component represents a single todo item
// It handles displaying, editing, toggling, and deleting a todo

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Handle saving the edit
  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      // If empty, cancel edit
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  // Handle key press in edit mode
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`group bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 p-3 transition-all duration-200
                    hover:border-gray-200 hover:shadow-sm
                    ${todo.completed ? 'opacity-60' : ''}`}>
      
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="sr-only" // Hide default checkbox
          />
          {/* Custom checkbox design */}
          <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200
                          flex items-center justify-center
                          ${todo.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-green-400'}`}>
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>

        {/* Todo text or edit input */}
        <div className="flex-1">
          {isEditing ? (
                         <input
               type="text"
               value={editText}
               onChange={(e) => setEditText(e.target.value)}
               onKeyDown={handleKeyDown}
               onBlur={handleSave}
               className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
               autoFocus
               aria-label="Edit todo text"
             />
          ) : (
            <span
              onDoubleClick={() => setIsEditing(true)}
              className={`cursor-pointer transition-all duration-200
                         ${todo.completed 
                           ? 'line-through text-gray-500' 
                           : 'text-gray-800 hover:text-blue-600'}`}
            >
              {todo.text}
            </span>
          )}
        </div>

        {/* Action buttons - show on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!isEditing && (
            <>
              {/* Edit button */}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {/* Delete button */}
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 