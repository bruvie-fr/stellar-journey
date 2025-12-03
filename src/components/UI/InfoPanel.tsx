import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CelestialBody } from '@/data/celestialBodies';
import { formatDistance, formatScientific, getDistanceBetween, getOrbitalPosition } from '@/data/astronomyUtils';

interface InfoPanelProps {
  body: CelestialBody;
  date: Date;
  onClose: () => void;
}

const InfoPanel = ({ body, date, onClose }: InfoPanelProps) => {
  const position = getOrbitalPosition(body, date);
  const earthPosition = getOrbitalPosition(
    { id: 'earth', distanceFromSun: 1, orbitalPeriod: 365.25, eccentricity: 0.0167, inclination: 0, type: 'planet' } as CelestialBody,
    date
  );
  const distanceFromEarth = body.id !== 'earth' ? getDistanceBetween(position, earthPosition) : 0;

  const typeColors = {
    star: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    planet: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    'dwarf-planet': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    moon: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
  };

  return (
    <Card className="w-80 bg-background/90 backdrop-blur-lg border-border/50 text-foreground shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{body.name}</CardTitle>
            <Badge variant="outline" className={`mt-1 ${typeColors[body.type]}`}>
              {body.type.replace('-', ' ')}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{body.description}</p>
        
        <Separator className="bg-border/50" />
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          {body.id !== 'earth' && body.type !== 'star' && (
            <div>
              <p className="text-muted-foreground text-xs">Distance from Earth</p>
              <p className="font-semibold text-primary">{formatDistance(distanceFromEarth)}</p>
            </div>
          )}
          
          {body.type !== 'star' && body.type !== 'moon' && (
            <div>
              <p className="text-muted-foreground text-xs">Distance from Sun</p>
              <p className="font-semibold">{body.distanceFromSun.toFixed(2)} AU</p>
            </div>
          )}
          
          <div>
            <p className="text-muted-foreground text-xs">Radius</p>
            <p className="font-semibold">{body.radius.toLocaleString()} km</p>
          </div>
          
          <div>
            <p className="text-muted-foreground text-xs">Mass</p>
            <p className="font-semibold">{formatScientific(body.mass)} kg</p>
          </div>
          
          <div>
            <p className="text-muted-foreground text-xs">Temperature</p>
            <p className="font-semibold">
              {body.temperature.min === body.temperature.max
                ? `${body.temperature.min}°C`
                : `${body.temperature.min} to ${body.temperature.max}°C`}
            </p>
          </div>
          
          {body.orbitalPeriod > 0 && (
            <div>
              <p className="text-muted-foreground text-xs">Orbital Period</p>
              <p className="font-semibold">
                {body.orbitalPeriod < 365
                  ? `${body.orbitalPeriod.toFixed(1)} days`
                  : `${(body.orbitalPeriod / 365.25).toFixed(1)} years`}
              </p>
            </div>
          )}
          
          <div>
            <p className="text-muted-foreground text-xs">Day Length</p>
            <p className="font-semibold">
              {Math.abs(body.rotationPeriod) < 48
                ? `${Math.abs(body.rotationPeriod).toFixed(1)} hours`
                : `${(Math.abs(body.rotationPeriod) / 24).toFixed(1)} Earth days`}
            </p>
          </div>
          
          <div>
            <p className="text-muted-foreground text-xs">Axial Tilt</p>
            <p className="font-semibold">{body.axialTilt.toFixed(1)}°</p>
          </div>
        </div>
        
        <Separator className="bg-border/50" />
        
        <div>
          <p className="text-xs text-muted-foreground mb-2">Did you know?</p>
          <ul className="space-y-1">
            {body.facts.slice(0, 3).map((fact, index) => (
              <li key={index} className="text-xs flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
