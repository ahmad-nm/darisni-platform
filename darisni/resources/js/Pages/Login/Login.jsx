import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import styles from "./Login.module.css";

export function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        console.log("Submitting login form:", form);

        try {
            await login(form, {
                onSuccess: (page) => {
                    console.log("Login onSuccess:", page);
                    const userData = page.props.auth?.user;
                    
                    if (!userData) {
                        setErrorMessage("Failed to fetch user data after login.");
                        setLoading(false);
                        return;
                    }

                    setWelcomeMessage(`Welcome back, ${userData.name}!`);
                    setTimeout(() => {
                        console.log("Redirecting to /");
                        router.visit("/");
                    }, 1500);
                },
                onError: (errors) => {
                    console.log("Login onError:", errors);
                    const msg = errors.email || errors.password || "Login failed!";
                    setErrorMessage(msg);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error("Login error (catch):", error);
            console.error("Login error:", error);
            setErrorMessage("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            
            {loading && (
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

            {welcomeMessage && (
                <div className={styles.welcomeMessage}>
                    <div className={styles.welcomeOverlay}></div>
                    <div className={styles.welcomeText}>{welcomeMessage}</div>
                </div>
            )}

            <div className={styles.loginContainer}>
                <h1 className={styles.loginTitle}>Login</h1>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <input className={styles.loginInput} name="email" type="email" placeholder="Email" onChange={handleChange} />
                    
                    <input className={styles.loginInput} name="password" type="password" placeholder="Password" onChange={handleChange} />
                    
                    <div className={styles.forgotPassword}>
                        <Link href="/forgot-password" className={styles.forgotPasswordLink}>Forgot Password?</Link>
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}>{errorMessage}</div>
                    )}
                    
                    <Link href="/signup" className={styles.signupLink}>Don't have an account? Sign up</Link>
                    
                    <button className={styles.loginButton} type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}