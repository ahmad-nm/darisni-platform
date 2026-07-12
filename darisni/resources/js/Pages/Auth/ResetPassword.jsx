import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import resetLock from '@/assets/Icons/resetLock.png'; // Make sure this image exists
import styles from './ResetPassword.module.css';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    const [message, setMessage] = useState('');

    const submit = (e) => {
        e.preventDefault();
        setMessage('');
        post(route('password.store'), {
            onSuccess: () => setMessage('Password reset successful! You can now log in.'),
            onError: () => setMessage('Error resetting password.'),
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className={styles.resetPassPage}>
            <Head title="Reset Password" />

            <div className={styles.resetPassContainer}>
                <h1 className={styles.resetPassTitle}>Reset Your Password</h1>
                <img src={resetLock} alt="Reset Lock" className={styles.resetLockIcon} />
                <form className={styles.resetPassForm} onSubmit={submit}>
                    <input
                        className={styles.resetPassInput}
                        type="email"
                        placeholder="Email"
                        required
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    <input
                        className={styles.resetPassInput}
                        type="password"
                        placeholder="New password"
                        required
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    <input
                        className={styles.resetPassInput}
                        type="password"
                        placeholder="Confirm new password"
                        required
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                    />
                    {errors.email && <div className="text-red-600 text-sm mt-2">{errors.email}</div>}
                    {errors.password && <div className="text-red-600 text-sm mt-2">{errors.password}</div>}
                    {errors.password_confirmation && <div className="text-red-600 text-sm mt-2">{errors.password_confirmation}</div>}
                    <button className={styles.submitButton} type="submit" disabled={processing}>
                        Reset Password
                    </button>
                </form>
                {message && <p>{message}</p>}
                <Link href="/login" className={styles.backToLogin}>Back to Login</Link>
            </div>
        </div>
    );
}