export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


export const getFilterLabel = (filterType) => {
    switch (filterType) {
        case "course":
            return "Course Reviews";

        case "tutor":
            return "Tutor Reviews";

        case "darisni":
            return "Platform Reviews";

        default:
            return "All Reviews";
    }
};


export const getReviewTypeIcon = (type) => {
    switch (type) {
        case "course":
            return "📚";

        case "tutor":
            return "👨‍🏫";

        case "darisni":
            return "🏢";

        default:
            return "📝";
    }
};


export const getReviewTypeColor = (type) => {
    switch (type) {
        case "course":
            return "#4CAF50";

        case "tutor":
            return "#2196F3";

        case "darisni":
            return "#FF9800";

        default:
            return "#757575";
    }
};