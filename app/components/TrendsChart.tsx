import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TrendsChartProps {
  dailyCompletions: number[];
}

export const TrendsChart = ({ dailyCompletions }: TrendsChartProps) => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    });

    const dataPoints = [...Array(Math.max(0, 30 - dailyCompletions.length)).fill(0), ...dailyCompletions].slice(-30);

    setChartData({
      labels,
      datasets: [{
        label: 'Tareas Completadas',
        data: dataPoints,
        backgroundColor: '#667eea',
        borderColor: '#5a67d8',
        borderWidth: 1,
        borderRadius: 4,
      }],
    });

    setAnimated(true);
  }, [dailyCompletions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'JetBrains Mono, monospace' } },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#6B7280', font: { family: 'JetBrains Mono, monospace' } },
        max: Math.max(7, ...dailyCompletions, 10),
      },
    },
    animation: {
        delay: animated ? 0 : 500,
        duration: 1000,
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-2xl h-80"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">📈 Tendencias Históricas (Últimos 30 Días)</h2>
      <div className="h-56">
        {chartData.labels && chartData.labels.length > 0 && <Bar data={chartData} options={options} />}
      </div>
    </motion.div>
  );
};
