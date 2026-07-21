import styles from "../TutorApplications.module.css";

export default function ApplicationStats({ stats }) {
    return (
        <div className={styles.statsContainer}>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.total}</span>
                <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.pending}</span>
                <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.approved}</span>
                <span className={styles.statLabel}>Approved</span>
            </div>
            <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.rejected}</span>
                <span className={styles.statLabel}>Rejected</span>
            </div>
        </div>
    );
}
