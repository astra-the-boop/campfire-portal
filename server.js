import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {origin: "*"}
});

const events = {};
const waiting = {};

function serializeEvents(){
    return Object.entries(events).map(([id,e])=>({
        id,
        online:e.users.size,
        waiting:waiting[id]?.size ?? 0
    }));
}

io.on("connection", (socket) => {
    socket.on("join-event", ({eventId, name})=>{
        socket.data = {eventId, name};

        events[eventId] ??= {users: new Map()};
        waiting[eventId] ??= new Set();

        events[eventId].users.set(socket.id, name);

        io.emit("events-update", serializeEvents());
    });

    socket.on("wait", () =>{
        const {eventId} = socket.data;
        waiting[eventId].add(socket.id);
        io.emit("events-update", serializeEvents())
    })

    socket.on("call", ()=>{
        const {eventId} = socket.data;
        const pool = waiting[eventId];

        const [callee] = pool;
        if(!callee){return}

        pool.delete(callee);
        io.to([socket.id, callee]).emit("match-found", {
            roomId: crypto.randomUUID()
        })
    })

    socket.on("disconnect", ()=>{
        const {eventId} = socket.data || {};
        if(!eventId) return;

        events[eventId]?.users.delet(socket.id);
        waiting[eventId]?.delete(socket.id);

        io.emit("events-update", serializeEvents());
    })
})

httpServer.listen(3000);