'use client'

import React, { useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Jellyfish from './Jellyfish'

// Bioluminescent particle field (embers floating upwards)
function FloatingParticles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  // Create random initial positions and physics values for each particle
  const [positions, particleData] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const data = []
    
    for (let i = 0; i < count; i++) {
      // Position spread
      pos[i * 3] = (Math.random() - 0.5) * 12      // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10  // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8   // Z
      
      data.push({
        speed: 0.15 + Math.random() * 0.2,          // Floating up speed
        swaySpeed: 0.5 + Math.random() * 1.0,       // Sway frequency
        swayAmp: 0.05 + Math.random() * 0.15,       // Sway width
        angle: Math.random() * Math.PI * 2,         // Starting phase
      })
    }
    
    return [pos, data]
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    
    const geo = pointsRef.current.geometry
    const posAttr = geo.attributes.position
    const positionsArray = posAttr.array as Float32Array
    const time = state.clock.getElapsedTime()
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const data = particleData[i]
      
      // Move particle upwards
      positionsArray[idx + 1] += data.speed * delta
      
      // Sway left and right (X & Z)
      positionsArray[idx] += Math.sin(time * data.swaySpeed + data.angle) * data.swayAmp * delta
      positionsArray[idx + 2] += Math.cos(time * data.swaySpeed * 0.8 + data.angle) * data.swayAmp * delta
      
      // If particle goes off-screen top, reset to bottom
      if (positionsArray[idx + 1] > 5.0) {
        positionsArray[idx + 1] = -5.0
        positionsArray[idx] = (Math.random() - 0.5) * 12
        positionsArray[idx + 2] = (Math.random() - 0.5) * 8
      }
    }
    
    posAttr.needsUpdate = true
  })

  // Create a canvas-based round particle texture for smooth glowing dots
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
      gradient.addColorStop(0, 'rgba(227, 246, 255, 1)')
      gradient.addColorStop(0.3, 'rgba(250, 183, 201, 0.8)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 16, 16)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        map={glowTexture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 3D Headline text that lives inside the canvas for spatial occlusion with the jellyfish
// NOTE: Removed in-canvas 3D text so all HTML text renders sharply in the foreground.

// Mouse parallax camera rig: camera shifts subtly based on pointer position
function CameraParallax() {
  const { camera } = useThree()
  const basePos = useRef(new THREE.Vector3(0, 0, 8))
  
  useFrame((state) => {
    // Camera shifts at ~15% speed of the pointer (slowest layer for depth)
    const targetX = basePos.current.x + state.pointer.x * 0.3
    const targetY = basePos.current.y + state.pointer.y * 0.15
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02)
  })
  
  return null
}

export default function Scene() {
  const [aboutActive, setAboutActive] = useState(false)

  useEffect(() => {
    const target = document.getElementById('about')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setAboutActive(entry.isIntersecting)
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -45% 0px',
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    // Inline styles ensure the canvas stays behind the HTML hero content and does not obstruct UI interactions.
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ pointerEvents: 'auto' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Mouse parallax camera controller */}
        <CameraParallax />
        
        {/* Soft background space illumination */}
        <ambientLight intensity={0.06} />
        
        {/* Cyan rim light from upper-right — creates the dual-tone edge illumination */}
        <pointLight 
          position={[4, 3, 3]} 
          intensity={8.0} 
          color="#E3F6FF" 
          distance={15} 
          decay={2} 
        />
        
        {/* Pink rim light from lower-left — warm bioluminescent side */}
        <pointLight 
          position={[-4, -2, 2]} 
          intensity={6.0} 
          color="#FAB7C9" 
          distance={15} 
          decay={2} 
        />
        
        {/* Subtle cyan light from above right to highlight curves */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.4} 
          color="#E3F6FF" 
        />
        
        {/* Soft pink fill light from the bottom left */}
        <directionalLight 
          position={[-5, -5, -2]} 
          intensity={0.2} 
          color="#FAB7C9" 
        />
        
        {/* The center bioluminescent Jellyfish rendered in front of the hero headline text */}
        <Jellyfish aboutActive={aboutActive} />
        
        {/* Floating embers */}
        <FloatingParticles count={150} />
      </Canvas>
    </div>
  )
}
