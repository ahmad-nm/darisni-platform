import { router } from "@inertiajs/react";

export const createUser = (userData, options = {}) => {
    router.post("/admin/users", userData, options);
};