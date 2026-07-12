import { Head, Link, useForm } from '@inertiajs/react';
import styles from './Login.module.css';

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
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loadingSpinner}></div>
                        <div className={styles.loadingText}>Processing...</div>
                    </div>
                )}

                <div className={styles.backgroundAnimation}>
                    <div className={styles.floatingShapes}>
                        <div className={`${styles.shape} ${styles.shape1}`}></div>
                        <div className={`${styles.shape} ${styles.shape2}`}></div>
                        <div className={`${styles.shape} ${styles.shape3}`}></div>
                        <div className={`${styles.shape} ${styles.shape4}`}></div>
                        <div className={`${styles.shape} ${styles.shape5}`}></div>
                    </div>
                </div>

                <div className={styles.loginContainer}>
                    <h1 className={styles.loginTitle}>Login</h1>

                    {status && (
                        <div className={styles.statusMessage}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={styles.loginInput}
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
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={styles.loginInput}
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

                        <button 
                            className={styles.loginButton} 
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
