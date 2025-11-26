
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function ParticleHead() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
            // Slow rotation
            groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
        }
    });

    // Create geometries for head, neck, and shoulders
    const headGeo = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);
    const neckGeo = useMemo(() => new THREE.CylinderGeometry(0.4, 0.4, 1, 32), []);
    const shouldersGeo = useMemo(() => new THREE.SphereGeometry(1.5, 64, 32), []);

    return (
        <group ref={groupRef} position={[0, 0.5, 0]}>
            {/* Head */}
            <points position={[0, 1.2, 0]}>
                <primitive object={headGeo} />
                <pointsMaterial color="#00ffff" size={0.015} transparent opacity={0.8} sizeAttenuation />
            </points>

            {/* Neck */}
            <points position={[0, 0.2, 0]}>
                <primitive object={neckGeo} />
                <pointsMaterial color="#00ffff" size={0.015} transparent opacity={0.6} sizeAttenuation />
            </points>

            {/* Shoulders (Approximated with a scaled sphere) */}
            <points position={[0, -0.8, 0]} scale={[2, 0.8, 1]}>
                <primitive object={shouldersGeo} />
                <pointsMaterial color="#00ffff" size={0.015} transparent opacity={0.5} sizeAttenuation />
            </points>

            {/* Inner Glow for Head */}
            <mesh position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.95, 32, 32]} />
                <meshBasicMaterial color="#0088ff" transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

function BackgroundParticles() {
    const count = 2000;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 3; // Slower, ambient movement
            const s = Math.cos(t);

            // No mouse interaction, just ambient floating
            dummy.position.set(
                (particle.mx / 10) + Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) + Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) + Math.cos(t) + Math.sin(t * 3) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            if (mesh.current) {
                mesh.current.setMatrixAt(i, dummy.matrix);
            }
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshPhongMaterial color="#00ffff" emissive="#0088ff" transparent opacity={0.4} />
        </instancedMesh>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

                <ParticleHead />
                <BackgroundParticles />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
}

