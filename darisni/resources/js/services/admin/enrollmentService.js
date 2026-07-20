import { router } from "@inertiajs/react";

export function enrollUser(userId, courseIds, options = {}) {
    router.post(
        route("admin.enrollments.store"),
        {
            user_id: userId,
            course_ids: courseIds,
        },
        options,
    );
}

export function deleteEnrollment(enrollmentId, options = {}) {
    router.delete(
        route("admin.enrollments.destroy", enrollmentId),
        options,
    );
}