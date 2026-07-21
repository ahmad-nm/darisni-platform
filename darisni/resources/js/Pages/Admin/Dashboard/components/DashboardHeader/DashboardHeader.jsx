import styles from "./DashboardHeader.module.css";

export const DashboardHeader = ({
    user,
    loading,
    error,
    onRefresh,
}) => {
    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div>
                    <h1 className={styles.title}>
                        Admin Dashboard
                    </h1>

                    <p className={styles.subtitle}>
                        Welcome back, {user?.name}! Manage your Darisni
                        platform from here.
                    </p>
                </div>

                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={styles.refreshButton}
                    title="Refresh dashboard data"
                >
                    {loading ? "⟳" : "🔄"}
                </button>
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
        </div>
    );
};