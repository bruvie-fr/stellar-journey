import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SUN } from '@/data/celestialBodies';
import { getVisualSize } from '@/data/astronomyUtils';

interface SunProps {
  onClick: () => void;
  isSelected: boolean;
  useRealisticScale: boolean;
  labelSize: number;
}

// Create procedural sun texture
const createSunTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  // Base gradient
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(0.2, '#FFF5E0');
  gradient.addColorStop(0.4, '#FFDD80');
  gradient.addColorStop(0.7, '#FFA500');
  gradient.addColorStop(1, '#FF6B00');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add granulation pattern
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 5 + Math.random() * 15;
    const brightness = Math.random() > 0.5 ? 
      `rgba(255, 255, 200, ${Math.random() * 0.3})` : 
      `rgba(255, 150, 50, ${Math.random() * 0.3})`;
    
    ctx.fillStyle = brightness;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

const Sun = ({ onClick, isSelected, useRealisticScale, labelSize }: SunProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glow1Ref = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  
  const size = getVisualSize(SUN, useRealisticScale);
  const texture = useMemo(() => createSunTexture(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
    
    // Animate inner glow
    if (glow1Ref.current) {
      const scale = 1 + Math.sin(time * 2) * 0.03;
      glow1Ref.current.scale.setScalar(scale);
    }
    
    // Animate outer glow
    if (glow2Ref.current) {
      const scale = 1 + Math.sin(time * 1.5 + 1) * 0.05;
      glow2Ref.current.scale.setScalar(scale);
    }
    
    // Animate corona
    if (coronaRef.current) {
      const scale = 1 + Math.sin(time * 0.8) * 0.08;
      coronaRef.current.scale.setScalar(scale);
      coronaRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core sun - using basic material since it's self-lit */}
      <Sphere
        ref={meshRef}
        args={[size, 64, 64]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshBasicMaterial map={texture} />
      </Sphere>
      
      {/* Inner glow layer 1 */}
      <Sphere ref={glow1Ref} args={[size * 1.1, 32, 32]}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Inner glow layer 2 */}
      <Sphere ref={glow2Ref} args={[size * 1.25, 32, 32]}>
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer corona */}
      <Sphere ref={coronaRef} args={[size * 1.5, 32, 32]}>
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outermost glow */}
      <Sphere args={[size * 2, 32, 32]}>
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Main directional light from sun - creates realistic lighting on planets */}
      <pointLight 
        intensity={4} 
        distance={800} 
        decay={1.5} 
        color="#FFF5E0" 
        castShadow={false}
      />
      
      {/* Secondary warm light */}
      <pointLight 
        intensity={1.5} 
        distance={1000} 
        decay={2} 
        color="#FFA500" 
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Sphere args={[size * 2.2, 32, 32]}>
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.15}
            wireframe
          />
        </Sphere>
      )}
      
      {/* Sun label */}
      <Html
        position={[0, size * 2.5, 0]}
        center
        distanceFactor={15}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div 
          className="text-white font-medium px-2 py-0.5 bg-black/50 rounded backdrop-blur-sm whitespace-nowrap"
          style={{ fontSize: `${labelSize}px` }}
        >
          Sun
        </div>
      </Html>
    </group>
  );
};

export default Sun;
