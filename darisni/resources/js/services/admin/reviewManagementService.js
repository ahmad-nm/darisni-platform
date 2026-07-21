import { router } from "@inertiajs/react";


export const deleteReview = (id, type) => {
    return router.delete(`/admin/reviews/${id}`, {
        data: { type },
        preserveScroll: true,
    });
};


export const getReviews = async (filter, searchTerm) => {
    const response = await fetch(
        `/admin/reviews?filter=${filter}&search=${searchTerm}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch reviews");
    }

    return response.json();
};


export const getReviewStats = async () => {
    const response = await fetch("/admin/reviews/stats");

    if (!response.ok) {
        throw new Error("Failed to fetch review stats");
    }

    return response.json();
};