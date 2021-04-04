import { Html } from "drei";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack} from "react-icons/fi";
import styles from "../styles/PlaybackControls.module.scss";

export default function PlaybackControls({ paused, textColor }){

    const handleAction = ( action ) => {
        if(action === "next"){
            window.player.nextTrack();
        } else if(action === "prev"){
            window.player.previousTrack();
        } else{
            window.player.togglePlay();
        }

    }

    return (
        <Html position={[-1.2, -4.5, 0]} className={`${styles.playbackControls} ${ textColor === "#000" ? styles.darkIcons : '' }`}>
            <FiSkipBack onClick={() => handleAction("prev")}/>
            { !paused ? <FiPause onClick={handleAction}/> : <FiPlay onClick={handleAction}/> }
            <FiSkipForward onClick={() => handleAction("next")}/>
        </Html>
    )
}