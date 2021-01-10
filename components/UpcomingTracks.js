import SpinningBox from "./SpinningBox";

const UpcomingTracks = ({ tracks, paused, reverse}) => {
    if(tracks.length === 0) return null;

    return (
        tracks.map((track, index) => 
            <SpinningBox
                key={index}
                position={[(reverse ? -6 : 6) + (index* (reverse ? -6 : 6)), 1, -5 + (index*-4)]}
                factor={0}
                speed={6}
                isPaused={paused}
                action="next"
                cover={track.album.images[0].url}
            />
        )
    )
}

export default UpcomingTracks;