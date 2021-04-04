import dynamic from 'next/dynamic'
import { useEffect } from 'react';
const SpinningBox = dynamic(() => import('./SpinningBox'), { ssr: false })

const UpcomingTracks = ({ tracks, paused, reverse}) => {
    if(tracks.length === 0) return null;

    useEffect(() => {
        console.log(tracks)
    })

    return (
        tracks.map((track, index) => 
            <SpinningBox
                key={index}
                position={[(reverse ? -6 : 6) + (index* (reverse ? -6 : 6)), 1, -5 + (index*-4)]}
                factor={0}
                speed={6}
                isPaused={paused}
                action={ reverse ? "prev" : "next" }
                trackId={track.id}
                cover={track.album.images[0].url}
            />
        )
    )
}

export default UpcomingTracks;