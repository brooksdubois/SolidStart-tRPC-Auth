// src/routes/api/trpc/trpc.ts
import { eventHandler } from "vinxi/http";
import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from '../server/api';

// Create a map to avoid duplicate handler init
let wss: WebSocketServer | undefined;

export default eventHandler({
    handler() { },
    websocket: {
        async open(peer) {
            if (!wss) {
                wss = new WebSocketServer({ noServer: true });
                const createContext = () => ({})
                applyWSSHandler({ wss, router: appRouter, createContext });
            }

            wss.emit("connection", peer.websocket, peer.request);
        },
        async message(peer, msg) {
            //console.log("update received");
        },
        async error(peer, err) {
            console.error("WebSocket error:", err);
        },
        async close(peer) { },
    },
});
