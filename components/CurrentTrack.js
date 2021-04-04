import dynamic from 'next/dynamic'
const SpinningBox = dynamic(() => import('./SpinningBox'), { ssr: false })

import { Plane, Text } from "drei";
import { useEffect, useRef, useState } from "react";

const CurrentTrack = ({ track, paused }) => {
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);

    const main = useRef(null);
    
    const handleDrag = (e) => {
        window.player.seek(Math.round((e.uv.x)/100 * duration)*100);
    }

    useEffect(() => {
        if(track) setDuration(track.duration_ms);
        
        const checkState = setInterval(() => {
            window.player.getCurrentState().then(state => {
                if (!state) {
                  console.error('User is not playing music through the Web Playback SDK');
                  return;
                }

                setProgress(state.position);
            });
        }, 1000);

        return () => clearInterval(checkState); 
    }, [duration, progress]);

    const convertMS = ( milliseconds ) => {
        let hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        hour = hour % 24;

        const pad = ( size, value ) => {
            let s = String(value);
            while (s.length < (size || 2)) {s = "0" + s;}
            return s;
        }

        return `${minute}:${pad(2, seconds)}`;
    }


    return (
        <>
            <SpinningBox
                position={[0, 1, 0]}
                factor={0.5}
                args={[2, 2, 2]}
                speed={2}
                isPaused={paused}
                track={track.name}
                trackId={track.id}
                artists={track.artists.map(a => a.name).join(", ")}
                cover={track.album.images[0].url}
            />

            <group position={[0, -3.8, 0]}>
                <Plane args={[5.0, 0.1]} onClick={handleDrag} ref={main}>
                    <meshBasicMaterial color="#E9EAED"/>
                </Plane>
                <Plane args={[(progress/duration) * 5, 0.1]} position={[-2.48 + (((progress/duration) * 5)/2.0), 0, 0.1]} onClick={handleDrag}>
                    <meshBasicMaterial color="#1DB954"/>
                </Plane>

                <Text
                    font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                    anchorX="center"
                    fontSize={0.2}
                    textShad
                    position={[-3.0, -0.1, 0]}
                    anchorY="bottom">
                     { convertMS(progress) }
                </Text>

                <Text
                    font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                    anchorX="center"
                    fontSize={0.2}
                    textShad
                    position={[3.0, -0.1, 0]}
                    anchorY="bottom">
                     { convertMS(duration) }
                </Text>
            </group>
           
        </>
 
    )
}

export default CurrentTrack;