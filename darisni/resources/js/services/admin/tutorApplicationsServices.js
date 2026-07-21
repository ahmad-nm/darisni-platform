const getCsrfToken = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") || "";

const defaultHeaders = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
};

export const fetchApplications = async () => {
    const response = await fetch("/admin/applications/data", {
        method: "GET",
        headers: {
            ...defaultHeaders,
            "X-CSRF-TOKEN": getCsrfToken(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch applications");
    }

    return response.json();
};

export const updateApplicationStatus = async (applicationId, status) => {
    const response = await fetch(
        `/admin/applications/${applicationId}/status`,
        {
            method: "PATCH",
            headers: {
                ...defaultHeaders,
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCsrfToken(),
            },
            credentials: "same-origin",
            body: JSON.stringify({ status }),
        }
    );

    return response.json();
};

export const deleteApplication = async (applicationId) => {
    const response = await fetch(`/admin/applications/${applicationId}`, {
        method: "DELETE",
        headers: {
            ...defaultHeaders,
            "X-CSRF-TOKEN": getCsrfToken(),
        },
    });

    return response.json();
};

export const downloadCV = (applicationId) => {
    window.open(`/admin/applications/${applicationId}/cv`, "_blank");
};