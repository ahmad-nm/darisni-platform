import styles from './AnimatedBg.module.css';

export default function AnimatedBg() {
    return (
        <div className={styles.backgroundAnimation}>
            <div className={styles.floatingShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
                <div className={`${styles.shape} ${styles.shape4}`}></div>
                <div className={`${styles.shape} ${styles.shape5}`}></div>
            </div>
        </div>
    )
}