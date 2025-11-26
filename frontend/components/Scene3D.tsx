
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Model() {
    // Load the model from the public folder
    // The user must place a file named 'scene.gltf' or 'scene.glb' in frontend/public
    const { scene } = useGLTF("/scene.gltf");

    return (
        <primitive
            object={scene}
            scale={2}
            position={[0, -1, 0]}
            rotation={[0, Math.PI / 5, 0]}
        />
    );
}

function BackgroundParticles() {
    const { viewport, mouse } = useThree();
    const count = 2000;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Initialize particles with random positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20; // Spread across width
            const y = (Math.random() - 0.5) * 20; // Spread across height
            const z = (Math.random() - 0.5) * 10 - 5; // Depth
            temp.push({ x, y, z, ox: x, oy: y, oz: z, vx: 0, vy: 0, vz: 0 });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if (!mesh.current) return;

        // Convert normalized mouse coordinates (-1 to 1) to world coordinates (approx)
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        particles.forEach((particle, i) => {
            // Calculate distance to mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 3; // Radius of influence

            if (dist < repulsionRadius) {
                // Repulsion force
                const force = (repulsionRadius - dist) / repulsionRadius;
                const angle = Math.atan2(dy, dx);

                // Push away
                particle.vx -= Math.cos(angle) * force * 0.1;
                particle.vy -= Math.sin(angle) * force * 0.1;
            }

            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Friction / Return to original position (optional, or just drift)
            // Let's make them drift back slowly to original position for "stillness"
            particle.x += (particle.ox - particle.x) * 0.02;
            particle.y += (particle.oy - particle.y) * 0.02;

            // Dampen velocity
            particle.vx *= 0.9;
            particle.vy *= 0.9;

            dummy.position.set(particle.x, particle.y, particle.z);

            // Scale down slightly
            const s = 0.5;
            dummy.scale.set(s, s, s);
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
            <meshPhongMaterial color="#00ffff" emissive="#0088ff" transparent opacity={0.6} />
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

                <Model />
                <BackgroundParticles />
                {/* Reduced background stars since we have interactive particles */}
                <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
}

