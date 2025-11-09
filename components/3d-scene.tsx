"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  Sphere,
  Box,
  Torus,
  Octahedron,
} from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

function MorphingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentShape, setCurrentShape] = useState(0);
  const shapes = ["box", "sphere", "torus", "octahedron"];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.z =
        Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.3;

      // Change shape every 4 seconds
      const shapeIndex =
        Math.floor(state.clock.elapsedTime / 4) % shapes.length;
      if (shapeIndex !== currentShape) {
        setCurrentShape(shapeIndex);
      }
    }
  });

  const renderShape = () => {
    const shapeProps = {
      ref: meshRef,
      scale: [1.5, 1.5, 1.5],
    };

    switch (shapes[currentShape]) {
      case "sphere":
        return (
          <Sphere {...shapeProps}>
            <meshStandardMaterial
              color="#059669"
              metalness={0.8}
              roughness={0.1}
              emissive="#10b981"
              emissiveIntensity={0.2}
            />
          </Sphere>
        );
      case "torus":
        return (
          <Torus {...shapeProps} args={[1, 0.4, 16, 100]}>
            <meshStandardMaterial
              color="#10b981"
              metalness={0.9}
              roughness={0.05}
              emissive="#059669"
              emissiveIntensity={0.3}
            />
          </Torus>
        );
      case "octahedron":
        return (
          <Octahedron {...shapeProps}>
            <meshStandardMaterial
              color="#065f46"
              metalness={0.7}
              roughness={0.2}
              emissive="#34d399"
              emissiveIntensity={0.15}
            />
          </Octahedron>
        );
      default:
        return (
          <Box {...shapeProps}>
            <meshStandardMaterial
              color="#059669"
              metalness={0.7}
              roughness={0.2}
              emissive="#10b981"
              emissiveIntensity={0.1}
            />
          </Box>
        );
    }
  };

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={1}>
      {renderShape()}
      <Html transform occlude position={[0, 0, 2]}>
        <div className="text-white text-sm font-mono bg-black/70 px-3 py-2 rounded-lg backdrop-blur-md border border-primary/30">
          {`<${shapes[currentShape]} />`}
        </div>
      </Html>
    </Float>
  );
}

function EnhancedParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

      // React to mouse movement
      particlesRef.current.position.x = mousePosition.x * 0.5;
      particlesRef.current.position.y = mousePosition.y * 0.3;
    }
  });

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

    // Gradient colors from emerald to lighter emerald
    const intensity = Math.random();
    colors[i * 3] = 0.02 + intensity * 0.3; // R
    colors[i * 3 + 1] = 0.6 + intensity * 0.4; // G
    colors[i * 3 + 2] = 0.4 + intensity * 0.2; // B
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.8} />
    </points>
  );
}

function FloatingCodeElements() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const codeSnippets = [
    "{ React }",
    "[ Node.js ]",
    "< MongoDB >",
    "( DevOps )",
    "{ Three.js }",
    "[ TypeScript ]",
    "[ Docker ]",
    "[ Kubernetes ]",
  ];

  return (
    <group ref={groupRef}>
      {codeSnippets.map((code, index) => {
        const angle = (index / codeSnippets.length) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index + Date.now() * 0.001) * 0.5;

        return (
          <Float
            key={index}
            speed={2 + index * 0.5}
            rotationIntensity={0.5}
            floatIntensity={0.8}
          >
            <Html position={[x, y, z]} transform>
              <div className="text-primary font-mono text-xs bg-card/90 px-2 py-1 rounded border border-primary/20 backdrop-blur-sm animate-pulse-glow">
                {code}
              </div>
            </Html>
          </Float>
        );
      })}
    </group>
  );
}

interface ThreeDSceneProps {
  className?: string;
}

export function ThreeDScene({ className }: ThreeDSceneProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#10b981" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.8}
            color="#059669"
          />
          <spotLight position={[0, 10, 0]} intensity={0.5} color="#34d399" />

          <MorphingGeometry />
          <EnhancedParticles />
          <FloatingCodeElements />

          <Environment preset="studio" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
