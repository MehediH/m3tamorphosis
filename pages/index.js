import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { Canvas } from "react-three-fiber";
import SpinningBox from 'components/Box';
import { softShadows, OrbitControls, Sky, Stars } from "drei";
import { Suspense } from 'react';

softShadows();

export default function Home() {

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
          <Suspense fallback={null}>
            <SpinningBox position={[0, 1, 0]} factor={0.5} args={[2, 2, 2]} speed={2}/>
            <SpinningBox position={[-2, 1, -5]} factor={0} speed={6}/>
            <SpinningBox position={[5, 1, -2]} factor={0} speed={6}/>
          </Suspense>

          <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -3, 0]}>
            <planeBufferGeometry attach='geometry' args={[100, 100]}/>
            <shadowMaterial attach='material' opacity={0.2}/>
          </mesh>
        </group> 
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={10} // Size factor (default=4)
          saturation={1} // Saturation 0-1 (default=0)
          fade // Faded dots (default=false)
        />
        <OrbitControls/>
      </Canvas>
    </>
  )
}
