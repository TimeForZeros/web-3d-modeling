'use client';
import type { RefObject } from 'react';
import type { Object3D, Object3DEventMap } from 'three';
import { create } from 'zustand';
import { useGLTF } from '@react-three/drei';
import { useGizmoStore } from './gizmo';
type XbotState = {
  nodes: Record<string, RefObject<Object3D<Object3DEventMap>>>;
};
type XbotStateAction = {
  setNodeRef: (id: string, el: Object3D<Object3DEventMap>) => void;
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
  },
}));

const Xbot = () => {
  const store = useXbotStore();
  const gizmoStore = useGizmoStore();
  console.log(store.nodes);

  const { scene } = useGLTF('/Xbot.glb');
  return (
    <primitive
      object={scene}
      ref={(el: Object3D<Object3DEventMap>) => store.setNodeRef('test', el)}
      castShadow
      receiveShadow
      scale={1}
      position={[0, 0, 0]}
      onClick={() => gizmoStore.setSelectedMesh(store.nodes['test'])}
      onPointerMissed={() => gizmoStore.setSelectedMesh(null)}
    />
  );
};

export default Xbot;
