import { Plus, Square, Check } from 'lucide-react';
import { Button } from './ui/button';

interface Task {
  id: string;
  description: string;
  date: string;
  completed: boolean;
  color?: string;
}

interface DayViewProps {
  date: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  onToggleComplete: (taskId: string) => void;
}

// Helper function to darken a color
function darkenColor(hex: string, percent: number = 20): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent / 100)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent / 100)));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

export function DayView({ date, tasks, onTaskClick, onAddTask, onToggleComplete }: DayViewProps) {
  const dateString = date.toISOString().split('T')[0];
  const dayTasks = tasks.filter((t) => t.date === dateString);

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f5f1ed' }}>
      <div className="max-w-4xl mx-auto p-6 space-y-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-stone-800">Taken</h2>
          <Button onClick={onAddTask} size="sm" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe taak
          </Button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p>Geen taken voor deze dag</p>
            <Button onClick={onAddTask} variant="outline" className="mt-4 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">
              <Plus className="w-4 h-4 mr-2" />
              Voeg je eerste taak toe
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className="task-box flex items-center gap-3 p-5 rounded-2xl border-2 border-stone-200 hover:shadow-md transition-all relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-16 before:h-[3px] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-16 after:h-[3px]"
                  style={{ 
                    '--accent-color': task.color || '#d9cec0',
                    backgroundColor: '#faf8f6',
                    borderLeftColor: task.color || '#d9cec0',
                    borderLeftWidth: '6px',
                  } as React.CSSProperties & { '--accent-color': string }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task.id);
                    }}
                    className="flex-shrink-0 hover:scale-110 transition-transform relative"
                  >
                    <Square 
                      className="w-6 h-6" 
                      style={{ 
                        color: task.completed ? '#8b7355' : '#9a8b7a',
                        fill: task.completed ? '#8b7355' : 'transparent'
                      }}
                    />
                    {task.completed && (
                      <Check 
                        className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                        style={{ color: '#faf8f6' }}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onTaskClick(task)}
                  >
                    <p className={`text-stone-700 ${task.completed ? 'line-through text-stone-400' : ''}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
