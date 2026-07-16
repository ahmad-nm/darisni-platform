import { router } from "@inertiajs/react";

export function login(data) {
    return new Promise((resolve, reject) => {
        router.post(route("login"), data, {
            onSuccess: resolve,
            onError: reject,
        });
    });
}

export function register(data) {
    return new Promise((resolve, reject) => {
        router.post(route("register"), data, {
            onSuccess: resolve,
            onError: reject,
        });
    });
}

export function forgotPassword(data) {
    return new Promise((resolve, reject) => {
        router.post(route("password.email"), data, {
            onSuccess: resolve,
            onError: reject,
        });
    });
}

export function resetPassword(data) {
    return new Promise((resolve, reject) => {
        router.post(route("password.store"), data, {
            onSuccess: resolve,
            onError: reject,
        });
    });
}

export function resendVerificationEmail() {
    return new Promise((resolve, reject) => {
        router.post(route("verification.send"), {}, {
            onSuccess: resolve,
            onError: reject,
        });
    });
}