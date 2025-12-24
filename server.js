import express from 'express';
import {AccessToken} from "livekit-server-sdk";
import "dotenv/config";

const app = express();
app.use(express.json());

app.post("/token", (req, res) => {
    const {room, identity} = req.body;

    if(!room || !identity) {
        return res.status(400).json({error:"room & id required"});
    }

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {identity}
    )

    token.addGrant({
        room,
        roomJoin:true,
        canPublish:true,
        canSubscribe:true,
        }
    )

    res.json({token:token.toJwt()});
});

app.listen(3000, () => {console.log("Token server running on port 3000")});