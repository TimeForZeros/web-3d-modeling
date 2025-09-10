import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CCDIKSolver } from 'three/examples/jsm/Addons.js'; // You may need to adjust the import path

export function useCCDIKSolver(skinnedMesh, iks, targetPosition) {
  const ikSolverRef = useRef(null);

  useEffect(() => {
    if (!skinnedMesh || !skinnedMesh.isSkinnedMesh) return;

    // Initialize the solver once
    const solver = new CCDIKSolver(skinnedMesh, iks);
    ikSolverRef.current = solver;

    return () => {
      // Optional: Cleanup if needed
    };
  }, [skinnedMesh, iks]);

  useFrame(() => {
    if (ikSolverRef.current) {
      // Update the target position
      if (iks[0].target.isObject3D && targetPosition) {
        iks[0].target.position.copy(targetPosition);
      }

      // Run the solver on every frame
      ikSolverRef.current.update();
    }
  });
}
