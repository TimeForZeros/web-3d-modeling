'use client';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useLoader } from '@react-three/fiber';
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
  useGLTF,
} from '@react-three/drei';
import { RefObject, useRef, useState, useEffect, Suspense } from 'react';
import { Object3D } from 'three';
const Xbot = () => {
  const groupRef = useRef(null)
  const xBot = useGLTF('/Xbot.glb')
  console.log(xBot); 
  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={xBot} />
    </group>
  )
};
function Scene() {
  const meshRef = useRef(null);
  const mesh2Ref = useRef(null);
  const [selectedMesh, setSelectedMesh] = useState<Object3D | null>(null);
  const [gizmoMode, setGizmoMode] = useState<'scale' | 'rotate' | 'translate'>('translate');
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;
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
  }, []);

  const deselectMesh = () => {
    setSelectedMesh(null);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <mesh
        ref={meshRef}
        onClick={() => setSelectedMesh(meshRef.current)}
        onPointerMissed={deselectMesh}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh
        ref={mesh2Ref}
        position={[2, 0, 0]}
        onClick={() => setSelectedMesh(mesh2Ref.current)}
        onPointerMissed={deselectMesh}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Suspense>
        <Xbot />
      </Suspense>
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
