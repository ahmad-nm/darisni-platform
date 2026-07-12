import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import styles from './UpdateProfileInformationForm.module.css';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={submit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        <span className={styles.labelIcon}>👤</span>
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Enter your full name"
                    />
                    {errors.name && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>⚠️</span>
                            {errors.name}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        <span className={styles.labelIcon}>📧</span>
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="Enter your email address"
                    />
                    {errors.email && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>⚠️</span>
                            {errors.email}
                        </div>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className={styles.verificationNotice}>
                        <div className={styles.verificationIcon}>📬</div>
                        <div className={styles.verificationContent}>
                            <p className={styles.verificationText}>
                                Your email address is unverified.
                            </p>
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className={styles.verificationLink}
                            >
                                Click here to re-send the verification email.
                            </Link>
                            {status === 'verification-link-sent' && (
                                <div className={styles.verificationSuccess}>
                                    ✅ A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`${styles.saveButton} ${processing ? styles.saving : ''}`}
                    >
                        {processing ? (
                            <>
                                <span className={styles.spinner}></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className={styles.saveIcon}>💾</span>
                                Save Changes
                            </>
                        )}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter={styles.fadeEnter}
                        enterFrom={styles.fadeEnterFrom}
                        enterTo={styles.fadeEnterTo}
                        leave={styles.fadeLeave}
                        leaveFrom={styles.fadeLeaveFrom}
                        leaveTo={styles.fadeLeaveTo}
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
