import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import resetLock from '@/assets/Icons/resetLock.png'; // Make sure this image exists
import styles from './ResetPassword.module.css';
import FormInput from '@/Components/Auth/FormInput/FormInput';
import AuthButton from '@/Components/Auth/AuthButton/AuthButton';
import { resetPassword } from '@/services/authService';

export default function ResetPassword({ token, email }) {
    const { data, setData, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });
    const [message, setMessage] = useState('');

    const submit = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            await resetPassword(data);

            setMessage("Password reset successful! You can now log in.");
        } catch {
            setMessage("Error resetting password.");
        } finally {
            reset("password", "password_confirmation");
        }
    };

    return (
        <div className={styles.resetPassPage}>
            <Head title="Reset Password" />

            <div className={styles.resetPassContainer}>
                <h1 className={styles.resetPassTitle}>Reset Your Password</h1>
                
                <img src={resetLock} alt="Reset Lock" className={styles.resetLockIcon} />
                
                <form className={styles.resetPassForm} onSubmit={submit}>
                    <FormInput
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />

                    <FormInput
                        type="password"
                        placeholder="New password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />

                    <FormInput
                        type="password"
                        placeholder="Confirm new password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                    />

                    {errors.email && <div className="text-red-600 text-sm mt-2">{errors.email}</div>}
                    {errors.password && <div className="text-red-600 text-sm mt-2">{errors.password}</div>}
                    {errors.password_confirmation && <div className="text-red-600 text-sm mt-2">{errors.password_confirmation}</div>}
                    
                    <AuthButton
                        type="submit" 
                        disabled={processing}
                        text={processing ? 'Resetting...' : 'Reset Password'}
                    />
                </form>
                {message && <p>{message}</p>}
                <Link href="/login" className={styles.backToLogin}>Back to Login</Link>
            </div>
        </div>
    );
}