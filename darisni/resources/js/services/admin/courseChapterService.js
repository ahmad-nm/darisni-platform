import { router } from "@inertiajs/react";


export const getCourseChapters = async (courseId) => {
    try {
        const response = await fetch(
            `/admin/courses/${courseId}/chapters`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            }
        );

        const data = await response.json();

        return data.chapters || [];

    } catch (error) {
        console.error("Error fetching chapters:", error);
        return [];
    }
};


export const createCourseChapter = async (chapterData) => {
    return new Promise((resolve, reject) => {

        router.post("/admin/chapters", chapterData, {

            onSuccess: (page) => {
                resolve(
                    page.props.chapter || chapterData
                );
            },

            onError: (errors) => {
                reject(errors);
            },
        });
    });
};



export const updateCourseChapter = async (
    chapterId,
    chapterData
) => {

    return new Promise((resolve, reject) => {

        router.put(
            `/admin/chapters/${chapterId}`,
            chapterData,
            {

                onSuccess: (page) => {
                    resolve(
                        page.props.chapter || chapterData
                    );
                },

                onError: (errors) => {
                    reject(errors);
                },
            }
        );
    });
};



export const deleteCourseChapter = async (chapterId) => {

    return new Promise((resolve, reject) => {

        router.delete(
            `/admin/chapters/${chapterId}`,
            {

                onSuccess: () => resolve(),

                onError: (errors) => reject(errors),
            }
        );
    });
};