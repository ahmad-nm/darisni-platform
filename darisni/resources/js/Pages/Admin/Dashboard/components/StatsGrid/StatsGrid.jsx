import styles from "./StatsGrid.module.css";

export const StatsGrid = ({ loading, stats }) => {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statContent}>
                    <h3>
                        {loading ? "..." : stats.totalUsers.toLocaleString()}
                    </h3>
                    <p>Total Users</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <div className={styles.statContent}>
                    <h3>{loading ? "..." : stats.totalCourses}</h3>
                    <p>Total Courses</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>👨‍🏫</div>
                <div className={styles.statContent}>
                    <h3>{loading ? "..." : stats.totalTutors}</h3>
                    <p>Active Tutors</p>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon}>🎓</div>
                <div className={styles.statContent}>
                    <h3>
                        {loading
                            ? "..."
                            : stats.totalEnrollments.toLocaleString()}
                    </h3>
                    <p>Tutor Assignments</p>
                </div>
            </div>
        </div>
    );
};
