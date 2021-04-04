import { Html } from "drei";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack} from "react-icons/fi";
import styles from "../styles/PlaybackControls.module.scss";

export default function PlaybackControls({ paused, textColor, disallows }){

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
        <Html transform position={[-1.2, -4.5, 0]} className={`${styles.playbackControls} ${ textColor === "#000" ? styles.darkIcons : '' }`}>
            <FiSkipBack onClick={() => handleAction("prev")} className={disallows?.skipping_prev ? styles.disabled : ''} disabled={disallows?.skipping_prev}/>
            { !paused ? <FiPause onClick={handleAction}/> : <FiPlay onClick={handleAction}/> }
            <FiSkipForward onClick={() => handleAction("next")} className={disallows?.skipping_next ? styles.disabled : ''} disabled={disallows?.skipping_next}/>
        </Html>
    )
}