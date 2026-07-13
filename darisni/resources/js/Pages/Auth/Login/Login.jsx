import { Head, Link, useForm } from '@inertiajs/react';
import styles from './Login.module.css';
import ProcessingSpinner from '@/Components/Auth/ProcessingSpinner/ProcessingSpinner';
import AnimatedBg from '@/Components/Auth/AnimatedBg/AnimatedBg';
import FormInput from '@/Components/Auth/FormInput/FormInput';
import AuthButton from '@/Components/Auth/AuthButton/AuthButton';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            
            <div className={styles.loginPage}>
                {processing && (
                    <ProcessingSpinner />
                )}

                <AnimatedBg />

                <div className={styles.loginContainer}>
                    <h1 className={styles.loginTitle}>Login</h1>

                    {status && (
                        <div className={styles.statusMessage}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <FormInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Email"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <div className={styles.errorMessage}>{errors.email}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <FormInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="Password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <div className={styles.errorMessage}>{errors.password}</div>
                            )}
                        </div>

                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember" className={styles.checkboxLabel}>
                                Remember me
                            </label>
                        </div>

                        <div className={styles.forgotPassword}>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className={styles.forgotPasswordLink}
                                >
                                    Forgot Password?
                                </Link>
                            )}
                        </div>

                        <Link href={route('register')} className={styles.registerLink}>
                            Don't have an account? Sign up
                        </Link>

                        <AuthButton
                            type="submit"
                            disabled={processing}
                            text={processing ? 'Logging in...' : 'Login'}
                            style={{ fontSize: '1.1rem' }}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
