import { router } from "@inertiajs/react";

export function login(data, options = {}) {
    return router.post(route("login"), data, options);
}


export function register(data, options = {}) {
    return router.post(route("register"), data, options);
}


export function forgotPassword(data, options = {}) {
    return router.post(route("password.email"), data, options);
}


export function resetPassword(data, options = {}) {
    return router.post(route("password.store"), data, options);
}


export function resendVerificationEmail(options = {}) {
    return router.post(route("verification.send"), {}, options);
}

export function logout(options = {}) {
    return router.post(route("logout"), {}, options);
}