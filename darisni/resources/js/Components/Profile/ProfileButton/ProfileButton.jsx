import styles from "./PorfileButton.module.css";

export default function ProfileButton({
    children,
    loading,
    icon,
    variant = "primary",
    ...props
}) {
    return (
        <button
            {...props}
            className={`${styles.button} ${styles[variant] || ""}`.trim()}
        >
            {loading ? (
                <>
                    <span className={styles.spinner} />
                    Loading...
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}
