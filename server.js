import express from "express";
import "dotenv/config";
import cors from "cors";
import {AccessToken} from "livekit-server-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

if(!apiKey || !apiSecret){
    console.log("missing api key or secret");
    process.exit(1);
}

app.post("/token", async (req, res) => {
    const {room, identity} = req.body;

    const token = new AccessToken(apiKey, apiSecret, {identity});

    token.addGrant({
        room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
    })

    const jwt = await token.toJwt();
    console.log(`jwt: ${jwt}`)

    res.json({
        token: jwt

    })

});

app.listen(3679, () => {console.log("Listening on port 3679")});