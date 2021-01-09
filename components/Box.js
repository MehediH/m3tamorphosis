import { Html, MeshWobbleMaterial, shaderMaterial } from "drei";
import { useRef, useState } from "react";
import { useFrame, useLoader  } from "react-three-fiber"
import { useSpring, a } from "react-spring/three";
import { TextureLoader } from "three";

export default function SpinningBox({ position, factor, args, speed}){
    const mesh = useRef(null);

    useFrame(() => ( mesh.current.rotation.x = mesh.current.rotation.y += 0.01 ));
    
    const [expand, setExpand] = useState(false);

    const props = useSpring({
        scale: expand ? [1.9, 1.9, 1.9] : [1.5, 1.5, 1.5],
    }); 

    const texture = useLoader(TextureLoader, "https://images.genius.com/a648b3698f94ea28fda903cbadddbb21.640x640x1.jpg")
 
    return (
        <a.mesh castShadow ref={mesh} position={position} onClick={() => setExpand(!expand)} scale={props.scale} cursor>
            <boxBufferGeometry attach='geometry' args={args} />
            <MeshWobbleMaterial attach='material' map={texture} speed={speed} factor={factor} />
           
        </a.mesh> 
    )
}