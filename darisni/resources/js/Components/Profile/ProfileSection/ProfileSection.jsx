import styles from "./ProfileSection.module.css";

export default function ProfileSection({
    title,
    description,
    children,
}) {
    return (
        <section className={styles.section}>
            <header className={styles.header}>
                <h2>{title}</h2>

                {description && (
                    <p>{description}</p>
                )}
            </header>

            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
}