const loadSDK = () => {
    const existingScript = document.getElementById('playerSDK');

    if(existingScript) return;

    const script = document.createElement('script');
    script.id = 'playerSDK';
    script.type = 'text/javascript';
    script.async = false;
    script.defer = true;
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => console.log("loaded");
    script.onerror = (error) => console.error(error);

    document.head.appendChild(script);
}

export default loadSDK;