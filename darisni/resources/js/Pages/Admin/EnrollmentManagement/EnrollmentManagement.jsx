import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "./EnrollmentManagement.module.css";
import ViewCoursesModal from "./components/ViewCourseModal";
import EnrollModal from "./components/EnrollModal";
import { deleteEnrollment, enrollUser } from "@/services/admin/enrollmentService";

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
    const handleEnroll = (courseIds) => {
        if (!selectedUser || courseIds.length === 0) return;

        setLoading(true);

        enrollUser(selectedUser.id, courseIds, {
            preserveScroll: true,

            onSuccess: () => {
                setShowEnrollModal(false);
                setSelectedUser(null);
                router.reload();
            },

            onError: () => {
                alert("Failed to enroll user");
            },

            onFinish: () => {
                setLoading(false);
            },
        });
    };

    // Delete enrollment
    const handleDeleteEnrollment = (enrollmentId) => {
        setLoading(true);

        deleteEnrollment(enrollmentId, {
            preserveScroll: true,

            onSuccess: () => {
                if (viewUser) {
                    setViewUser((prev) => ({
                        ...prev,
                        enrollments: prev.enrollments.filter(
                            (e) => e.id !== enrollmentId,
                        ),
                    }));
                }
            },

            onError: () => {
                alert("Failed to delete enrollment");
            },

            onFinish: () => {
                setLoading(false);
            },
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