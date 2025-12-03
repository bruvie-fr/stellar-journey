import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { SUN } from '@/data/celestialBodies';
import { getVisualSize } from '@/data/astronomyUtils';

interface SunProps {
  onClick: () => void;
  isSelected: boolean;
  useRealisticScale: boolean;
}

const Sun = ({ onClick, isSelected, useRealisticScale }: SunProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const size = getVisualSize(SUN, useRealisticScale);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner sun */}
      <Sphere
        ref={meshRef}
        args={[size, 64, 64]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshBasicMaterial color="#FDB813" />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[size * 1.2, 32, 32]}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer glow */}
      <Sphere args={[size * 1.5, 32, 32]}>
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Point light */}
      <pointLight intensity={2} distance={500} decay={2} />
      
      {/* Selection indicator */}
      {isSelected && (
        <Sphere args={[size * 1.8, 32, 32]}>
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.2}
            wireframe
          />
        </Sphere>
      )}
    </group>
  );
};

export default Sun;
