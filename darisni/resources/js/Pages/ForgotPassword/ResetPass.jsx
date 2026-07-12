import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import resetLock from '../../assets/Icons/resetLock.png';
import style from './ResetPass.module.css';

export function ResetPass() {
    const location = useLocation();
    const email = location.state?.email || '';
    const verified = location.state?.verified || false;
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!verified || !email) {
            navigate('/login');
        }
    }, [verified, email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            const res = await resetPassword(email, password, password_confirmation);
            setMessage(res.data.message || 'Password reset successful! You can now log in.');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                error.message ||
                'Error resetting password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.resetPassPage}>

            {loading && (
                <div className={style.loadingOverlay}>
                    <div className={style.loadingSpinner}></div>
                    <div className={style.loadingText}>Processing...</div>
                </div>
            )}

            <div className={style.resetPassContainer}>
                <h1 className={style.resetPassTitle}>Reset Your Password</h1>
                <img src={resetLock} alt="Reset Lock" className={style.resetLockIcon} />
                <form className={style.resetPassForm} onSubmit={handleSubmit}>
                    <input
                        className={style.resetPassInput}
                        type="password"
                        placeholder="New password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <input
                        className={style.resetPassInput}
                        type="password"
                        placeholder="Confirm new password"
                        required
                        value={password_confirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                    />
                    <button className={style.submitButton} type="submit">Reset Password</button>
                </form>
                {message && <p>{message}</p>}
                <Link to="/login" className={style.backToLogin}>Back to Login</Link>
            </div>
        </div>
    );
}