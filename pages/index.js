import Head from 'next/head'
import { FaSpotify } from "react-icons/fa";
import { FiBox, FiMaximize, FiLogOut } from "react-icons/fi";

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from "react-three-fiber";
import { softShadows, OrbitControls, Stars, Html, Text} from "drei";

import styles from '../styles/Home.module.scss'
import { useSession, signin, getSession, signOut } from "next-auth/client";

softShadows();

import Lights from '@/components/Lights';
import PlaybackControls from '@/components/PlaybackControls';
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

  const [ textColor, setTextColor ] = useState("#fff");
  const [ userAccess, setUserAccess ] = useState("");
  const [ isFullscreen, setIsFullscreen ] = useState(false);

  useEffect(() => {
    startPlayer();
  }, [])

  const startPlayer = (setupOnCall=false) => {
    getSession().then(async (session) => {
      if(!session || !session.user) return;

      setUserAccess(session.user.accessToken);
      initPlayer(session.user.accessToken, updatePlaying, updateBackground, stoppedPlaying, setupOnCall);
      if(!setupOnCall) loadSDK();
    });
  }

  const updatePlaying = ( state, setupOnCall ) => {
    setPlaying(state);

    console.log(state.disallows)

    if(setupOnCall){
      takeOver(userAccess, state.deviceId)
    }
  }

  const updateBackground = (color) => {
    const [ r, g, b ] = color

    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) / 1000);
    const textColour = (brightness > 125) ? '#000' : '#fff';

    setTextColor(textColour)
  }

  const stoppedPlaying = () => {
    setPlaying({ deviceSwitched: true });
  }

  const fullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }

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
                color={textColor}
                fontSize={1}
                letterSpacing={0.02}
                textAlign={'center'}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                position={[0, 2.0, 0]}
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
              <CurrentTrack track={playing.tracks.current_track} paused={playing.paused} textColor={textColor}/>
              <UpcomingTracks tracks={playing.tracks.previous_tracks.reverse()} paused={playing.paused} reverse/>
              <UpcomingTracks tracks={playing.tracks.next_tracks} paused={playing.paused}/>
              <PlaybackControls paused={playing.paused} textColor={textColor} disallows={playing.disallows}/>
            </Suspense>
          )}

          {(session && playing?.deviceSwitched) && (
            <>
              <Text
                color={'#fff'}
                fontSize={1}
                letterSpacing={0.02}
                textAlign={'center'}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                position={[0, 2.0, 0]}
                factor={-0.1}
                color={textColor}
              >
                Playing on another device
              </Text>
            <Html fullscreen className={styles.intro}>
              <button className={`${styles.login} ${styles.play}`} onClick={() => {
                startPlayer(true);
              }}><FaSpotify/>take over</button>
            </Html>
            </>
          )}

          {(session && playing?.deviceReady) && (
            <>
              <Text
                color={'#fff'}
                fontSize={1}
                letterSpacing={0.02}
                textAlign={'center'}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                position={[0, 2.0, 0]}
                factor={-0.1}
                color={textColor}
              >
                Ready for playback
              </Text>
              <Html fullscreen className={styles.intro}>
                <button className={`${styles.login} ${styles.play}`} onClick={() => takeOver(session.user.accessToken, playing.deviceId)}><FaSpotify/> Start playing</button>
              </Html>
            </>
          )}

          {(session && !playing) && (
             <Text
              fontSize={1}
              letterSpacing={0.02}
              textAlign={'center'}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              position={[0, 2.0, 0]}
              factor={-0.1}
              color={textColor}
            >
              Talking to Spotify...
            </Text>
          )}

          { session && (
            <Html fullscreen className={`${styles.uiControls} ${ isFullscreen ? styles.fullScreenControls : '' }`}>
              <button onClick={() => fullScreen()}><FiMaximize/>Fullscreen</button>
              <button onClick={() => orbit.current.reset()}><FiBox/>Reset</button>
              <button onClick={() => signOut()}><FiLogOut/>Logout</button>
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
          </mesh>
        </group> 
       
        <OrbitControls ref={orbit}/>

      </Canvas>
    </>
  )
}
