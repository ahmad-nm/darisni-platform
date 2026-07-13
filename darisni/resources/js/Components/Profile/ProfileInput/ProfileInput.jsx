import { forwardRef } from "react";
import styles from "./ProfileInput.module.css";

const ProfileInput = forwardRef(function ProfileInput(
    { label, icon, error, className = "", ...props },
    ref,
) {
    return (
        <div className={styles.formGroup}>
            {label && (
                <label htmlFor={props.id} className={styles.label}>
                    {icon && <span className={styles.labelIcon}>{icon}</span>}
                    {label}
                </label>
            )}

            <input
                {...props}
                ref={ref}
                className={`${styles.input} ${
                    error ? styles.inputError : ""
                } ${className}`.trim()}
            />

            {error && <p className={styles.error}>⚠️ {error}</p>}
        </div>
    );
});

export default ProfileInput;
