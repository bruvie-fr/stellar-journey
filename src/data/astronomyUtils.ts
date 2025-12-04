import { CelestialBody, SCALE, VISIBILITY_SCALE } from './celestialBodies';

// Calculate the mean anomaly for a given date
export const getMeanAnomaly = (
  orbitalPeriod: number,
  date: Date,
  epoch: Date = new Date('2000-01-01T12:00:00Z')
): number => {
  const daysSinceEpoch = (date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24);
  const meanAnomaly = (360 * daysSinceEpoch) / Math.abs(orbitalPeriod);
  return ((meanAnomaly % 360) + 360) % 360; // Normalize to 0-360
};

// Calculate eccentric anomaly using Newton's method
export const getEccentricAnomaly = (meanAnomaly: number, eccentricity: number): number => {
  const M = (meanAnomaly * Math.PI) / 180;
  let E = M;
  for (let i = 0; i < 10; i++) {
    E = M + eccentricity * Math.sin(E);
  }
  return E;
};

// Calculate true anomaly from eccentric anomaly
export const getTrueAnomaly = (eccentricAnomaly: number, eccentricity: number): number => {
  const E = eccentricAnomaly;
  const e = eccentricity;
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );
  return trueAnomaly;
};

// Get true anomaly in degrees for a body at a given date
export const getTrueAnomalyDegrees = (body: CelestialBody, date: Date): number => {
  if (body.id === 'sun') return 0;
  const meanAnomaly = getMeanAnomaly(body.orbitalPeriod, date);
  const eccentricAnomaly = getEccentricAnomaly(meanAnomaly, body.eccentricity);
  const trueAnomaly = getTrueAnomaly(eccentricAnomaly, body.eccentricity);
  const degrees = (trueAnomaly * 180) / Math.PI;
  return ((degrees % 360) + 360) % 360;
};

// Get mean anomaly in degrees for display
export const getMeanAnomalyDegrees = (body: CelestialBody, date: Date): number => {
  if (body.id === 'sun') return 0;
  return getMeanAnomaly(body.orbitalPeriod, date);
};

// Calculate ecliptic longitude (heliocentric longitude)
export const getEclipticLongitude = (body: CelestialBody, date: Date): number => {
  if (body.id === 'sun') return 0;
  
  // Simplified calculation - true anomaly + argument of perihelion
  const trueAnomaly = getTrueAnomalyDegrees(body, date);
  // Approximate argument of perihelion based on body
  const argumentOfPerihelion = getArgumentOfPerihelion(body.id);
  
  return ((trueAnomaly + argumentOfPerihelion) % 360 + 360) % 360;
};

// Get argument of perihelion for planets (in degrees)
export const getArgumentOfPerihelion = (bodyId: string): number => {
  const values: Record<string, number> = {
    mercury: 29.12,
    venus: 54.85,
    earth: 114.21,
    mars: 286.50,
    jupiter: 273.87,
    saturn: 339.39,
    uranus: 96.99,
    neptune: 273.19,
    pluto: 113.76,
    ceres: 73.60,
    eris: 151.43,
    makemake: 297.24,
    haumea: 239.18,
  };
  return values[bodyId] || 0;
};

// Get longitude of ascending node for planets (in degrees)
export const getLongitudeOfAscendingNode = (bodyId: string): number => {
  const values: Record<string, number> = {
    mercury: 48.33,
    venus: 76.68,
    earth: 348.74,
    mars: 49.56,
    jupiter: 100.46,
    saturn: 113.64,
    uranus: 74.01,
    neptune: 131.78,
    pluto: 110.30,
    ceres: 80.33,
    eris: 35.87,
    makemake: 79.38,
    haumea: 121.90,
  };
  return values[bodyId] || 0;
};

