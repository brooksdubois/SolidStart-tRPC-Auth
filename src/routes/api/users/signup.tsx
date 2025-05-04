import { db } from "~/db/client";
import type { APIEvent } from "solid-start";
import bcrypt from "bcryptjs";
import {users} from "~/db/schema";

type CreateUserInput = {
    username: string;
    password: string;
};

export async function POST({ request }: APIEvent) {
    const  { username, password }: CreateUserInput = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Inserting:", { username, password: hashedPassword });
    try {
        await db.insert(users).values({ username, password: hashedPassword });
        return new Response("OK");
    } catch (err: any) {
        console.error("DB Insert Error:", err);
        return new Response(err.message)
    }
}