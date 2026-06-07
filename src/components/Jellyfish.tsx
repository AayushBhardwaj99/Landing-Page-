'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Define the custom shader material for the bioluminescent jellyfish bell
const JellyfishMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorPink: new THREE.Color('#FAB7C9'),
    uColorCyan: new THREE.Color('#E3F6FF'),
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Calculate deformation
      vec3 pos = position;
      
      // Pulsating contraction: sine wave of time, combined with height
      // The pulse is stronger at the base (y closer to 0) than at the top (y closer to 1.5)
      float heightFactor = 1.0 - (pos.y / 1.5); // 0 at top, 1 at base
      
      // Pulsing wave: rapid contraction, slower relaxation
      float pulseCycle = uTime * 2.5;
      float pulse = (sin(pulseCycle - pos.y * 1.2) * 0.5 + 0.5);
      pulse = pow(pulse, 2.0) * 0.15 * heightFactor;
      
      // Contract inwards along XZ, and expand in Y during contraction
      pos.xz *= (1.0 - pulse * 1.3);
      pos.y += pulse * 0.4;
      
      // Add subtle organic high-frequency ripple
      float ripple = sin(pos.y * 8.0 + uTime * 4.0) * 0.03 * heightFactor;
      pos.x += ripple;
      pos.z += cos(pos.y * 8.0 + uTime * 4.0) * 0.03 * heightFactor;
      
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform vec3 uColorPink;
    uniform vec3 uColorCyan;

    void main() {
      vec3 normal = normalize(vNormal);
      
      // View vector (from camera to vertex)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Fresnel term: glow at the silhouette
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Blending colors based on height and time
      float heightFactor = clamp(vPosition.y / 1.5, 0.0, 1.0);
      float colorBlend = heightFactor + sin(uTime * 1.5 + vPosition.y * 2.0) * 0.15;
      colorBlend = clamp(colorBlend, 0.0, 1.0);
      
      vec3 baseColor = mix(uColorPink, uColorCyan, colorBlend);
      
      // Glowing rim
      vec3 glow = baseColor * (fresnel * 2.2 + 0.15);
      
      // Internal glowing core
      float core = 1.0 - clamp(length(vPosition.xz) / 1.5, 0.0, 1.0);
      glow += uColorPink * pow(core, 5.0) * (sin(uTime * 2.5) * 0.3 + 0.7) * 0.8;
      
      // Soft pulsing light
      float pulseLight = sin(uTime * 2.5) * 0.1 + 0.9;
      glow *= pulseLight;
      
      // Transparency
      float alpha = fresnel * 0.75 + pow(core, 3.0) * 0.5 + 0.12;
      
      gl_FragColor = vec4(glow, alpha);
    }
  `
)

// Extend R3F elements
extend({ JellyfishMaterial })

// Add type safety for TS JSX compiler
declare global {
  namespace JSX {
    interface IntrinsicElements {
      jellyfishMaterial: any;
    }
  }
}

export default function Jellyfish({ aboutActive }: { aboutActive: boolean }) {
  const jellyfishGroup = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  // Track mouse states
  const mouse = useRef({ x: 0, y: 0, active: false })
  const lastPointer = useRef(new THREE.Vector2())
  const inactiveTime = useRef(0)
  
  // Setup tentacles (physics-based delay trail)
  // We'll create:
  // - 4 central thick oral arms (ribbon-like)
  // - 12 peripheral thin stinging tentacles (thread-like)
  const numOralArms = 4
  const numTentacles = 12
  const pointsPerTentacle = 25
  const segmentLength = 0.22
  
  // Initialize tentacle points arrays
  // We hold refs to Vector3 arrays to animate them smoothly in the frame loop without React re-renders
  const { oralArmPaths, tentaclePaths, oralArmsRefs, tentaclesRefs } = useMemo(() => {
    const oralRefs = Array.from({ length: numOralArms }, () => React.createRef<any>())
    const tentRefs = Array.from({ length: numTentacles }, () => React.createRef<any>())
    
    const oralPaths = Array.from({ length: numOralArms }, (_, idx) => {
      const angle = (idx / numOralArms) * Math.PI * 2
      const radius = 0.4 // attached closer to center
      const startX = Math.cos(angle) * radius
      const startZ = Math.sin(angle) * radius
      
      return Array.from({ length: pointsPerTentacle }, (_, i) => 
        new THREE.Vector3(startX, -i * segmentLength, startZ)
      )
    })
    
    const tentPaths = Array.from({ length: numTentacles }, (_, idx) => {
      const angle = (idx / numTentacles) * Math.PI * 2
      const radius = 1.35 // attached to the outer rim of the bell
      const startX = Math.cos(angle) * radius
      const startZ = Math.sin(angle) * radius
      
      // Stinging tentacles are longer (30 points)
      return Array.from({ length: pointsPerTentacle + 5 }, (_, i) => 
        new THREE.Vector3(startX, -i * (segmentLength * 0.8), startZ)
      )
    })
    
    return { 
      oralArmPaths: oralPaths, 
      tentaclePaths: tentPaths, 
      oralArmsRefs: oralRefs, 
      tentaclesRefs: tentRefs 
    }
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    
    // 1. Update material time uniform
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
    }
    
    // 2. Track cursor inactivity and calculate target position
    const dist = state.pointer.distanceTo(lastPointer.current)
    if (dist > 0.0005) {
      lastPointer.current.copy(state.pointer)
      inactiveTime.current = 0
      mouse.current.active = true
    } else {
      inactiveTime.current += delta
      if (inactiveTime.current > 2.5) {
        mouse.current.active = false
      }
    }
    
    const basePosition = new THREE.Vector3(
      0,
      aboutActive ? 0.4 : 0,
      0
    )

    // Clamp X movement to prevent the jellyfish drifting too far right
    const pointerX = Math.min(state.pointer.x * 2.5, 0.8)
    
    const pointerTarget = new THREE.Vector3(
      pointerX,
      state.pointer.y * 1.2,
      state.pointer.y * -0.5
    )

    const ambientWander = new THREE.Vector3(
      Math.sin(t * 0.3) * 0.18,
      Math.cos(t * 0.25) * 0.12,
      Math.sin(t * 0.15) * 0.12
    )

    const target = basePosition.clone()
      .add(mouse.current.active ? pointerTarget : ambientWander)

    // 3. Smoothly lerp jellyfish position towards target
    if (jellyfishGroup.current) {
      jellyfishGroup.current.position.x = THREE.MathUtils.lerp(
        jellyfishGroup.current.position.x,
        target.x,
        0.15
      )
      jellyfishGroup.current.position.y = THREE.MathUtils.lerp(
        jellyfishGroup.current.position.y,
        target.y,
        0.15
      )
      jellyfishGroup.current.position.z = THREE.MathUtils.lerp(
        jellyfishGroup.current.position.z,
        target.z,
        0.15
      )

      // Subtle orientation toward cursor movement
      jellyfishGroup.current.rotation.y = THREE.MathUtils.lerp(
        jellyfishGroup.current.rotation.y,
        state.pointer.x * 0.16,
        0.06
      )
      jellyfishGroup.current.rotation.x = THREE.MathUtils.lerp(
        jellyfishGroup.current.rotation.x,
        state.pointer.y * 0.12,
        0.06
      )
      jellyfishGroup.current.rotation.z = THREE.MathUtils.lerp(
        jellyfishGroup.current.rotation.z,
        -state.pointer.x * 0.04,
        0.05
      )

      // Slow pulsing roll rotation on top of cursor-facing orientation
      jellyfishGroup.current.rotation.y = THREE.MathUtils.lerp(
        jellyfishGroup.current.rotation.y,
        jellyfishGroup.current.rotation.y + Math.sin(t * 0.22) * 0.05,
        0.02
      )
      
      const currentPos = jellyfishGroup.current.position
      
      // 4. Update Oral Arms with inertia lag + wave physics
      oralArmPaths.forEach((path, pathIdx) => {
        const line = oralArmsRefs[pathIdx].current
        if (!line) return
        
        const angle = (pathIdx / numOralArms) * Math.PI * 2
        const radius = 0.4
        
        // The head/anchor position of this arm in world coordinates
        // Attach at base of the bell
        const localHead = new THREE.Vector3(
          Math.cos(angle) * radius,
          -0.2,
          Math.sin(angle) * radius
        )
        // Transform local attachment to world coordinate space (accounting for jellyfish tilting)
        localHead.applyEuler(jellyfishGroup.current!.rotation)
        const worldHead = currentPos.clone().add(localHead)
        
        // Update first point of the curve
        path[0].copy(worldHead)
        
        // Update other points (Verlet-like chain trailing)
        for (let i = 1; i < path.length; i++) {
          const prev = path[i - 1]
          const curr = path[i]
          
          // Organic waves propagating down the tentacles
          const waveSpeed = 4.0
          const waveFreq = 0.35
          const waveAmp = 0.05 * (i / path.length) * (sinPulse(t * 2.5 - i * 0.1) * 0.6 + 0.4)
          
          const waveX = Math.sin(t * waveSpeed - i * waveFreq + angle) * waveAmp
          const waveZ = Math.cos(t * waveSpeed * 0.8 - i * waveFreq + angle) * waveAmp
          
          // Desired target location (below the previous node, with wave deformation)
          const targetNode = prev.clone().add(new THREE.Vector3(waveX, -segmentLength, waveZ))
          
          // Smoothly trail (slower trail at the tip)
          const trailDamp = 0.22 - (i / path.length) * 0.1
          curr.lerp(targetNode, trailDamp)
        }
        
        // Feed updated vertices into line geometry
        // Since we are rendering global paths, we translate them back to relative coordinates of the group if rendering within the group,
        // or we render in world coordinates. Here we render relative to our component space.
        const relativePoints = path.map(p => p.clone().sub(currentPos))
        
        // Map points back to euler transformation of group so it behaves naturally inside group hierarchy
        const inverseRot = new THREE.Euler(
          -jellyfishGroup.current!.rotation.x,
          -jellyfishGroup.current!.rotation.y,
          -jellyfishGroup.current!.rotation.z,
          'ZYX'
        )
        const relativeRotatedPoints = relativePoints.map(p => p.applyEuler(inverseRot))
        
        line.geometry.setFromPoints(relativeRotatedPoints)
      })

      // 5. Update Outer Stinging Tentacles
      tentaclePaths.forEach((path, pathIdx) => {
        const line = tentaclesRefs[pathIdx].current
        if (!line) return
        
        const angle = (pathIdx / numTentacles) * Math.PI * 2
        // Dynamic pulsating radius: rim contracts when the bell pulses
        const pulseRatio = sinPulse(t * 2.5)
        const radius = 1.35 * (1.0 - pulseRatio * 0.12)
        
        const localHead = new THREE.Vector3(
          Math.cos(angle) * radius,
          -0.3 + pulseRatio * 0.08,
          Math.sin(angle) * radius
        )
        localHead.applyEuler(jellyfishGroup.current!.rotation)
        const worldHead = currentPos.clone().add(localHead)
        
        path[0].copy(worldHead)
        
        for (let i = 1; i < path.length; i++) {
          const prev = path[i - 1]
          const curr = path[i]
          
          const waveSpeed = 5.0
          const waveFreq = 0.25
          // Thin stinging tentacles sway more wildly and have longer segments
          const waveAmp = 0.08 * (i / path.length)
          const waveX = Math.sin(t * waveSpeed - i * waveFreq + angle) * waveAmp
          const waveZ = Math.cos(t * waveSpeed * 0.7 - i * waveFreq + angle) * waveAmp
          
          const targetNode = prev.clone().add(new THREE.Vector3(waveX, -segmentLength * 0.75, waveZ))
          const trailDamp = 0.28 - (i / path.length) * 0.12
          curr.lerp(targetNode, trailDamp)
        }
        
        const relativePoints = path.map(p => p.clone().sub(currentPos))
        const inverseRot = new THREE.Euler(
          -jellyfishGroup.current!.rotation.x,
          -jellyfishGroup.current!.rotation.y,
          -jellyfishGroup.current!.rotation.z,
          'ZYX'
        )
        const relativeRotatedPoints = relativePoints.map(p => p.applyEuler(inverseRot))
        
        line.geometry.setFromPoints(relativeRotatedPoints)
      })
    }
  })

  // Auxiliary pulse function to match the contraction wave
  const sinPulse = (val: number) => {
    const sine = Math.sin(val) * 0.5 + 0.5
    return Math.pow(sine, 2.0)
  }

  return (
    <group ref={jellyfishGroup}>
      {/* 3D Bell (Body) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        {/* @ts-ignore */}
        <jellyfishMaterial ref={materialRef} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner Glowing Organs (Hypothetical bioluminescent details inside the bell) */}
      <mesh position={[0, 0.2, 0]} scale={[0.5, 0.4, 0.5]}>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial 
          color="#FAB7C9" 
          transparent 
          opacity={0.35} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner Point Light to project bioluminescence onto environment */}
      <pointLight 
        color="#FAB7C9" 
        intensity={6.0} 
        distance={10} 
        decay={2.0} 
        position={[0, 0, 0]} 
      />
      <pointLight 
        color="#E3F6FF" 
        intensity={3.0} 
        distance={8} 
        decay={2.0} 
        position={[0, 0.4, 0]} 
      />

      {/* Oral Arms (Ribbons) */}
      {oralArmPaths.map((_, idx) => (
        <line ref={oralArmsRefs[idx]} key={`oral-${idx}`}>
          <bufferGeometry />
          <lineBasicMaterial 
            color="#FAB7C9" 
            transparent 
            opacity={0.65} 
            blending={THREE.AdditiveBlending} 
            linewidth={4.0} // Fallback for browsers that support it
          />
        </line>
      ))}

      {/* Stinging Tentacles (Threads) */}
      {tentaclePaths.map((_, idx) => (
        <line ref={tentaclesRefs[idx]} key={`tentacle-${idx}`}>
          <bufferGeometry />
          <lineBasicMaterial 
            color="#E3F6FF" 
            transparent 
            opacity={0.35} 
            blending={THREE.AdditiveBlending} 
            linewidth={1.0}
          />
        </line>
      ))}
    </group>
  )
}
