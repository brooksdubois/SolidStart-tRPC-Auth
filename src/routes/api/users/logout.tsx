export async function POST() {
    try {
        return new Response(
            JSON.stringify({ message: "Logged out" }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
                },
            }
        );
    } catch (err: any) {
        console.error("Logout Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
