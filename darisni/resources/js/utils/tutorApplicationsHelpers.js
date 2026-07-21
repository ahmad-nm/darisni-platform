export const getStatusBadge = (status) => {
    const badges = {
        pending: { text: "Pending", className: "pendingBadge" },
        approved: { text: "Approved", className: "acceptedBadge" },
        rejected: { text: "Rejected", className: "rejectedBadge" },
        under_review: { text: "Under Review", className: "pendingBadge" },
    };
    return badges[status] || badges.pending;
};

export const getStatusStats = (applications) => {
    const stats = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {});

    return {
        total: applications.length,
        pending: stats.pending || 0,
        approved: stats.approved || 0,
        rejected: stats.rejected || 0,
    };
};

export const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "Invalid date";
    }
};
