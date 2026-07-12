import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import styles from "./SignUp.module.css";

export function Signup() {
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationOverlay, setVerificationOverlay] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const { register } = useAuth();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);
        
        try {
            await register(form, {
                onSuccess: () => {
                    setVerificationOverlay(true);
                },
                onError: (errors) => {
                    const msg = Object.values(errors).flat().join(', ') || "Registration failed!";
                    setErrorMessage(msg);
                    setLoading(false);
                }
            });
        } catch (registerError) {
            if (registerError.response) {
                setErrorMessage(registerError.response.data?.message || "Signup failed! Please check your input.");
            } else if (registerError.request) {
                setErrorMessage("No response from server. Please check your connection.");
            } else {
                setErrorMessage("An unexpected error occurred during signup.");
            }
        } finally {
            setLoading(false);
        }
    };

    // For Laravel, email verification will be handled by the backend
    // User can continue to main site and verify later
    const handleContinue = () => {
        router.visit('/');
    };

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            router.post('/email/verification-notification', {}, {
                onSuccess: () => {
                    // Show success message - verification email sent
                },
                onError: (errors) => {
                    setErrorMessage("Error resending verification email. Please try again later.");
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (error) {
            setErrorMessage("Error resending verification email. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div className={styles.signupPage}>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Processing...</div>
                </div>
            )}

            {verificationOverlay && (
                <div className={styles.verificationOverlay}>
                    <div className={styles.verificationMessage}>
                        <p>A verification email has been sent to {form.email}. Please check your inbox.</p>
                    </div>
                    <div className={styles.verificationControls}>
                        <button className={styles.closeButton} onClick={() => setVerificationOverlay(false)}>Close</button>
                        <button className={styles.resendButton} onClick={handleResendVerification}>Resend Verification Email</button>
                    </div>
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

            <div className={styles.SignUpContainer}>
                <h1 className={styles.SignupTitle}>Sign Up</h1>
                <form onSubmit={handleSubmit} className={styles.SignupForm}>
                    <input className={styles.SignupInput} name="name" value={form.name} placeholder="Name" onChange={handleChange} />
                    <input className={styles.SignupInput} name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange} />
                    <input className={styles.SignupInput} name="password" type="password" value={form.password} placeholder="Password" onChange={handleChange} />
                    <input
                        className={styles.SignupInput}
                        name="password_confirmation"
                        type="password"
                        value={form.password_confirmation}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                    />

                    {errorMessage && (
                        <div className={styles.errorMessage}>{errorMessage}</div>
                    )}

                    <Link href="/login" className={styles.loginLink}>Already have an account? Log in</Link>
                    <button className={styles.SignupButton} type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}