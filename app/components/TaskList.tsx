import { Reorder } from 'framer-motion';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface Props {
  tasks: Task[];
  onReorder: (newTasks: Task[]) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export const TaskList = ({ tasks, onReorder, onToggleTask, onDeleteTask, onUpdateTask }: Props) => {
  return (
    <Reorder.Group axis="y" values={tasks} onReorder={onReorder}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </Reorder.Group>
  );
};
