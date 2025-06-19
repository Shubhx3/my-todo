// Types for our Todo Application
// This file contains all TypeScript interfaces and types
// Keeping types separate makes the code more organized and reusable

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Filter options for displaying todos
export type FilterType = 'all' | 'active' | 'completed'; 