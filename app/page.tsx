'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as LegendJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as TitleJS,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useProductivityApp } from '@/hooks/useProductivityApp';
import { Task, Category, Priority } from './types';
import { TaskList } from '@/components/TaskList';
import { FilterBar } from '@/components/FilterBar';
import { StatsCard } from '@/components/StatsCard';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { WeeklyGoal } from '@/components/WeeklyGoal';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { ExportButton } from '@/components/ExportButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { TrendsChart } from '@/components/TrendsChart';
import { format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  BarChart2, Target, Trophy, Clock, CalendarDays, Edit,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

ChartJS.register(
  ArcElement,
  Tooltip,
  LegendJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TitleJS
);

export default function Home() {
  const {
    appState,
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
  } = useProductivityApp();

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | 'All'>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<Priority | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    let tasks = currentDayTasks;

    if (selectedCategoryFilter !== 'All') {
      tasks = tasks.filter(task => task.category === selectedCategoryFilter);
    }

    if (selectedPriorityFilter !== 'All') {
      tasks = tasks.filter(task => task.priority === selectedPriorityFilter);
    }

    if (searchQuery) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return tasks;
  }, [currentDayTasks, selectedCategoryFilter, selectedPriorityFilter, searchQuery]);

  const currentDayData = appState.days[currentDate];
  const completedToday = currentDayData?.tasks.filter(t => t.completed).length || 0;
  const totalTasksToday = currentDayData?.tasks.length || 0;
  const percentageToday = totalTasksToday > 0 ? Math.round((completedToday / totalTasksToday) * 100) : 0;

  const pieData = {
    labels: ['Completado', 'Pendiente'],
    datasets: [{
      data: [completedToday, totalTasksToday - completedToday],
      backgroundColor: ['hsl(var(--primary))', 'hsl(var(--muted))'],
      borderWidth: 0,
    }],
  };

  const dayDisplay = useMemo(() => {
    const date = new Date(currentDate);
    if (isToday(date)) return "Hoy";
    if (isYesterday(date)) return "Ayer";
    return format(date, 'EEEE, d MMM yyyy', { locale: es });
  }, [currentDate]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-card rounded-2xl shadow-lg border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              P
            </div>
            <div>
              <h1 className="text-3xl font-bold">ProductivApp <span className="text-primary text-sm">v2</span></h1>
              <p className="text-muted-foreground">Welcome back, Dante!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ExportButton data={appState} />
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarDays size={20} />
              <span>{dayDisplay}</span>
            </Button>
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <WeeklyGoal goal={appState.weeklyGoal} onUpdateGoal={handleUpdateWeeklyGoal} />

            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">📋 Your Daily Tasks</h2>
              <FilterBar
                selectedCategory={selectedCategoryFilter}
                setSelectedCategory={setSelectedCategoryFilter}
                selectedPriority={selectedPriorityFilter}
                setSelectedPriority={setSelectedPriorityFilter}
                onAddTask={() => setIsAddTaskModalOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              {filteredTasks.length > 0 ? (
                <TaskList
                  tasks={filteredTasks}
                  onReorder={handleReorderTasks}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                />
              ) : (
                <p className="text-muted-foreground text-center py-8">No tasks found for {dayDisplay}.</p>
              )}
            </div>

            <TrendsChart dailyCompletions={dailyCompletionsLast30Days} />
          </motion.div>

          {/* Right Column - Stats & Badges */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Daily Progress */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h2 className="text-2xl font-bold text-foreground text-center mb-6">🎯 Daily Progress</h2>
              <div className="h-48 relative">
                <Doughnut data={pieData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-bold text-primary">{percentageToday}%</span>
                  <span className="text-muted-foreground mt-2">Completado</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <StatsCard 
                title="Current Streak"
                value={weeklyStats.maxStreak}
                icon={<Flame size={28} />}
                color="bg-amber-500"
                delay={0}
              />
              <StatsCard 
                title="Weekly Avg"
                value={`${weeklyStats.weeklyAvg}%`}
                icon={<BarChart2 size={28} />}
                color="bg-blue-500"
                delay={0.1}
              />
              <StatsCard 
                title="Total Done"
                value={weeklyStats.totalCompleted}
                icon={<CheckCircle2 size={28} />}
                color="bg-green-500"
                delay={0.2}
              />
              <StatsCard 
                title="Best Day"
                value={weeklyStats.bestDayScore > 0 ? format(new Date(weeklyStats.bestDayDate), 'MMM d') : '-'}
                icon={<Trophy size={28} />}
                color="bg-purple-500"
                delay={0.3}
              />
            </div>

            <BadgeDisplay badges={appState.badges} />
            <MotivationalQuote />
          </motion.div>
        </div>
      </div>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
