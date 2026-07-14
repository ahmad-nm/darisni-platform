export async function fetchCourses() {
    const response = await fetch('/api/courses?visible=1');
    const data = await response.json();

    return data.success ? data.data : [];
}