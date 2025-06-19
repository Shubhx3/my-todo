# 🧠 State Management - How Our App Remembers Things

State management is like the **memory** of our app. It remembers what todos you have, which filter is active, and keeps everything in sync. Let's explore this in simple terms!

## 🤔 What is State?

**State** is data that can change over time. Think of it like:

- Your phone's battery level (changes as you use it)
- Items in your shopping cart (you add/remove things)
- Your current location on a map (changes as you move)

In our Todo app, the state includes:

- 📝 List of all your todos
- 🔍 Current filter (All/Active/Completed)
- 📊 Statistics (how many todos, how many done)

## 🏠 Where Does State Live?

In our app, most state lives in a special place called `useTodos` - this is a **custom hook**. Think of it as the app's brain that:

- Remembers all your todos
- Knows how to add, edit, delete todos
- Calculates statistics
- Handles filtering

## 🎣 Understanding Custom Hooks

### What is a Custom Hook?

A custom hook is like a **helper function** that:

- Manages state for you
- Provides functions to change that state
- Can be reused in different components

**Simple example:**

```tsx
// A custom hook for managing a counter
function useCounter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
}

// Use it in a component
function Counter() {
  const { count, increment, decrement } = useCounter();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

## 📋 Our useTodos Hook Explained

Let's break down our `useTodos` hook step by step:

### The Basic Structure

```tsx
export const useTodos = () => {
  // 1. State variables (the app's memory)
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // 2. Functions to change state
  const addTodo = (text) => { /* logic */ };
  const toggleTodo = (id) => { /* logic */ };
  const deleteTodo = (id) => { /* logic */ };
  
  // 3. Computed values (calculated from state)
  const filteredTodos = /* filter todos based on current filter */;
  const stats = /* calculate statistics */;
  
  // 4. Return everything for components to use
  return {
    todos: filteredTodos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    // ... more functions
  };
};
```

### 1. State Variables (The Memory)

```tsx
// Main list of todos
const [todos, setTodos] = useState([]);

// Current filter setting
const [filter, setFilter] = useState('all');
```

**What this means:**

- `todos` is an array that holds all your todo items
- `filter` is a string that remembers which filter is active
- `useState([])` means "start with an empty array"
- `useState('all')` means "start with 'all' filter"

### 2. React 19 Features

```tsx
// For smooth filter changes
const [isPending, startTransition] = useTransition();

// For instant feedback when adding todos
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo) => [newTodo, ...state]
);
```

**What this means:**

- `useTransition` makes filter changes smooth
- `useOptimistic` shows new todos immediately

### 3. Functions to Change State

#### Adding a Todo

```tsx
const addTodo = (text) => {
  if (text.trim() !== '') {
    const newTodo = {
      id: Date.now(),           // Unique ID
      text: text.trim(),        // The todo text
      completed: false,         // Not done yet
      createdAt: new Date(),    // When it was created
    };
    
    // React 19: Show immediately
    addOptimisticTodo(newTodo);
    
    // Update real state
    setTodos(prev => [newTodo, ...prev]);
  }
};
```

**Step by step:**

1. Check if text isn't empty
2. Create a new todo object
3. Add it to the optimistic state (shows immediately)
4. Add it to the real state

#### Toggling a Todo (Mark as Done/Undone)

```tsx
const toggleTodo = (id) => {
  setTodos(prev => prev.map(todo =>
    todo.id === id 
      ? { ...todo, completed: !todo.completed }
      : todo
  ));
};
```

**Step by step:**

1. Find the todo with the matching ID
2. Flip its `completed` status (true → false, false → true)
3. Keep all other todos unchanged

#### Deleting a Todo

```tsx
const deleteTodo = (id) => {
  setTodos(prev => prev.filter(todo => todo.id !== id));
};
```

**Step by step:**

1. Remove the todo with the matching ID
2. Keep all other todos

### 4. Computed Values (Smart Calculations)

#### Filtered Todos

```tsx
const filteredTodos = useMemo(() => {
  return optimisticTodos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;      // Show only unfinished
      case 'completed':
        return todo.completed;       // Show only finished
      default:
        return true;                 // Show all
    }
  });
}, [optimisticTodos, filter]);
```

**What this does:**

- Takes all todos and filters them based on current filter
- `useMemo` means "only recalculate when todos or filter changes"
- Returns different todos based on which filter is active

#### Statistics

```tsx
const stats = useMemo(() => ({
  total: optimisticTodos.length,
  completed: optimisticTodos.filter(todo => todo.completed).length,
  active: optimisticTodos.filter(todo => !todo.completed).length,
}), [optimisticTodos]);
```

**What this does:**

- Counts total todos
- Counts completed todos
- Counts active (unfinished) todos
- Recalculates when todos change

## 🔄 Data Flow in Our App

Here's how data flows through our app:

### 1. Initial State

```plaintext
useTodos hook:
├── todos: []
├── filter: 'all'
└── stats: { total: 0, completed: 0, active: 0 }
```

### 2. User Adds a Todo

```plaintext
1. User types "Buy milk" in TodoInput
2. TodoInput calls onAddTodo("Buy milk")
3. useTodos.addTodo("Buy milk") runs:
   ├── Creates new todo object
   ├── addOptimisticTodo (shows immediately)
   └── setTodos (updates real state)
