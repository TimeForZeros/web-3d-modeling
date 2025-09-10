'use client';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useLoader } from '@react-three/fiber';
import {
  GizmoHelper,
  GizmoViewport,
  Gltf,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
  useGLTF,
} from '@react-three/drei';
import { RefObject, useRef, useState, useEffect, Suspense, forwardRef, createRef } from 'react';
import { Object3D, Object3DEventMap } from 'three';
import { create } from 'zustand';

type XbotState = {
  nodes: Record<string, RefObject<Object3D<Object3DEventMap>>>;
};
type XbotStateAction = {
  setNodeRef: (id: string, el: Object3D<Object3DEventMap>) => void,
};

type XbotStore = XbotState & XbotStateAction;

const useXbotStore = create<XbotStore>((set, get) => ({
  nodes: {},
  setNodeRef: (id, el) => {
    const nodes = get().nodes;
    if (!nodes[id]) {
      nodes[id] = { current: el as Object3D<Object3DEventMap> };
      set({ nodes: { ...nodes } });
    }
    return nodes[id];
  }
}));

type GizmoState = {
  selectedMesh: RefObject<Object3D | Object3DEventMap | null> | null
  mode: 'scale' | 'rotate' | 'translate'
}
type GizmoStateAction = {
  setSelectedMesh: (ref: RefObject<Object3D> | null) => void,
  setMode: (mode: 'scale' | 'rotate' | 'translate') => void,
}
type GizmoStore = GizmoState & GizmoStateAction;
const useGizmoStore = create<GizmoStore>((set) => ({
  selectedMesh: null,
  mode: 'translate',
  setSelectedMesh: (ref) => set({selectedMesh: ref}),
  setMode: (mode) => set({mode}),
}))

const Xbot = () => {
  const store = useXbotStore();
  const gizmoStore = useGizmoStore();
  console.log(store.nodes);

  const { scene } = useGLTF('/Xbot.glb');
  return (
    <primitive
      object={scene}
      ref={(el) => store.setNodeRef('test', el)}
      castShadow
      receiveShadow
      scale={1}
      position={[0, 0, 0]}
      onClick={() => gizmoStore.setSelectedMesh(store.nodes['test'])}
      onPointerMissed={() => gizmoStore.setSelectedMesh(null)}
    />
  );
});

Xbot.displayName = 'Xbot';

function Scene() {
  const gizmoStore = useGizmoStore();
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
  const { scene } = useGLTF('/Xbot.glb');

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense>
        <Xbot />
      </Suspense>
      {gizmoStore.selectedMesh && <TransformControls mode={gizmoMode} object={gizmoStore.selectedMesh} />}
      <OrbitControls enabled={!gizmoStore.selectedMesh} />
      <Grid scale={100} />
    </>
  );
}

export default function Home() {
  return (
    <div className="h-screen">
      <Canvas>
        <color attach="background" args={['#F0F0F0']} />
        <Scene />
      </Canvas>
    </div>
  );
}