// Get orbital position in 3D space with collision prevention
export const getOrbitalPosition = (
  body: CelestialBody,
  date: Date,
  parentPosition: [number, number, number] = [0, 0, 0]
): [number, number, number] => {
  if (body.id === 'sun') {
    return [0, 0, 0];
  }

  const meanAnomaly = getMeanAnomaly(body.orbitalPeriod, date);
  const eccentricAnomaly = getEccentricAnomaly(meanAnomaly, body.eccentricity);
  const trueAnomaly = getTrueAnomaly(eccentricAnomaly, body.eccentricity);

  // Calculate distance from focus with collision prevention for moons
  let a: number;
  if (body.type === 'moon') {
    // Base distance for moon
    a = body.distanceFromSun * SCALE.MOON_DISTANCE;
    
    // Ensure minimum safe distance based on visual sizes
    const moonScale = VISIBILITY_SCALE[body.id] || 200;
    const parentScale = VISIBILITY_SCALE[body.parentId || ''] || 100;
    const minSafeDistance = (moonScale + parentScale) * body.radius * SCALE.SIZE * 3;
    
    if (a < minSafeDistance) {
      a = minSafeDistance;
    }
  } else {
    a = body.distanceFromSun * SCALE.DISTANCE;
  }
  
  const r = a * (1 - body.eccentricity * Math.cos(eccentricAnomaly));

  // Calculate position in orbital plane
  // For retrograde orbits (negative period), reverse direction
  const direction = body.orbitalPeriod < 0 ? -1 : 1;
  const x = r * Math.cos(trueAnomaly * direction);
  const z = r * Math.sin(trueAnomaly * direction);

  // Apply inclination
  const inclRad = (body.inclination * Math.PI) / 180;
  const y = z * Math.sin(inclRad);
  const zFinal = z * Math.cos(inclRad);

  return [
    x + parentPosition[0],
    y + parentPosition[1],
    zFinal + parentPosition[2]
  ];
};

// Get the visual size for rendering with collision-safe constraints
export const getVisualSize = (body: CelestialBody, useRealisticScale: boolean): number => {
  const baseSize = body.radius * SCALE.SIZE;
  
  if (useRealisticScale) {
    return baseSize * 100;
  }
  
  const multiplier = VISIBILITY_SCALE[body.id] || 100;
  return baseSize * multiplier;
};

// Calculate distance between two bodies in AU
export const getDistanceBetween = (
  pos1: [number, number, number],
  pos2: [number, number, number]
): number => {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz) / SCALE.DISTANCE;
};

