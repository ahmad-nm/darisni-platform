import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "@inertiajs/react";
import styles from "./AdminLogin.module.css";
import { navigate } from "@/utils/navigationService";
import { ROUTES } from "@/constants/routes";

export function AdminLogin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            await login(form, {
                onSuccess: (page) => {
                    const userData = page.props.auth?.user;

                    if (!userData) {
                        setErrorMessage(
                            "Authentication failed. Please try again.",
                        );
                        setLoading(false);
                        return;
                    }

                    // Check if email is verified
                    if (!userData.email_verified_at) {
                        setErrorMessage("Your email is not verified.");
                        setLoading(false);
                        return;
                    }

                    // Check if user is admin
                    if (userData.role !== "admin") {
                        setErrorMessage(
                            `Access denied. Admin privileges required. Your role: ${userData.role}`,
                        );
                        setLoading(false);
                        return;
                    }

                    setWelcomeMessage(`Welcome back, Admin ${userData.name}!`);

                    // Small delay to show welcome message before redirecting
                    setTimeout(() => {
                        navigate(ROUTES.ADMIN_DASHBOARD);
                    }, 1500);
                },
                onError: (errors) => {
                    const msg =
                        errors.email || errors.password || "Login failed!";
                    setErrorMessage(msg);
                    setLoading(false);
                },
            });
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className={styles.adminLoginPage}>
            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Authenticating...</div>
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
                <div className={styles.adminBadge}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z"
                            fill="currentColor"
                        />
                        <path
                            d="M10 16L6 12L7.41 10.59L10 13.17L16.59 6.58L18 8L10 16Z"
                            fill="white"
                        />
                    </svg>
                    Admin Panel
                </div>

                <h1 className={styles.loginTitle}>Admin Login</h1>
                <p className={styles.loginSubtitle}>
                    Enter your admin credentials to access the dashboard
                </p>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <input
                            className={styles.loginInput}
                            name="email"
                            type="email"
                            placeholder="Admin Email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            className={styles.loginInput}
                            name="password"
                            type="password"
                            placeholder="Admin Password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="currentColor"
                                />
                                <line
                                    x1="15"
                                    y1="9"
                                    x2="9"
                                    y2="15"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                                <line
                                    x1="9"
                                    y1="9"
                                    x2="15"
                                    y2="15"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </svg>
                            {errorMessage}
                        </div>
                    )}

                    <button
                        className={styles.loginButton}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Login to Admin Panel"}
                    </button>
                </form>

                <div className={styles.securityNote}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="12"
                            stroke="white"
                            strokeWidth="2"
                        />
                        <line
                            x1="12"
                            y1="16"
                            x2="12.01"
                            y2="16"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </svg>
                    This is a secure admin area. Only authorized personnel can
                    access this panel.
                </div>
            </div>
        </div>
    );
}
