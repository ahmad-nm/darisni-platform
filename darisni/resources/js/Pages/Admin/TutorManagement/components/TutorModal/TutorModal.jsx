import { useState } from "react";
import TutorDetails from "./TutorDetails";
import styles from "../../TutorManagement.module.css";
import TutorForm from "./TutorForm";

// Tutor Details/Edit Modal Component
export default function TutorModal({
    tutor,
    mode,
    users,
    courses,
    onClose,
    onSave,
    setModalMode,
    createTutorCourse,
    deleteTutorCourse,
    updateTutorCourse,
    calculateAverageRating,
}) {
    const [formData, setFormData] = useState({
        user_id: tutor?.user_id || "",
        name: tutor?.name || "",
        university: tutor?.university || "",
        year: tutor?.year || "",
        bio: tutor?.bio || "",
        contact: tutor?.contact || "",
        experience_years: tutor?.experience_years || 0,
        hourly_rate: tutor?.hourly_rate || "",
        image: tutor?.image || "",
    });
    const [availability, setAvailability] = useState(tutor?.availability || []);
    const [tutorCourses, setTutorCourses] = useState(tutor?.courses || []);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const availableUsers = users || [];

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
            const response = await fetch("/admin/tutors/upload-image", {
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

    const handleCourseAdd = async (e) => {
        const courseId = e.target.value;
        if (courseId) {
            const course = courses.find((c) => c.id === parseInt(courseId));
            if (course && !tutorCourses.some((tc) => tc.id === course.id)) {
                // If we're editing an existing tutor, make API call immediately
                if (mode === "edit" && tutor) {
                    try {
                        await createTutorCourse({
                            tutor_id: tutor.id,
                            course_id: course.id,
                        });
                        console.log(
                            `Course ${course.title} assigned to tutor successfully`,
                        );
                    } catch (error) {
                        console.error("Error assigning course:", error);
                        alert(
                            `Failed to assign course: ${error.response?.data?.message || error.message}`,
                        );
                        return; // Don't update local state if API call failed
                    }
                }

                setTutorCourses([...tutorCourses, course]);
            }
        }
    };

    const handleCourseRemove = async (index) => {
        const courseToRemove = tutorCourses[index];

        // If we're editing an existing tutor, make API call immediately
        if (mode === "edit" && tutor && courseToRemove) {
            try {
                await deleteTutorCourse(courseToRemove.id, tutor.id);
                console.log(
                    `Course ${courseToRemove.title} unassigned from tutor successfully`,
                );
            } catch (error) {
                console.error("Error unassigning course:", error);
                alert(
                    `Failed to unassign course: ${error.response?.data?.message || error.message}`,
                );
                return; // Don't update local state if API call failed
            }
        }

        setTutorCourses(tutorCourses.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === "view") return;

        setLoading(true);
        try {
            // Include availability and courses data with the form data
            const completeData = {
                ...formData,
                availability: availability,
                courses: tutorCourses.map((course) => course.id),
            };
            await onSave(completeData);
        } catch (error) {
            alert("Failed to save tutor. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityAdd = () => {
        setAvailability([
            ...availability,
            { day: "", start_time: "", end_time: "" },
        ]);
    };

    const handleAvailabilityRemove = (index) => {
        setAvailability(availability.filter((_, i) => i !== index));
    };

    const handleAvailabilityChange = (index, field, value) => {
        const updated = availability.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot,
        );
        setAvailability(updated);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>
                        {mode === "view"
                            ? "Tutor Details"
                            : mode === "edit"
                              ? "Edit Tutor"
                              : "Create New Tutor"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                {mode === "view" ? (
                    <TutorDetails
                        tutor={tutor}
                        onClose={onClose}
                        setModalMode={setModalMode}
                        calculateAverageRating={calculateAverageRating}
                    />
                ) : (
                    <TutorForm
                        mode={mode}
                        handleSubmit={handleSubmit}

                        availableUsers={availableUsers}
                        courses={courses}

                        formData={formData}
                        setFormData={setFormData}

                        availability={availability}
                        tutorCourses={tutorCourses}

                        handleAvailabilityAdd={handleAvailabilityAdd}
                        handleAvailabilityChange={handleAvailabilityChange}
                        handleAvailabilityRemove={handleAvailabilityRemove}

                        handleCourseAdd={handleCourseAdd}
                        handleCourseRemove={handleCourseRemove}

                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}

                        loading={loading}
                        uploading={uploading}

                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
}