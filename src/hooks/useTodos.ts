import { useState, useMemo, useTransition, useOptimistic } from 'react';
import type { Todo, FilterType } from '../types/Todo';

// Custom Hook: useTodos
// This hook manages all todo-related state and operations
// Custom hooks help us organize logic and make it reusable across components

export const useTodos = () => {
  // State for storing all todos
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // State for the current filter (all, active, completed)
  const [filter, setFilter] = useState<FilterType>('all');

  // React 19: useTransition for non-urgent filter updates
  const [isPending, startTransition] = useTransition();
  
  // React 19: useOptimistic for immediate UI feedback
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, optimisticTodo: Todo) => [optimisticTodo, ...state]
  );

  // Function to add a new todo
  const addTodo = (text: string) => {
    if (text.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(), // Simple ID generation using timestamp
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
      };
      
      // React 19: Optimistic update for immediate feedback
      addOptimisticTodo(newTodo);
      
      // Actual state update
      setTodos(prev => [newTodo, ...prev]);
    }
  };

  // Function to toggle todo completion status
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Function to delete a todo
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Function to edit todo text
  const editTodo = (id: number, newText: string) => {
    if (newText.trim() !== '') {
      setTodos(prev => prev.map(todo =>
        todo.id === id 
          ? { ...todo, text: newText.trim() }
          : todo
      ));
    }
  };

  // Function to clear all completed todos
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // React 19: Non-urgent filter updates with useTransition
  const updateFilter = (newFilter: FilterType) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  };

  // Memoized computed values for better performance
  const filteredTodos = useMemo(() => {
    return optimisticTodos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });
  }, [optimisticTodos, filter]);

  const stats = useMemo(() => ({
    total: optimisticTodos.length,
    completed: optimisticTodos.filter(todo => todo.completed).length,
    active: optimisticTodos.filter(todo => !todo.completed).length,
  }), [optimisticTodos]);

  // Return all the state and functions that components can use
  return {
    todos: filteredTodos,
    filter,
    stats,
    isPending, // React 19: Expose pending state for UI feedback
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter: updateFilter,
  };
}; 