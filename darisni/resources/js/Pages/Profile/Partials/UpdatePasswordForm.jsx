import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import styles from './UpdatePasswordForm.module.css';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={updatePassword} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="current_password" className={styles.label}>
                        <span className={styles.labelIcon}>🔒</span>
                        Current Password
                    </label>
                    <div className={styles.passwordField}>
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type={showPasswords.current ? 'text' : 'password'}
                            className={`${styles.input} ${errors.current_password ? styles.inputError : ''}`}
                            autoComplete="current-password"
                            placeholder="Enter your current password"
                        />
                        <button
                            type="button"
                            className={styles.togglePassword}
                            onClick={() => togglePasswordVisibility('current')}
                        >
                            {showPasswords.current ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.current_password && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>⚠️</span>
                            {errors.current_password}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        <span className={styles.labelIcon}>🔑</span>
                        New Password
                    </label>
                    <div className={styles.passwordField}>
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showPasswords.new ? 'text' : 'password'}
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            autoComplete="new-password"
                            placeholder="Enter a strong new password"
                        />
                        <button
                            type="button"
                            className={styles.togglePassword}
                            onClick={() => togglePasswordVisibility('new')}
                        >
                            {showPasswords.new ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.password && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>⚠️</span>
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password_confirmation" className={styles.label}>
                        <span className={styles.labelIcon}>✅</span>
                        Confirm New Password
                    </label>
                    <div className={styles.passwordField}>
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type={showPasswords.confirm ? 'text' : 'password'}
                            className={`${styles.input} ${errors.password_confirmation ? styles.inputError : ''}`}
                            autoComplete="new-password"
                            placeholder="Confirm your new password"
                        />
                        <button
                            type="button"
                            className={styles.togglePassword}
                            onClick={() => togglePasswordVisibility('confirm')}
                        >
                            {showPasswords.confirm ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <div className={styles.errorMessage}>
                            <span className={styles.errorIcon}>⚠️</span>
                            {errors.password_confirmation}
                        </div>
                    )}
                </div>

                <div className={styles.passwordTips}>
                    <h4 className={styles.tipsTitle}>Password Requirements:</h4>
                    <ul className={styles.tipsList}>
                        <li>At least 8 characters long</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Include at least one number</li>
                        <li>Include at least one special character</li>
                    </ul>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`${styles.updateButton} ${processing ? styles.updating : ''}`}
                    >
                        {processing ? (
                            <>
                                <span className={styles.spinner}></span>
                                Updating Password...
                            </>
                        ) : (
                            <>
                                <span className={styles.updateIcon}>🔐</span>
                                Update Password
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
                            <span className={styles.successIcon}>🎉</span>
                            Password updated successfully!
                        </div>
                    </Transition>
                </div>
            </form>
        </div>
    );
}
