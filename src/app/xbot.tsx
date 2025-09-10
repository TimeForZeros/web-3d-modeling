'use client';
import type { RefObject } from 'react';
import { Vector3, type Object3D, type Object3DEventMap } from 'three';
import { create } from 'zustand';
import { useGLTF } from '@react-three/drei';
import { useGizmoStore } from './gizmo';
import { CCDIKSolver, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useFrame, useLoader } from '@react-three/fiber';
import { useCCDIKSolver } from './hooks';
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
    if (!el) return;
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
  const xbot = useLoader(GLTFLoader, '/Xbot.glb');
  const { nodes } = xbot;

  const skeleton = {
    root: nodes.Armature,
    hips: nodes.mixamorigHips,
    leftLeg: nodes.mixamorigLeftLeg,
    rightLeg: nodes.mixamorigRightLeg,
  };

  // const iks = [
  //   effector: store.nodes.joints
  // ]
  // console.log(materials);
  // console.log(nodes);
  // const nodeList = Object.keys(nodes).filter((key) => key.startsWith('mixamorig')).map((key) => nodes[key]);
  // console.log(nodeList);
  // console.log(nodes.Armature)
  const worldPosition = new Vector3();
  const position = skeleton.leftLeg.getWorldPosition(worldPosition);
  console.log(position);
  return (
    <>
      <primitive
        object={nodes.Armature}
        // ref={(el) => store.setNodeRef('joints', el)}
        // onClick={() => gizmoStore.setSelectedMesh(store.nodes.joints)}
        // onPointerMissed={() => gizmoStore.setSelectedMesh(null)}
      />
      <mesh
        scale={0.1}
        position={position}
        ref={(el) => store.setNodeRef('test', el)}
        onClick={() => gizmoStore.setSelectedMesh(store.nodes.test)}
        onPointerMissed={() => gizmoStore.setSelectedMesh(null)}>
        <sphereGeometry />
        <meshBasicMaterial wireframe />
      </mesh>
      {/* <mesh geometry={skeleton.hips} /> */}
      {/* <group>
        <mesh geometry={nodes.Beta_Joints.geometry} material={materials.Beta_Joints_MAT} ref={(el) => store.setNodeRef('joints', el)} onClick={() => gizmoStore.setSelectedMesh(store.nodes.joints)} />
        <mesh geometry={nodes.Beta_Surface.geometry} material={materials['asdf1:Beta_HighLimbsGeoSG2']} />
      </group> */}
    </>
  );
};

export default Xbot;
