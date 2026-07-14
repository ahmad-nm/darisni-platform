export async function fetchCourses() {
    const response = await fetch('/api/courses');
    const data = await response.json();

    return data.success ? data.data : [];
}