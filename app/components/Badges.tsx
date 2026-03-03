import { motion } from 'framer-motion';
import { Badge as BadgeType } from '../types';
import { Trophy, Star, Zap, Target, Flame, Award } from 'lucide-react';

interface BadgesProps {
  badges: BadgeType[];
}

const iconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy size={32} />,
  star: <Star size={32} />,
  zap: <Zap size={32} />,
  target: <Target size={32} />,
  flame: <Flame size={32} />,
  award: <Award size={32} />,
};

export const Badges = ({ badges }: BadgesProps) => {
  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const lockedBadges = badges.filter(b => !b.unlockedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🏆 Achievement Badges</h2>
      
      {unlockedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Unlocked</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {unlockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center text-center"
                title={badge.description}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg mb-2">
                  {iconMap[badge.icon] || <Trophy size={32} />}
                </div>
                <span className="text-xs font-medium text-gray-700">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Locked</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center opacity-40"
                title={badge.description}
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                  {iconMap[badge.icon] || <Trophy size={32} />}
                </div>
                <span className="text-xs font-medium text-gray-500">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
