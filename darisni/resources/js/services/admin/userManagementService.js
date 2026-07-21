import { router } from "@inertiajs/react";

export const deleteUser = (
    userId,
    {
        onSuccess,
        onError,
        onFinish,
    } = {}
) => {
    router.delete(route("admin.users.destroy", userId), {
        preserveScroll: true,
        onSuccess,
        onError,
        onFinish,
    });
};

export const updateUser = (
    userId,
    payload,
    {
        onSuccess,
        onError,
        onFinish,
    } = {}
) => {
    const isFormData = payload instanceof FormData;

    if (isFormData) {
        router.post(route("admin.users.update", userId), payload, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess,
            onError,
            onFinish,
        });

        return;
    }

    router.put(route("admin.users.update", userId), payload, {
        preserveScroll: true,
        onSuccess,
        onError,
        onFinish,
    });
};

export const uploadUserImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch("/admin/users/upload-image", {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"),
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Image upload failed.");
    }

    return data;
};