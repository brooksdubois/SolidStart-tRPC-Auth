import { db } from "~/db/client";
import type { APIEvent } from "solid-start";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { users } from "~/db/schema";

type LoginInput = {
    username: string;
    password: string;
};

const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "dev-secret"; // Use env var in prod

export async function POST({ request }: APIEvent) {
    const { username, password }: LoginInput = await request.json();

    const result = await db.select().from(users).where(eq(users.username, username));
    const user = result[0];
    if (!user) {
        return new Response("Invalid credentials", { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return new Response("Invalid credentials", { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: "7d",
    });

    return new Response(
        JSON.stringify({ token }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",//todo: HttpOnly; removed from cookie here
                "Set-Cookie": `token=${token}; Path=/; Max-Age=604800; SameSite=Lax`,
            },
        }
    );
}

