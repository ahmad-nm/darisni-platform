import { forwardRef, useState } from "react";
import ProfileInput from "../ProfileInput/ProfileInput";
import styles from "./ProfilePasswordInput.module.css";

const ProfilePasswordInput = forwardRef(function ProfilePasswordInput(
    { label, icon, error, className = "", ...props },
    ref,
) {
    const [show, setShow] = useState(false);

    return (
        <div className={styles.passwordField}>
            <ProfileInput
                {...props}
                ref={ref}
                type={show ? "text" : "password"}
                label={label}
                icon={icon}
                error={error}
                className={className}
            />

            <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShow(!show)}
            >
                {show ? "🙈" : "👁️"}
            </button>
        </div>
    );
});

export default ProfilePasswordInput;
