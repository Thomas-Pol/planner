import { Plus, Square, Check } from 'lucide-react';
import { Button } from './ui/button';

interface Task {
  id: string;
  description: string;
  date: string;
  completed: boolean;
  color?: string;
}

interface WeekViewProps {
  weekStart: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (date: string) => void;
  onDayClick: (date: Date) => void;
  onToggleComplete: (taskId: string) => void;
}

const DAYS = ['Zondag','Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

let month: string[] = [];

// Helper function to darken a color
function darkenColor(hex: string, percent: number = 20): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent / 100)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent / 100)));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

export function WeekView({ weekStart, tasks, onTaskClick, onAddTask, onDayClick, onToggleComplete }: WeekViewProps) {
  // Build week days using local year/month/day components to avoid
  // timezone shifts caused by toISOString/from-ISO string parsing.
  const getWeekDays = () => {
    const days: Date[] = [];
    const baseYear = weekStart.getFullYear();
    const baseMonth = weekStart.getMonth();
    const baseDate = weekStart.getDate();

    for (let i = 0; i < 7; i++) {
      // new Date(year, monthIndex, day) creates a date at local midnight
      // and adding i to the day keeps calculations in local time.
      days.push(new Date(baseYear, baseMonth, baseDate + i));
    }

    return days;
  };

  // Format a date as a local YYYY-MM-DD string (not UTC). This keeps
  // comparisons consistent with how users expect dates to behave in the UI.
  const formatDateLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const weekDays = getWeekDays();
  const today = new Date().toDateString();

  const getTasksForDay = (date: Date) => {
    const dateString = formatDateLocal(date);
    return tasks.filter((t) => t.date === dateString);
  };

  const getDayByDayOfWeek = (dayOfWeek: number) => {
    return weekDays.find(day => day.getDay() === dayOfWeek);
  };

  const renderDayCard = (dayOfWeek: number) => {
    const day = getDayByDayOfWeek(dayOfWeek);
    if (!day) return null;

    const isToday = day.toDateString() === today;
    const dateString = day.toISOString().split('T')[0];
    const dayTasks = getTasksForDay(day);

    return (
      <div
        key={day.toISOString()}
        className="border border-stone-200 rounded-2xl overflow-hidden bg-warmwhite shadow-sm hover:shadow-md transition-all"
        style={{ backgroundColor: '#faf8f6' }}
      >
        <div
          className={`p-4 cursor-pointer border-b-2 ${isToday ? 'day-header-today' : 'day-header'}`}
          onClick={() => onDayClick(day)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm day-name">
                {DAYS[day.getDay()]}
              </div>
              <div className="mt-1 day-number">
                {day.getDate()} {day.toLocaleDateString('nl-NL', { month: 'short' })}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-stone-100 text-stone-600 day-add-btn"
                onClick={(e) => {
                e.stopPropagation();
               
                onAddTask(formatDateLocal(day));
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2 min-h-[200px]">
          {dayTasks.length === 0 ? (
            <p className="text-sm text-stone-300 text-center py-8">
              Geen taken
            </p>
          ) : (
            dayTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className="task-box flex items-start gap-2 p-3 rounded-xl hover:opacity-90 transition-all relative border-2 border-stone-200 before:content-[''] before:absolute before:left-0 before:top-0 before:w-12 before:h-[2px] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-[2px]"
                  style={{ 
                    '--accent-color': task.color || '#d9cec0',
                    backgroundColor: '#faf8f6',
                    borderLeftColor: task.color || '#d9cec0',
                    borderLeftWidth: '5px',
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
                      className="w-5 h-5" 
                      style={{ 
                        color: task.completed ? '#8b7355' : '#9a8b7a',
                        fill: task.completed ? '#8b7355' : 'transparent'
                      }}
                    />
                    {task.completed && (
                      <Check 
                        className="w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                        style={{ color: '#faf8f6' }}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                  <div
                    className="flex-1 min-w-0 cursor-pointer text-sm"
                    onClick={() => onTaskClick(task)}
                  >
                    <p className={`break-words text-stone-700 ${task.completed ? 'line-through text-stone-400' : ''}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: '#f5f1ed' }}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column: Monday, Wednesday, Friday */}
          <div className="space-y-4">
            {renderDayCard(1)} {/* Monday */}
            {renderDayCard(3)} {/* Wednesday */}
            {renderDayCard(5)} {/* Friday */}
          </div>

          {/* Right Column: Tuesday, Thursday, then Sat & Sun side-by-side */}
          <div className="space-y-4">
            {renderDayCard(2)} {/* Tuesday */}
            {renderDayCard(4)} {/* Thursday */}

            {/* Bottom Row: Sat, Sun */}
            <div className="grid grid-cols-2 gap-4">
              {renderDayCard(6)} {/* Saturday */}
              {renderDayCard(0)} {/* Sunday */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
