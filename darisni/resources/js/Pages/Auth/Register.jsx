import { Head, Link, useForm } from '@inertiajs/react';
import styles from './Register.module.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            
            <div className={styles.registerPage}>
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

                <div className={styles.registerContainer}>
                    <h1 className={styles.registerTitle}>Sign Up</h1>

                    <form onSubmit={submit} className={styles.registerForm}>
                        <div className={styles.inputGroup}>
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                className={styles.registerInput}
                                placeholder="Name"
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && (
                                <div className={styles.errorMessage}>{errors.name}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={styles.registerInput}
                                placeholder="Email"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                className={styles.registerInput}
                                placeholder="Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && (
                                <div className={styles.errorMessage}>{errors.password}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={styles.registerInput}
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && (
                                <div className={styles.errorMessage}>{errors.password_confirmation}</div>
                            )}
                        </div>

                        <Link href={route('login')} className={styles.loginLink}>
                            Already have an account? Log in
                        </Link>

                        <button 
                            className={styles.registerButton} 
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
