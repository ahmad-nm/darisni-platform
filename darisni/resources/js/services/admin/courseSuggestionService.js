const csrfToken = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

export async function deleteCourseSuggestion(id) {
    const response = await fetch(`/admin/course-suggestions/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": csrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete suggestion.");
    }

    return response.json();
}