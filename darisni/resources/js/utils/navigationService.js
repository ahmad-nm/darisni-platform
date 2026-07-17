import { router } from "@inertiajs/react";

export function navigate(path) {
    router.visit(path);
}