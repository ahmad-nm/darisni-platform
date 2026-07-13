import styles from "./FormError.module.css";

export default function FormError({ error }) {
    if (!error) return null;

    return (
        <div className={styles.error}>
            <span>⚠️</span>
            {error}
        </div>
    );
}