import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, Task, DayData, Priority, Category, Badge } from '../types';
import { loadState, saveState, generateId, getTodayISO } from '../utils/storage';
import { isSameDay, subDays, format, parseISO } from 'date-fns';

export const useProductivityApp = () => {
  const [appState, setAppState] = useState<AppState>(loadState);
  const [currentDate, setCurrentDate] = useState(getTodayISO()); // Track current day selected by user

  // Save state to localStorage whenever appState changes
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Ensure today's tasks are always initialized
  useEffect(() => {
    setAppState(prev => {
      const today = getTodayISO();
      if (!prev.days[today]) {
        return {
          ...prev,
          days: {
            ...prev.days,
            [today]: { date: today, tasks: [], completedCount: 0 }
          }
        };
      }
      return prev;
    });
  }, []);

  // Recalculate completed count for current day when its tasks change
  const todayData = appState.days[currentDate];
  useEffect(() => {
    if (todayData) {
      const newCompletedCount = todayData.tasks.filter(task => task.completed).length;
      if (newCompletedCount !== todayData.completedCount) {
        setAppState(prev => ({
          ...prev,
          days: {
            ...prev.days,
            [currentDate]: { ...prev.days[currentDate], completedCount: newCompletedCount }
          }
        }));
      }
    }
  }, [todayData, currentDate]); // Added currentDate as dependency

  const currentDayTasks = useMemo(() => appState.days[currentDate]?.tasks || [], [appState.days, currentDate]);

  const handleAddTask = useCallback((title: string, category: Category, priority: Priority, estimate: number) => {
    setAppState(prev => {
      const today = getTodayISO();
      const newTask: Task = {
        id: generateId(),
        title,
        completed: false,
        category,
        priority,
        estimate,
      };
      const updatedTasks = [...(prev.days[today]?.tasks || []), newTask];
      return {
        ...prev,
        days: {
          ...prev.days,
          [today]: {
            date: today,
            tasks: updatedTasks,
            completedCount: updatedTasks.filter(t => t.completed).length,
          },
        },
        // Check for 'first-task' badge
        badges: prev.badges.map(badge => 
          badge.id === 'first-task' && !badge.unlockedAt 
            ? { ...badge, unlockedAt: getTodayISO() } 
            : badge
        )
      };
    });
  }, []);

  const handleToggleTask = useCallback((id: string) => {
    setAppState(prev => {
      const updatedDays = { ...prev.days };
      const day = updatedDays[currentDate];
      if (day) {
        const updatedTasks = day.tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        updatedDays[currentDate] = { ...day, tasks: updatedTasks };

        // Badge logic: '5-tasks' and 'daily-goal'
        const newCompletedCount = updatedTasks.filter(t => t.completed).length;
        const totalTasks = updatedTasks.length;
        let newBadges = [...prev.badges];

        if (newCompletedCount >= 5 && !newBadges.find(b => b.id === '5-tasks')?.unlockedAt) {
          newBadges = newBadges.map(b => b.id === '5-tasks' ? { ...b, unlockedAt: getTodayISO() } : b);
        }

        if (totalTasks > 0 && newCompletedCount === totalTasks && !newBadges.find(b => b.id === 'daily-goal')?.unlockedAt) {
          newBadges = newBadges.map(b => b.id === 'daily-goal' ? { ...b, unlockedAt: getTodayISO() } : b);
        }

        return {
          ...prev,
          days: updatedDays,
          badges: newBadges,
        };
      }
      return prev;
    });
  }, [currentDate]);

  const handleDeleteTask = useCallback((id: string) => {
    setAppState(prev => {
      const updatedDays = { ...prev.days };
      const day = updatedDays[currentDate];
      if (day) {
        const updatedTasks = day.tasks.filter(task => task.id !== id);
        updatedDays[currentDate] = { ...day, tasks: updatedTasks };
        return { ...prev, days: updatedDays };
      }
      return prev;
    });
  }, [currentDate]);

  const handleUpdateTask = useCallback((id: string, updates: Partial<Task>) => {
    setAppState(prev => {
      const updatedDays = { ...prev.days };
      const day = updatedDays[currentDate];
      if (day) {
        const updatedTasks = day.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        );
        updatedDays[currentDate] = { ...day, tasks: updatedTasks };
        return { ...prev, days: updatedDays };
      }
      return prev;
    });
  }, [currentDate]);

  const handleReorderTasks = useCallback((newTasks: Task[]) => {
    setAppState(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [currentDate]: { ...prev.days[currentDate], tasks: newTasks }
      }
    }));
  }, [currentDate]);

  const handleUpdateWeeklyGoal = useCallback((goal: string) => {
    setAppState(prev => ({ ...prev, weeklyGoal: goal }));
  }, []);

  // Calculate weekly stats and badges (streak, weekly average)
  const weeklyStats = useMemo(() => {
    let totalCompleted = 0;
    let totalTasks = 0;
    let bestDayScore = -1;
    let bestDayDate = '';
    let currentStreak = 0;
    let maxStreak = 0;

    const sortedDates = Object.keys(appState.days).sort();
    for (let i = 0; i < sortedDates.length; i++) {
      const day = appState.days[sortedDates[i]];
      if (!day) continue;

      const completedCount = day.tasks.filter(t => t.completed).length;
      const totalTasksCount = day.tasks.length;

      totalCompleted += completedCount;
      totalTasks += totalTasksCount;

      if (completedCount > bestDayScore) {
        bestDayScore = completedCount;
        bestDayDate = day.date;
      }

      // Streak calculation
      const prevDay = sortedDates[i-1] ? parseISO(sortedDates[i-1]) : null;
      const current = parseISO(day.date);

      if (totalTasksCount > 0 && completedCount === totalTasksCount) {
        if (!prevDay || isSameDay(current, prevDay) || isSameDay(current, subDays(prevDay, -1))) {
          currentStreak++;
        } else {
          currentStreak = 1; // Reset if not consecutive or first completed day
        }
      } else {
        currentStreak = 0; // Reset if not all tasks completed
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    const weeklyAvg = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    // Update '3-day-streak' and 'weekly-avg' badges
    setAppState(prev => {
      let newBadges = [...prev.badges];
      if (maxStreak >= 3 && !newBadges.find(b => b.id === '3-day-streak')?.unlockedAt) {
        newBadges = newBadges.map(b => b.id === '3-day-streak' ? { ...b, unlockedAt: getTodayISO() } : b);
      }
      if (weeklyAvg >= 80 && !newBadges.find(b => b.id === 'weekly-avg')?.unlockedAt) {
        newBadges = newBadges.map(b => b.id === 'weekly-avg' ? { ...b, unlockedAt: getTodayISO() } : b);
      }
      if (newBadges.some((b, i) => b.unlockedAt !== prev.badges[i]?.unlockedAt)) {
        return { ...prev, badges: newBadges };
      }
      return prev;
    });

    return {
      totalCompleted,
      totalTasks,
      bestDayScore,
      bestDayDate,
      currentStreak,
      maxStreak,
      weeklyAvg,
    };
  }, [appState.days]);

  // Historical trends for the last 30 days
  const dailyCompletionsLast30Days = useMemo(() => {
    const today = new Date();
    const data: number[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayData = appState.days[dateString];
      data.push(dayData ? dayData.tasks.filter(t => t.completed).length : 0);
    }
    return data;
  }, [appState.days]);

  return {
    appState,
    setAppState,
    currentDate,
    setCurrentDate,
    currentDayTasks,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTask,
    handleReorderTasks,
    handleUpdateWeeklyGoal,
    weeklyStats,
    dailyCompletionsLast30Days,
  };
};
