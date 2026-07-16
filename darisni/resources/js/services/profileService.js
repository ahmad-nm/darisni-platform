import { router } from "@inertiajs/react";

export function deleteAccount(password) {
    return new Promise((resolve, reject) => {
        router.delete(route("profile.destroy"), {
            data: { password },

            onSuccess: resolve,

            onError: reject,
        });
    });
}

export function updateUserPassword(currentPassword, newPassword, newPasswordConfirmation) {
    return new Promise((resolve, reject) => {
        router.put(
            route("password.update"),
            {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: newPasswordConfirmation,
            },
            {
                preserveScroll: true,

                onSuccess: resolve,

                onError: reject,
            }
        );
    });
}

export function updateProfileInformation(data) {
    return new Promise((resolve, reject) => {
        router.patch(
            route("profile.update"),
            data,
            {
                preserveScroll: true,

                onSuccess: resolve,

                onError: reject,
            }
        );
    });
}