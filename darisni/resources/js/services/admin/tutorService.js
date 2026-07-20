import { router } from "@inertiajs/react";


export const createTutor = async (data) => {
    try {
        const response = await fetch("/admin/tutors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        return result.tutor;

    } catch (error) {
        console.error("Error creating tutor:", error);
        throw error;
    }
};



export const updateTutor = async (id, data) => {
    try {
        const response = await fetch(`/admin/tutors/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify(data),
        });


        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const result = await response.json();

        return result.tutor;

    } catch (error) {
        console.error("Error updating tutor:", error);
        throw error;
    }
};



export const deleteTutor = async (id) => {
    return new Promise((resolve, reject) => {

        router.delete(`/admin/tutors/${id}`, {

            onSuccess: () => resolve(),

            onError: (errors) => {
                console.error("Delete errors:", errors);
                reject(new Error("Delete failed"));
            },

        });

    });
};



export const updateUserRole = async (userId, role, user) => {

    return new Promise((resolve, reject) => {

        router.put(
            `/admin/users/${userId}`,
            {
                name: user.name,
                email: user.email,
                role,
                email_verified_at: user.email_verified_at
                    ? true
                    : false,
            },
            {

                onSuccess: () => resolve(),

                onError: (errors) => {
                    console.error(
                        "Role update errors:",
                        errors
                    );

                    reject(
                        new Error("Role update failed")
                    );
                },

            }
        );

    });

};




export const createTutorAvailability = async (data) => {

    try {

        const response = await fetch(
            "/admin/tutors/availability",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },

                body: JSON.stringify(data),
            }
        );


        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}`
            );
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Error creating tutor availability:",
            error
        );

        throw error;
    }

};





export const createTutorCourse = async (data) => {

    try {

        const response = await fetch(
            "/admin/tutors/courses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },

                body: JSON.stringify(data),
            }
        );


        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status}`
            );
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Error creating tutor course:",
            error
        );

        throw error;
    }

};





export const updateTutorCourse = async (
    courseId,
    tutorId,
    data
) => {

    try {

        const response = await fetch(
            `/admin/tutors/courses/${courseId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },

                body: JSON.stringify({
                    ...data,
                    tutor_id: tutorId,
                }),
            }
        );


        if (!response.ok) {
            throw new Error(
                `HTTP error! status:${response.status}`
            );
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Error updating tutor course:",
            error
        );

        throw error;

    }

};





export const deleteTutorCourse = async (
    courseId,
    tutorId
) => {

    try {

        const response = await fetch(
            `/admin/tutors/courses/${courseId}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },

                body: JSON.stringify({
                    tutor_id: tutorId
                }),
            }
        );


        if (!response.ok) {
            throw new Error(
                `HTTP error! status:${response.status}`
            );
        }


        return await response.json();


    } catch (error) {

        console.error(
            "Error deleting tutor course:",
            error
        );

        throw error;

    }

};