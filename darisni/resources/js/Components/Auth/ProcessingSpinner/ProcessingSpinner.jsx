import styles from './ProcessingSpinner.module.css';

export default function ProcessingSpinner() {
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Processing...</div>
        </div>
    );
}