import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Task {
  id: string;
  description: string;
  date: string;
  completed: boolean;
  color?: string;
}

interface MoveTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onMove: (newDate: string) => void;
}

export function MoveTaskDialog({ open, onOpenChange, task, onMove }: MoveTaskDialogProps) {
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    if (task && open) {
      setNewDate(task.date);
    }
  }, [task, open]);

  const handleMove = () => {
    if (!newDate) return;
    onMove(newDate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-stone-800">Taak verplaatsen</DialogTitle>
          <DialogDescription className="text-stone-600">
            Kies een nieuwe datum voor deze taak.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newDate" className="text-stone-700">Nieuwe datum</Label>
            <Input
              id="newDate"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-xl border-stone-200 focus:border-amber-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50">
            Annuleren
          </Button>
          <Button onClick={handleMove} className="rounded-xl">
            Verplaatsen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
