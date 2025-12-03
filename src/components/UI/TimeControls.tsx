import { useState, useEffect } from 'react';
import { Calendar, Play, Pause, RotateCcw, ChevronDown, Clock } from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PRESET_DATES } from '@/data/astronomyUtils';

interface TimeControlsProps {
  date: Date;
  setDate: (date: Date) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

const SPEED_OPTIONS = [
  { value: 0.001, label: 'Real-time' },
  { value: 0.04, label: '1 hour/sec' },
  { value: 1, label: '1 day/sec' },
  { value: 7, label: '1 week/sec' },
  { value: 30, label: '1 month/sec' },
  { value: 365, label: '1 year/sec' },
];

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
  const [hour, setHour] = useState(date.getHours().toString().padStart(2, '0'));
  const [minute, setMinute] = useState(date.getMinutes().toString().padStart(2, '0'));
  const [second, setSecond] = useState(date.getSeconds().toString().padStart(2, '0'));
  const [showTime, setShowTime] = useState(false);

  // Sync local state when date prop changes
  useEffect(() => {
    setYear(date.getFullYear().toString());
    setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
    setDay(date.getDate().toString().padStart(2, '0'));
    setHour(date.getHours().toString().padStart(2, '0'));
    setMinute(date.getMinutes().toString().padStart(2, '0'));
    setSecond(date.getSeconds().toString().padStart(2, '0'));
  }, [date]);

  const handleDateChange = () => {
    const newDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
    if (!isNaN(newDate.getTime())) {
      setDate(newDate);
    }
  };

  const handleReset = () => {
    const today = new Date();
    setDate(today);
  };

  const handlePresetSelect = (presetDate: Date) => {
    setDate(presetDate);
  };

  const formatDisplayDate = (d: Date) => {
    const dateStr = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${dateStr} ${timeStr}`;
  };

  const getSpeedLabel = (currentSpeed: number) => {
    const option = SPEED_OPTIONS.find(opt => Math.abs(opt.value - currentSpeed) < 0.001);
    if (option) return option.label;
    if (currentSpeed < 1) return `${(currentSpeed * 24).toFixed(1)} hr/sec`;
    return `${currentSpeed.toFixed(0)} day/sec`;
  };

  const speedIndex = SPEED_OPTIONS.findIndex(opt => opt.value === speed);
  const sliderValue = speedIndex >= 0 ? speedIndex : 2;

  return (
    <div className="flex items-center gap-2 bg-card/90 backdrop-blur-xl rounded-xl p-3 border border-border/50 shadow-lg shadow-primary/5">
      {/* Play/Pause */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPlaying(!isPlaying)}
        className="h-9 w-9 rounded-lg hover:bg-primary/20 transition-colors"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      {/* Speed Control */}
      <div className="flex items-center gap-2 px-3 border-x border-border/30">
        <span className="text-xs text-muted-foreground font-medium">Speed:</span>
        <div className="w-24">
          <Slider
            value={[sliderValue]}
            onValueChange={([v]) => setSpeed(SPEED_OPTIONS[v]?.value ?? 1)}
            min={0}
            max={SPEED_OPTIONS.length - 1}
            step={1}
            className="w-full"
          />
        </div>
        <span className="text-xs font-mono w-20 text-primary">{getSpeedLabel(speed)}</span>
      </div>
      
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/20">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{formatDisplayDate(date)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
          <div className="space-y-4">
            {/* Date inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Month</Label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.padStart(2, '0'))}
                  onBlur={handleDateChange}
                  className="h-9 bg-background/50"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(e) => setDay(e.target.value.padStart(2, '0'))}
                  onBlur={handleDateChange}
                  className="h-9 bg-background/50"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Year</Label>
                <Input
                  type="number"
                  min="-3000"
                  max="3000"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  onBlur={handleDateChange}
                  className="h-9 bg-background/50"
                />
              </div>
            </div>

            {/* Time inputs (collapsible) */}
            <Collapsible open={showTime} onOpenChange={setShowTime}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:text-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">Precise Time</span>
                  </div>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showTime ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Hour</Label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={hour}
                      onChange={(e) => setHour(e.target.value.padStart(2, '0'))}
                      onBlur={handleDateChange}
                      className="h-9 bg-background/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
                      onBlur={handleDateChange}
                      className="h-9 bg-background/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Sec</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={second}
                      onChange={(e) => setSecond(e.target.value.padStart(2, '0'))}
                      onBlur={handleDateChange}
                      className="h-9 bg-background/50"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button onClick={handleDateChange} className="w-full bg-primary/90 hover:bg-primary" size="sm">
              Go to Date
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Presets */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/20">
            Presets
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
          {Object.entries(PRESET_DATES).map(([label, presetDate]) => (
            <DropdownMenuItem
              key={label}
              onClick={() => handlePresetSelect(presetDate)}
              className="cursor-pointer hover:bg-primary/20"
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
        className="h-9 w-9 rounded-lg hover:bg-primary/20"
        title="Reset to today"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TimeControls;