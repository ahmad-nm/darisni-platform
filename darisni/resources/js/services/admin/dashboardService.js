const getHeaders = () => ({
    Accept: "application/json",
    "X-CSRF-TOKEN": document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
});

export const fetchDashboardData = async () => {
    const [statsResponse, activitiesResponse] = await Promise.all([
        fetch("/admin/dashboard/stats", {
            headers: getHeaders(),
        }),
        fetch("/admin/dashboard/activities", {
            headers: getHeaders(),
        }),
    ]);

    if (!statsResponse.ok || !activitiesResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    const statsData = await statsResponse.json();
    const activitiesData = await activitiesResponse.json();

    return {
        stats: {
            totalUsers: statsData.totalUsers,
            totalCourses: statsData.totalCourses,
            totalTutors: statsData.totalTutors,
            totalEnrollments: statsData.totalEnrollments,
        },
        activities: activitiesData,
    };
};