import React from "react";
import styles from "../UserManagement.module.css";

export default function UserTable({ users, onEdit, onView, onDelete }) {
    const getStatusBadge = (user) => {
        const isActive = user.email_verified_at !== null;

        return (
            <span
                className={`${styles.statusBadge} ${
                    isActive ? styles.statusActive : styles.statusInactive
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const roleClass =
            role === "admin"
                ? styles.roleAdmin
                : role === "tutor"
                  ? styles.roleTutor
                  : styles.roleStudent;

        return (
            <span className={`${styles.roleBadge} ${roleClass}`}>{role}</span>
        );
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Verified</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className={styles.userRow}>
                            <td className={styles.userInfo}>
                                <div className={styles.userAvatar}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.userDetails}>
                                    <div className={styles.userName}>
                                        {user.name}
                                    </div>

                                    <div className={styles.userEmail}>
                                        {user.email}
                                    </div>
                                </div>
                            </td>

                            <td>{getRoleBadge(user.role)}</td>

                            <td>{getStatusBadge(user)}</td>

                            <td>
                                <span
                                    className={
                                        user.email_verified_at
                                            ? styles.verified
                                            : styles.unverified
                                    }
                                >
                                    {user.email_verified_at
                                        ? "✓ Verified"
                                        : "✗ Unverified"}
                                </span>
                            </td>

                            <td className={styles.joinDate}>
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>

                            <td>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.editBtn}
                                        title="Edit User"
                                        onClick={() => onEdit(user)}
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        className={styles.viewBtn}
                                        title="View Details"
                                        onClick={() => onView(user)}
                                    >
                                        👁️
                                    </button>

                                    <button
                                        className={styles.deleteBtn}
                                        title="Delete User"
                                        onClick={() => onDelete(user.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
