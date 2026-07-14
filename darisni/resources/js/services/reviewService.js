export async function fetchCourseReviews(courseId) {
    const response = await fetch(`/api/reviews/course/${courseId}`);
    const data = await response.json();

    return data.success ? (data.data.reviews || []) : [];
}