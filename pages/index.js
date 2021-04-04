import Head from 'next/head'
import { FaSpotify } from "react-icons/fa";

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from "react-three-fiber";
import { softShadows, OrbitControls, Stars, Html, Text} from "drei";

import styles from '../styles/Home.module.scss'
import { useSession, signin, getSession, signOut } from "next-auth/client";

softShadows();

import Lights from '@/components/Lights';
import CurrentTrack from '@/components/CurrentTrack';
import UpcomingTracks from '@/components/UpcomingTracks';
import initPlayer from '../lib/initPlayer';
import loadSDK from '../lib/loadSDK';
import takeOver from '../lib/takeOver';

export default function Home() {
  const mesh = useRef(null);
  const orbit = useRef(null);

  const [ session ] = useSession();
  const [ playing, setPlaying ] = useState();

  useEffect(() => {
    getSession().then(async (session) => {
      if(!session || !session.user) return;

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

      <Canvas shadowMap colorManagement camera={{fov: 60, position: [1, -3, 13]}}>
        <Lights/>

        <group>
          {!session && (
            <>
              <Text
                color={'#fff'}
                fontSize={1}
                letterSpacing={0.02}
                textAlign={'center'}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                position={[0, 1, 0]}
                factor={-0.1}
              >
                m3tamorphosis
              </Text>
              <Html center>
                <button onClick={() => signin("spotify")} className={styles.login}><FaSpotify/>Login with Spotify</button>
              </Html>
            </>
          )}

          {(session && playing?.deviceSelected) && (
            <Suspense fallback={null}>
              <CurrentTrack track={playing.tracks.current_track} paused={playing.paused}/>
              <UpcomingTracks tracks={playing.tracks.previous_tracks.reverse()} paused={playing.paused} reverse/>
              <UpcomingTracks tracks={playing.tracks.next_tracks} paused={playing.paused}/>

            </Suspense>
          )}

          {(session && playing?.deviceReady) && (
            <>
              <Text
                color={'#fff'}
                fontSize={1}
                letterSpacing={0.02}
                textAlign={'center'}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                position={[0, 1, 0]}
                factor={-0.1}
              >
                ready for playback
              </Text>
            <Html fullscreen className={styles.intro}>
            <button className={`${styles.login} ${styles.play}`} onClick={() => takeOver(session.user.accessToken, playing.deviceId)}><FaSpotify/> Start playing</button>

            </Html>
            </>
          )}

          {(session && !playing) && (
             <Text
              color={'#fff'}
              fontSize={1}
              letterSpacing={0.02}
              textAlign={'center'}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              position={[0, 1, 0]}
              factor={-0.1}
            >
              talking to spotify...
            </Text>
          )}

          { session && (
            <Html fullscreen className={styles.uiControls}>
              <button onClick={() => signOut()} className={`${styles.login} ${styles.logout}`}><FaSpotify/>Logout</button>
              <button onClick={() => orbit.current.reset()} className={`${styles.login} ${styles.logout}`}>Reset</button>
            </Html>
          )}

          <Stars
            ref={mesh}
            radius={100} 
            depth={50} 
            count={5000} 
            factor={10} 
            saturation={1} 
            fade
          />

          <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[0, -5, 0]}>
            <planeBufferGeometry attach='geometry' args={[300, 300]}/>
            <shadowMaterial attach='material' opacity={0.3}/>
            {/* <colorMaterial attach='material'/> */}
          </mesh>
        </group> 
       
        <OrbitControls ref={orbit}/>
        {/* <colorMaterial attach='material'/> */}

      </Canvas>
    </>
  )
}
