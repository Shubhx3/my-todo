# 🧩 Components Guide

This guide explains each component in our Todo app. Think of components like **LEGO blocks** - each one has a specific job, and we combine them to build our complete app!

## 🤔 What is a Component?

A **component** is a piece of code that:

- Shows something on the screen (like a button or input box)
- Can respond to user actions (like clicks or typing)
- Can be reused in different parts of the app

**Simple Example:**

```tsx
// This is a simple component that shows "Hello!"
function Greeting() {
  return <h1>Hello!</h1>;
}
```

## 📱 Our App's Components

Let's look at each component in our Todo app, from simplest to most complex:

## 1. 📊 TodoStats Component

**What it does:** Shows how many todos you have and your progress

**Where you see it:** The blue progress bar section

### Simple Explanation

- Counts your total todos
- Counts completed todos
- Shows a progress bar
- Gives you encouraging messages! 🎉

### Code Example

```tsx
// This component receives stats as props
function TodoStats({ stats }) {
  return (
    <div>
      <p>You have {stats.total} todos</p>
      <p>{stats.completed} are done!</p>
      {/* Progress bar here */}
    </div>
  );
}
```

### Props (Data it receives)

- `stats.total` - How many todos you have
- `stats.completed` - How many are finished
- `stats.active` - How many are still to do

---

## 2. ✅ TodoItem Component

**What it does:** Shows one single todo with checkbox, text, and action buttons

**Where you see it:** Each row in your todo list

### Simple Explanation

- Shows a checkbox to mark todo as done/undone
- Shows the todo text
- Has edit and delete buttons (appear when you hover)
- You can double-click the text to edit it

### Code Example

```tsx
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <div>
      {/* Checkbox */}
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      
      {/* Todo text */}
      <span>{todo.text}</span>
      
      {/* Edit and Delete buttons */}
      <button onClick={() => onEdit(todo.id)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}
```

### Props (Data it receives)

- `todo` - The todo object with id, text, and completed status
- `onToggle` - Function to mark todo as done/undone
- `onDelete` - Function to delete the todo
- `onEdit` - Function to edit the todo text

### Cool Features

- **Double-click to edit**: Click the text twice to change it
- **Hover to see buttons**: Edit and delete buttons appear on hover
- **Visual feedback**: Completed todos look faded and crossed out

---

## 3. 📝 TodoInput Component

**What it does:** The input box where you type new todos

**Where you see it:** At the top of the app

### Simple Explanation

- Has an input field where you type
- Shows an "Add" button when you start typing
- Pressing Enter also adds the todo
- Uses React 19 features for better performance

### Code Example

```tsx
function TodoInput({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAddTodo(inputValue);  // Send to parent
      setInputValue('');      // Clear input
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
      />
      {inputValue && <button>Add</button>}
    </form>
  );
}
```

### Props (Data it receives)

- `onAddTodo` - Function to add a new todo
- `placeholder` - Text shown when input is empty

### React 19 Feature Used

- **useFormStatus**: Automatically handles form loading states

---

## 4. 📋 TodoList Component

**What it does:** Shows all your todos or a message if you have none

**Where you see it:** The main area with all your todos

### Simple Explanation

- If you have todos: shows them all using TodoItem components
- If you have no todos: shows a friendly "No tasks yet" message
- Each todo gets its own TodoItem component

### Code Example

```tsx
function TodoList({ todos, onToggleTodo, onDeleteTodo, onEditTodo }) {
  // If no todos, show empty state
  if (todos.length === 0) {
    return (
      <div>
        <h3>No tasks yet</h3>
        <p>Add your first task above to get started</p>
      </div>
    );
  }
  
  // If we have todos, show them
  return (
    <div>
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
}
```

### Props (Data it receives)

- `todos` - Array of all todos to display
- `onToggleTodo` - Function to mark todos as done/undone
- `onDeleteTodo` - Function to delete todos
- `onEditTodo` - Function to edit todos

---

## 5. 🔍 TodoFilters Component

**What it does:** Buttons to filter which todos you see (All/Active/Completed)

**Where you see it:** Row of buttons below the progress bar

### Simple Explanation

- "All" button: shows all todos
- "Active" button: shows only unfinished todos
- "Completed" button: shows only finished todos
- "Clear" button: removes all completed todos
- Uses React 19 for smooth transitions

### Code Example

