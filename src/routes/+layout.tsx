import Layout from "~/components/Layout";
import { Outlet } from "solid-start";

export default function RootLayout() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}