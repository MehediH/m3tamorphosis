import SpinningBox from "@/components/SpinningBox";

const CurrentTrack = ({ track, paused }) => {
    return (
        <SpinningBox
            position={[0, 1, 0]}
            factor={0.5}
            args={[2, 2, 2]}
            speed={2}
            isPaused={paused}
            track={track.name}
            artists={track.artists.map(a => a.name).join(", ")}
            cover={track.album.images[0].url}
        />

    )
}

export default CurrentTrack;