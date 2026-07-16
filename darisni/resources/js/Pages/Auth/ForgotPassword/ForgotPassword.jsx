import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head, useForm } from '@inertiajs/react';
import lockIcon from '@/assets/Icons/lock.png';
import styles from './ForgotPassword.module.css';
import ProcessingSpinner from '@/Components/Auth/ProcessingSpinner/ProcessingSpinner';
import FormInput from '@/Components/Auth/FormInput/FormInput';
import AuthButton from '@/Components/Auth/AuthButton/AuthButton';
import { forgotPassword } from '@/services/authService';

export default function ForgotPassword({ status }) {
    const { data, setData, processing, errors } = useForm({
        email: '',
    });
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await forgotPassword(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <Head title="Forgot Password" />

            {loading && (
                <ProcessingSpinner />
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
                    <FormInput
                        type="email"
                        placeholder="✉ Enter your email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <div className="text-red-600 text-sm mt-2">{errors.email}</div>
                    )}
                    <AuthButton
                        type="submit" 
                        disabled={processing}
                        text="Send Reset Link"
                    />
                </form>
                <Link className={styles.backToLogin} href="/login">Back to Login</Link>
            </div>
        </div>
    );
}