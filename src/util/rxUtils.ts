import * as R from "ramda";
import {createTRPCClient, createWSClient, wsLink} from "@trpc/client";
import type {AppRouter} from "~/server/api";

const socketUrl = 'ws://localhost:3000/trpc';

export const getClient = () => {
    if (typeof window === "undefined") return null; //client only

    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    const client = createWSClient({
        url: socketUrl,
        connectionParams: { token },
    });

    return createTRPCClient<AppRouter>({
        links: [wsLink({ client })],
    });
};

export const logError = (err: any) => console.error('tRPC error:', err);

// export const unsubscribeAll = (...subs: Array<() => void>) => () =>
//     R.forEach(R.invoker(0, 'unsubscribe'), subs);
