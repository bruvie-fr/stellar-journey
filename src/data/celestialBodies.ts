export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'dwarf-planet' | 'moon';
  parentId?: string;
  color: string;
  radius: number; // km
  mass: number; // kg
  distanceFromSun: number; // AU (for planets) or km (for moons from parent)
  orbitalPeriod: number; // Earth days
  rotationPeriod: number; // Earth hours
  axialTilt: number; // degrees
  temperature: { min: number; max: number }; // Celsius
  eccentricity: number;
  inclination: number; // degrees
  hasRings?: boolean;
  texture?: string;
  description: string;
  facts: string[];
}

// Scale factors for visualization
export const SCALE = {
  DISTANCE: 30, // AU to scene units (increased for realistic spacing)
  SIZE: 0.00001, // km to scene units
  MOON_DISTANCE: 0.00008, // km to scene units for moons (increased for better separation)
  TIME: 1,
};

// Visibility scale multipliers (adjusted to prevent overlapping)
export const VISIBILITY_SCALE: Record<string, number> = {
  sun: 0.3,
  mercury: 120,
  venus: 80,
  earth: 80,
  mars: 100,
  jupiter: 15,
  saturn: 18,
  uranus: 30,
  neptune: 30,
  pluto: 250,
  ceres: 350,
  eris: 250,
  makemake: 300,
  haumea: 300,
  // Earth's Moon - reduced to prevent collision
  moon: 120,
  // Mars moons - reduced
  phobos: 500,
  deimos: 600,
  // Jupiter moons - reduced
  io: 120,
  europa: 120,
  ganymede: 100,
  callisto: 100,
  // Saturn moons - reduced
  titan: 100,
  enceladus: 250,
  mimas: 350,
  rhea: 180,
  dione: 220,
  iapetus: 180,
  // Uranus moons
  miranda: 300,
  ariel: 220,
  umbriel: 220,
  titania: 180,
  oberon: 180,
  // Neptune moons
  triton: 150,
};

// Get visual size helper
export const getVisualSize = (body: CelestialBody, useRealisticScale: boolean): number => {
  const baseSize = body.radius * SCALE.SIZE;
  
  if (useRealisticScale) {
    return baseSize * 100;
  }
  
  const multiplier = VISIBILITY_SCALE[body.id] || 100;
  return baseSize * multiplier;
};

export const SUN: CelestialBody = {
  id: 'sun',
  name: 'Sun',
  type: 'star',
  color: '#FDB813',
  radius: 696340,
  mass: 1.989e30,
  distanceFromSun: 0,
  orbitalPeriod: 0,
  rotationPeriod: 609.12,
  axialTilt: 7.25,
  temperature: { min: 5500, max: 5500 },
  eccentricity: 0,
  inclination: 0,
  description: 'The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma.',
  facts: [
    'Contains 99.86% of the Solar System\'s mass',
    'About 4.6 billion years old',
    'Takes 225-250 million years to orbit the Milky Way',
    'Core temperature reaches 15 million °C'
  ]
};

