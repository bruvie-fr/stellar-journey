import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody, SCALE } from '@/data/celestialBodies';

interface OrbitPathProps {
  body: CelestialBody;
  parentPosition?: [number, number, number];
  isHighlighted: boolean;
}

const OrbitPath = ({ body, parentPosition = [0, 0, 0], isHighlighted }: OrbitPathProps) => {
  const points = useMemo(() => {
    const segments = 128;
    const orbitPoints: THREE.Vector3[] = [];
    
    const a = body.type === 'moon'
      ? body.distanceFromSun * SCALE.MOON_DISTANCE
      : body.distanceFromSun * SCALE.DISTANCE;
    
    const e = body.eccentricity;
    const inclRad = (body.inclination * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(angle));
      
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);
      const y = z * Math.sin(inclRad);
      const zFinal = z * Math.cos(inclRad);
      
      orbitPoints.push(new THREE.Vector3(
        x + parentPosition[0],
        y + parentPosition[1],
        zFinal + parentPosition[2]
      ));
    }
    
    return orbitPoints;
  }, [body, parentPosition]);

  const color = isHighlighted ? '#4DA6FF' : '#3A3A5A';
  const lineWidth = isHighlighted ? 2 : 1;
  const opacity = isHighlighted ? 0.8 : 0.3;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  );
};

export default OrbitPath;
