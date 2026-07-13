import { Head, Link, useForm } from '@inertiajs/react';
import styles from './Register.module.css';
import ProcessingSpinner from '@/Components/Auth/ProcessingSpinner/ProcessingSpinner';
import AnimatedBg from '@/Components/Auth/AnimatedBg/AnimatedBg';
import FormInput from '@/Components/Auth/FormInput/FormInput';
import AuthButton from '@/Components/Auth/AuthButton/AuthButton';

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
                    <ProcessingSpinner />
                )}

                <AnimatedBg />

                <div className={styles.registerContainer}>
                    <h1 className={styles.registerTitle}>Sign Up</h1>

                    <form onSubmit={submit} className={styles.registerForm}>
                        <div className={styles.inputGroup}>
                            <FormInput
                                id="name"
                                name="name"
                                value={data.name}
                                placeholder="Name"
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && (
                                <div className={styles.errorMessage}>{errors.name}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <FormInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Email"
                                autoComplete="username"
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <div className={styles.errorMessage}>{errors.password}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <FormInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            {errors.password_confirmation && (
                                <div className={styles.errorMessage}>{errors.password_confirmation}</div>
                            )}
                        </div>

                        <Link href={route('login')} className={styles.loginLink}>
                            Already have an account? Log in
                        </Link>

                        <AuthButton
                            type="submit"
                            disabled={processing}
                            text={processing ? 'Creating Account...' : 'Sign Up'}
                            styles={{ fontSize: '1.1rem' }}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
