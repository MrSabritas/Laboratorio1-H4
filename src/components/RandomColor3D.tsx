import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Componente para la Dona animada
const AnimatedDonut: React.FC<{ color: string }> = ({ color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[1.5, 0.5, 16, 100]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.8}
        envMapIntensity={1}
      />
    </mesh>
  );
};

const RandomColor3D: React.FC = () => {
  const [hue, setHue] = useState<number>(0);

  // Efecto para cambiar el color aleatoriamente cada 2 segundos
  useEffect(() => {
    // Inicializar con un color aleatorio
    setHue(Math.floor(Math.random() * 361));

    const interval = setInterval(() => {
      const randomHue = Math.floor(Math.random() * 361);
      setHue(randomHue);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHarmonies = (h: number) => {
    return [
      { type: 'Base', val: `hsl(${h}, 70%, 50%)` },
      { type: 'Complementario', val: `hsl(${(h + 180) % 360}, 70%, 50%)` },
      { type: 'Triada A', val: `hsl(${(h + 120) % 360}, 70%, 50%)` },
      { type: 'Triada B', val: `hsl(${(h + 240) % 360}, 70%, 50%)` },
    ];
  };

  const harmonies = getHarmonies(hue);
  const baseColor = harmonies[0].val;

  return (
    <section className="section-container">
      <h2>Objeto 3D - Aleatorio (Cada 2s)</h2>
      
      <div className="main-object-3d">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          
          <AnimatedDonut color={baseColor} />
          
          <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <div className="harmonies-grid">
        {harmonies.map((c) => (
          <div key={c.type} className="color-card" style={{ backgroundColor: c.val }}>
            <span className="type">{c.type}</span>
            <span className="val">{c.val}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RandomColor3D;
