import { AppState, DayData, Task } from '../types';
import { format, subDays } from 'date-fns';

const STORAGE_KEY = 'productivity_data_v2';
const TASK_ID_PREFIX = 'task_';

export const loadState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      days: {},
      badges: [
        { id: 'first-task', name: 'First Step', icon: 'star', description: 'Complete your first task.' },
        { id: '5-tasks', name: 'Getting Started', icon: 'zap', description: 'Complete 5 tasks.' },
        { id: 'daily-goal', name: 'Daily Achiever', icon: 'target', description: 'Complete all tasks in a day.' },
        { id: '3-day-streak', name: 'On Fire!', icon: 'flame', description: 'Complete all tasks for 3 consecutive days.' },
        { id: 'weekly-avg', name: 'Consistent Coder', icon: 'award', description: 'Maintain 80% weekly completion average.' },
        { id: 'automation-master', name: 'Automation Master', icon: 'lightbulb', description: 'Use automation to save time.' },
      ],
      weeklyGoal: '',
    };
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return {
        days: {},
        badges: [
          { id: 'first-task', name: 'First Step', icon: 'star', description: 'Complete your first task.' },
          { id: '5-tasks', name: 'Getting Started', icon: 'zap', description: 'Complete 5 tasks.' },
          { id: 'daily-goal', name: 'Daily Achiever', icon: 'target', description: 'Complete all tasks in a day.' },
          { id: '3-day-streak', name: 'On Fire!', icon: 'flame', description: 'Complete all tasks for 3 consecutive days.' },
          { id: 'weekly-avg', name: 'Consistent Coder', icon: 'award', description: 'Maintain 80% weekly completion average.' },
          { id: 'automation-master', name: 'Automation Master', icon: 'lightbulb', description: 'Use automation to save time.' },
        ],
        weeklyGoal: '',
      };
    }
    const loadedState: AppState = JSON.parse(serializedState);

    // Initialize default badges if not present in loaded state
    const defaultBadges = [
      { id: 'first-task', name: 'First Step', icon: 'star', description: 'Complete your first task.' },
      { id: '5-tasks', name: 'Getting Started', icon: 'zap', description: 'Complete 5 tasks.' },
      { id: 'daily-goal', name: 'Daily Achiever', icon: 'target', description: 'Complete all tasks in a day.' },
      { id: '3-day-streak', name: 'On Fire!', icon: 'flame', description: 'Complete all tasks for 3 consecutive days.' },
      { id: 'weekly-avg', name: 'Consistent Coder', icon: 'award', description: 'Maintain 80% weekly completion average.' },
      { id: 'automation-master', name: 'Automation Master', icon: 'lightbulb', description: 'Use automation to save time.' },
    ];
    const mergedBadges = defaultBadges.map(defaultBadge => {
      const existing = loadedState.badges.find(b => b.id === defaultBadge.id);
      return existing ? { ...defaultBadge, ...existing } : defaultBadge;
    });
    loadedState.badges = mergedBadges;

    // Clean up old days (e.g., beyond 30 days history, or just keep relevant structure)
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const newDays: Record<string, DayData> = {};
    for (const dateString in loadedState.days) {
      if (new Date(dateString) >= thirtyDaysAgo) {
        newDays[dateString] = loadedState.days[dateString];
      }
    }
    loadedState.days = newDays;

    return loadedState;
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return {
      days: {},
      badges: [
        { id: 'first-task', name: 'First Step', icon: 'star', description: 'Complete your first task.' },
        { id: '5-tasks', name: 'Getting Started', icon: 'zap', description: 'Complete 5 tasks.' },
        { id: 'daily-goal', name: 'Daily Achiever', icon: 'target', description: 'Complete all tasks in a day.' },
        { id: '3-day-streak', name: 'On Fire!', icon: 'flame', description: 'Complete all tasks for 3 consecutive days.' },
        { id: 'weekly-avg', name: 'Consistent Coder', icon: 'award', description: 'Maintain 80% weekly completion average.' },
        { id: 'automation-master', name: 'Automation Master', icon: 'lightbulb', description: 'Use automation to save time.' },
      ],
      weeklyGoal: '',
    };
  }
};

export const saveState = (state: AppState) => {
  if (typeof window === 'undefined') return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

export const generateId = (): string => {
  return TASK_ID_PREFIX + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};

export const getTodayISO = () => format(new Date(), 'yyyy-MM-dd');
