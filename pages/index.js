import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { Canvas, extend } from "react-three-fiber";
import SpinningBox from 'components/Box';
import { softShadows, OrbitControls, shaderMaterial, Stars, Html} from "drei";
import { Suspense, useEffect, useRef, useState } from 'react';
import { FaSpotify } from "react-icons/fa";
import { useSession, signin, signout, getSession, signOut } from "next-auth/client";
import { prominent } from 'color.js'

softShadows();

// import glsl from 'babel-plugin-glsl/macro'
// import { Color } from "three";
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
  const [ session, loading ] = useSession();
  const [playing, setPlaying] = useState();

  useEffect(() => {
    getSession().then(async (session) => {
      if(!session || !session.user) return;

      initPlayer(session.user.accessToken)
      loadPlayer(session.user.accessToken)
    });
  }, [])

  const loadPlayer = (token) => {
    const existingScript = document.getElementById('playerSDK');

    if(existingScript) return;

    const script = document.createElement('script');
    script.id = 'playerSDK';
    script.type = 'text/javascript';
    script.async = false;
    script.defer = true;
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => console.log("loaded");
    script.onerror = (error) => console.error(error);

    document.head.appendChild(script);
  }

  const initPlayer = (token) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'M3TAMORPHOSIS',
        getOAuthToken: cb => { cb(token); }
      });
    
      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });
    
      // Playback status updates
      player.addListener('player_state_changed', state => { 
        setPlaying({
          tracks: state.track_window,
          paused: state.paused
        })

        prominent(state.track_window.current_track.album.images[0].url, { amount: 2, format: 'hex' }).then(color => {
          document.getElementsByTagName("body")[0].style.background = `linear-gradient(160deg, ${color[0]} 0%, ${color[1]} 100%)`;
        })

       });
    
      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
    
      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });


      player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }

        let {
          current_track,
          next_tracks: [next_track]
        } = state.track_window;

        console.log('Currently Playing', current_track);
        console.log('Playing Next', next_track);
      });
          
      // Connect to the player!
      player.connect();
    };
  }

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
          {!session && (
            <Html center>
              <button onClick={() => signin("spotify")} className={styles.login}><FaSpotify/>Login with Spotify</button>
            </Html>
          )}

          {(session && playing) && (
            <Suspense fallback={null}>
              <SpinningBox position={[0, 1, 0]} factor={0.5} args={[2, 2, 2]} speed={2} isPaused={playing.paused} cover={playing.tracks.current_track.album.images[0].url}/>
              <SpinningBox position={[-2, 1, -5]} factor={0} speed={6} isPaused={playing.paused} cover={playing.tracks.previous_tracks.length > 0 ? playing.tracks.previous_tracks[0].album.images[0].url : null}/>
              <SpinningBox position={[5, 1, -2]} factor={0} speed={6} isPaused={playing.paused} cover={playing.tracks.next_tracks.length > 0 ? playing.tracks.next_tracks[0].album.images[0].url : null}/>
{/* 
              <Html fullscreen className={styles.container}>
                <button onClick={() => signOut()} className={`${styles.login} ${styles.logout}`}><FaSpotify/>Logout</button>
              </Html> */}
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
