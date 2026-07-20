import { useState } from "react";
import styles from "../../CourseManagement.module.css";
import CourseDetails from "./CourseDetails";
import CourseForm from "./CourseForm";

// Course Details/Edit Modal Component
export default function CourseModal({
    course,
    mode,
    categories,
    tutors,
    onClose,
    onSave,
    setModalMode,
}) {
    const [formData, setFormData] = useState({
        code: course?.code || "",
        title: course?.title || "",
        subject: course?.subject || "",
        category_id: course?.category_id || "",
        tutor_id: course?.tutor_id || "",
        price: course?.price || "",
        lectures: course?.lectures || "",
        credits: course?.credits || "",
        semester: course?.semester || "",
        duration_weeks: course?.duration_weeks || "",
        type: course?.type || "",
        image: course?.image || "",
        visible: course?.visible !== undefined ? course.visible : true,
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const response = await fetch("/admin/courses/upload-image", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: formDataUpload,
            });
            const data = await response.json();
            if (data.url) {
                setFormData((prev) => ({ ...prev, image: data.url }));
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
            alert("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === "view") return;

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            alert("Failed to save course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        if (
            !categoryId ||
            !Array.isArray(categories) ||
            categories.length === 0
        )
            return "Unknown";
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Unknown";
    };

    const getTutorName = (tutorId) => {
        if (!tutorId || !Array.isArray(tutors) || tutors.length === 0)
            return "Unknown";
        const tutor = tutors.find((t) => t.id === tutorId);
        return tutor ? tutor.user?.name || tutor.name || "Unknown" : "Unknown";
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>
                        {mode === "view"
                            ? "Course Details"
                            : mode === "edit"
                              ? "Edit Course"
                              : "Create New Course"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                {mode === "view" ? (
                    <CourseDetails
                        course={course}
                        categoryName={getCategoryName(course.category_id)}
                        tutorName={getTutorName(course.tutor_id)}
                        onClose={onClose}
                        setModalMode={setModalMode}
                    />
                ) : (
                    <CourseForm
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        tutors={tutors}
                        loading={loading}
                        uploading={uploading}
                        mode={mode}
                        onClose={onClose}
                        handleSubmit={handleSubmit}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                    />
                )}
            </div>
        </div>
    );
}