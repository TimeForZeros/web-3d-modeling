'use client';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Xbot from './xbot';
import { Gizmo } from './gizmo';
import { Grid } from '@react-three/drei';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense>
        <Xbot />
      </Suspense>
      <Gizmo />
      <Grid scale={100} />
    </>
  );
}

export default function Home() {
  return (
    <div className="h-screen">
      <Canvas>
        {/* <color attach="background" args={['#F0F0F0']} /> */}
        <Scene />
      </Canvas>
    </div>
  );
}
