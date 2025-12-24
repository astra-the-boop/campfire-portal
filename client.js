import {connect} from "https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.umd.min.js";

async function getToken(){
    const response = await fetch("http://localhost:3679/token",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            room: "campfire",
            identity: "astra-123"
        })
    });

    const data = await response.json();
    return data.token;
}

async function joinRoom(){
    const token = await getToken();
    const url = "ws://localhost:7880";

    try{
        const room = await LiveKit.connect(url,token);
        console.log(`connected to ${room.name}`);

        room.participants.forEach(participant => {
            console.log(`Participants joined: ${participant.identity}`);
            participant.tracks.forEach(trackPub => {
                if(trackPub.isSubscribed){
                    document.body.append(trackPub.track.attach());
                }
            });

            participant.on("trackSubscribed", track => {
                document.body.appendChild(track.attach());
            })
        })

        room.on("ParticipantConnected", participant => {
            console.log(`new participant ${participant.identity}`);
        })

    }catch(err){
        console.log(`failed: ${err}`)
    }
}

joinRoom();