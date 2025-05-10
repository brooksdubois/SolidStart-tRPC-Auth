
# solid-rx-rpc-ws-bun

A reactive full-stack project powered by **SolidStart**, **Bun**, **tRPC**, **RxJS**, and **Drizzle ORM** — with real-time WebSocket subscriptions and persistent state shared across clients.

This repo is designed to be a **reference** for reactive app development using modern primitives. It features a minimalist but powerful `todo` app with real-time shared updates via BehaviorSubjects, and server-driven state sync over WebSockets using tRPC subscriptions — all with **JWT-based authentication**. For instance, the counter page is blocked to start a timer unless you are logged in.

Try opening two windows and the drizzle-kit studio and then updating valiues in the todo list! You'll see the changes reflected immediately _in the other window_. Refresh the drizzle-kit page and you'll see it's reflected in the database too.

---

## 🚀 Tech Stack

| Layer        | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| Frontend     | [SolidJS](https://www.solidjs.com/) with [SolidStart](https://start.solidjs.dev) |
| Backend      | [Bun](https://bun.sh/) + [tRPC](https://trpc.io/) + native WebSockets |
| State Mgmt   | [RxJS](https://rxjs.dev/) with shared observables for reactivity      |
| ORM & DB     | [Drizzle](https://orm.drizzle.team/) + PostgreSQL (via Docker Compose) |
| Auth         | JWT-based session authentication with server-side validation         |
| Dev Tooling  | TypeScript, Bun runtime, `.env` config, live `test-api.http` endpoints |

---

## 🧠 Project Structure

```
src/
├── app.tsx                 # SolidStart app entry
├── entry-client.tsx       # Solid client entrypoint
├── entry-server.tsx       # Bun+Solid server entrypoint
├── components/            # UI components (e.g., Todo, TextInput, FancyButton)
├── routes/                # File-based routing via SolidStart
├── shared/                # Shared RxJS state (counter$, todoList$)
├── lib/trpc.ts            # tRPC client/server wiring
├── server/api.ts          # tRPC router with observable subscription
├── db/                    # Drizzle schema + db client
│   ├── schema.ts
│   ├── todo/
│   └── users/
└── util/rxUtils.ts        # RxJS helpers (e.g., makeBehaviorSubject)
```

---

## 🧪 Live Dev

Make sure you have [Bun](https://bun.sh/) installed. You may need to source the env file for all features to work correctly.

```bash
# Install deps
bun install

# Start app
bun run dev
```

The server will auto-load your `SolidStart` routes and boot up tRPC/WebSocket handling.

---

## 🐳 Database (Drizzle + PostgreSQL)

To spin up the Postgres container:

```bash
docker-compose up -d
```

Your `.env.sample` includes example values:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/db
```

> You'll want to run `drizzle-kit push` or `drizzle-kit generate` to manage migrations.

---

## 🔄 Real-Time WebSocket Sync

The app exposes a `todoList$` RxJS subject shared across all clients. When one client adds a todo, all others update in real time via:

```ts
onTodoListChange: t.procedure.subscription(() => {
  return observable<Todo[]>((emit) => {
    const sub = todoList$.subscribe((todos) => emit.next(todos));
    return () => sub.unsubscribe();
  });
});
```

This pattern allows **state derived from RxJS to be streamed to any connected frontend** via tRPC subscriptions.

---

## ✅ Todo

- [x] SolidStart app scaffolding
- [x] RxJS state & shared subjects
- [x] tRPC client/server + subscriptions
- [x] WebSocket transport over Bun
- [x] PostgreSQL + Drizzle ORM
- [x] JWT-based authentication
- [x] Dockerfile

---

## 🛠 Dev Notes

- Dev tools: You can test routes via `test-api.http` (REST call collection).
- Written entirely in TypeScript, no transpilation step needed with Bun.
- Custom components use Tailwind (optional — not enforced across app).
- Routing uses `(root).tsx` layout to nest Solid pages.

---

## 🧼 Clean Install Checklist

```bash
cp .env.sample .env
bun install
docker-compose up -d
bun run dev
```

Then navigate to [`http://localhost:3000`](http://localhost:3000) to see the app in action.

---

