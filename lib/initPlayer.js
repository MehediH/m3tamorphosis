import { prominent, average } from 'color.js'

const initPlayer = (token, setPlaying) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'M3TAMORPHOSIS',
        getOAuthToken: cb => { cb(token); }
      });
    
      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });
    
      // Playback status updates
      player.addListener('player_state_changed', state => { 
        if(!state) return;

        setPlaying({
          deviceSelected: true,
          tracks: state.track_window,
          paused: state.paused
        })

        prominent(state.track_window.current_track.album.images[0].url, { format: 'hex', amount: 2 }).then(colors => {
          document.getElementsByTagName("body")[0].style.background = `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
        })

       });
    
      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        setPlaying({ deviceReady: true, deviceId: device_id });
      });
    
      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);

        setPlaying({ deviceReady: false });
      });

          
      // Connect to the player!
      player.connect();

      window.player = player;
    };

}

export default initPlayer;