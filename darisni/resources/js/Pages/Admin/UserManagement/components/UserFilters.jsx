import React from "react";
import styles from "../UserManagement.module.css";

export default function UserFilters({
    searchQuery,
    selectedRole,
    onSearchChange,
    onRoleChange,
}) {
    return (
        <div className={styles.filtersContainer}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className={styles.searchInput}
                />

                <div className={styles.searchIcon}>🔍</div>
            </div>

            <div className={styles.filterContainer}>
                <select
                    value={selectedRole}
                    onChange={onRoleChange}
                    className={styles.roleFilter}
                >
                    <option value="all">All Roles</option>

                    <option value="admin">Admin</option>

                    <option value="tutor">Tutor</option>

                    <option value="student">Student</option>
                </select>
            </div>
        </div>
    );
}
