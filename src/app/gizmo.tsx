'use client';
import {
  TransformControls,
  OrbitControls,
} from '@react-three/drei';
import {
  RefObject,
  useEffect,
  useMemo,
} from 'react';
import { create } from 'zustand';
import type { Object3D, Object3DEventMap } from 'three';

type GizmoState = {
  selectedMesh: Object3D<Object3DEventMap> | RefObject<Object3D<Object3DEventMap>> | null;
  mode: 'scale' | 'rotate' | 'translate';
};
type GizmoStateAction = {
  setSelectedMesh: (ref: RefObject<Object3D> | null) => void;
  setMode: (mode: 'scale' | 'rotate' | 'translate') => void;
};
type GizmoStore = GizmoState & GizmoStateAction;
export const useGizmoStore = create<GizmoStore>((set) => ({
  selectedMesh: null,
  mode: 'translate',
  setSelectedMesh: (ref) => set({ selectedMesh: ref }),
  setMode: (mode) => set({ mode }),
}));

export const Gizmo = () => {
  const gizmoStore = useGizmoStore();
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      switch (key) {
        case 'w':
          gizmoStore.setMode('translate');
          break;
        case 'e':
          gizmoStore.setMode('rotate');
          break;
        case 'r':
          gizmoStore.setMode('scale');
          break;
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <>
      {gizmoStore.selectedMesh && (
        <TransformControls mode={gizmoStore.mode} object={gizmoStore.selectedMesh} />
      )}
      <OrbitControls enabled={!gizmoStore.selectedMesh} />
    </>
  );
};