// Format distance for display
export const formatDistance = (distanceAU: number): string => {
  if (distanceAU < 0.01) {
    const km = distanceAU * 149597870.7;
    return `${km.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;
  }
  return `${distanceAU.toFixed(3)} AU`;
};

// Format large numbers with scientific notation
export const formatScientific = (num: number): string => {
  if (num >= 1e10) {
    return num.toExponential(2);
  }
  return num.toLocaleString();
};

// Convert date to Julian Date
export const toJulianDate = (date: Date): number => {
  return date.getTime() / 86400000 + 2440587.5;
};

// Get day of year (1-365)
const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Calculate the subsolar point (where Sun is directly overhead on Earth)
export const getSubsolarPoint = (date: Date): { latitude: number; longitude: number } => {
  // Get UTC time components
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();
  
  // Calculate solar longitude (where it's solar noon)
  // At 12:00 UTC, solar noon is at 0° longitude
  // Earth rotates 15° per hour
  const decimalHours = utcHours + utcMinutes / 60 + utcSeconds / 3600;
  let solarLongitude = (12 - decimalHours) * 15;
  
  // Normalize to -180 to 180
  while (solarLongitude > 180) solarLongitude -= 360;
  while (solarLongitude < -180) solarLongitude += 360;
  
  // Calculate solar declination (latitude where Sun is overhead)
  // This varies between +23.44° (summer solstice) and -23.44° (winter solstice)
  const dayOfYear = getDayOfYear(date);
  // Day 172 is approximately June 21 (summer solstice in Northern Hemisphere)
  const solarLatitude = 23.44 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
  
  return {
    latitude: solarLatitude,
    longitude: solarLongitude
  };
};

// Region data with coordinates (center lat/lon for spherical calculation)
const REGIONS: { name: string; lon: number; lat: number }[] = [
  // Asia
  { name: 'Japan', lon: 138, lat: 36 },
  { name: 'China', lon: 104, lat: 35 },
  { name: 'India', lon: 79, lat: 21 },
  { name: 'Indonesia', lon: 118, lat: -2 },
  { name: 'Bhutan', lon: 90.4, lat: 27.5 },
  { name: 'Nepal', lon: 84, lat: 28 },
  { name: 'Bangladesh', lon: 90, lat: 24 },
  { name: 'Thailand', lon: 101, lat: 13 },
  { name: 'Vietnam', lon: 106, lat: 16 },
  { name: 'Philippines', lon: 122, lat: 13 },
  { name: 'South Korea', lon: 128, lat: 36 },
  // Oceania
  { name: 'Australia', lon: 134, lat: -25 },
  { name: 'New Zealand', lon: 172, lat: -41 },
  // Europe
  { name: 'UK', lon: -2, lat: 54 },
  { name: 'France', lon: 2, lat: 46 },
  { name: 'Germany', lon: 10, lat: 51 },
  { name: 'Spain', lon: -4, lat: 40 },
  { name: 'Italy', lon: 12, lat: 42 },
  { name: 'Poland', lon: 19, lat: 52 },
  { name: 'Russia', lon: 100, lat: 60 },
  // Middle East
  { name: 'Middle East', lon: 45, lat: 29 },
  // Africa
  { name: 'West Africa', lon: -5, lat: 10 },
  { name: 'East Africa', lon: 37, lat: 1 },
  { name: 'South Africa', lon: 25, lat: -29 },
  { name: 'Egypt', lon: 30, lat: 27 },
  // Americas
  { name: 'Eastern US', lon: -77, lat: 39 },
  { name: 'Central US', lon: -95, lat: 39 },
  { name: 'Western US', lon: -118, lat: 37 },
  { name: 'Canada', lon: -106, lat: 56 },
  { name: 'Mexico', lon: -102, lat: 23 },
  { name: 'Brazil', lon: -52, lat: -14 },
  { name: 'Argentina', lon: -64, lat: -34 },
  { name: 'Hawaii', lon: -157, lat: 20 },
  { name: 'Alaska', lon: -153, lat: 64 },
];

// Calculate angular distance using Haversine formula (great-circle distance in degrees)
const getAngularDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return c * 180 / Math.PI; // Return in degrees
};

// Get regions currently in daylight, twilight, and night using spherical geometry
export const getSunlitRegions = (date: Date): { daylight: string[]; twilight: string[]; night: string[] } => {
  const subsolar = getSubsolarPoint(date);
  const daylight: string[] = [];
  const twilight: string[] = [];
  const night: string[] = [];
  
  REGIONS.forEach(region => {
    // Calculate great-circle angular distance from subsolar point
    const angularDist = getAngularDistance(
      subsolar.latitude, 
      subsolar.longitude, 
      region.lat, 
      region.lon
    );
    
    // Day/night terminator is at 90° from subsolar point
    // Civil twilight extends to ~96° (sun 6° below horizon)
    if (angularDist < 90) {
      daylight.push(region.name);
    } else if (angularDist < 96) {
      twilight.push(region.name);
    } else {
      night.push(region.name);
    }
  });
  
  return { daylight, twilight, night };
};

// Preset dates for quick navigation
export const PRESET_DATES = {
  'Today': new Date(),
  'Moon Landing (1969)': new Date('1969-07-20'),
  'Voyager 1 Launch (1977)': new Date('1977-09-05'),
  'Pluto Flyby (2015)': new Date('2015-07-14'),
  'Mars 2020': new Date('2020-07-30'),
  'Year 2050': new Date('2050-01-01'),
  'Year 2100': new Date('2100-01-01'),
};
