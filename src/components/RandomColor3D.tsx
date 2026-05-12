import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
const vertexShader = `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  varying vec3 vPos;
  varying vec3 vNormal;

  void main() {
    // Calculamos un degradado en diagonal basándonos en los ejes X e Y del objeto
    // El radio del toroide es de aprox 2.0 (1.5 + 0.5), por lo que x+y va de -4 a 4
    float t = (vPos.x + vPos.y + 4.0) / 8.0;
    t = clamp(t, 0.0, 1.0);
    
    vec3 finalColor;
    
    // Mezcla lineal (linear-gradient) de los 4 colores
    if (t < 0.333) {
        finalColor = mix(color1, color2, t / 0.333);
    } else if (t < 0.666) {
        finalColor = mix(color2, color3, (t - 0.333) / 0.333);
    } else {
        finalColor = mix(color3, color4, (t - 0.666) / 0.334);
    }

    // Iluminación 3D calculada matemáticamente (para que NO dependa de luces externas)
    vec3 lightDir = normalize(vec3(1.0, 2.0, 3.0));
    float diff = max(dot(vNormal, lightDir), 0.3); // 0.3 asegura que NUNCA sea totalmente negro
    
    gl_FragColor = vec4(finalColor * diff, 1.0);
  }
`;

// Componente para la Dona animada con colores puros mediante shader
const AnimatedDonut: React.FC<{ harmonies: { type: string, val: string }[] }> = ({ harmonies }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => {
    return {
      color1: { value: new THREE.Color(harmonies[0].val) },
      color2: { value: new THREE.Color(harmonies[2].val) },
      color3: { value: new THREE.Color(harmonies[1].val) },
      color4: { value: new THREE.Color(harmonies[3].val) }
    };
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.color1.value.set(harmonies[0].val);
      material.uniforms.color2.value.set(harmonies[2].val);
      material.uniforms.color3.value.set(harmonies[1].val);
      material.uniforms.color4.value.set(harmonies[3].val);
    }
  }, [harmonies]);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.5, 0.5, 64, 100]} />
      <shaderMaterial 
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniforms}
      />
    </mesh>
  );
};

const RandomColor3D: React.FC = () => {
  const [hue, setHue] = useState<number>(0);

  useEffect(() => {
  
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

  return (
    <section className="section-container">
      <h2>Objeto 3D - Aleatorio (Cada 2s)</h2>
      
      <div className="main-object-3d">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          {/* El objeto 3D ahora usa su propia luz interna matemática */}
          
          <AnimatedDonut harmonies={harmonies} />
          
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
