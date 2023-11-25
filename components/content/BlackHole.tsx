import React, { useRef, useState } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Mesh, ShaderMaterial } from 'three';

extend({ ShaderMaterial });

const BlackHoleShader = {
  uniforms: {
    time: { value: 0 },
    resolution: { value: [1, 1] },
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      float dist = distance(uv, vec2(0.5));
      float edge = smoothstep(0.4, 0.5, dist);
      float distortion = sin(time + dist * 10.0) * 0.1;
      uv.x += distortion;
      uv.y += distortion;
      gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), edge);
    }
  `,
};

const BlackHole: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const [active, setActive] = useState(false);
  const { gl } = useThree();

  // Animation function that scales the mesh up and down
  const animateOnTouch = () => {
    setActive(!active);
  };

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
    }
  });

  return (
    <mesh
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={animateOnTouch} // Trigger animation on click
      onPointerDown={animateOnTouch} // Trigger animation on touch
    >
      <sphereGeometry args={[2, 32, 32]} />
      <shaderMaterial args={[BlackHoleShader]} />
    </mesh>
  );
};

export default BlackHole;
