import Head from 'next/head'
import dynamic from 'next/dynamic'

import styles from '../styles/Home.module.scss'

import { Canvas } from "react-three-fiber";
import { softShadows, OrbitControls, Stars, Html} from "drei";
import { Suspense, useEffect, useRef, useState } from 'react';
import { FaSpotify } from "react-icons/fa";
import { useSession, signin, getSession, signOut } from "next-auth/client";
import initPlayer from '../lib/initPlayer';
import loadSDK from '../lib/loadSDK';
import takeOver from '../lib/takeOver';

softShadows();

const Lights = dynamic(() => import('@/components/Lights'), { ssr: false })
const CurrentTrack = dynamic(() => import('@/components/CurrentTrack'), { ssr: false })
const UpcomingTracks = dynamic(() => import('@/components/UpcomingTracks'), { ssr: false })

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
            <Html center>
              <button onClick={() => signin("spotify")} className={styles.login}><FaSpotify/>Login with Spotify</button>
            </Html>
          )}

          {(session && playing?.deviceSelected) && (
            <Suspense fallback={null}>
              <CurrentTrack track={playing.tracks.current_track} paused={playing.paused}/>
              <UpcomingTracks tracks={playing.tracks.previous_tracks.reverse()} paused={playing.paused} reverse/>
              <UpcomingTracks tracks={playing.tracks.next_tracks} paused={playing.paused}/>

            </Suspense>
          )}

          {(session && playing?.deviceReady) && (
            <Html fullscreen className={styles.intro}>
              <div className={styles.box}>
                <h1>m3tamorphosis is ready for playback</h1>
                <p>Selected m3tamorphosis as a playback device on Spotify, or take-over playback.</p>
                <button className={`${styles.login} ${styles.play}`} onClick={() => takeOver(session.user.accessToken, playing.deviceId)}><FaSpotify/> Start playing</button>
              </div>
            </Html>
          )}

          {(session && !playing) && (
            <Html fullscreen className={styles.intro}>
              <div className={styles.box}>
                <h1>m3tamorphosis</h1>
                <p>Talking to Spotify...this will only take a few seconds!</p>
              </div>
            </Html>
          )}

          { session && (
            <Html fullscreen className={styles.container}>
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
