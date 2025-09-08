'use client';
import { Canvas } from '@react-three/fiber';
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
} from '@react-three/drei';
import { RefObject, useRef, useState, useEffect } from 'react';
import { Object3D } from 'three';
function Scene() {
  const meshRef = useRef(null);
  const mesh2Ref = useRef(null);
  const [selectedMesh, setSelectedMesh] = useState<Object3D | null>(null);
  const [gizmoMode, setGizmoMode] = useState<'scale' | 'rotate' | 'translate'>('translate');
  useEffect(() => {
    const handleKeyPress = (event) => {
      console.count();
      console.log(event);
      const { key } = event;
      console.log(key)
      switch (key) {
        case 'w':
          setGizmoMode('translate');
          break;
        case 'e':
          setGizmoMode('rotate');
          break;
        case 'r':
          setGizmoMode('scale');
          break;
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  },[]);

  const deselectMesh = () => {
    setSelectedMesh(null);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <mesh
        ref={meshRef}
        onClick={() => setSelectedMesh(meshRef.current)}
        onPointerMissed={deselectMesh} // Hides gizmo when clicking away
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh
        ref={mesh2Ref}
        position={[2, 0, 0]}
        onClick={() => setSelectedMesh(mesh2Ref.current)}
        onPointerMissed={deselectMesh} // Hides gizmo when clicking away
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {selectedMesh && <TransformControls mode={gizmoMode} object={selectedMesh} />}
      <OrbitControls enabled={!selectedMesh} />
      <Grid scale={100} />
    </>
  );
}

export default function Home() {
  return (
    <div className="h-screen">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
