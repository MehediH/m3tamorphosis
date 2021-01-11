import { Html, MeshWobbleMaterial, shaderMaterial, Text } from "drei";
import { useRef } from "react";
import { useFrame, useLoader  } from "react-three-fiber"
import { useSpring, a } from "react-spring/three";
import { TextureLoader } from "three";

export default function SpinningBox({ position, factor, args, speed, isPaused, track, artists, cover, action }){
    const mesh = useRef(null);

    useFrame(() => ( mesh.current.rotation.x = mesh.current.rotation.y += (isPaused ? 0.0 : 0.01) ));
    
    const props = useSpring({
        scale: isPaused ? [1.9, 1.9, 1.9] : [1.5, 1.5, 1.5],
    }); 

    const texture = useLoader(TextureLoader, cover ? cover: "https://images.genius.com/a648b3698f94ea28fda903cbadddbb21.640x640x1.jpg")
   
    const handleAction = () => {        
        if(action == "next"){
            window.player.nextTrack();
        } else if(action == "prev"){
            window.player.previousTrack();
        } else{
            window.player.togglePlay();
        }

    }

    return (
        <>
            <a.mesh castShadow ref={mesh} position={position} scale={props.scale} onClick={handleAction}>
                <boxBufferGeometry attach='geometry' args={args} />
                <MeshWobbleMaterial attach='material' map={texture} speed={speed} factor={factor} />
            </a.mesh> 

            <Text
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                fontSize={0.5}
                position={[0, -2.8, 0]}
                shadows={true}
                texture
                anchorY="middle">
                    {track}
            </Text>
            <Text
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                fontSize={0.2}
                textShad
                position={[0, -3.4, 0]}
                anchorY="bottom">
                    {artists}
            </Text>
        </>
    )
}