import * as R from "ramda";
import {createTRPCClient, createWSClient, wsLink} from "@trpc/client";
import type {AppRouter} from "~/server/api";


const socketUrl = 'ws://localhost:3000/trpc/';

export const getClient = () => createTRPCClient<AppRouter>({
    links: [wsLink({ client: createWSClient({ url: socketUrl }) })],
});

export const logError = (err: any) => console.error('tRPC error:', err);

export const unsubscribeAll = (...subs: Array<() => void>) => () =>
    R.forEach(R.invoker(0, 'unsubscribe'), subs);
