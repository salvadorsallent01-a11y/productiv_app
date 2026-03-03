'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const STORAGE_KEY = 'productivity_data_v1';
const TASKS_COUNT = 7;

const tasks = [
  'Trabajo',
  'Matar a Alfonsín',
  'Oxygen',
  'Ojos de Video',
  'Gym',
  'Cardio',
  'Bici / Caminata',
];

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface DataType {
  [key: string]: boolean[];
}

export default function Home() {
  const [data, setData] = useState<DataType>({});
  const [currentDay, setCurrentDay] = useState('Lunes');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialData: DataType = saved ? JSON.parse(saved) : {};
    
    days.forEach(day => {
      if (!initialData[day]) {
        initialData[day] = Array(TASKS_COUNT).fill(false);
      }
    });
    
    setData(initialData);
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const toggleTask = (index: number) => {
    setData(prev => ({
      ...prev,
      [currentDay]: prev[currentDay].map((checked, i) => i === index ? !checked : checked)
    }));
  };

  const resetDay = () => {
    if (confirm(`¿Estás seguro de reiniciar el ${currentDay}?`)) {
      setData(prev => ({
        ...prev,
        [currentDay]: Array(TASKS_COUNT).fill(false)
      }));
    }
  };

  const dayData = data[currentDay] || Array(TASKS_COUNT).fill(false);
  const completed = dayData.filter(Boolean).length;
  const percentage = Math.round((completed / TASKS_COUNT) * 100);

  const pieData = {
    labels: ['Completado', 'Pendiente'],
    datasets: [{
      data: [completed, TASKS_COUNT - completed],
      backgroundColor: ['#22c55e', '#e5e7eb'],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  // Calculate weekly stats
  let totalCompleted = 0;
  let totalTasks = 0;
  let bestDay = '-';
  let bestDayScore = -1;
  let streak = 0;
  let maxStreak = 0;

  days.forEach(day => {
    const dayDataArray = data[day] || Array(TASKS_COUNT).fill(false);
    const completedCount = dayDataArray.filter(Boolean).length;
    totalCompleted += completedCount;
    totalTasks += TASKS_COUNT;

    if (completedCount > bestDayScore) {
      bestDayScore = completedCount;
      bestDay = day;
    }

    if (completedCount === TASKS_COUNT) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  });

  const weeklyAvg = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const weeklyData = {
    labels: days,
    datasets: [{
      label: 'Tareas Completadas',
      data: days.map(day => (data[day] || Array(TASKS_COUNT).fill(false)).filter(Boolean).length),
      backgroundColor: '#667eea',
      borderRadius: 8,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 7,
        ticks: { stepSize: 1 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  if (!mounted) return <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🎯 Dashboard de Productividad
        </h1>

        {/* Day Selector */}
        <div className="text-center mb-8">
          <select
            value={currentDay}
            onChange={(e) => setCurrentDay(e.target.value)}
            className="px-6 py-3 text-lg rounded-xl border-none bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          >
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {/* Main Dashboard */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Tasks Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">📋 Tareas del Día</h2>
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  onClick={() => toggleTask(index)}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 hover:translate-x-2 ${
                    dayData[index]
                      ? 'bg-green-100 opacity-80'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-7 h-7 border-3 rounded-lg mr-4 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      dayData[index]
                        ? 'bg-green-500 border-green-500'
                        : 'border-indigo-500'
                    }`}
                  >
                    {dayData[index] && (
                      <span className="text-white text-lg font-bold">✓</span>
                    )}
                  </div>
                  <span
                    className={`text-lg font-medium ${
                      dayData[index]
                        ? 'line-through text-green-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {task}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={resetDay}
              className="w-full mt-6 py-4 bg-red-500 text-white rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors"
            >
              🔄 Reiniciar Día
            </button>
          </div>

          {/* Chart Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">📊 Progreso</h2>
            <div className="h-64 relative">
              <Doughnut data={pieData} options={pieOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-bold text-indigo-500">{percentage}%</span>
                <span className="text-gray-500 mt-2">Completado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">📈 Estadísticas Semanales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{weeklyAvg}%</div>
              <div className="text-sm opacity-90 mt-1">Promedio Semanal</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{bestDayScore > 0 ? bestDay : '-'}</div>
              <div className="text-sm opacity-90 mt-1">Mejor Día</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{totalCompleted}</div>
              <div className="text-sm opacity-90 mt-1">Tareas Totales</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{maxStreak}</div>
              <div className="text-sm opacity-90 mt-1">Racha Actual</div>
            </div>
          </div>
          <div className="h-64">
            <Bar data={weeklyData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
