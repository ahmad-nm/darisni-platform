import { router } from "@inertiajs/react";

export function submitRating(data) {
    return new Promise((resolve, reject) => {
        router.post("/api/ratings", data, {
            onSuccess: resolve,

            onError: reject,
        });
    });
}