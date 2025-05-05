import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//     server: {
//         preset: "node-server",
//         experimental: {
//             websocket: true,
//         },
//     },
//     vite: {
//         plugins: [tailwindcss()],
//     },
// }).addRouter({
//     name: "trpc",
//     type: "http",
//     handler: "./src/lib/trpc.ts",
//     target: "server",
//     base: "/trpc",
// });

export default defineConfig({
    server: {
        preset: "node_server",
        experimental: {
            websocket: true,
        },
    },
    vite: {
        plugins: [tailwindcss()],
    }
}).addRouter({
    name: "trpc",
    type: "http",
    handler: "./src/lib/trpc.ts",
    target: "server",
    base: "/trpc",
});
