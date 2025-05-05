import { eventHandler } from "vinxi/http";
import { WebSocketServer } from "ws";
import { applyWSSHandler, type CreateWSSContextFn } from "@trpc/server/adapters/ws";
import { appRouter } from '../server/api';
import jwt from "jsonwebtoken";

// Maintain server outside to prevent duplicate creation
let wss: WebSocketServer | undefined;

const createContext: CreateWSSContextFn<any> = (incoming) => {
    const token = incoming?.info?.connectionParams?.token
    let user = null;

    if (token) {
        try {
            user = jwt.verify(token, process.env.JWT_SECRET_TOKEN ?? "dev-secret");
        } catch (e) {
            console.warn("Invalid JWT in WS:", e);
        }
    }

    return { user };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export default eventHandler({
    handler() {},
    websocket: {
        async open(peer) {
            if (!wss) {
                wss = new WebSocketServer({ noServer: true });

                applyWSSHandler({
                    wss,
                    router: appRouter,
                    createContext,
                });
            }

            wss.emit("connection", peer.websocket, peer.request, peer);
        },
    },
});
