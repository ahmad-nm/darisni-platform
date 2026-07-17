import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "./EnrollmentManagement.module.css";

export default function EnrollmentManagement({ users, courses = [] }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewUser, setViewUser] = useState(null);

    const filteredUsers = users
        .filter((user) => user.email_verified_at)
        .filter(
            (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => b.enrollments.length - a.enrollments.length);

    // Add enrollment
    const handleEnroll = async (courseIds) => {
        if (!selectedUser || !courseIds || courseIds.length === 0) return;
        setLoading(true);
        router.post(
            route("admin.enrollments.store"),
            {
                user_id: selectedUser.id,
                course_ids: courseIds, // send as array
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowEnrollModal(false);
                    setSelectedUser(null);
                    router.reload();
                },
                onError: () => alert("Failed to enroll user"),
                onFinish: () => setLoading(false),
            },
        );
    };

    // Delete enrollment
    const handleDeleteEnrollment = async (enrollmentId) => {
        setLoading(true);
        router.delete(route("admin.enrollments.destroy", enrollmentId), {
            preserveScroll: true,
            onSuccess: () => {
                // Update viewUser enrollments locally
                if (viewUser) {
                    setViewUser((prev) => ({
                        ...prev,
                        enrollments: prev.enrollments.filter(
                            (e) => e.id !== enrollmentId,
                        ),
                    }));
                }
                setLoading(false);
            },
            onError: () => {
                alert("Failed to delete enrollment");
                setLoading(false);
            },
            // Remove router.reload() here
        });
    };

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="Enrollment Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>
                                    Enrollment Management
                                </h1>
                                <p className={styles.subtitle}>
                                    View and manage user course enrollments
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.modalInput}
                            placeholder="Search users by name or email..."
                        />
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.usersTable}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Courses Enrolled</th>
                                    <th>Course Names</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={styles.userRow}
                                    >
                                        <td>
                                            <div className={styles.userInfo}>
                                                <div
                                                    className={
                                                        styles.userAvatar
                                                    }
                                                >
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div
                                                    className={
                                                        styles.userDetails
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.userName
                                                        }
                                                    >
                                                        {user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.enrollments.length}</td>
                                        <td>
                                            {user.enrollments.length > 0 ? (
                                                <button
                                                    className={styles.viewBtn}
                                                    style={{ marginLeft: 8 }}
                                                    onClick={() =>
                                                        setViewUser(user)
                                                    }
                                                >
                                                    View
                                                </button>
                                            ) : (
                                                <span
                                                    className={
                                                        styles.noImagePreview
                                                    }
                                                >
                                                    No courses
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.editBtn}
                                                    title="Add Enrollment"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEnrollModal(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    ➕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Enroll Modal */}
                    {showEnrollModal && selectedUser && (
                        <EnrollModal
                            user={selectedUser}
                            courses={courses}
                            onClose={() => {
                                setShowEnrollModal(false);
                                setSelectedUser(null);
                            }}
                            onEnroll={handleEnroll}
                            loading={loading}
                        />
                    )}

                    {viewUser && (
                        <ViewCoursesModal
                            user={viewUser}
                            onClose={() => setViewUser(null)}
                            handleDeleteEnrollment={handleDeleteEnrollment}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

// Modal for enrolling user in a course
function EnrollModal({ user, courses = [], onClose, onEnroll, loading }) {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [search, setSearch] = useState("");

    // Filter out courses already enrolled
    const enrolledIds = user.enrollments.map((e) => e.course_id);
    const filteredCourses = courses
        .filter((course) => !enrolledIds.includes(course.id))
        .filter((course) =>
            course.title.toLowerCase().includes(search.toLowerCase()),
        );

    const handleCheckboxChange = (courseId) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCourses.length === 0) return;
        onEnroll(selectedCourses);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Enroll {user.name} in Courses</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                        <label>Search Courses</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.modalInput}
                            placeholder="Type to search..."
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Select Courses</label>
                        <div
                            style={{
                                maxHeight: 200,
                                overflowY: "auto",
                                border: "1px solid #eee",
                                borderRadius: 8,
                                padding: 8,
                            }}
                        >
                            {filteredCourses.length === 0 ? (
                                <div>No courses found.</div>
                            ) : (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={course.id}
                                                checked={selectedCourses.includes(
                                                    course.id,
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        course.id,
                                                    )
                                                }
                                                disabled={loading}
                                            />{" "}
                                            {course.title}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || selectedCourses.length === 0}
                            className={styles.saveBtn}
                        >
                            {loading ? "Enrolling..." : "Enroll"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ViewCoursesModal({ user, onClose, handleDeleteEnrollment, loading }) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{user.name}'s Enrolled Courses</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.modalForm}>
                    {user.enrollments.length === 0 ? (
                        <div>No courses enrolled.</div>
                    ) : (
                        <ul style={{ padding: 0, margin: 0 }}>
                            {user.enrollments.map((e) => (
                                <li
                                    key={e.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 12,
                                    }}
                                >
                                    <span className={styles.courseCode}>
                                        {e.course?.code}
                                    </span>
                                    <span style={{ flex: 1 }}>
                                        {e.course?.title}
                                    </span>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() =>
                                            handleDeleteEnrollment(e.id)
                                        }
                                        disabled={loading}
                                    >
                                        🗑️ Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
