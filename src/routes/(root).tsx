import { ParentProps } from "solid-js";
import "../app.css"
import {A, AnchorProps, useMatch } from "@solidjs/router";

function NavAnchor(props: AnchorProps) {
    const match = useMatch(() => props.href);
    return (
        <A classList={{ "opacity-45": Boolean(match()) }} href={props.href}>
            {props.children}
        </A>
    );
}

const Layout = (props: ParentProps) =>
    <div class="min-h-screen flex flex-col">
        <nav class="bg-blue-600 p-4 text-white">
            <div class="container mx-auto flex justify-center items-center">
                <nav class="flex space-x-4">
                    <NavAnchor href='/'>Home</NavAnchor>
                    <NavAnchor href='/counter'>Counter</NavAnchor>
                    <NavAnchor href='/users'>Users</NavAnchor>
                </nav>
            </div>
        </nav>
        <main class="flex-grow">
            { props.children }
        </main>
        <footer>
            <pre class="text-center">DrizzleORM + Bun + tRPC + SolidStart + Flowbite</pre>
        </footer>
    </div>;

export default Layout;