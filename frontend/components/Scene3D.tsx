
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Model() {
    // Load the model from the public folder
    const { scene } = useGLTF("/scene.gltf");

    // Clone the scene to avoid mutating the cached original
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <primitive
            object={clonedScene}
            scale={2}
            position={[0, -1.5, 0]}
            rotation={[0, Math.PI / 5, 0]}
        />
    );
}

// function BackgroundParticles() { ... } (Commented out for debugging)

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

                <Model />
                {/* <BackgroundParticles /> */}
                {/* <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={0.5} /> */}

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
}

