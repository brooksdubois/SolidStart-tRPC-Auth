// src/routes/api/profile.ts
import type { APIEvent } from "solid-start";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "dev-secret";

export async function POST({ request }: APIEvent) {
    const cookie = request.headers.get("cookie") ?? "";
    const token = cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const profile = jwt.verify(token, JWT_SECRET) as { username: string };
        return new Response(`Hello ${profile.username}`);
    } catch (err) {
        console.error("JWT verify failed", err);
        return new Response("Unauthorized", { status: 401 });
    }
}
