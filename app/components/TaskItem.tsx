import { Reorder, useMotionValue } from 'framer-motion';
import { Task, Priority, Category } from '../types';
import { GripVertical, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const PriorityColors: Record<Priority, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

export const TaskItem = ({ task, onToggle, onDelete, onUpdate }: Props) => {
  const y = useMotionValue(0);

  return (
    <Reorder.Item value={task} id={task.id} style={{ y }} className="mb-2">
      <div className={clsx(
        "flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all",
        task.completed && "opacity-60 bg-gray-50"
      )}>
        <div className="cursor-grab active:cursor-grabbing mr-3 text-gray-400">
          <GripVertical size={20} />
        </div>

        <div 
          onClick={() => onToggle(task.id)}
          className={clsx(
            "w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-3 cursor-pointer transition-colors",
            task.completed ? "bg-green-500 border-green-500" : "border-indigo-200"
          )}
        >
          {task.completed && <span className="text-white font-bold text-xs">✓</span>}
        </div>

        <div className="flex-1">
          <p className={clsx(
            "font-medium text-gray-800 transition-all",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </p>
          <div className="flex gap-2 mt-1 text-xs">
            <span className={clsx("px-2 py-0.5 rounded-full", PriorityColors[task.priority])}>
              {task.priority}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {task.category}
            </span>
            <span className="px-2 py-0.5 text-gray-500">
              {task.estimate}m
            </span>
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Reorder.Item>
  );
};
