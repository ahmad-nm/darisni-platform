import { Link } from "@inertiajs/react";
import styles from "./QuickActions.module.css";

const actions = [
    {
        icon: "👥",
        title: "Manage Users",
        description: "Add, edit, or remove user accounts",
        route: "admin.users",
    },
    {
        icon: "📚",
        title: "Manage Courses",
        description: "Create and organize course content",
        route: "admin.courses",
    },
    {
        icon: "👨‍🏫",
        title: "Manage Tutors",
        description: "Manage tutor profiles, courses, and availability",
        route: "admin.tutors",
    },
    {
        icon: "⭐",
        title: "Manage Reviews",
        description: "Monitor and manage course reviews and ratings",
        route: "admin.reviews",
    },
    {
        icon: "📂",
        title: "Manage Categories",
        description: "Create and organize course categories",
        route: "admin.categories",
    },
    {
        icon: "📋",
        title: "Manage Enrollments",
        description: "View and manage course enrollments",
        route: "admin.enrollments",
    },
    {
        icon: "💡",
        title: "Manage Course Suggestions",
        description: "View and respond to course suggestions from users",
        route: "admin.course-suggestions",
    },
    {
        icon: "🌐",
        title: "Preview Website",
        description: "See how the public website looks",
        route: "home",
    },
];

export const QuickActions = () => {
    return (
        <div className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>

            <div className={styles.actionsGrid}>
                {actions.map((action, index) => (
                    <Link
                        key={action.route}
                        href={route(action.route)}
                        className={styles.actionCard}
                    >
                        <div className={styles.actionIcon}>{action.icon}</div>
                        <h3>{action.title}</h3>
                        <p>{action.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};