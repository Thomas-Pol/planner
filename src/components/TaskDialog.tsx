import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface Task {
  id: string;
  description: string;
  date: string;
  completed: boolean;
  color?: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  task?: Task | null;
  defaultDate?: string;
}

const TASK_COLORS = [
  { name: 'Geel', value: '#E8DDB5' },
  { name: 'Peach', value: '#F0DCC4' },
  { name: 'Roze', value: '#E8C5CC' },
  { name: 'Blauw', value: '#C8D8DC' },
  { name: 'Lila', value: '#D0C8DC' },
  { name: 'Groen', value: '#C8DCC8' },
];

export function TaskDialog({ open, onOpenChange, onSave, task, defaultDate }: TaskDialogProps) {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [color, setColor] = useState(TASK_COLORS[0].value);

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setDate(task.date);
      setColor(task.color || TASK_COLORS[0].value);
    } else if (defaultDate) {
      setDate(defaultDate);
      setColor(TASK_COLORS[0].value);
    }
  }, [task, defaultDate, open]);

  const handleSave = () => {
    if (!description.trim() || !date) return;

    const taskData: Task = {
      id: task?.id || Date.now().toString(),
      description: description.trim(),
      date,
      completed: task?.completed || false,
      color,
    };

    onSave(taskData);
    handleClose();
  };

  const handleClose = () => {
    setDescription('');
    setDate('');
    setColor(TASK_COLORS[0].value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-stone-800">{task ? 'Taak bewerken' : 'Nieuwe taak'}</DialogTitle>
          <DialogDescription className="text-stone-600">
            {task ? 'Wijzig de beschrijving van je taak.' : 'Voeg een nieuwe taak toe aan je agenda.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-stone-700">Beschrijving</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Wat moet er gebeuren?"
              rows={4}
              autoFocus
              className="rounded-xl border-stone-200 focus:border-amber-700"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-stone-700">Kleur</Label>
            <div className="flex gap-3">
              {TASK_COLORS.map((taskColor) => (
                <button
                  key={taskColor.value}
                  type="button"
                  className="w-10 h-10 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: taskColor.value,
                    border: color === taskColor.value ? '3px solid #8b7355' : '2px solid #d9cec0',
                    boxShadow: color === taskColor.value ? '0 0 0 2px rgba(139, 115, 85, 0.2)' : 'none',
                  }}
                  onClick={() => setColor(taskColor.value)}
                  title={taskColor.name}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-stone-700">Datum</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border-stone-200 focus:border-amber-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">
            Annuleren
          </Button>
          <Button onClick={handleSave} className="rounded-xl">
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
