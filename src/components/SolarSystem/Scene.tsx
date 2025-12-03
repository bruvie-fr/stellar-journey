import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import Sun from './Sun';
import CelestialBody from './CelestialBody';
import OrbitPath from './OrbitPath';
import Starfield from './Starfield';
import { 
  PLANETS, 
  DWARF_PLANETS, 
  getMoonsForParent 
} from '@/data/celestialBodies';
import { getOrbitalPosition } from '@/data/astronomyUtils';

interface SceneProps {
  date: Date;
  selectedBodyId: string | null;
  onSelectBody: (id: string) => void;
  useRealisticScale: boolean;
  showOrbits: boolean;
  showMoons: boolean;
  showDwarfPlanets: boolean;
  labelSize: number;
}

// Loading component
const Loader = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshBasicMaterial color="#4DA6FF" wireframe />
  </mesh>
);

const SolarSystemScene = ({
  date,
  selectedBodyId,
  onSelectBody,
  useRealisticScale,
  showOrbits,
  showMoons,
  showDwarfPlanets,
  labelSize
}: SceneProps) => {
  const planetPositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    [...PLANETS, ...DWARF_PLANETS].forEach(planet => {
      positions[planet.id] = getOrbitalPosition(planet, date);
    });
    return positions;
  }, [date]);

  return (
    <Canvas className="w-full h-full" gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 80, 150]} fov={60} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={600}
        zoomSpeed={0.5}
        rotateSpeed={0.5}
        panSpeed={0.5}
      />
      
      {/* Ambient light for visibility */}
      <ambientLight intensity={0.08} />
      
      {/* Background stars using drei */}
      <Stars
        radius={300}
        depth={60}
        count={8000}
        factor={6}
        saturation={0.1}
        fade
        speed={0.5}
      />
      
      <Suspense fallback={<Loader />}>
        <Starfield />
        
        {/* Sun */}
        <Sun
          onClick={() => onSelectBody('sun')}
          isSelected={selectedBodyId === 'sun'}
          useRealisticScale={useRealisticScale}
          labelSize={labelSize}
        />
        
        {/* Planets */}
        {PLANETS.map(planet => (
          <group key={planet.id}>
            {showOrbits && (
              <OrbitPath
                body={planet}
                isHighlighted={selectedBodyId === planet.id}
              />
            )}
            <CelestialBody
              body={planet}
              date={date}
              onClick={() => onSelectBody(planet.id)}
              isSelected={selectedBodyId === planet.id}
              useRealisticScale={useRealisticScale}
              labelSize={labelSize}
            />
            
            {/* Moons */}
            {showMoons && getMoonsForParent(planet.id).map(moon => (
              <group key={moon.id}>
                {showOrbits && (
                  <OrbitPath
                    body={moon}
                    parentPosition={planetPositions[planet.id]}
                    isHighlighted={selectedBodyId === moon.id}
                  />
                )}
                <CelestialBody
                  body={moon}
                  date={date}
                  onClick={() => onSelectBody(moon.id)}
                  isSelected={selectedBodyId === moon.id}
                  useRealisticScale={useRealisticScale}
                  parentPosition={planetPositions[planet.id]}
                  labelSize={labelSize}
                />
              </group>
            ))}
          </group>
        ))}
        
        {/* Dwarf Planets */}
        {showDwarfPlanets && DWARF_PLANETS.map(dwarf => (
          <group key={dwarf.id}>
            {showOrbits && (
              <OrbitPath
                body={dwarf}
                isHighlighted={selectedBodyId === dwarf.id}
              />
            )}
            <CelestialBody
              body={dwarf}
              date={date}
              onClick={() => onSelectBody(dwarf.id)}
              isSelected={selectedBodyId === dwarf.id}
              useRealisticScale={useRealisticScale}
              labelSize={labelSize}
            />
          </group>
        ))}
      </Suspense>
    </Canvas>
  );
};

export default SolarSystemScene;