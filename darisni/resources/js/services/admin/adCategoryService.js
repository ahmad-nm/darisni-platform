const csrfToken = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");


export async function createCategory(data) {
    const response = await fetch("/admin/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-TOKEN": csrfToken(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create category");
    }

    const result = await response.json();

    return result.category;
}


export async function updateCategory(id, data) {
    const response = await fetch(`/admin/categories/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-TOKEN": csrfToken(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update category");
    }

    const result = await response.json();

    return result.category;
}


export async function deleteCategory(id) {
    const response = await fetch(`/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": csrfToken(),
        },
    });


    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function uploadCategoryImage(file) {
    
    const formData = new FormData();
    
    formData.append("image", file);

    const response = await fetch("/admin/categories/upload-image", {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": csrfToken(),
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Image upload failed.");
    }

    const data = await response.json();

    return data.url;
}