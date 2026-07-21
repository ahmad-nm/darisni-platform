import styles from "./ReviewStats.module.css";


export default function ReviewStats({ stats }) {

    const cards = [
        {
            icon: "📊",
            value: stats.total_reviews,
            label: "Total Reviews",
        },
        {
            icon: "📚",
            value: stats.course_reviews,
            label: "Course Reviews",
        },
        {
            icon: "👨‍🏫",
            value: stats.tutor_reviews,
            label: "Tutor Reviews",
        },
        {
            icon: "🏢",
            value: stats.darisni_reviews,
            label: "Platform Reviews",
        },
        {
            icon: "⭐",
            value: stats.average_ratings?.overall || 0,
            label: "Avg Rating",
        },
        {
            icon: "🆕",
            value: stats.recent_reviews?.total || 0,
            label: "Recent (7 days)",
        },
    ];


    return (
        <div className={styles.statsContainer}>

            {cards.map((card) => (

                <div
                    key={card.label}
                    className={styles.statCard}
                >

                    <div className={styles.statIcon}>
                        {card.icon}
                    </div>


                    <div className={styles.statInfo}>

                        <span className={styles.statNumber}>
                            {card.value}
                        </span>


                        <span className={styles.statLabel}>
                            {card.label}
                        </span>

                    </div>

                </div>

            ))}

        </div>
    );
}