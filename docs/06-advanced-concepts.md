# 🚀 Advanced Concepts - Taking Your Skills Further

Ready to level up? This guide covers advanced topics that will help you become a React expert. Don't worry if some concepts seem complex at first - we'll explain everything step by step!

## 🧠 TypeScript Deep Dive

### What Makes TypeScript Powerful?

TypeScript is like having a **smart assistant** that catches mistakes before they happen. Let's explore advanced TypeScript patterns used in our app:

#### Generic Types
```tsx
// Generic function that works with any type
function createArray<T>(item: T, count: number): T[] {
  return Array(count).fill(item);
}

// Usage
const numbers = createArray<number>(5, 3);     // [5, 5, 5]
const strings = createArray<string>("hi", 2);  // ["hi", "hi"]
```

#### Union Types in Our App
```tsx
// FilterType can only be one of these values
export type FilterType = 'all' | 'active' | 'completed';

// This prevents typos and ensures type safety
const validFilter: FilterType = 'all';      // ✅ Valid
const invalidFilter: FilterType = 'done';   // ❌ TypeScript error
```

#### Interface vs Type
```tsx
// Interface (can be extended)
interface BaseTodo {
  id: number;
  text: string;
}

interface ExtendedTodo extends BaseTodo {
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

// Type alias (more flexible)
type TodoWithTimestamp = Todo & {
  createdAt: Date;
  updatedAt?: Date;
};
```

### Advanced TypeScript Patterns

#### Conditional Types
```tsx
// Type that changes based on condition
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>;  // { message: string }
type TodoResponse = ApiResponse<Todo>;      // { data: Todo }
```

#### Utility Types
```tsx
// Pick specific properties
type TodoPreview = Pick<Todo, 'id' | 'text'>;

// Make all properties optional
type PartialTodo = Partial<Todo>;

// Make all properties required
type RequiredTodo = Required<Todo>;

// Exclude certain types
type ActiveFilter = Exclude<FilterType, 'all'>;  // 'active' | 'completed'
```

## ⚡ React 19 Advanced Patterns

### Custom Hooks Best Practices

#### Hook Composition
```tsx
// Breaking down useTodos into smaller hooks
function useFilter() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isPending, startTransition] = useTransition();
  
  const updateFilter = (newFilter: FilterType) => {
    startTransition(() => setFilter(newFilter));
  };
  
  return { filter, isPending, updateFilter };
}

function useTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // All todo operations...
  
  return { todos, addTodo, toggleTodo, deleteTodo };
}

// Main hook that combines others
function useTodos() {
  const { filter, isPending, updateFilter } = useFilter();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoList();
  
  // Combine and return
  return {
    filter, isPending, todos,
    addTodo, toggleTodo, deleteTodo,
    setFilter: updateFilter
  };
}
```

#### Hook Dependencies and Cleanup
```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setValue(value);
      
      const valueToStore = value instanceof Function ? value(value) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [value, setStoredValue] as const;
}
```

### Advanced React 19 Features

#### Concurrent Features Deep Dive
```tsx
// Using startTransition with priority
function usePriorityUpdates() {
  const [urgentState, setUrgentState] = useState('');
  const [nonUrgentState, setNonUrgentState] = useState('');
  const [isPending, startTransition] = useTransition();

  const updateUrgent = (value: string) => {
    setUrgentState(value);  // Immediate update
  };

  const updateNonUrgent = (value: string) => {
    startTransition(() => {
      setNonUrgentState(value);  // Can be interrupted
    });
  };

  return { urgentState, nonUrgentState, isPending, updateUrgent, updateNonUrgent };
}
```

#### Advanced useOptimistic Patterns
```tsx
function useOptimisticTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // Multiple optimistic states
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (state, action: { type: 'add' | 'toggle' | 'delete'; payload: any }) => {
      switch (action.type) {
        case 'add':
          return [action.payload, ...state];
        case 'toggle':
          return state.map(todo => 
            todo.id === action.payload 
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        case 'delete':
          return state.filter(todo => todo.id !== action.payload);
        default:
          return state;
      }
    }
  );

  const addTodoOptimistic = async (todo: Todo) => {
    setOptimisticTodos({ type: 'add', payload: todo });
    
    try {
      await saveTodoToAPI(todo);
      setTodos(prev => [todo, ...prev]);
    } catch (error) {
      // Optimistic update will automatically revert
      console.error('Failed to save todo:', error);
    }
  };

  return { optimisticTodos, addTodoOptimistic };
}
```

## 🎨 Advanced CSS and Styling

