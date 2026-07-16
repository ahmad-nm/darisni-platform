import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import ProfileButton from "@/Components/Profile/ProfileButton/ProfileButton";
import ProfilePasswordInput from "@/Components/Profile/ProfilePasswordInput/ProfilePasswordInput";
import formStyles from "../../../../Components/Profile/ProfileForm.module.css";
import styles from "./UpdatePasswordForm.module.css";
import { updateUserPassword } from "@/services/profileService";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = async (e) => {
        e.preventDefault();

        try {
            await updateUserPassword(data.current_password, data.password, data.password_confirmation);
            reset();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Handle validation errors
                console.error("Validation errors:", error.response.data.errors);
            } else {
                // Handle other errors
                console.error("An error occurred:", error);
            }
        }
    };

    return (
        <div className={formStyles.formContainer}>
            <form onSubmit={updatePassword} className={formStyles.form}>
                <ProfilePasswordInput
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) =>
                        setData("current_password", e.target.value)
                    }
                    label="Current Password"
                    icon="🔒"
                    error={errors.current_password}
                    autoComplete="current-password"
                    placeholder="Enter your current password"
                />

                <ProfilePasswordInput
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    label="New Password"
                    icon="🔑"
                    error={errors.password}
                    autoComplete="new-password"
                    placeholder="Enter a strong new password"
                />

                <ProfilePasswordInput
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    label="Confirm New Password"
                    icon="✅"
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                />

                <div className={styles.passwordTips}>
                    <h4 className={styles.tipsTitle}>Password Requirements:</h4>
                    <ul className={styles.tipsList}>
                        <li>At least 8 characters long</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Include at least one number</li>
                        <li>Include at least one special character</li>
                    </ul>
                </div>

                <div className={formStyles.formActions}>
                    <ProfileButton
                        type="submit"
                        disabled={processing}
                        loading={processing}
                        icon="🔐"
                    >
                        Update Password
                    </ProfileButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition-opacity duration-300 ease-in-out"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition-opacity duration-300 ease-in-out"
                        leaveFrom="opacity-100 translate-x-0"
                        leaveTo="opacity-0 translate-x-2"
                    >
                        <div className={styles.successMessage}>
                            <span className={styles.successIcon}>🎉</span>
                            Password updated successfully!
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
