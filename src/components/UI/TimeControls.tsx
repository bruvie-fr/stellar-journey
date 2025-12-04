import { useState, useEffect } from 'react';
import { Calendar, Play, Pause, RotateCcw, ChevronDown, Plus, Minus } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PRESET_DATES } from '@/data/astronomyUtils';

interface TimeControlsProps {
  date: Date;
  setDate: (date: Date) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isMobile?: boolean;
}

const SPEED_OPTIONS = [
  { value: 0.001, label: 'Real-time' },
  { value: 0.04, label: '1 hour/sec' },
  { value: 1, label: '1 day/sec' },
  { value: 7, label: '1 week/sec' },
  { value: 30, label: '1 month/sec' },
  { value: 365, label: '1 year/sec' },
];

const MONTHS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

const TimeControls = ({
  date,
  setDate,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  isMobile = false
}: TimeControlsProps) => {
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState((date.getMonth() + 1).toString().padStart(2, '0'));
  const [day, setDay] = useState(date.getDate().toString().padStart(2, '0'));
  const [hour, setHour] = useState(date.getHours().toString().padStart(2, '0'));
  const [minute, setMinute] = useState(date.getMinutes().toString().padStart(2, '0'));

  // Sync local state when date prop changes
  useEffect(() => {
    setYear(date.getFullYear());
    setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
    setDay(date.getDate().toString().padStart(2, '0'));
    setHour(date.getHours().toString().padStart(2, '0'));
    setMinute(date.getMinutes().toString().padStart(2, '0'));
  }, [date]);

  const applyDateChange = (newYear: number, newMonth: string, newDay: string, newHour: string, newMinute: string) => {
    const newDate = new Date(
      newYear,
      parseInt(newMonth) - 1,
      parseInt(newDay),
      parseInt(newHour),
      parseInt(newMinute),
      0
    );
    if (!isNaN(newDate.getTime())) {
      setDate(newDate);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    // Adjust day if needed
    const maxDays = getDaysInMonth(parseInt(newMonth), year);
    const adjustedDay = Math.min(parseInt(day), maxDays).toString().padStart(2, '0');
    setDay(adjustedDay);
    applyDateChange(year, newMonth, adjustedDay, hour, minute);
  };

  const handleDayChange = (newDay: string) => {
    setDay(newDay);
    applyDateChange(year, month, newDay, hour, minute);
  };

  const handleYearChange = (delta: number) => {
    const newYear = year + delta;
    setYear(newYear);
    // Adjust day if needed (for leap year Feb)
    const maxDays = getDaysInMonth(parseInt(month), newYear);
    const adjustedDay = Math.min(parseInt(day), maxDays).toString().padStart(2, '0');
    setDay(adjustedDay);
    applyDateChange(newYear, month, adjustedDay, hour, minute);
  };

  const handleHourChange = (newHour: string) => {
    setHour(newHour);
    applyDateChange(year, month, day, newHour, minute);
  };

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute);
    applyDateChange(year, month, day, hour, newMinute);
  };

  const handleReset = () => {
    const today = new Date();
    setDate(today);
  };

  const handlePresetSelect = (presetDate: Date) => {
    setDate(presetDate);
  };

  const formatDisplayDate = (d: Date) => {
    if (isMobile) {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      });
    }
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
    if (option) return isMobile ? option.label.split('/')[0] : option.label;
    if (currentSpeed < 1) return `${(currentSpeed * 24).toFixed(1)} hr/sec`;
    return `${currentSpeed.toFixed(0)} day/sec`;
  };

  const speedIndex = SPEED_OPTIONS.findIndex(opt => opt.value === speed);
  const sliderValue = speedIndex >= 0 ? speedIndex : 2;

  const daysInCurrentMonth = getDaysInMonth(parseInt(month), year);
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="flex items-center gap-1 bg-card/90 backdrop-blur-xl rounded-xl p-2 border border-border/50 shadow-lg shadow-primary/5 w-full">
        {/* Play/Pause */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-10 w-10 min-w-[40px] rounded-lg hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        {/* Speed Slider (compact) */}
        <div className="flex items-center gap-1 flex-1 px-2">
          <div className="w-full max-w-[80px]">
            <Slider
              value={[sliderValue]}
              onValueChange={([v]) => setSpeed(SPEED_OPTIONS[v]?.value ?? 1)}
              min={0}
              max={SPEED_OPTIONS.length - 1}
              step={1}
              className="w-full"
            />
          </div>
          <span className="text-xs font-mono text-primary whitespace-nowrap">{getSpeedLabel(speed)}</span>
        </div>
        
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/20 h-10 px-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{formatDisplayDate(date)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl z-50">
            <div className="space-y-4">
              {/* Year with +/- buttons */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Year</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleYearChange(-100)}>
                    <span className="text-xs">-100</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleYearChange(-1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => {
                      const newYear = parseInt(e.target.value) || year;
                      setYear(newYear);
                    }}
                    onBlur={() => applyDateChange(year, month, day, hour, minute)}
                    className="h-10 w-20 text-center bg-background/50"
                  />
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleYearChange(1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleYearChange(100)}>
                    <span className="text-xs">+100</span>
                  </Button>
                </div>
              </div>

              {/* Month & Day dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Month</Label>
                  <Select value={month} onValueChange={handleMonthChange}>
                    <SelectTrigger className="h-10 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Day</Label>
                  <Select value={day} onValueChange={handleDayChange}>
                    <SelectTrigger className="h-10 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50 max-h-[200px]">
                      <ScrollArea className="h-[200px]">
                        {days.map((d) => (
                          <SelectItem key={d} value={d}>{parseInt(d)}</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Hour</Label>
                  <Select value={hour} onValueChange={handleHourChange}>
                    <SelectTrigger className="h-10 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50 max-h-[200px]">
                      <ScrollArea className="h-[200px]">
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>{h}:00</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Minute</Label>
                  <Select value={minute} onValueChange={handleMinuteChange}>
                    <SelectTrigger className="h-10 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {minutes.map((m) => (
                        <SelectItem key={m} value={m}>:{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Presets */}
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Quick Presets</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(PRESET_DATES).slice(0, 4).map(([label, presetDate]) => (
                    <Button
                      key={label}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect(presetDate)}
                      className="text-xs h-8"
                    >
                      {label.split(' ')[0]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Reset */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-10 w-10 min-w-[40px] rounded-lg hover:bg-primary/20"
          title="Reset to today"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Desktop Layout
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
        <PopoverContent className="w-96 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl z-50">
          <div className="space-y-4">
            {/* Year with +/- buttons */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Year</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 px-2" onClick={() => handleYearChange(-100)}>
                  -100
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleYearChange(-1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value) || year;
                    setYear(newYear);
                  }}
                  onBlur={() => applyDateChange(year, month, day, hour, minute)}
                  className="h-9 w-24 text-center bg-background/50"
                />
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleYearChange(1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-2" onClick={() => handleYearChange(100)}>
                  +100
                </Button>
              </div>
            </div>

            {/* Month, Day, Hour, Minute dropdowns */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Month</Label>
                <Select value={month} onValueChange={handleMonthChange}>
                  <SelectTrigger className="h-9 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Day</Label>
                <Select value={day} onValueChange={handleDayChange}>
                  <SelectTrigger className="h-9 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50 max-h-[200px]">
                    <ScrollArea className="h-[200px]">
                      {days.map((d) => (
                        <SelectItem key={d} value={d}>{parseInt(d)}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Hour</Label>
                <Select value={hour} onValueChange={handleHourChange}>
                  <SelectTrigger className="h-9 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50 max-h-[200px]">
                    <ScrollArea className="h-[200px]">
                      {hours.map((h) => (
                        <SelectItem key={h} value={h}>{h}:00</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Minute</Label>
                <Select value={minute} onValueChange={handleMinuteChange}>
                  <SelectTrigger className="h-9 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>:{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
        <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border/50 shadow-xl z-50">
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