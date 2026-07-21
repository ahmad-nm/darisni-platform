import React from "react";
import styles from "../UserManagement.module.css";

export default function UserStats({ stats, users }) {
    const activeUsers = users.filter(
        (user) => user.email_verified_at !== null,
    ).length;

    const tutors = users.filter(
        (user) => user.role === "tutor",
    ).length;

    const unverifiedUsers = users.filter(
        (user) => user.email_verified_at === null,
    ).length;

    return (
        <div className={styles.statsContainer}>
            <div className={styles.statItem}>
                <span className={styles.statNumber}>
                    {users.length}
                </span>

                <span className={styles.statLabel}>
                    Total Users
                </span>
            </div>


            <div className={styles.statItem}>
                <span className={styles.statNumber}>
                    {stats.active || activeUsers}
                </span>

                <span className={styles.statLabel}>
                    Active
                </span>
            </div>


            <div className={styles.statItem}>
                <span className={styles.statNumber}>
                    {stats.tutors || tutors}
                </span>

                <span className={styles.statLabel}>
                    Tutors
                </span>
            </div>


            <div className={styles.statItem}>
                <span className={styles.statNumber}>
                    {unverifiedUsers}
                </span>

                <span className={styles.statLabel}>
                    Unverified
                </span>
            </div>
        </div>
    );
}