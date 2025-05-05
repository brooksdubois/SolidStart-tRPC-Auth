import { ParentProps } from "solid-js";
import "../app.css"
import {A} from "@solidjs/router";

const Layout = (props: ParentProps) =>
    <div class="min-h-screen flex flex-col">
        <nav class="bg-blue-600 p-4 text-white">
            <div class="container mx-auto flex justify-center items-center">
                <div class="flex space-x-4">
                    <A href='/public'>Home</A>
                    <A href='/counter'>Counter</A>
                    <A href='/users'>Users</A>
                </div>
            </div>
        </nav>
        <main class="flex-grow">{props.children}</main>
        <footer>
            <pre class="text-center">DrizzleORM + Bun + tRPC + SolidStart + Tailwind CSS</pre>
        </footer>
    </div>;

export default Layout;