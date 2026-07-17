import { Transition } from "@headlessui/react";
import { Link, useForm } from "@inertiajs/react";
import ProfileButton from "@/Components/Profile/ProfileButton/ProfileButton";
import ProfileInput from "@/Components/Profile/ProfileInput/ProfileInput";
import formStyles from "../../../../Components/Profile/ProfileForm.module.css";
import styles from "./UpdateProfileInformationForm.module.css";
import { updateProfileInformation } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { user } = useAuth();

    const { data, setData, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = async (e) => {
        e.preventDefault();

        try {
            await updateProfileInformation(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={formStyles.formContainer}>
            <form onSubmit={submit} className={formStyles.form}>
                <ProfileInput
                    id="name"
                    type="text"
                    label="Full Name"
                    icon="👤"
                    error={errors.name}
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                />

                <ProfileInput
                    id="email"
                    type="email"
                    label="Email Address"
                    icon="📧"
                    error={errors.email}
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="Enter your email address"
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className={styles.verificationNotice}>
                        <div className={styles.verificationIcon}>📬</div>
                        <div className={styles.verificationContent}>
                            <p className={styles.verificationText}>
                                Your email address is unverified.
                            </p>
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className={styles.verificationLink}
                            >
                                Click here to re-send the verification email.
                            </Link>
                            {status === "verification-link-sent" && (
                                <div className={styles.verificationSuccess}>
                                    ✅ A new verification link has been sent to
                                    your email address.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className={formStyles.formActions}>
                    <ProfileButton
                        type="submit"
                        disabled={processing}
                        loading={processing}
                        icon="💾"
                    >
                        Save Changes
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
                            <span className={styles.successIcon}>✅</span>
                            Profile updated successfully!
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
