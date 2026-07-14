export async function fetchTestimonials() {
    const response = await fetch('/api/reviews/darisni?limit=6');
    const data = await response.json();

    if (!data.success || data.data.length === 0) {
        return [];
    }

    return data.data.map(review => ({
        id: review.id,
        name: review.user?.name || 'Anonymous',
        rating: review.rating,
        testimonial: review.feedback || '',
        image: review.user?.image || '/images/default-avatar.svg',
        major: review.user?.role || 'Student',
        date: review.created_at,
    }));
}