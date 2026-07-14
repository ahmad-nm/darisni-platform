// Fetch tutors data from API
export const fetchTutors = async () => {
    try {
        const response = await fetch('/api/tutors');
        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            // Fallback to empty array if API fails
            return [];
        }
    } catch (error) {
        console.error('Error fetching tutors:', error);
        // Fallback to empty array on error
        return [];
    }
};