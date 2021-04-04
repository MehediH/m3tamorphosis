import { MeshWobbleMaterial } from "drei";
import { useRef } from "react";
import { useFrame, useLoader  } from "react-three-fiber"
import { useSpring, a } from "react-spring/three";
import { TextureLoader } from "three";
import LargeText from "./LargeText";

export default function SpinningBox({ position, factor, args, speed, isPaused, track, trackId, artists, cover, action, textColor }){
    const mesh = useRef(null);

    useFrame(() =>  {
        if(!mesh.current) return;

        mesh.current.rotation.x = mesh.current.rotation.y += (isPaused ? 0.0 : 0.01)
    });
    
    const props = useSpring({
        scale: isPaused ? [1.9, 1.9, 1.9] : [1.5, 1.5, 1.5],
    }); 

    const texture = useLoader(TextureLoader, cover ? cover: "https://images.genius.com/a648b3698f94ea28fda903cbadddbb21.640x640x1.jpg")
   
    const handleAction = () => {
        window.player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }

            const { previous_tracks, next_tracks, current_track } = state.track_window
        
            // if user clicks on currently playing song, we just toggle playback
            if(trackId === current_track.id){
                window.player.togglePlay();
            } 

            // otherwise, we play previous/next
            if(action === "next"){
                const findPosition = next_tracks.findIndex(t => t.id === trackId);
                let movementsNeeded = findPosition + 1;

                while(movementsNeeded != 0) {
                    window.player.nextTrack();
                    movementsNeeded -= 1;
                }
            } else if(action === "prev"){
                const findPosition = previous_tracks.reverse().findIndex(t => t.id === trackId);
                let movementsNeeded = findPosition + 1;

                console.log(findPosition, movementsNeeded)

                while(movementsNeeded != 0) {
                    window.player.previousTrack();
                    movementsNeeded -= 1;
                }
            }
        }) 

    }

    return (
        <>
            <a.mesh castShadow ref={mesh} position={position} scale={props.scale} onClick={handleAction}>
                <boxBufferGeometry attach='geometry' args={args} />
                <MeshWobbleMaterial attach='material' map={texture} speed={speed} factor={factor} />
            </a.mesh> 

            <LargeText body={track} position={[0, -2.8, 0]} fontSize={0.5} anchorX="center" anchorY="middle" color={textColor}/>
            <LargeText body={artists} position={[0, -3.5, 0]} fontSize={0.2} anchorX="center" anchorY="bottom" color={textColor}/>
        </>
    )
}