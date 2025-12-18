"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

function HolographicCore({ isDark }: { isDark: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

    // Colors based on theme
    const wireframeColor = isDark ? "#00ffff" : "#1e293b"; // Cyan vs Dark Slate
    const coreColor = isDark ? "#0088ff" : "#334155"; // Blue vs Slate
    const ring1Color = isDark ? "#00ffff" : "#0f172a"; // Cyan vs Slate-900
    const ring2Color = isDark ? "#0088ff" : "#475569"; // Blue vs Slate-600
    const particleColor = isDark ? "#ffffff" : "#000000"; // White vs Black

    useFrame((state) => {
        if (groupRef.current) {
            // Complex rotation for a sci-fi feel
            groupRef.current.rotation.y += 0.005;
            groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Core Icosahedron - The "Brain" */}
            <mesh>
                <icosahedronGeometry args={[1.2, 2]} />
                <meshBasicMaterial color={wireframeColor} wireframe transparent opacity={0.3} />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial color={coreColor} transparent opacity={0.5} />
            </mesh>

            {/* Orbiting Ring 1 */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[1.8, 0.02, 16, 100]} />
                <meshBasicMaterial color={ring1Color} transparent opacity={0.6} />
            </mesh>

            {/* Orbiting Ring 2 */}
            <mesh rotation={[-Math.PI / 3, 0, 0]}>
                <torusGeometry args={[2.2, 0.02, 16, 100]} />
                <meshBasicMaterial color={ring2Color} transparent opacity={0.4} />
            </mesh>

            {/* Floating Particles around core */}
            <points>
                <sphereGeometry args={[2.5, 64, 64]} />
                <pointsMaterial color={particleColor} size={0.015} transparent opacity={0.2} />
            </points>
        </group>
    );
}

function MovingStars({ isDark }: { isDark: boolean }) {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null);
    const { viewport, mouse } = useThree();

    // Generate random positions and velocities
    const [positions, velocities, originalPositions] = useMemo(() => {
        const count = 2000; // Define count inside if needed or use from outer scope
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        const orig = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // eslint-disable-next-line react-hooks/purity
            const x = (Math.random() - 0.5) * 20;
            // eslint-disable-next-line react-hooks/purity
            const y = (Math.random() - 0.5) * 20;
            // eslint-disable-next-line react-hooks/purity
            const z = (Math.random() - 0.5) * 10;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            orig[i * 3] = x;
            orig[i * 3 + 1] = y;
            orig[i * 3 + 2] = z;

            vel[i * 3] = 0;
            vel[i * 3 + 1] = 0;
            vel[i * 3 + 2] = 0;
        }
        return [pos, vel, orig];
    }, []);

    useFrame(() => {
        if (!mesh.current) return;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const positionsArr = mesh.current.geometry.attributes.position.array as Float32Array;

        // Mouse position in world space (approximate at z=0)
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            // const iz = i * 3 + 2; // Unused

            // Current position
            const px = positions[ix];
            const py = positions[iy];

            // Distance to mouse
            const dx = mouseX - px;
            const dy = mouseY - py;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // Interaction radius
            const radius = 4;

            if (dist < radius) {
                // Repulsion force
                const force = (radius - dist) / radius;
                const angle = Math.atan2(dy, dx);

                // eslint-disable-next-line react-hooks/immutability
                velocities[ix] -= Math.cos(angle) * force * 0.02;
                // eslint-disable-next-line react-hooks/immutability
                velocities[iy] -= Math.sin(angle) * force * 0.02;
            }

            // Return to original position (elasticity)
            const ox = originalPositions[ix];
            const oy = originalPositions[iy];

            // eslint-disable-next-line react-hooks/immutability
            velocities[ix] += (ox - px) * 0.005;
            // eslint-disable-next-line react-hooks/immutability
            velocities[iy] += (oy - py) * 0.005;

            // Apply velocity
            // eslint-disable-next-line react-hooks/immutability
            positions[ix] += velocities[ix];
            // eslint-disable-next-line react-hooks/immutability
            positions[iy] += velocities[iy];

            // Damping (friction)
            // eslint-disable-next-line react-hooks/immutability
            velocities[ix] *= 0.92;
            // eslint-disable-next-line react-hooks/immutability
            velocities[iy] *= 0.92;
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;

        // Slowly rotate the whole star field
        mesh.current.rotation.y += 0.0005;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color={isDark ? "#ffffff" : "#000000"}
                transparent
                opacity={isDark ? 0.8 : 0.6}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

export default function Scene3D() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color={isDark ? "#00ffff" : "#334155"} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color={isDark ? "#ff00ff" : "#94a3b8"} />

                <HolographicCore isDark={isDark} />
                <MovingStars isDark={isDark} />
            </Canvas>
        </div>
    );
}
