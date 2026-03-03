import { motion, Variants } from 'framer-motion';
import { Badge as BadgeType } from '../types';
import {
  Trophy, Star, Zap, Target, Flame, Award, Lightbulb, CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badges: BadgeType[];
}

const iconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy size={32} />,
  star: <Star size={32} />,
  zap: <Zap size={32} />,
  target: <Target size={32} />,
  flame: <Flame size={32} />,
  award: <Award size={32} />,
  lightbulb: <Lightbulb size={32} />,
  checkcircle: <CheckCircle size={32} />,
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, type: 'spring' as const, stiffness: 200, damping: 10 }
  })
};

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const lockedBadges = badges.filter(b => !b.unlockedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl p-6 shadow-lg border border-border"
    >
      <h2 className="text-xl font-bold text-foreground text-center mb-6">🏆 Achievement Badges</h2>
      
      {unlockedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Unlocked</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {unlockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="flex flex-col items-center text-center"
                title={badge.description}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-2",
                  "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                )}>
                  {iconMap[badge.icon.toLowerCase()] || <Trophy size={32} />}
                </div>
                <span className="text-xs font-medium text-foreground">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Locked</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {lockedBadges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0.4, scale: 0.9 }}
                animate={{ opacity: 0.4, scale: 0.9 }}
                className="flex flex-col items-center text-center"
                title={badge.description}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-2 bg-muted text-muted-foreground">
                  {iconMap[badge.icon.toLowerCase()] || <Trophy size={32} />}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
