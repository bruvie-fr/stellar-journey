import { CelestialBody, SCALE, VISIBILITY_SCALE } from './celestialBodies';

// Calculate the mean anomaly for a given date
export const getMeanAnomaly = (
  orbitalPeriod: number,
  date: Date,
  epoch: Date = new Date('2000-01-01T12:00:00Z')
): number => {
  const daysSinceEpoch = (date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24);
  const meanAnomaly = (360 * daysSinceEpoch) / Math.abs(orbitalPeriod);
  return meanAnomaly % 360;
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

// Get orbital position in 3D space
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

  // Calculate distance from focus
  // Use MOON_DISTANCE scale for moons to make them visible around planets
  const a = body.type === 'moon' 
    ? body.distanceFromSun * SCALE.MOON_DISTANCE
    : body.distanceFromSun * SCALE.DISTANCE;
  
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

// Get the visual size for rendering
export const getVisualSize = (body: CelestialBody, useRealisticScale: boolean): number => {
  const baseSize = body.radius * SCALE.SIZE;
  
  if (useRealisticScale) {
    return baseSize * 100; // Still need some scaling for visibility
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