### CSS-in-JS with Styled Components (Alternative Approach)
```tsx
import styled from 'styled-components';

// Styled component with props
const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' 
    ? `
      background-color: #3b82f6;
      color: white;
      &:hover { background-color: #2563eb; }
    `
    : `
      background-color: #f3f4f6;
      color: #374151;
      &:hover { background-color: #e5e7eb; }
    `
  }
`;
```

### Advanced Tailwind Patterns
```tsx
// Dynamic classes with clsx/classnames
import clsx from 'clsx';

function Button({ variant, size, children, ...props }) {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        
        // Variant styles
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        },
        
        // Size styles
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### CSS Variables with Tailwind
```css
/* In your CSS */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --spacing-unit: 0.25rem;
}

/* Use in Tailwind config */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
      },
      spacing: {
        'unit': 'var(--spacing-unit)',
      }
    }
  }
}
```

## 🏗️ Architecture Patterns

### Component Composition Patterns

#### Compound Components
```tsx
// TodoCard compound component
function TodoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {children}
    </div>
  );
}

function TodoCardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 font-semibold">{children}</div>;
}

function TodoCardBody({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-600">{children}</div>;
}

function TodoCardActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 flex gap-2">{children}</div>;
}

// Attach sub-components
TodoCard.Header = TodoCardHeader;
TodoCard.Body = TodoCardBody;
TodoCard.Actions = TodoCardActions;

// Usage
<TodoCard>
  <TodoCard.Header>My Todo</TodoCard.Header>
  <TodoCard.Body>Description here</TodoCard.Body>
  <TodoCard.Actions>
    <button>Edit</button>
    <button>Delete</button>
  </TodoCard.Actions>
</TodoCard>
```

#### Render Props Pattern
```tsx
function DataProvider<T>({ 
  children, 
  data 
}: { 
  children: (data: T[]) => React.ReactNode;
  data: T[];
}) {
  return <>{children(data)}</>;
}

// Usage
<DataProvider data={todos}>
  {(todos) => (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )}
</DataProvider>
```

#### Higher-Order Components (HOCs)
```tsx
function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & { isLoading: boolean }
  ) {
    const { isLoading, ...restProps } = props;
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    return <Component {...(restProps as P)} />;
  };
}

// Usage
const TodoListWithLoading = withLoading(TodoList);
```

## 🔧 Performance Optimization

### React.memo and useMemo Advanced Usage
```tsx
// Memoized component with custom comparison
const TodoItem = React.memo<TodoItemProps>(({ todo, onToggle, onDelete }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.completed === nextProps.todo.completed &&
    prevProps.todo.text === nextProps.todo.text
  );
});

// Advanced useMemo with dependencies
function ExpensiveComponent({ todos, filter, searchTerm }) {
  const expensiveValue = useMemo(() => {
    // Expensive calculation
    return todos
      .filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'active') return !todo.completed;
        return true;
      })
      .filter(todo => 
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.text.localeCompare(b.text));
  }, [todos, filter, searchTerm]);

  return <div>{/* Use expensiveValue */}</div>;
}
```

### useCallback Optimization
```tsx
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // Memoized callback to prevent unnecessary re-renders
  const handleToggle = useCallback((id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // Empty dependency array since we use functional update
  
  const handleDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

## 🧪 Testing Advanced Components

### Testing Custom Hooks
```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useTodos } from '../hooks/useTodos';

describe('useTodos', () => {
  test('should add a todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Test todo');
  });
  
  test('should toggle todo completion', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo');
    });
    
    const todoId = result.current.todos[0].id;
    
    act(() => {
      result.current.toggleTodo(todoId);
    });
    
    expect(result.current.todos[0].completed).toBe(true);
  });
});
```

### Testing React 19 Features
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../components/TodoInput';

describe('TodoInput with useFormStatus', () => {
  test('should show loading state during submission', async () => {
    const mockAddTodo = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<TodoInput onAddTodo={mockAddTodo} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    await userEvent.type(input, 'New todo');
    await userEvent.click(button);
    
    // Should show loading state
    expect(button).toHaveTextContent('Adding...');
    expect(input).toBeDisabled();
    
    // Wait for completion
    await waitFor(() => {
      expect(button).toHaveTextContent('Add');
      expect(input).not.toBeDisabled();
    });
  });
});
```

## 🌐 Integration with External APIs

### Advanced API Integration
```tsx
// API service layer
class TodoAPI {
  private baseURL = 'https://api.example.com';
  
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${this.baseURL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  }
  
  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    const response = await fetch(`${this.baseURL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  }
  
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${this.baseURL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  }
}

// Hook for API integration
function useTodosAPI() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new TodoAPI();
  
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const todos = await api.getTodos();
      setTodos(todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const addTodo = useCallback(async (text: string) => {
    try {
      const newTodo = await api.createTodo({
        text,
        completed: false,
        createdAt: new Date(),
      });
      setTodos(prev => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }, []);
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  
  return { todos, loading, error, addTodo, fetchTodos };
}
```

## 🚀 Deployment and Production

### Environment Configuration
```tsx
// config/environment.ts
interface Config {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  version: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export default config;
```

### Error Boundaries
```tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 💡 Advanced Patterns Summary

### Key Takeaways

1. **TypeScript helps catch errors early** - Use advanced types for better safety
2. **React 19 features improve performance** - Learn when and how to use them
3. **Component composition is powerful** - Build flexible, reusable components
4. **Performance optimization matters** - Use memo, useMemo, and useCallback wisely
5. **Testing ensures reliability** - Test hooks and components thoroughly
6. **Architecture scales with complexity** - Plan for growth from the beginning

### Next Steps for Advanced Learning

1. **Explore React Server Components** - The future of React applications
2. **Learn advanced TypeScript** - Template literal types, mapped types
3. **Study performance profiling** - React DevTools profiler
4. **Understand bundler optimization** - Code splitting, tree shaking
5. **Master testing strategies** - Integration tests, E2E testing
6. **Learn state management libraries** - Zustand, Jotai, Valtio

Remember: **Advanced concepts build on fundamentals!** Make sure you understand the basics before diving into these advanced topics. Practice implementing these patterns gradually in your own projects! 🌟 