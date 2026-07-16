import { Head, Link, useForm } from '@inertiajs/react';
import styles from './VerifyEmail.module.css';
import AuthButton from '@/Components/Auth/AuthButton/AuthButton';
import AnimatedBg from '@/Components/Auth/AnimatedBg/AnimatedBg';
import { resendVerificationEmail } from "@/services/authService";

export default function VerifyEmail({ status }) {
    const { processing } = useForm({});

    const submit = async (e) => {
        e.preventDefault();

        await resendVerificationEmail();
    };

    return (
        <div className={styles.verifyPage}>
            <Head title="Email Verification" />

            <AnimatedBg />

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
                        <AuthButton
                            type="submit" 
                            disabled={processing}
                            text="Send Verification Email"
                        />
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