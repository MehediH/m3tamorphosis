import { MeshWobbleMaterial } from "drei";
import { useRef, useState } from "react";
import { useFrame } from "react-three-fiber"
import { useSpring, a } from "react-spring/three";

export default function SpinningBox({ position, color, args, speed}){
    const mesh = useRef(null);

    useFrame(() => ( mesh.current.rotation.x = mesh.current.rotation.y += 0.01 ));
    
    const [expand, setExpand] = useState(false);

    const props = useSpring({
        scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
    });

    return (
        <a.mesh castShadow ref={mesh} position={position} onClick={() => setExpand(!expand)} scale={props.scale}>
            <boxBufferGeometry attach='geometry' args={args} />
            <MeshWobbleMaterial attach='material' color={color} speed={speed} factor={0.9}/>
        </a.mesh>
    )
}