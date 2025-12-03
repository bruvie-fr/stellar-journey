import { Settings, Eye, EyeOff, Orbit, Moon, Globe, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ControlPanelProps {
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showMoons: boolean;
  setShowMoons: (show: boolean) => void;
  showDwarfPlanets: boolean;
  setShowDwarfPlanets: (show: boolean) => void;
  useRealisticScale: boolean;
  setUseRealisticScale: (use: boolean) => void;
  labelSize: number;
  setLabelSize: (size: number) => void;
  isMobile?: boolean;
}

const ControlPanel = ({
  showOrbits,
  setShowOrbits,
  showMoons,
  setShowMoons,
  showDwarfPlanets,
  setShowDwarfPlanets,
  useRealisticScale,
  setUseRealisticScale,
  labelSize,
  setLabelSize,
  isMobile = false
}: ControlPanelProps) => {
  const content = (
    <div className="space-y-4">
      <h4 className="font-medium text-sm">Display Settings</h4>
      
      <div className={`flex items-center justify-between ${isMobile ? 'min-h-[44px]' : ''}`}>
        <div className="flex items-center gap-2">
          <Orbit className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="orbits" className="text-sm">Show Orbits</Label>
        </div>
        <Switch
          id="orbits"
          checked={showOrbits}
          onCheckedChange={setShowOrbits}
        />
      </div>
      
      <div className={`flex items-center justify-between ${isMobile ? 'min-h-[44px]' : ''}`}>
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="moons" className="text-sm">Show Moons</Label>
        </div>
        <Switch
          id="moons"
          checked={showMoons}
          onCheckedChange={setShowMoons}
        />
      </div>
      
      <div className={`flex items-center justify-between ${isMobile ? 'min-h-[44px]' : ''}`}>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="dwarfs" className="text-sm">Dwarf Planets</Label>
        </div>
        <Switch
          id="dwarfs"
          checked={showDwarfPlanets}
          onCheckedChange={setShowDwarfPlanets}
        />
      </div>
      
      <div className={`flex items-center justify-between ${isMobile ? 'min-h-[44px]' : ''}`}>
        <div className="flex items-center gap-2">
          {useRealisticScale ? (
            <Eye className="h-4 w-4 text-muted-foreground" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Label htmlFor="scale" className="text-sm">Realistic Scale</Label>
        </div>
        <Switch
          id="scale"
          checked={useRealisticScale}
          onCheckedChange={setUseRealisticScale}
        />
      </div>
      
      <div className="space-y-2 pt-2 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm">Label Size</Label>
          </div>
          <span className="text-xs text-muted-foreground">{labelSize}px</span>
        </div>
        <Slider
          value={[labelSize]}
          onValueChange={([value]) => setLabelSize(value)}
          min={10}
          max={200}
          step={2}
          className="w-full"
        />
      </div>
    </div>
  );

  // Mobile: render content directly
  if (isMobile) {
    return (
      <div className="bg-background/50 rounded-lg p-4 border border-border/30">
        {content}
      </div>
    );
  }

  // Desktop: render in popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-lg border-border/50"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 bg-background/95 backdrop-blur-lg border-border/50"
        align="end"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default ControlPanel;
