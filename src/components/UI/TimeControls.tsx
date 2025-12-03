import { useState } from 'react';
import { Calendar, Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PRESET_DATES } from '@/data/astronomyUtils';

interface TimeControlsProps {
  date: Date;
  setDate: (date: Date) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

const TimeControls = ({
  date,
  setDate,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed
}: TimeControlsProps) => {
  const [year, setYear] = useState(date.getFullYear().toString());
  const [month, setMonth] = useState((date.getMonth() + 1).toString().padStart(2, '0'));
  const [day, setDay] = useState(date.getDate().toString().padStart(2, '0'));

  const handleDateChange = () => {
    const newDate = new Date(`${year}-${month}-${day}`);
    if (!isNaN(newDate.getTime())) {
      setDate(newDate);
    }
  };

  const handleReset = () => {
    const today = new Date();
    setDate(today);
    setYear(today.getFullYear().toString());
    setMonth((today.getMonth() + 1).toString().padStart(2, '0'));
    setDay(today.getDate().toString().padStart(2, '0'));
  };

  const handlePresetSelect = (presetDate: Date) => {
    setDate(presetDate);
    setYear(presetDate.getFullYear().toString());
    setMonth((presetDate.getMonth() + 1).toString().padStart(2, '0'));
    setDay(presetDate.getDate().toString().padStart(2, '0'));
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const speedLabels = ['1x', '10x', '100x', '1000x'];

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-lg rounded-lg p-2 border border-border/50">
      {/* Play/Pause */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPlaying(!isPlaying)}
        className="h-8 w-8"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      {/* Speed Control */}
      <div className="flex items-center gap-2 px-2 border-x border-border/50">
        <span className="text-xs text-muted-foreground">Speed:</span>
        <div className="w-20">
          <Slider
            value={[Math.log10(speed)]}
            onValueChange={([v]) => setSpeed(Math.pow(10, v))}
            min={0}
            max={3}
            step={1}
            className="w-full"
          />
        </div>
        <span className="text-xs font-mono w-12">{speedLabels[Math.log10(speed)]}</span>
      </div>
      
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDisplayDate(date)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-background/95 backdrop-blur-lg border-border/50">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Month</Label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.padStart(2, '0'))}
                  onBlur={handleDateChange}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => setDay(e.target.value.padStart(2, '0'))}
                  onBlur={handleDateChange}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Year</Label>
                <Input
                  type="number"
                  min="-3000"
                  max="3000"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  onBlur={handleDateChange}
                  className="h-8"
                />
              </div>
            </div>
            <Button onClick={handleDateChange} className="w-full" size="sm">
              Go to Date
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Presets */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            Presets
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background/95 backdrop-blur-lg border-border/50">
          {Object.entries(PRESET_DATES).map(([label, presetDate]) => (
            <DropdownMenuItem
              key={label}
              onClick={() => handlePresetSelect(presetDate)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Reset */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        className="h-8 w-8"
        title="Reset to today"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TimeControls;
