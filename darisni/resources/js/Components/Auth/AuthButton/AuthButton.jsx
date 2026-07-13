import styles from './AuthButton.module.css';

export default function AuthButton({ type, text, onClick, disabled, ...props }) {
    return (
        <button
            type={type}
            className={styles.authButton}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {text}
        </button>
    )
}