export const PLANETS: CelestialBody[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    color: '#B5B5B5',
    radius: 2439.7,
    mass: 3.301e23,
    distanceFromSun: 0.387,
    orbitalPeriod: 87.97,
    rotationPeriod: 1407.6,
    axialTilt: 0.034,
    temperature: { min: -180, max: 430 },
    eccentricity: 0.2056,
    inclination: 7.0,
    description: 'Mercury is the smallest planet in our Solar System and closest to the Sun.',
    facts: [
      'No atmosphere to retain heat',
      'Most cratered planet in the Solar System',
      'One day on Mercury = 59 Earth days',
      'Has a large iron core'
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    color: '#E6C229',
    radius: 6051.8,
    mass: 4.867e24,
    distanceFromSun: 0.723,
    orbitalPeriod: 224.7,
    rotationPeriod: -5832.5,
    axialTilt: 177.4,
    temperature: { min: 462, max: 462 },
    eccentricity: 0.0067,
    inclination: 3.4,
    description: 'Venus is the second planet from the Sun and the hottest planet in our Solar System.',
    facts: [
      'Rotates backwards compared to most planets',
      'Day is longer than its year',
      'Surface pressure is 90x Earth\'s',
      'Called Earth\'s "sister planet"'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    color: '#6B93D6',
    radius: 6371,
    mass: 5.972e24,
    distanceFromSun: 1.0,
    orbitalPeriod: 365.25,
    rotationPeriod: 23.93,
    axialTilt: 23.44,
    temperature: { min: -89, max: 57 },
    eccentricity: 0.0167,
    inclination: 0,
    description: 'Earth is the third planet from the Sun and the only known planet to harbor life.',
    facts: [
      'Only planet not named after a god',
      '71% of surface is water',
      'Has a powerful magnetic field',
      'Orbits Sun at 107,000 km/h'
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    color: '#C1440E',
    radius: 3389.5,
    mass: 6.39e23,
    distanceFromSun: 1.524,
    orbitalPeriod: 687,
    rotationPeriod: 24.62,
    axialTilt: 25.19,
    temperature: { min: -125, max: 20 },
    eccentricity: 0.0934,
    inclination: 1.85,
    description: 'Mars is the fourth planet from the Sun, often called the "Red Planet".',
    facts: [
      'Has the tallest volcano in the Solar System (Olympus Mons)',
      'Has two small moons: Phobos and Deimos',
      'A year on Mars is 687 Earth days',
      'Has seasons like Earth'
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    color: '#D8CA9D',
    radius: 69911,
    mass: 1.898e27,
    distanceFromSun: 5.203,
    orbitalPeriod: 4333,
    rotationPeriod: 9.93,
    axialTilt: 3.13,
    temperature: { min: -145, max: -145 },
    eccentricity: 0.0489,
    inclination: 1.3,
    description: 'Jupiter is the largest planet in our Solar System, a gas giant with a Great Red Spot.',
    facts: [
      'Could fit 1,300 Earths inside it',
      'Has at least 95 known moons',
      'Great Red Spot is a storm lasting 400+ years',
      'Has the shortest day of all planets'
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    color: '#F4D59E',
    radius: 58232,
    mass: 5.683e26,
    distanceFromSun: 9.537,
    orbitalPeriod: 10759,
    rotationPeriod: 10.7,
    axialTilt: 26.73,
    temperature: { min: -178, max: -178 },
    eccentricity: 0.0565,
    inclination: 2.49,
    hasRings: true,
    description: 'Saturn is the sixth planet from the Sun, famous for its stunning ring system.',
    facts: [
      'Rings are mostly ice and rock',
      'Least dense planet - would float on water',
      'Has 146 known moons',
      'Winds can reach 1,800 km/h'
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    color: '#D1E7E7',
    radius: 25362,
    mass: 8.681e25,
    distanceFromSun: 19.191,
    orbitalPeriod: 30687,
    rotationPeriod: -17.24,
    axialTilt: 97.77,
    temperature: { min: -224, max: -224 },
    eccentricity: 0.0457,
    inclination: 0.77,
    hasRings: true,
    description: 'Uranus is the seventh planet from the Sun, an ice giant that rotates on its side.',
    facts: [
      'Rotates on its side at 98° tilt',
      'First planet discovered with telescope',
      'Has 27 known moons',
      'Named after Greek god of the sky'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    color: '#5B5DDF',
    radius: 24622,
    mass: 1.024e26,
    distanceFromSun: 30.069,
    orbitalPeriod: 60190,
    rotationPeriod: 16.11,
    axialTilt: 28.32,
    temperature: { min: -218, max: -218 },
    eccentricity: 0.0113,
    inclination: 1.77,
    hasRings: true,
    description: 'Neptune is the eighth and farthest planet from the Sun, known for its vivid blue color.',
    facts: [
      'Has the strongest winds in the Solar System',
      'Takes 165 years to orbit the Sun',
      'Discovered through mathematical predictions',
      'Has 16 known moons'
    ]
  }
];

export const DWARF_PLANETS: CelestialBody[] = [
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'dwarf-planet',
    color: '#D2B48C',
    radius: 1188.3,
    mass: 1.303e22,
    distanceFromSun: 39.482,
    orbitalPeriod: 90560,
    rotationPeriod: -153.3,
    axialTilt: 122.53,
    temperature: { min: -233, max: -223 },
    eccentricity: 0.2488,
    inclination: 17.16,
    description: 'Pluto is a dwarf planet in the Kuiper Belt, once considered the ninth planet.',
    facts: [
      'Reclassified as dwarf planet in 2006',
      'Has 5 known moons',
      'Smaller than Earth\'s Moon',
      'Has a heart-shaped glacier'
    ]
  },
  {
    id: 'ceres',
    name: 'Ceres',
    type: 'dwarf-planet',
    color: '#9E9E9E',
    radius: 473,
    mass: 9.393e20,
    distanceFromSun: 2.77,
    orbitalPeriod: 1682,
    rotationPeriod: 9.07,
    axialTilt: 4,
    temperature: { min: -105, max: -34 },
    eccentricity: 0.0758,
    inclination: 10.59,
    description: 'Ceres is the largest object in the asteroid belt between Mars and Jupiter.',
    facts: [
      'Contains 1/3 of asteroid belt\'s mass',
      'First asteroid ever discovered (1801)',
      'Has bright spots (salt deposits)',
      'May have subsurface ocean'
    ]
  },
  {
    id: 'eris',
    name: 'Eris',
    type: 'dwarf-planet',
    color: '#E8E8E8',
    radius: 1163,
    mass: 1.66e22,
    distanceFromSun: 67.67,
    orbitalPeriod: 203830,
    rotationPeriod: 25.9,
    axialTilt: 78,
    temperature: { min: -243, max: -217 },
    eccentricity: 0.44,
    inclination: 44.19,
    description: 'Eris is one of the most massive dwarf planets, located in the scattered disc.',
    facts: [
      'Discovery led to Pluto\'s reclassification',
      'Named after Greek goddess of discord',
      'Has one known moon: Dysnomia',
      'Most distant known natural object'
    ]
  },
  {
    id: 'makemake',
    name: 'Makemake',
    type: 'dwarf-planet',
    color: '#CD853F',
    radius: 715,
    mass: 3.1e21,
    distanceFromSun: 45.79,
    orbitalPeriod: 112897,
    rotationPeriod: 22.48,
    axialTilt: 29,
    temperature: { min: -243, max: -238 },
    eccentricity: 0.159,
    inclination: 29,
    description: 'Makemake is a dwarf planet in the Kuiper Belt, one of the brightest objects there.',
    facts: [
      'Named after Rapa Nui creator god',
      'No known atmosphere',
      'Second brightest Kuiper Belt object',
      'Has one known moon'
    ]
  },
  {
    id: 'haumea',
    name: 'Haumea',
    type: 'dwarf-planet',
    color: '#F5F5DC',
    radius: 816,
    mass: 4.006e21,
    distanceFromSun: 43.13,
    orbitalPeriod: 103410,
    rotationPeriod: 3.92,
    axialTilt: 126,
    temperature: { min: -241, max: -241 },
    eccentricity: 0.195,
    inclination: 28.22,
    description: 'Haumea is an elongated dwarf planet with the fastest rotation in the Solar System.',
    facts: [
      'Egg-shaped due to rapid rotation',
      'Has two moons and a ring',
      'Named after Hawaiian goddess',
      'Rotates once every 4 hours'
    ]
  }
];

export const MOONS: CelestialBody[] = [
  // Earth's Moon
  {
    id: 'moon',
    name: 'Moon',
    type: 'moon',
    parentId: 'earth',
    color: '#C4C4C4',
    radius: 1737.4,
    mass: 7.342e22,
    distanceFromSun: 384400,
    orbitalPeriod: 27.32,
    rotationPeriod: 655.7,
    axialTilt: 1.54,
    temperature: { min: -173, max: 127 },
    eccentricity: 0.0549,
    inclination: 5.14,
    description: 'The Moon is Earth\'s only natural satellite and the fifth largest moon in the Solar System.',
    facts: [
      '12 humans have walked on it',
      'Slowly drifting away from Earth',
      'Same face always points to Earth',
      'Causes Earth\'s tides'
    ]
  },
  // Mars moons
  {
    id: 'phobos',
    name: 'Phobos',
    type: 'moon',
    parentId: 'mars',
    color: '#8B7355',
    radius: 11.267,
    mass: 1.0659e16,
    distanceFromSun: 9376,
    orbitalPeriod: 0.319,
    rotationPeriod: 7.66,
    axialTilt: 0,
    temperature: { min: -40, max: -4 },
    eccentricity: 0.0151,
    inclination: 1.093,
    description: 'Phobos is the larger and closer of Mars\' two moons, destined to crash into Mars in 50 million years.',
    facts: [
      'Orbits Mars 3 times per Martian day',
      'Will crash into Mars or break apart',
      'Has a large crater called Stickney',
      'May be a captured asteroid'
    ]
  },
  {
    id: 'deimos',
    name: 'Deimos',
    type: 'moon',
    parentId: 'mars',
    color: '#9E8B7D',
    radius: 6.2,
    mass: 1.4762e15,
    distanceFromSun: 23463,
    orbitalPeriod: 1.263,
    rotationPeriod: 30.3,
    axialTilt: 0,
    temperature: { min: -40, max: -4 },
    eccentricity: 0.00033,
    inclination: 0.93,
    description: 'Deimos is the smaller and farther of Mars\' two moons.',
    facts: [
      'Named after Greek god of terror',
      'Smoother than Phobos',
      'Slowly spiraling away from Mars',
      'About 15 km across'
    ]
  },
  // Jupiter moons (Galilean)
  {
    id: 'io',
    name: 'Io',
    type: 'moon',
    parentId: 'jupiter',
    color: '#FFFF00',
    radius: 1821.6,
    mass: 8.93e22,
    distanceFromSun: 421700,
    orbitalPeriod: 1.77,
    rotationPeriod: 42.46,
    axialTilt: 0,
    temperature: { min: -143, max: -143 },
    eccentricity: 0.0041,
    inclination: 0.05,
    description: 'Io is the innermost Galilean moon of Jupiter and the most volcanically active body in the Solar System.',
    facts: [
      'Over 400 active volcanoes',
      'Surface constantly reshaped by lava',
      'Discovered by Galileo in 1610',
      'Sulfur gives it yellow color'
    ]
  },
  {
    id: 'europa',
    name: 'Europa',
    type: 'moon',
    parentId: 'jupiter',
    color: '#F5DEB3',
    radius: 1560.8,
    mass: 4.8e22,
    distanceFromSun: 671034,
    orbitalPeriod: 3.55,
    rotationPeriod: 85.22,
    axialTilt: 0.1,
    temperature: { min: -160, max: -160 },
    eccentricity: 0.009,
    inclination: 0.47,
    description: 'Europa is one of Jupiter\'s Galilean moons, believed to have a subsurface ocean.',
    facts: [
      'May have more water than Earth',
      'Ice crust may be 10-30 km thick',
      'Top candidate for extraterrestrial life',
      'Has a thin oxygen atmosphere'
    ]
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    type: 'moon',
    parentId: 'jupiter',
    color: '#A9A9A9',
    radius: 2634.1,
    mass: 1.4819e23,
    distanceFromSun: 1070400,
    orbitalPeriod: 7.15,
    rotationPeriod: 171.7,
    axialTilt: 0.2,
    temperature: { min: -163, max: -163 },
    eccentricity: 0.0013,
    inclination: 0.2,
    description: 'Ganymede is the largest moon in our Solar System, even bigger than Mercury.',
    facts: [
      'Larger than planet Mercury',
      'Only moon with its own magnetic field',
      'Has both rocky and icy surface',
      'May have underground ocean'
    ]
  },
  {
    id: 'callisto',
    name: 'Callisto',
    type: 'moon',
    parentId: 'jupiter',
    color: '#708090',
    radius: 2410.3,
    mass: 1.0759e23,
    distanceFromSun: 1882700,
    orbitalPeriod: 16.69,
    rotationPeriod: 400.5,
    axialTilt: 0,
    temperature: { min: -139, max: -139 },
    eccentricity: 0.0074,
    inclination: 0.19,
    description: 'Callisto is Jupiter\'s second-largest moon and the most heavily cratered object in the Solar System.',
    facts: [
      'Surface is 4 billion years old',
      'Possible subsurface ocean',
      'No geological activity',
      'Potential site for future base'
    ]
  },
  // Saturn moons
  {
    id: 'titan',
    name: 'Titan',
    type: 'moon',
    parentId: 'saturn',
    color: '#DAA520',
    radius: 2574.7,
    mass: 1.3452e23,
    distanceFromSun: 1221870,
    orbitalPeriod: 15.95,
    rotationPeriod: 382.7,
    axialTilt: 0,
    temperature: { min: -179, max: -179 },
    eccentricity: 0.0288,
    inclination: 0.34,
    description: 'Titan is Saturn\'s largest moon and the only moon with a dense atmosphere.',
    facts: [
      'Has lakes of liquid methane',
      'Thicker atmosphere than Earth',
      'Only moon with stable surface liquid',
      'Huygens probe landed here in 2005'
    ]
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    type: 'moon',
    parentId: 'saturn',
    color: '#FFFFFF',
    radius: 252.1,
    mass: 1.08e20,
    distanceFromSun: 238042,
    orbitalPeriod: 1.37,
    rotationPeriod: 32.9,
    axialTilt: 0,
    temperature: { min: -198, max: -198 },
    eccentricity: 0.0047,
    inclination: 0.02,
    description: 'Enceladus is a small icy moon of Saturn with active geysers.',
    facts: [
      'Shoots water vapor into space',
      'Brightest object in Solar System',
      'Has subsurface ocean',
      'May harbor microbial life'
    ]
  },
  {
    id: 'mimas',
    name: 'Mimas',
    type: 'moon',
    parentId: 'saturn',
    color: '#C0C0C0',
    radius: 198.2,
    mass: 3.75e19,
    distanceFromSun: 185539,
    orbitalPeriod: 0.94,
    rotationPeriod: 22.6,
    axialTilt: 0,
    temperature: { min: -209, max: -209 },
    eccentricity: 0.0196,
    inclination: 1.53,
    description: 'Mimas is one of Saturn\'s moons, famous for its large crater making it look like the Death Star.',
    facts: [
      'Looks like Star Wars Death Star',
      'Herschel crater is 1/3 its diameter',
      'Smallest known spherical moon',
      'Made mostly of water ice'
    ]
  },
  {
    id: 'rhea',
    name: 'Rhea',
    type: 'moon',
    parentId: 'saturn',
    color: '#E8E8E8',
    radius: 763.8,
    mass: 2.306e21,
    distanceFromSun: 527108,
    orbitalPeriod: 4.52,
    rotationPeriod: 108.4,
    axialTilt: 0,
    temperature: { min: -174, max: -174 },
    eccentricity: 0.0012,
    inclination: 0.35,
    description: 'Rhea is Saturn\'s second-largest moon and may have its own thin ring system.',
    facts: [
      'Second largest moon of Saturn',
      'May have faint ring system',
      'Very thin atmosphere of oxygen',
      'Heavily cratered ice world'
    ]
  },
  {
    id: 'dione',
    name: 'Dione',
    type: 'moon',
    parentId: 'saturn',
    color: '#F5F5F5',
    radius: 561.4,
    mass: 1.095e21,
    distanceFromSun: 377396,
    orbitalPeriod: 2.74,
    rotationPeriod: 65.7,
    axialTilt: 0,
    temperature: { min: -186, max: -186 },
    eccentricity: 0.0022,
    inclination: 0.02,
    description: 'Dione is a medium-sized moon of Saturn with ice cliffs.',
    facts: [
      'Has bright ice cliffs',
      'Shares orbit with two tiny moons',
      'May have subsurface ocean',
      'Heavily cratered on one side'
    ]
  },
  {
    id: 'iapetus',
    name: 'Iapetus',
    type: 'moon',
    parentId: 'saturn',
    color: '#8B4513',
    radius: 734.5,
    mass: 1.806e21,
    distanceFromSun: 3560820,
    orbitalPeriod: 79.32,
    rotationPeriod: 1903.7,
    axialTilt: 0,
    temperature: { min: -143, max: -173 },
    eccentricity: 0.0286,
    inclination: 15.47,
    description: 'Iapetus is Saturn\'s third-largest moon, known for its two-tone coloration.',
    facts: [
      'Half black, half white surface',
      'Has a massive equatorial ridge',
      'Orbits far from Saturn',
      'Discovered by Cassini in 1671'
    ]
  },
  // Uranus moons
  {
    id: 'miranda',
    name: 'Miranda',
    type: 'moon',
    parentId: 'uranus',
    color: '#A9A9A9',
    radius: 235.8,
    mass: 6.59e19,
    distanceFromSun: 129900,
    orbitalPeriod: 1.41,
    rotationPeriod: 33.9,
    axialTilt: 0,
    temperature: { min: -187, max: -187 },
    eccentricity: 0.0013,
    inclination: 4.34,
    description: 'Miranda is Uranus\'s smallest major moon, known for its bizarre surface.',
    facts: [
      'Has 20 km high cliffs',
      'May have been shattered and reformed',
      'Extreme varied terrain',
      'Discovered by Kuiper in 1948'
    ]
  },
  {
    id: 'ariel',
    name: 'Ariel',
    type: 'moon',
    parentId: 'uranus',
    color: '#D3D3D3',
    radius: 578.9,
    mass: 1.353e21,
    distanceFromSun: 190900,
    orbitalPeriod: 2.52,
    rotationPeriod: 60.5,
    axialTilt: 0,
    temperature: { min: -213, max: -213 },
    eccentricity: 0.0012,
    inclination: 0.26,
    description: 'Ariel is one of Uranus\'s major moons with a relatively young surface.',
    facts: [
      'Brightest of Uranus\'s moons',
      'Has extensive canyon systems',
      'Shows signs of past activity',
      'Named after character in "The Tempest"'
    ]
  },
  {
    id: 'umbriel',
    name: 'Umbriel',
    type: 'moon',
    parentId: 'uranus',
    color: '#696969',
    radius: 584.7,
    mass: 1.172e21,
    distanceFromSun: 266000,
    orbitalPeriod: 4.14,
    rotationPeriod: 99.5,
    axialTilt: 0,
    temperature: { min: -198, max: -198 },
    eccentricity: 0.0039,
    inclination: 0.13,
    description: 'Umbriel is the darkest of Uranus\'s major moons.',
    facts: [
      'Darkest major moon of Uranus',
      'Ancient, heavily cratered surface',
      'Has mysterious bright ring feature',
      'Named after a character in "Rape of the Lock"'
    ]
  },
  {
    id: 'titania',
    name: 'Titania',
    type: 'moon',
    parentId: 'uranus',
    color: '#C0C0C0',
    radius: 788.4,
    mass: 3.527e21,
    distanceFromSun: 436300,
    orbitalPeriod: 8.71,
    rotationPeriod: 209.0,
    axialTilt: 0,
    temperature: { min: -203, max: -203 },
    eccentricity: 0.0011,
    inclination: 0.34,
    description: 'Titania is the largest moon of Uranus.',
    facts: [
      'Largest moon of Uranus',
      'Has fault valleys and craters',
      'May have subsurface ocean',
      'Named after Shakespeare\'s fairy queen'
    ]
  },
  {
    id: 'oberon',
    name: 'Oberon',
    type: 'moon',
    parentId: 'uranus',
    color: '#A9A9A9',
    radius: 761.4,
    mass: 3.014e21,
    distanceFromSun: 583500,
    orbitalPeriod: 13.46,
    rotationPeriod: 323.1,
    axialTilt: 0,
    temperature: { min: -198, max: -198 },
    eccentricity: 0.0014,
    inclination: 0.06,
    description: 'Oberon is the outermost major moon of Uranus.',
    facts: [
      'Second largest moon of Uranus',
      'Heavily cratered surface',
      'Has dark material on crater floors',
      'Named after king of fairies'
    ]
  },
  // Neptune moon
  {
    id: 'triton',
    name: 'Triton',
    type: 'moon',
    parentId: 'neptune',
    color: '#FFC0CB',
    radius: 1353.4,
    mass: 2.14e22,
    distanceFromSun: 354759,
    orbitalPeriod: -5.877,
    rotationPeriod: 141.0,
    axialTilt: 0,
    temperature: { min: -235, max: -235 },
    eccentricity: 0.000016,
    inclination: 156.885,
    description: 'Triton is Neptune\'s largest moon, believed to be a captured Kuiper Belt object.',
    facts: [
      'Orbits Neptune backwards',
      'Has active nitrogen geysers',
      'Will eventually crash into Neptune',
      'Coldest known object in Solar System'
    ]
  }
];

export const ALL_BODIES = [SUN, ...PLANETS, ...DWARF_PLANETS, ...MOONS];

export const getBodyById = (id: string): CelestialBody | undefined => {
  return ALL_BODIES.find(body => body.id === id);
};

export const getMoonsForParent = (parentId: string): CelestialBody[] => {
  return MOONS.filter(moon => moon.parentId === parentId);
};
