import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody as CelestialBodyType } from '@/data/celestialBodies';
import { getVisualSize, getOrbitalPosition } from '@/data/astronomyUtils';

interface CelestialBodyProps {
  body: CelestialBodyType;
  date: Date;
  onClick: () => void;
  isSelected: boolean;
  useRealisticScale: boolean;
  parentPosition?: [number, number, number];
}

const CelestialBodyComponent = ({
  body,
  date,
  onClick,
  isSelected,
  useRealisticScale,
  parentPosition = [0, 0, 0]
}: CelestialBodyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const size = getVisualSize(body, useRealisticScale);
  const position = useMemo(
    () => getOrbitalPosition(body, date, parentPosition),
    [body, date, parentPosition]
  );

  useFrame(() => {
    if (meshRef.current) {
      const rotationSpeed = body.rotationPeriod !== 0 
        ? 0.01 / Math.abs(body.rotationPeriod) 
        : 0.001;
      meshRef.current.rotation.y += rotationSpeed * (body.rotationPeriod < 0 ? -1 : 1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Planet sphere */}
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial
          color={body.color}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Rings for Saturn, Uranus, Neptune */}
      {body.hasRings && (
        <Ring
          args={[size * 1.4, size * 2.2, 64]}
          rotation={[-Math.PI / 2 + (body.axialTilt * Math.PI) / 180, 0, 0]}
        >
          <meshBasicMaterial
            color={body.id === 'saturn' ? '#C9A86C' : '#AAAAAA'}
            transparent
            opacity={body.id === 'saturn' ? 0.7 : 0.3}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <>
          <Sphere args={[size * 1.5, 32, 32]}>
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.2}
              wireframe
            />
          </Sphere>
          {/* Pulsing ring */}
          <Ring args={[size * 1.8, size * 2, 64]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
              color="#4DA6FF"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </Ring>
        </>
      )}
      
      {/* Name label hover effect */}
      <mesh position={[0, size * 1.5, 0]}>
        <planeGeometry args={[0, 0]} />
      </mesh>
    </group>
  );
};

export default CelestialBodyComponent;
