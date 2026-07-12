import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head, useForm } from '@inertiajs/react';
import lockIcon from '@/assets/Icons/lock.png';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('password.email'), {
            onFinish: () => setLoading(false)
        });
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <Head title="Forgot Password" />

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Processing...</div>
                </div>
            )}

            <div className={styles.forgotPasswordContainer}>
                <h1 className={styles.forgotPasswordTitle}>Forgot Password?</h1>
                <img className={styles.lockIcon} src={lockIcon} alt="Lock" />
                <p className={styles.description}>
                    We'll send you an email to reset <br /> your password.
                </p>
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
                <form className={styles.forgotPasswordForm} onSubmit={submit}>
                    <input
                        className={styles.emailInput}
                        type="email"
                        placeholder="✉ Enter your email"
                        required
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <div className="text-red-600 text-sm mt-2">{errors.email}</div>
                    )}
                    <button className={styles.submitButton} type="submit" disabled={processing}>
                        Send Reset Link
                    </button>
                </form>
                <Link className={styles.backToLogin} href="/login">Back to Login</Link>
            </div>
        </div>
    );
}