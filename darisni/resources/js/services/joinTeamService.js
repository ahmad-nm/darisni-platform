import { router } from "@inertiajs/react";

export function submitTutorApplication(formData, userId) {
    return new Promise((resolve, reject) => {
        const payload = new FormData();

        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("age", formData.age);
        payload.append("university", formData.university);
        payload.append("year", formData.year);
        payload.append(
            "whereYouSeeYourself",
            formData.whereYouSeeYourself
        );
        payload.append("pay", formData.pay);
        payload.append("otherCourses", formData.otherCourses);
        payload.append("goodTutor", formData.goodTutor);
        payload.append("user_id", userId);

        formData.coursesToGive.forEach((course, index) => {
            payload.append(`coursesToGive[${index}]`, course);
        });

        if (formData.cv) {
            payload.append("cv", formData.cv);
        }

        router.post("/tutor-applications", payload, {
            forceFormData: true,

            onSuccess: resolve,

            onError: reject,
        });
    });
}