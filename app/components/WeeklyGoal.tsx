import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Edit2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface WeeklyGoalProps {
  goal: string;
  onUpdateGoal: (goal: string) => void;
}

export const WeeklyGoal = ({ goal, onUpdateGoal }: WeeklyGoalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);

  const handleSave = () => {
    onUpdateGoal(tempGoal);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-2xl text-white"
    >
      <div className="flex items-center gap-3 mb-4">
        <Target className="text-white/80" size={24} />
        <h2 className="text-xl font-bold">Weekly Goal</h2>
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            placeholder="Set your weekly goal..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <Button 
            onClick={handleSave}
            className="bg-white text-indigo-600 hover:bg-white/90"
          >
            <Check size={18} />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium">
            {goal || "No goal set yet. Click edit to set one!"}
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Edit2 size={18} />
          </Button>
        </div>
      )}
    </motion.div>
  );
};