4. App re-renders with new todo
5. TodoList shows the new todo
```

### 3. User Changes Filter

```plaintext
1. User clicks "Active" in TodoFilters
2. TodoFilters calls onFilterChange('active')
3. useTodos.updateFilter('active') runs:
   ├── startTransition(() => setFilter('active'))
   └── Filter change happens smoothly
4. filteredTodos recalculates (only shows unfinished todos)
5. TodoList shows only active todos
```

## 🎯 Why This Structure is Good

### 1. Single Source of Truth

- All todo data lives in one place (`useTodos`)
- No confusion about where data comes from
- Easy to debug and understand

### 2. Separation of Concerns

- `useTodos` handles **logic** (what to do)
- Components handle **presentation** (how to show it)
- Each part has a clear responsibility

### 3. Reusability

- `useTodos` could be used in different components
- Logic is separate from UI
- Easy to test the logic independently

### 4. Performance

- `useMemo` prevents unnecessary recalculations
- React 19 features make updates smooth
- Functional state updates prevent bugs

## 🛠️ State Management Patterns

### Functional State Updates

```tsx
// ❌ Direct state mutation (bad)
setTodos(todos.push(newTodo));

// ✅ Functional update (good)
setTodos(prev => [...prev, newTodo]);
```

**Why functional updates are better:**

- Prevents bugs with stale state
- Works better with React's batching
- More predictable behavior

### Immutable Updates

```tsx
// ❌ Mutating existing object (bad)
todo.completed = true;

// ✅ Creating new object (good)
const updatedTodo = { ...todo, completed: true };
```

**Why immutability matters:**

- React can detect changes easily
- Prevents unexpected side effects
- Makes debugging easier

## 🔍 Debugging State

### Using React DevTools

1. Install React DevTools browser extension
2. Open developer tools
3. Go to "React" tab
4. Click on components to see their state

### Adding Console Logs

```tsx
const addTodo = (text) => {
  console.log('Adding todo:', text);
  console.log('Current todos:', todos);
  
  // ... rest of function
};
```

### Understanding State Changes

- State updates are **asynchronous**
- React batches multiple state updates
- Always use functional updates for dependent state

## 🎓 Common Mistakes and How to Avoid Them

### 1. Mutating State Directly

```tsx
// ❌ Wrong
todos.push(newTodo);
setTodos(todos);

// ✅ Correct
setTodos(prev => [...prev, newTodo]);
```

### 2. Stale Closure

```tsx
// ❌ Might use old state
const handleClick = () => {
  setCount(count + 1);
};

// ✅ Always uses current state
const handleClick = () => {
  setCount(prev => prev + 1);
};
```

### 3. Missing Dependencies

```tsx
// ❌ Missing dependency
const filteredTodos = useMemo(() => {
  return todos.filter(/* logic */);
}, []); // Should include 'todos'

// ✅ Correct dependencies
const filteredTodos = useMemo(() => {
  return todos.filter(/* logic */);
}, [todos]);
```

## 💡 Key Takeaways

1. **State is your app's memory** - it remembers important information
2. **Custom hooks organize logic** - keep related state and functions together
3. **Functional updates are safer** - always use `prev => newValue`
4. **Immutability prevents bugs** - never modify state directly
5. **React 19 makes things smoother** - use new features for better UX

## 🎯 Practice Exercises

1. **Add a new piece of state**: Try adding a "dark mode" toggle
2. **Create a custom hook**: Make a `useCounter` hook for practice
3. **Debug state changes**: Add console.logs to understand the flow
4. **Experiment with filters**: Add a new filter option

Remember: **State management is the heart of React apps!** Understanding it well will make you a much better React developer! 🌟
