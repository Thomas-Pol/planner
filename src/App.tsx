import { useState, useEffect } from 'react';
import logoImage from './img/ilse-logo-no-bg.png';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ListTodo } from 'lucide-react';
import { useIsMobile } from './components/ui/use-mobile';
import { Button } from './components/ui/button';
import { DayView } from './components/DayView';
import { WeekView } from './components/WeekView';
import { TaskDialog } from './components/TaskDialog';
import { TaskActionsDialog } from './components/TaskActionsDialog';
import { MoveTaskDialog } from './components/MoveTaskDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

interface Task {
  id: string;
  description: string;
  date: string;
  completed: boolean;
  color?: string;
}

const STORAGE_KEY = 'agenda-tasks';

// Return the start of the week for a given date.
// In the Netherlands the week typically starts on Monday, so we compute
// the Monday of the week containing `date`. getDay() returns 0 for Sunday
// through 6 for Saturday. To get Monday as start (day 1), we shift so that
// Sunday (0) maps to -6 (previous Monday) and Monday (1) maps to 0.
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // Calculate difference to Monday: if day is 1 (Monday) diff=0; if day=0 (Sunday) diff=-6
  const diffToMonday = d.getDate() - ((day + 6) % 7);
  return new Date(d.setDate(diffToMonday));
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('nl-NL', options);
}

function formatWeekRange(startDate: Date): string {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const startMonth = startDate.toLocaleDateString('nl-NL', { month: 'short' });
  const endMonth = endDate.toLocaleDateString('nl-NL', { month: 'short' });
  const weekNumber = Math.ceil((((startDate.getTime() - new Date(startDate.getFullYear(), 0, 1).getTime()) / 86400000) + new Date(startDate.getFullYear(), 0, 1).getDay() + 1) / 7);
  
  if (startMonth === endMonth) {
    return `Week ${weekNumber} - (${startDate.getDate()} t/m ${endDate.getDate()} ${startMonth}, ${startDate.getFullYear()})`;
  }
  return `Week ${weekNumber} - (${startDate.getDate()} ${startMonth} t/m ${endDate.getDate()} ${endMonth}, ${startDate.getFullYear()})`;
}

export default function App() {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tasks from storage', e);
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Set view mode based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode('day');
    } else {
      setViewMode('week');
    }
  }, [isMobile]);

  const weekStart = getStartOfWeek(currentDate);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSaveTask = (task: Task) => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks([...tasks, task]);
    }
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setActionsDialogOpen(true);
  };

  const handleAddTask = (date?: string) => {
    setSelectedTask(null);
    setDefaultDate(date || currentDate.toISOString().split('T')[0]);
    setTaskDialogOpen(true);
  };

  const handleEditTask = () => {
    setTaskDialogOpen(true);
  };

  const handleDeleteTask = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTask) {
      setTasks(tasks.filter((t) => t.id !== selectedTask.id));
      setSelectedTask(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleMoveTask = () => {
    setMoveDialogOpen(true);
  };

  const handleConfirmMove = (newDate: string) => {
    if (selectedTask) {
      setTasks(tasks.map((t) => 
        t.id === selectedTask.id ? { ...t, date: newDate } : t
      ));
      setSelectedTask(null);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map((t) => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const displayDate = viewMode === 'day' ? formatDate(currentDate) : formatWeekRange(weekStart);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f5f1ed' }}>
      {/* App Header */}
      <div className="bg-warmwhite/90 backdrop-blur-sm border-b border-stone-200 shadow-sm" style={{ backgroundColor: 'rgba(250, 248, 246, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            
            <div>
              <img src={logoImage} alt="Logo" className="w-10 h-full drop-shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <div className="bg-warmwhite/60 backdrop-blur-sm border-b border-stone-200 p-4" style={{ backgroundColor: 'rgba(250, 248, 246, 0.6)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50" onClick={handlePrevious}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50" onClick={handleNext}>
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50" onClick={handleToday}>
                Vandaag
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-stone-600" />
              <h2 className="text-stone-800">{displayDate}</h2>
            </div>

            <div className="flex items-center gap-2">
              {!isMobile && (
                <div className="flex gap-1 border border-stone-200 rounded-xl p-1 bg-warmwhite/50" style={{ backgroundColor: 'rgba(250, 248, 246, 0.5)' }}>
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setViewMode('day')}
                  >
                    Dag
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setViewMode('week')}
                  >
                    Week
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'day' ? (
        <DayView
          date={currentDate}
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onAddTask={() => handleAddTask()}
          onToggleComplete={handleToggleComplete}
        />
      ) : (
        <WeekView
          weekStart={weekStart}
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
          onDayClick={handleDayClick}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={(open) => {
          setTaskDialogOpen(open);
          if (!open) {
            setSelectedTask(null);
            setDefaultDate('');
          }
        }}
        onSave={handleSaveTask}
        task={selectedTask}
        defaultDate={defaultDate}
      />

      {/* Task Actions Dialog */}
      <TaskActionsDialog
        open={actionsDialogOpen}
        onOpenChange={setActionsDialogOpen}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onMove={handleMoveTask}
      />

      {/* Move Task Dialog */}
      <MoveTaskDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        task={selectedTask}
        onMove={handleConfirmMove}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl border border-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-stone-800">Taak verwijderen</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-600">
              Weet je zeker dat je deze taak wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="rounded-xl">Verwijderen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
