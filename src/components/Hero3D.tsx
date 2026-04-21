import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

interface Hero3DProps {
    mouseX?: MotionValue<number>;
    mouseY?: MotionValue<number>;
}

const FloatingShape = ({ position, rotation, color, scale }: { position: [number, number, number], rotation: [number, number, number], color: string, scale: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.2}
                    roughness={0.1}
                    transmission={0.6}
                    thickness={0.5}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Float>
    );
};

const TorusShape = ({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x -= 0.002;
            meshRef.current.rotation.y -= 0.002;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
                <torusKnotGeometry args={[10, 3, 100, 16]} />
                <meshStandardMaterial
                    color="#4e6ef2"
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#4e6ef2"
                    emissiveIntensity={0.5}
                    wireframe
                />
            </mesh>
        </Float>
    );
};

const ParticleField = () => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
        </points>
    );
};

const CameraController = ({ mouseX, mouseY }: { mouseX?: MotionValue<number>, mouseY?: MotionValue<number> }) => {
    useFrame((state) => {
        if (mouseX && mouseY) {
            const x = mouseX.get();
            const y = mouseY.get();

            // Smoothly interpolate camera position
            state.camera.position.x += (x * 2 - state.camera.position.x) * 0.05;
            state.camera.position.y += (y * 2 - state.camera.position.y) * 0.05;
            state.camera.lookAt(0, 0, 0);
        }
    });
    return null;
};

const Hero3D: React.FC<Hero3DProps> = ({ mouseX, mouseY }) => {
    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-950 dark:to-black overflow-hidden">
            <Canvas 
                dpr={[1, 2]} 
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                <CameraController mouseX={mouseX} mouseY={mouseY} />
                <ambientLight intensity={0.5} />

                <directionalLight position={[5, 10, 7]} intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ade80" />

                <ParticleField />

                <FloatingShape position={[-6, 2, -5]} rotation={[0, 0, 0]} color="#3b82f6" scale={2} />
                <FloatingShape position={[6, -2, -2]} rotation={[0, Math.PI / 4, 0]} color="#2dd4bf" scale={2.5} />
                <FloatingShape position={[0, 5, -8]} rotation={[Math.PI / 4, 0, 0]} color="#8b5cf6" scale={1.5} />

                <TorusShape position={[8, 4, -10]} rotation={[0, 0, 0]} scale={0.15} />
                <TorusShape position={[-8, -4, -10]} rotation={[0, 0, 0]} scale={0.15} />
            </Canvas>

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-[1px]" />
        </div>
    );
};

export default Hero3D;
