import { db } from "~/db/client";
import { todo } from "~/db/schema";
import type { APIEvent } from "solid-start";

type CreateTodoInput = {
    data: string;
};

export async function POST({ request }: APIEvent) {
    const { data }: CreateTodoInput = await request.json();
    await db.insert(todo).values({ data });
    return new Response("OK");
}