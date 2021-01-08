import { Html, MeshWobbleMaterial, useTexture } from "drei";
import { useRef, useState } from "react";
import { useFrame } from "react-three-fiber"
import { useSpring, a } from "react-spring/three";
import Texture from './coverExample.png'; 

export default function SpinningBox({ position, factor, args, speed}){
    const mesh = useRef(null);

    useFrame(() => ( mesh.current.rotation.x = mesh.current.rotation.y += 0.01 ));
    
    const [expand, setExpand] = useState(false);

    const props = useSpring({
        scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
    }); 

    const texture = useTexture(Texture)
 
    return (
        <a.mesh castShadow ref={mesh} position={position} onClick={() => setExpand(!expand)} scale={props.scale}>
            <boxBufferGeometry attach='geometry' args={args} />
            <MeshWobbleMaterial attach='material' map={texture} speed={speed} factor={factor} />

        </a.mesh> 
    )
}