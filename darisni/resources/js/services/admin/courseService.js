import { router } from "@inertiajs/react";


export const createCourse = async (courseData) => {
    return new Promise((resolve, reject) => {
        router.post("/admin/courses", courseData, {
            onSuccess: () => {
                resolve(courseData);
            },
            onError: (errors) => {
                reject({
                    response: {
                        status: 422,
                        data: { errors },
                    },
                });
            },
        });
    });
};


export const updateCourse = async (courseId, courseData) => {
    return new Promise((resolve, reject) => {
        router.put(`/admin/courses/${courseId}`, courseData, {
            onSuccess: () => {
                resolve({
                    ...courseData,
                    id: courseId,
                });
            },
            onError: (errors) => {
                reject({
                    response: {
                        status: 422,
                        data: { errors },
                    },
                });
            },
        });
    });
};


export const deleteCourse = async (courseId) => {
    return new Promise((resolve, reject) => {
        router.delete(`/admin/courses/${courseId}`, {
            onSuccess: () => {
                resolve();
            },
            onError: () => {
                reject({
                    response: {
                        data: {
                            message: "Failed to delete course",
                        },
                    },
                });
            },
        });
    });
};