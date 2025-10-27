import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Event) => void;
  event?: Event | null;
  defaultDate?: string;
  defaultTime?: string;
}

const EVENT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#4B301E', // dark brown (replaces yellow)
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

export function EventDialog({ open, onOpenChange, onSave, event, defaultDate, defaultTime }: EventDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState(EVENT_COLORS[0]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setColor(event.color);
    } else if (defaultDate) {
      setDate(defaultDate);
      if (defaultTime) {
        setStartTime(defaultTime);
        const [hours, minutes] = defaultTime.split(':');
        const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
        setEndTime(`${endHour}:${minutes}`);
      }
    }
  }, [event, defaultDate, defaultTime]);

  const handleSave = () => {
    if (!title || !date || !startTime || !endTime) return;

    const eventData: Event = {
      id: event?.id || Date.now().toString(),
      title,
      description,
      date,
      startTime,
      endTime,
      color,
    };

    onSave(eventData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setColor(EVENT_COLORS[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Make changes to your event details.' : 'Add a new event to your agenda.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-400 transition-colors"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? '#000' : 'transparent',
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
