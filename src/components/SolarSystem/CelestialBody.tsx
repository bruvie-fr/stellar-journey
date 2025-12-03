import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Html } from '@react-three/drei';
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
  labelSize: number;
}

// Create procedural texture for planets
const createProceduralTexture = (body: CelestialBodyType): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  const baseColor = body.color;
  
  // Parse hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  };
  
  const rgb = hexToRgb(baseColor);
  
  // Fill background
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add texture based on body type
  if (body.id === 'earth') {
    // Earth - blue oceans with green/brown continents
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#1a5fb4');
    gradient.addColorStop(0.2, '#3584e4');
    gradient.addColorStop(0.4, '#2e8b57');
    gradient.addColorStop(0.5, '#228b22');
    gradient.addColorStop(0.6, '#8b7355');
    gradient.addColorStop(0.8, '#3584e4');
    gradient.addColorStop(1, '#1a5fb4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.ellipse(x, y, 20 + Math.random() * 30, 10 + Math.random() * 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (body.id === 'jupiter' || body.id === 'saturn') {
    // Gas giants - horizontal bands
    const bandColors = body.id === 'jupiter' 
      ? ['#d4a574', '#c9a86c', '#b89b5d', '#d8ca9d', '#e8d4a8', '#c9a86c']
      : ['#f4d59e', '#e8c98d', '#ddb87c', '#c9a86c', '#f0d090'];
    
    const bandHeight = canvas.height / bandColors.length;
    bandColors.forEach((color, i) => {
      const gradient = ctx.createLinearGradient(0, i * bandHeight, 0, (i + 1) * bandHeight);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, shadeColor(color, -10));
      gradient.addColorStop(1, color);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight + 1);
    });
    
    // Add storm for Jupiter
    if (body.id === 'jupiter') {
      ctx.fillStyle = '#c1440e';
      ctx.beginPath();
      ctx.ellipse(canvas.width * 0.7, canvas.height * 0.6, 40, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (body.id === 'mars') {
    // Mars - rusty red with darker regions
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, '#c1440e');
    gradient.addColorStop(0.5, '#a13a0c');
    gradient.addColorStop(1, '#8b3209');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add dark regions
    ctx.fillStyle = 'rgba(60, 30, 15, 0.4)';
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        30 + Math.random() * 50,
        20 + Math.random() * 30,
        Math.random() * Math.PI,
        0, Math.PI * 2
      );
      ctx.fill();
    }
  } else if (body.id === 'venus') {
    // Venus - yellowish with cloud swirls
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e6c229');
    gradient.addColorStop(0.3, '#d4b020');
    gradient.addColorStop(0.6, '#c9a018');
    gradient.addColorStop(1, '#e6c229');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add swirls
    ctx.strokeStyle = 'rgba(255, 220, 150, 0.3)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + (Math.random() - 0.5) * 100,
        startY + (Math.random() - 0.5) * 50,
        startX + Math.random() * 80,
        startY + (Math.random() - 0.5) * 40
      );
      ctx.stroke();
    }
  } else if (body.id === 'uranus' || body.id === 'neptune') {
    // Ice giants - subtle banding
    const baseHue = body.id === 'uranus' ? '#d1e7e7' : '#5b5ddf';
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, shadeColor(baseHue, 10));
    gradient.addColorStop(0.3, baseHue);
    gradient.addColorStop(0.5, shadeColor(baseHue, -10));
    gradient.addColorStop(0.7, baseHue);
    gradient.addColorStop(1, shadeColor(baseHue, 10));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (body.type === 'moon') {
    // Moons - cratered gray surface
    ctx.fillStyle = body.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add craters
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 3 + Math.random() * 15;
      
      // Crater shadow
      ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Crater highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.1})`;
      ctx.beginPath();
      ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Rocky planets and others - add noise/texture
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const variation = (Math.random() - 0.5) * 30;
      ctx.fillStyle = `rgb(${rgb.r + variation}, ${rgb.g + variation}, ${rgb.b + variation})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

// Helper function to shade colors
const shadeColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

const CelestialBodyComponent = ({
  body,
  date,
  onClick,
  isSelected,
  useRealisticScale,
  parentPosition = [0, 0, 0],
  labelSize
}: CelestialBodyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const size = getVisualSize(body, useRealisticScale);
  const position = useMemo(
    () => getOrbitalPosition(body, date, parentPosition),
    [body, date, parentPosition]
  );

  // Create texture once
  const texture = useMemo(() => createProceduralTexture(body), [body]);

  // Check if planet has atmosphere
  const hasAtmosphere = ['earth', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'titan'].includes(body.id);
  
  const atmosphereColor = useMemo(() => {
    switch (body.id) {
      case 'earth': return '#87CEEB';
      case 'venus': return '#FFD700';
      case 'mars': return '#FF6347';
      case 'jupiter': return '#DEB887';
      case 'saturn': return '#F5DEB3';
      case 'uranus': return '#E0FFFF';
      case 'neptune': return '#4169E1';
      case 'titan': return '#FFA500';
      default: return '#FFFFFF';
    }
  }, [body.id]);

  useFrame((state) => {
    if (meshRef.current) {
      const rotationSpeed = body.rotationPeriod !== 0 
        ? 0.01 / Math.abs(body.rotationPeriod) 
        : 0.001;
      meshRef.current.rotation.y += rotationSpeed * (body.rotationPeriod < 0 ? -1 : 1);
    }
    
    // Animate atmosphere
    if (atmosphereRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      atmosphereRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Planet sphere with texture */}
      <Sphere
        ref={meshRef}
        args={[size, 64, 64]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      {hasAtmosphere && (
        <Sphere ref={atmosphereRef} args={[size * 1.05, 32, 32]}>
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Enhanced rings for Saturn */}
      {body.id === 'saturn' && (
        <>
          {/* Inner ring */}
          <Ring
            args={[size * 1.3, size * 1.6, 64]}
            rotation={[-Math.PI / 2 + (body.axialTilt * Math.PI) / 180, 0, 0]}
          >
            <meshBasicMaterial
              color="#C9A86C"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </Ring>
          {/* Middle ring */}
          <Ring
            args={[size * 1.6, size * 2.0, 64]}
            rotation={[-Math.PI / 2 + (body.axialTilt * Math.PI) / 180, 0, 0]}
          >
            <meshBasicMaterial
              color="#DEB887"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </Ring>
          {/* Outer ring */}
          <Ring
            args={[size * 2.0, size * 2.4, 64]}
            rotation={[-Math.PI / 2 + (body.axialTilt * Math.PI) / 180, 0, 0]}
          >
            <meshBasicMaterial
              color="#A0826D"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        </>
      )}
      
      {/* Rings for Uranus and Neptune (fainter) */}
      {body.hasRings && body.id !== 'saturn' && (
        <Ring
          args={[size * 1.4, size * 1.8, 64]}
          rotation={[-Math.PI / 2 + (body.axialTilt * Math.PI) / 180, 0, 0]}
        >
          <meshBasicMaterial
            color="#AAAAAA"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <>
          <Sphere args={[size * 1.3, 32, 32]}>
            <meshBasicMaterial
              color="#4DA6FF"
              transparent
              opacity={0.15}
              wireframe
            />
          </Sphere>
          {/* Pulsing ring */}
          <Ring args={[size * 1.6, size * 1.8, 64]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
              color="#4DA6FF"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </Ring>
        </>
      )}
      
      {/* Planet name label */}
      <Html
        position={[0, size * 1.8, 0]}
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
          {body.name}
        </div>
      </Html>
    </group>
  );
};

export default CelestialBodyComponent;