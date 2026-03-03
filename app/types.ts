export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Work' | 'Health' | 'Personal' | 'Study' | 'Other';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  estimate: number; // minutes
}

export interface DayData {
  date: string; // ISO date YYYY-MM-DD
  tasks: Task[];
  goal?: string;
  completedCount: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string; // Date string or undefined
}

export interface AppState {
  days: Record<string, DayData>; // Keyed by YYYY-MM-DD
  badges: Badge[];
  weeklyGoal: string;
}

export const CATEGORIES: Category[] = ['Work', 'Health', 'Personal', 'Study', 'Other'];
export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
