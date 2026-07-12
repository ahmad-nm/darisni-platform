import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { router } from '@inertiajs/react';
import lockIcon from '../../assets/Icons/lock.png';
import style from './ForgotPassword.module.css';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const CODE_EXPIRY_KEY = "code_expiry_time";
    const EXPIRY_SECONDS = 600;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            console.error("Email is required");
            return;
        }

        setLoading(true);
        forgotPassword(email)
            .then(response => {
                localStorage.setItem(CODE_EXPIRY_KEY, (Date.now() + EXPIRY_SECONDS * 1000).toString());
                navigate('/verify-code', { state: { email, verified: true } });
            })
            .catch(error => {
                alert("Error sending forgot password email, try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={style.forgotPasswordPage}>
            
            {loading && (
                <div className={style.loadingOverlay}>
                    <div className={style.loadingSpinner}></div>
                    <div className={style.loadingText}>Processing...</div>
                </div>
            )}

            <div className={style.forgotPasswordContainer}>
                <h1 className={style.forgotPasswordTitle}>Forgot Password?</h1>
                <img className={style.lockIcon} src={lockIcon} alt="Lock" />
                <p className={style.description}>We'll send you an email to reset <br /> your password.</p>
                <form className={style.forgotPasswordForm} onSubmit={handleSubmit}>
                    <input 
                        className={style.emailInput} 
                        type="email" 
                        placeholder={`✉ Enter your email`} 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <button className={style.submitButton} type="submit">Send Reset Link</button>
                </form>
                <Link className={style.backToLogin} to="/login">Back to Login</Link>
            </div>
        </div>
    )
}