```tsx
function TodoFilters({ currentFilter, onFilterChange, stats }) {
  return (
    <div>
      {/* Filter buttons */}
      <button 
        onClick={() => onFilterChange('all')}
        className={currentFilter === 'all' ? 'active' : ''}
      >
        All ({stats.total})
      </button>
      
      <button 
        onClick={() => onFilterChange('active')}
        className={currentFilter === 'active' ? 'active' : ''}
      >
        Active ({stats.active})
      </button>
      
      <button 
        onClick={() => onFilterChange('completed')}
        className={currentFilter === 'completed' ? 'active' : ''}
      >
        Completed ({stats.completed})
      </button>
      
      {/* Clear button */}
      {stats.completed > 0 && (
        <button onClick={onClearCompleted}>
          Clear ({stats.completed})
        </button>
      )}
    </div>
  );
}
```

### Props (Data it receives)

- `currentFilter` - Which filter is currently active
- `onFilterChange` - Function to change the filter
- `stats` - Numbers for each filter (for button labels)
- `onClearCompleted` - Function to clear completed todos
- `isPending` - React 19 feature for loading states

### React 19 Feature Used

- **useTransition**: Makes filter changes smooth and non-blocking

---

## 6. 📱 App Component

**What it does:** The main component that puts everything together

**Where you see it:** This IS the entire app!

### Simple Explanation

- Uses the `useTodos` hook to manage all data
- Arranges all other components on the page
- Passes data between components
- Handles the overall layout and styling

### Code Example

```tsx
function App() {
  // Get all data and functions from our custom hook
  const {
    todos, filter, stats, isPending,
    addTodo, toggleTodo, deleteTodo, editTodo,
    clearCompleted, setFilter
  } = useTodos();
  
  return (
    <div className="app">
      <header>
        <h1>Todo</h1>
        <p>Stay focused and organized</p>
      </header>
      
      <main>
        {/* Input to add new todos */}
        <TodoInput onAddTodo={addTodo} />
        
        {/* Show stats if we have todos */}
        {stats.total > 0 && <TodoStats stats={stats} />}
        
        {/* Show filters if we have todos */}
        {stats.total > 0 && (
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={stats}
            isPending={isPending}
            onClearCompleted={clearCompleted}
          />
        )}
        
        {/* The todo list */}
        <TodoList
          todos={todos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onEditTodo={editTodo}
        />
      </main>
    </div>
  );
}
```

### What it manages

- **Layout**: How components are arranged
- **Data flow**: Passing data from `useTodos` to components
- **Conditional rendering**: Only showing stats/filters when needed

---

## 🎯 How Components Work Together

Think of it like a **restaurant**:

1. **App** = Restaurant manager (coordinates everything)
2. **TodoInput** = Order-taking waiter (gets new requests)
3. **TodoList** = Kitchen (shows all orders)
4. **TodoItem** = Individual dish (one order)
5. **TodoFilters** = Menu categories (organize orders)
6. **TodoStats** = Restaurant dashboard (shows progress)

### Data Flow

```
App (manager)
├── Gets data from useTodos hook
├── Passes data to TodoInput (waiter)
├── Passes data to TodoStats (dashboard)
├── Passes data to TodoFilters (menu)
└── Passes data to TodoList (kitchen)
    └── TodoList passes data to each TodoItem (dish)
```

## 🔄 Component Communication

Components talk to each other through **props** (like passing notes):

### Parent to Child (Passing Data Down)

```tsx
// App passes data to TodoList
<TodoList todos={todos} onToggleTodo={toggleTodo} />
```

### Child to Parent (Sending Actions Up)

```tsx
// TodoItem tells parent when something happens
<button onClick={() => onDelete(todo.id)}>Delete</button>
```

## 💡 Key Takeaways

1. **Each component has one job** - Single responsibility
2. **Components are reusable** - TodoItem is used for each todo
3. **Props flow down** - Data goes from parent to child
4. **Events flow up** - Actions go from child to parent
5. **Components are independent** - You can change one without breaking others

## 🎓 Practice Exercises

1. **Find a component**: Look at the running app and identify each component
2. **Trace data flow**: Follow how a new todo goes from input to display
3. **Modify a component**: Try changing the placeholder text in TodoInput
4. **Add a feature**: Add a "priority" field to TodoItem

Remember: **Start small and build up!** Understanding components is key to mastering React! 🌟
