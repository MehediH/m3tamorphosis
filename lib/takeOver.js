const takeOver = async ( accessToken, deviceId ) => {
    await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'PUT',
        body: JSON.stringify({ device_ids: [deviceId], play: true }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
    })

}

export default takeOver;