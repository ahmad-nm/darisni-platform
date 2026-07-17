import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./app";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App: InertiaApp, props }) {
        const root = createRoot(el);

        root.render(
            <App >
                <AuthProvider auth={props.initialPage.props.auth}>
                    <InertiaApp {...props} />
                </AuthProvider>
            </App>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
