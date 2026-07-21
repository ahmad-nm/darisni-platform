import styles from "./ActivitySection.module.css";

export const ActivitySection = ({ loading, activities }) => {
    return (
        <div className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>

            <div className={styles.activityList}>
                {loading ? (
                    <div className={styles.loadingMessage}>
                        Loading activities...
                    </div>
                ) : activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div
                            key={index}
                            className={styles.activityItem}
                        >
                            <div className={styles.activityIcon}>
                                {activity.icon}
                            </div>

                            <div className={styles.activityContent}>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: activity.message,
                                    }}
                                />

                                <span className={styles.activityTime}>
                                    {activity.formatted_time}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noActivityMessage}>
                        No recent activity found.
                    </div>
                )}
            </div>
        </div>
    );
};