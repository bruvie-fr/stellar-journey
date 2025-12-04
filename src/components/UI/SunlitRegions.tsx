import { useMemo } from 'react';
import { Sun, Globe, Sunrise, Sunset } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSubsolarPoint, getSunlitRegions } from '@/data/astronomyUtils';

interface SunlitRegionsProps {
  date: Date;
  isMobile?: boolean;
}

const SunlitRegions = ({ date, isMobile = false }: SunlitRegionsProps) => {
  const subsolarPoint = useMemo(() => getSubsolarPoint(date), [date]);
  const regions = useMemo(() => getSunlitRegions(date), [date]);

  const formatCoordinate = (value: number, type: 'lat' | 'lon') => {
    const abs = Math.abs(value);
    const dir = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    return `${abs.toFixed(1)}°${dir}`;
  };

  return (
    <Card className={`bg-background/90 backdrop-blur-lg border-border/50 shadow-xl ${isMobile ? 'w-full' : 'w-64'}`}>
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          Sunlit Regions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-3 pb-3 space-y-3">
        {/* Subsolar Point */}
        <div className="bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/20">
          <p className="text-xs text-muted-foreground mb-1">Sun directly overhead at:</p>
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3 text-yellow-500" />
            <span className="text-sm font-mono font-medium">
              {formatCoordinate(subsolarPoint.latitude, 'lat')}, {formatCoordinate(subsolarPoint.longitude, 'lon')}
            </span>
          </div>
        </div>

        {/* Daylight Regions */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sunrise className="h-3 w-3" />
            Currently in daylight:
          </p>
          <div className="flex flex-wrap gap-1">
            {regions.daylight.slice(0, isMobile ? 4 : 6).map((region) => (
              <Badge 
                key={region} 
                variant="outline" 
                className="text-xs bg-yellow-500/10 text-yellow-200 border-yellow-500/30"
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Twilight Regions */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sunset className="h-3 w-3" />
            Twilight zones:
          </p>
          <div className="flex flex-wrap gap-1">
            {regions.twilight.slice(0, isMobile ? 3 : 4).map((region) => (
              <Badge 
                key={region} 
                variant="outline" 
                className="text-xs bg-orange-500/10 text-orange-200 border-orange-500/30"
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Night Regions */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Currently in darkness:</p>
          <div className="flex flex-wrap gap-1">
            {regions.night.slice(0, isMobile ? 3 : 4).map((region) => (
              <Badge 
                key={region} 
                variant="outline" 
                className="text-xs bg-slate-500/10 text-slate-300 border-slate-500/30"
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Day/Night Visualization */}
        <div className="mt-2 pt-2 border-t border-border/30">
          <div className="h-3 rounded-full overflow-hidden bg-slate-800 relative">
            {/* Daylight band - render two segments to handle wrap-around */}
            {(() => {
              // Center of daylight is at subsolar longitude, spans ~180° (90° each side)
              const centerPercent = ((subsolarPoint.longitude + 180) / 360) * 100;
              const halfWidth = 25; // 25% = 90° of longitude
              
              const leftEdge = centerPercent - halfWidth;
              const rightEdge = centerPercent + halfWidth;
              
              // Handle wrap-around at edges
              if (leftEdge < 0) {
                // Wraps around the left side (180°W)
                return (
                  <>
                    <div 
                      className="absolute top-0 h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-400"
                      style={{ left: 0, width: `${rightEdge}%` }}
                    />
                    <div 
                      className="absolute top-0 h-full bg-gradient-to-l from-orange-400 via-yellow-400 to-yellow-400"
                      style={{ left: `${100 + leftEdge}%`, width: `${-leftEdge}%` }}
                    />
                  </>
                );
              } else if (rightEdge > 100) {
                // Wraps around the right side (180°E)
                return (
                  <>
                    <div 
                      className="absolute top-0 h-full bg-gradient-to-r from-yellow-400 via-yellow-400 to-orange-400"
                      style={{ left: `${leftEdge}%`, width: `${100 - leftEdge}%` }}
                    />
                    <div 
                      className="absolute top-0 h-full bg-gradient-to-l from-yellow-400 via-yellow-400 to-orange-400"
                      style={{ left: 0, width: `${rightEdge - 100}%` }}
                    />
                  </>
                );
              } else {
                // No wrap-around needed
                return (
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400"
                    style={{ left: `${leftEdge}%`, width: `${halfWidth * 2}%` }}
                  />
                );
              }
            })()}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>180°W</span>
            <span>0°</span>
            <span>180°E</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SunlitRegions;
