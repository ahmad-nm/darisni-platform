import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import styles from './VerifyEmail.module.css';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className={styles.verifyPage}>
            <Head title="Email Verification" />

            <div className={styles.backgroundAnimation}>
                <div className={styles.floatingShapes}>
                    <div className={`${styles.shape} ${styles.shape1}`}></div>
                    <div className={`${styles.shape} ${styles.shape2}`}></div>
                    <div className={`${styles.shape} ${styles.shape3}`}></div>
                    <div className={`${styles.shape} ${styles.shape4}`}></div>
                    <div className={`${styles.shape} ${styles.shape5}`}></div>
                </div>
            </div>

            <div className={styles.verifyContainer}>
                <h1 className={styles.verifyTitle}>Verify Your Email</h1>
                <div className={styles.verifyDescription}>
                    Thanks for signing up! Before getting started, please verify your email address by clicking the link we just emailed to you.<br />
                    If you didn't receive the email, you can request another below.
                </div>

                {status === 'verification-link-sent' && (
                    <div className={styles.successMessage}>
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <form onSubmit={submit} className={styles.verifyForm}>
                    <div className={styles.verifyActions}>
                        <button type="submit" className={styles.verifyButton} disabled={processing}>
                            Send Verification Email
                        </button>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={styles.logoutButton}
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}