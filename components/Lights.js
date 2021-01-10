const Lights = () => {
    return (
        <>
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
        </>
    )
}

export default Lights;