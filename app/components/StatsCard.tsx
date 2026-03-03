import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming utils.ts will provide cn

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Lucide icon
  color: string; // Tailwind color class e.g., 'bg-indigo-500'
  delay?: number;
}

export const StatsCard = ({ title, value, icon, color, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className={cn(
        "relative p-6 rounded-2xl shadow-xl overflow-hidden",
        color,
        "text-white"
      )}
    >
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'%2F%3E%3C%2Ffilter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'%2F%3E%3C%2Fsvg%3E")', backgroundSize: '200px 200px'}} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 mb-1 leading-tight">{title}</p>
          <h3 className="text-3xl font-bold leading-none">{value}</h3>
        </div>
        <div className="text-white opacity-70">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};
