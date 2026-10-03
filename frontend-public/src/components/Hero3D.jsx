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

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Core shape: an icosahedron wireframe - a "data structure" / network feel
    const group = new THREE.Group()
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 1)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.35 })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    // Glowing nodes at each vertex
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8)
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 })
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

    // Ambient particle field for depth
    const particleCount = 140
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    for(let i=0; i<particleCount; i++){
      particlePos[i*3] = (Math.random()-0.5) * 14
      particlePos[i*3+1] = (Math.random()-0.5) * 14
      particlePos[i*3+2] = (Math.random()-0.5) * 8 - 2
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({ color: 0x4f46e5, size: 0.03, transparent: true, opacity: 0.5 })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    let frameId
    let angle = 0
    const animate = () => {
      if(!reducedMotion){
        angle += 0.0016
        group.rotation.y = angle
        group.rotation.x = Math.sin(angle * 0.6) * 0.15
        particles.rotation.y = -angle * 0.3
      }
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      if(!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      coreGeo.dispose()
      coreMat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />
}
