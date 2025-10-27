import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Edit, Trash2, ArrowRight } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  date: string;
  completed: boolean;
  color?: string;
}

interface TaskActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
  onMove: () => void;
}

export function TaskActionsDialog({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onMove,
}: TaskActionsDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border border-stone-200">
        <DialogHeader>
          <DialogTitle className="text-stone-800">Taak acties</DialogTitle>
          <DialogDescription className="text-stone-600">Wat wil je doen met deze taak?</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50"
            onClick={() => {
              onEdit();
              onOpenChange(false);
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Bewerken
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50"
            onClick={() => {
              onMove();
              onOpenChange(false);
            }}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Verplaatsen naar andere dag
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start rounded-xl"
            onClick={() => {
              onDelete();
              onOpenChange(false);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Verwijderen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
