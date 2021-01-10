import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { Canvas, extend } from "react-three-fiber";
import SpinningBox from '@/components/Box';
import { softShadows, OrbitControls, shaderMaterial, Stars, Html} from "drei";
import { Suspense, useEffect, useRef, useState } from 'react';
import { FaSpotify } from "react-icons/fa";
import { useSession, signin, signout, getSession, signOut } from "next-auth/client";
import initPlayer from '../lib/initPlayer';
import loadSDK from '../lib/loadSDK';

softShadows();

import glsl from 'babel-plugin-glsl/macro'
import { Color } from "three";
import Lights from '@/components/Lights';
const ColorMaterial = shaderMaterial(
  { time: 0, color: new Color(0.2, 0.0, 0.1) },
  // vertex shader
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
    }
  `
)

extend({ ColorMaterial })

export default function Home() {
  const mesh = useRef(null);
  const [ session, loading ] = useSession();
  const [ playing, setPlaying ] = useState();

  useEffect(() => {
    getSession().then(async (session) => {
      if(!session || !session.user) return;

      console.log(session)

      initPlayer(session.user.accessToken, setPlaying);
      loadSDK();
    });
  }, [])



  return (
    <>
      <Head>
        <title>m3tamorphosis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas shadowMap colorManagement camera={{ position: [-5, 2, 10], fov: 60 }}>
        <Lights/>

        <group>
          {!session && (
            <Html center>
              <button onClick={() => signin("spotify")} className={styles.login}><FaSpotify/>Login with Spotify</button>
            </Html>
          )}

          {(session && playing) && (
            <Suspense fallback={null}>
              <SpinningBox position={[0, 1, 0]} factor={0.5} args={[2, 2, 2]} speed={2} isPaused={playing.paused} track={playing.tracks.current_track.name} artists={playing.tracks.current_track.artists.map(a => a.name).join(", ")} cover={playing.tracks.current_track.album.images[0].url}/>
              <SpinningBox position={[-2, 1, -5]} factor={0} speed={6} isPaused={playing.paused}  action="prev" cover={playing.tracks.previous_tracks.length > 0 ? playing.tracks.previous_tracks[0].album.images[0].url : null}/>
              <SpinningBox position={[5, 1, -2]} factor={0} speed={6} isPaused={playing.paused} action="next" cover={playing.tracks.next_tracks.length > 0 ? playing.tracks.next_tracks[0].album.images[0].url : null}/>

             
            </Suspense>
          )}

        <Html  className={styles.container}>
                <button onClick={() => signOut()} className={`${styles.login} ${styles.logout}`}><FaSpotify/>Logout</button>
              </Html>

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

          
          <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -2, 0]}>
            <planeBufferGeometry attach='geometry' args={[300, 300]}/>
            <shadowMaterial attach='material' opacity={0.2}/>
           
          </mesh>
        </group> 
       
        <OrbitControls/>
        <colorMaterial attach='material'/>

      </Canvas>
    </>
  )
}
