import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3D(){
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if(!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const width = mount.clientWidth
    const height = mount.clientHeight

    // 1. Scene Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 8) // Thoda aur peeche taake pura structure fit ho jaye

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // 2. Main Group (Jisme sab kuch hoga)
    const group = new THREE.Group()
    
    // --- LAYER 1: Outer Wireframe (Network Structure) ---
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 1)
    const coreMat = new THREE.MeshBasicMaterial({ 
      color: 0x6366f1, // Indigo color
      wireframe: true, 
      transparent: true, 
      opacity: 0.25 
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    // --- LAYER 2: Inner Solid Core (AI Brain feel) ---
    const innerGeo = new THREE.IcosahedronGeometry(1.1, 0)
    const innerMat = new THREE.MeshBasicMaterial({ 
      color: 0x818cf8, 
      transparent: true, 
      opacity: 0.15,
      wireframe: false
    })
    const inner = new THREE.Mesh(innerGeo, innerMat)
    group.add(inner)

    // --- LAYER 3: Glowing Nodes (Data Points) ---
    const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8)
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xc7d2fe }) // Light glowing blue
    const positions = coreGeo.attributes.position
    const seen = new Set()
    
    for(let i=0; i<positions.count; i++){
      const key = `${positions.getX(i).toFixed(2)},${positions.getY(i).toFixed(2)},${positions.getZ(i).toFixed(2)}`
      if(seen.has(key)) continue
      seen.add(key)
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(positions.getX(i), positions.getY(i), positions.getZ(i))
      group.add(node)
    }
    
    scene.add(group)

    // --- LAYER 4: Ambient Data Particles ---
    const particleCount = 250
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    
    for(let i=0; i<particleCount; i++){
      particlePos[i*3] = (Math.random()-0.5) * 20
      particlePos[i*3+1] = (Math.random()-0.5) * 20
      particlePos[i*3+2] = (Math.random()-0.5) * 12 - 2
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({ 
      color: 0x4f46e5, 
      size: 0.05, 
      transparent: true, 
      opacity: 0.6,
      blending: THREE.AdditiveBlending // Isse particles glow karte hain
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 3. Mouse Interaction (Parallax Effect)
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e) => {
      // Mouse position ko -1 se 1 ke darmiyan calculate karein
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // 4. Animation Loop
    let frameId
    let angle = 0
    
    const animate = () => {
      if(!reducedMotion){
        angle += 0.0015
        
        // Smoothly group ko mouse ki taraf jhukayein (Lerp effect)
        group.rotation.y += (mouseX * 0.6 - group.rotation.y) * 0.05
        group.rotation.x += (mouseY * 0.6 - group.rotation.x) * 0.05
        
        // Core ki apni rotation
        core.rotation.y = angle * 0.8
        core.rotation.x = Math.sin(angle * 0.5) * 0.1
        
        // Inner shape ulti direction mein ghoomay
        inner.rotation.y = -angle * 2
        inner.rotation.z = angle * 1.5

        // Particles ko dheere se ghoomayein
        particles.rotation.y = -angle * 0.3
        particles.rotation.x = angle * 0.1
      }
      
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    // 5. Handle Resize
    const handleResize = () => {
      if(!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // 6. Cleanup (Memory leaks se bachne ke liye)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId)
      
      coreGeo.dispose()
      coreMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
      
      if(mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full cursor-crosshair" aria-hidden="true" />
}
