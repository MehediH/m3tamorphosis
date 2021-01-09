import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { Canvas, extend } from "react-three-fiber";
import SpinningBox from 'components/Box';
import { softShadows, OrbitControls, shaderMaterial, Stars, Html} from "drei";
import { Suspense, useRef, useState } from 'react';
// import { Color } from "three";
import { FaSpotify } from "react-icons/fa";

softShadows();

// import glsl from 'babel-plugin-glsl/macro'

// const ColorMaterial = shaderMaterial(
//   { time: 0, color: new Color(0.2, 0.0, 0.1) },
//   // vertex shader
//   glsl`
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   // fragment shader
//   glsl`
//     uniform float time;
//     uniform vec3 color;
//     varying vec2 vUv;
//     void main() {
//       gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
//     }
//   `
// )

// extend({ ColorMaterial })

export default function Home() {
  const mesh = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <Head>
        <title>m3tamorphosis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas shadowMap colorManagement camera={{ position: [-5, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.2}/>
        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
       
        <pointLight position={[-10, 0, -20]} intensity={0.3}/>
        <pointLight position={[0, -10, 0]} intensity={1.5}/>

        <group>
          {!loggedIn && (
            <Html center>
              <button className={styles.login}><FaSpotify/>Login with Spotify</button>
            </Html>
          )}

          {loggedIn && (
            <Suspense fallback={null}>
              <SpinningBox position={[0, 1, 0]} factor={0.5} args={[2, 2, 2]} speed={2}/>
              <SpinningBox position={[-2, 1, -5]} factor={0} speed={6}/>
              <SpinningBox position={[5, 1, -2]} factor={0} speed={6}/>
            </Suspense>
          )}

          <Stars
            ref={mesh}
            radius={100} // Radius of the inner sphere (default=100)
            depth={50} // Depth of area where stars should fit (default=50)
            count={5000} // Amount of stars (default=5000)
            factor={10} // Size factor (default=4)
            saturation={1} // Saturation 0-1 (default=0)
            fade // Faded dots (default=false)
          >
          </Stars>

          
          <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -3, 0]}>
            <planeBufferGeometry attach='geometry' args={[100, 100]}/>
            <shadowMaterial attach='material' opacity={0.2}/>
            {/* <colorMaterial attach='material'/> */}
          </mesh>
        </group> 
       
        <OrbitControls/>
      </Canvas>
    </>
  )
}
