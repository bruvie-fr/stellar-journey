import { X, Compass, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CelestialBody } from '@/data/celestialBodies';
import { 
  formatDistance, 
  formatScientific, 
  getDistanceBetween, 
  getOrbitalPosition,
  getTrueAnomalyDegrees,
  getMeanAnomalyDegrees,
  getEclipticLongitude,
  getArgumentOfPerihelion,
  getLongitudeOfAscendingNode
} from '@/data/astronomyUtils';

interface InfoPanelProps {
  body: CelestialBody;
  date: Date;
  onClose: () => void;
  isMobile?: boolean;
}

const InfoPanel = ({ body, date, onClose, isMobile = false }: InfoPanelProps) => {
  const position = getOrbitalPosition(body, date);
  const earthPosition = getOrbitalPosition(
    { id: 'earth', distanceFromSun: 1, orbitalPeriod: 365.25, eccentricity: 0.0167, inclination: 0, type: 'planet' } as CelestialBody,
    date
  );
  const distanceFromEarth = body.id !== 'earth' ? getDistanceBetween(position, earthPosition) : 0;

  // Get orbital degree data
  const trueAnomaly = getTrueAnomalyDegrees(body, date);
  const meanAnomaly = getMeanAnomalyDegrees(body, date);
  const eclipticLongitude = getEclipticLongitude(body, date);
  const argumentOfPerihelion = getArgumentOfPerihelion(body.id);
  const longitudeOfAscendingNode = getLongitudeOfAscendingNode(body.id);

  const typeColors = {
    star: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    planet: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    'dwarf-planet': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    moon: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
  };

  return (
    <Card className={`bg-background/90 backdrop-blur-lg border-border/50 text-foreground shadow-xl ${
      isMobile ? 'w-full max-h-[60vh] overflow-y-auto' : 'w-80'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{body.name}</CardTitle>
            <Badge variant="outline" className={`mt-1 ${typeColors[body.type]}`}>
              {body.type.replace('-', ' ')}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 min-h-[44px] min-w-[44px]">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{body.description}</p>
        
        <Separator className="bg-border/50" />
        
        {/* Physical Properties */}
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
        
        {/* Orbital Data Section */}
        {body.type !== 'star' && (
          <>
            <Separator className="bg-border/50" />
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Orbital Position</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-primary/10 rounded-lg p-2">
                  <p className="text-muted-foreground text-xs">True Anomaly</p>
                  <p className="font-semibold text-primary">{trueAnomaly.toFixed(2)}°</p>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-2">
                  <p className="text-muted-foreground text-xs">Mean Anomaly</p>
                  <p className="font-semibold text-primary">{meanAnomaly.toFixed(2)}°</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-xs">Ecliptic Longitude</p>
                  <p className="font-semibold">{eclipticLongitude.toFixed(2)}°</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-xs">Orbital Inclination</p>
                  <p className="font-semibold">{body.inclination.toFixed(2)}°</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-xs">Eccentricity</p>
                  <p className="font-semibold">{body.eccentricity.toFixed(4)}</p>
                </div>
                
                {argumentOfPerihelion > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Arg. of Perihelion</p>
                    <p className="font-semibold">{argumentOfPerihelion.toFixed(2)}°</p>
                  </div>
                )}
                
                {longitudeOfAscendingNode > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Long. Asc. Node</p>
                    <p className="font-semibold">{longitudeOfAscendingNode.toFixed(2)}°</p>
                  </div>
                )}
              </div>
              
              {/* Visual orbital position indicator */}
              <div className="mt-3 relative">
                <div className="w-full h-20 relative">
                  {/* Orbit ellipse */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border border-border/50 rounded-full relative">
                      {/* Sun at focus */}
                      <div className="absolute w-2 h-2 bg-yellow-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-yellow-500/50" />
                      
                      {/* Planet position */}
                      <div 
                        className="absolute w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
                        style={{
                          top: `${50 - Math.sin(trueAnomaly * Math.PI / 180) * 45}%`,
                          left: `${50 + Math.cos(trueAnomaly * Math.PI / 180) * 45}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                    <span>0°</span>
                    <span>Current: {trueAnomaly.toFixed(1)}°</span>
                    <span>360°</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
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
