import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    server: {
        preset: "node-server",
        experimental: {
            websocket: true,
        },
    },
}).addRouter({
    name: "trpc",
    type: "http",
    handler: "./src/lib/trpc.ts",
    target: "server",
    base: "/trpc",
});