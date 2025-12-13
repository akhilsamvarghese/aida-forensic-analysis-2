/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

const AntigravityInner = ({
    count = 300,
    magnetRadius = 10,
    ringRadius = 10,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 2,
    lerpSpeed = 0.1,
    color = '#FF9FFC',
    autoAnimate = false,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule',
    fieldStrength = 10
}) => {
    const meshRef = useRef(null);
    const { viewport } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const mouseRef = useRef({ x: 0, y: 0 });

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseMoveTime = useRef(0);
    const virtualMouse = useRef({ x: 0, y: 0 });

    // Manual mouse tracking to ensure it works even if canvas is covered
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Convert pixel coordinates to normalized device coordinates (-1 to +1)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current = { x, y };

            lastMouseMoveTime.current = Date.now();
            lastMousePos.current = { x, y };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const particles = useMemo(() => {
        const temp = [];
        const width = viewport.width || 100;
        const height = viewport.height || 100;

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;

            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = (Math.random() - 0.5) * 20;

            const randomRadiusOffset = (Math.random() - 0.5) * 2;

            temp.push({
                t,
                factor,
                speed,
                xFactor,
                yFactor,
                zFactor,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                vx: 0,
                vy: 0,
                vz: 0,
                randomRadiusOffset
            });
        }
        return temp;
    }, [count, viewport.width, viewport.height]);

    useFrame(state => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const { viewport: v } = state;
        // Use our manual mouse ref instead of state.pointer
        const m = mouseRef.current;

        let destX = (m.x * v.width) / 2;
        let destY = (m.y * v.height) / 2;

        if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
            const time = state.clock.getElapsedTime();
            destX = Math.sin(time * 0.5) * (v.width / 4);
            destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
        }

        const smoothFactor = 0.25; // Much faster response (was 0.05)
        virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
        virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;

        const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

        particles.forEach((particle, i) => {
            let { t, speed, mx, my, mz, cz, randomRadiusOffset, xFactor, yFactor, zFactor } = particle;

            t = particle.t += speed * 0.8; // Increased base speed for more agility

            // 1. Ambient Drift (Particles float around naturally)
            // Increased drift range for more dynamic "spread" movement
            const driftX = Math.sin(t * 0.5 + xFactor) * 5;
            const driftY = Math.cos(t * 0.3 + yFactor) * 5;
            const driftZ = Math.sin(t * 0.4 + zFactor) * 2;

            // 2. No Global Parallax (Particles stay spread out)
            const projectionFactor = 1 - cz / 50;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            // Base target is initial pos + drift
            let targetPos = {
                x: mx + driftX,
                y: my + driftY,
                z: mz * depthFactor + driftZ
            };

            const dx = targetPos.x - projectedTargetX;
            const dy = targetPos.y - projectedTargetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < magnetRadius) {
                const angle = Math.atan2(dy, dx) + globalRotation;

                const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
                const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));

                const currentRingRadius = ringRadius + wave + deviation;

                // Smoothly blend between drift position and ring position based on distance
                const blend = Math.max(0, 1 - dist / magnetRadius); // 1 at center, 0 at edge

                const ringX = projectedTargetX + currentRingRadius * Math.cos(angle);
                const ringY = projectedTargetY + currentRingRadius * Math.sin(angle);
                const ringZ = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);

                // Lerp towards ring position if close
                targetPos.x = targetPos.x * (1 - blend) + ringX * blend;
                targetPos.y = targetPos.y * (1 - blend) + ringY * blend;
                targetPos.z = targetPos.z * (1 - blend) + ringZ * blend;
            }

            particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

            dummy.position.set(particle.cx, particle.cy, particle.cz);

            dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
            dummy.rotateX(Math.PI / 2);

            const currentDistToMouse = Math.sqrt(
                Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
            );

            // Scale effect: Pulse when drifting, shrink/grow when interacting
            const distFromRing = Math.abs(currentDistToMouse - ringRadius);
            let scaleFactor = 1;

            if (currentDistToMouse < magnetRadius) {
                scaleFactor = 1 - distFromRing / 10;
                scaleFactor = Math.max(0, Math.min(1, scaleFactor));
            } else {
                // Ambient pulse for distant particles
                scaleFactor = 0.5 + Math.sin(t * 2) * 0.2;
            }

            const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
            dummy.scale.set(finalScale, finalScale, finalScale);

            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);
        });

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
            {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
            {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
            {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
            <meshBasicMaterial color={color} />
        </instancedMesh>
    );
};

const Antigravity = (props) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 50], fov: 35 }}
            eventSource={document.body}
            eventPrefix="client"
        >
            <AntigravityInner {...props} />
        </Canvas>
    );
};

export default Antigravity;
