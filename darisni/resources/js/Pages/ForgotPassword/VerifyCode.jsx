import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import dmIcon from '../../assets/Icons/dm.png';
import style from './VerifyCode.module.css';

export function VerifyCode() {
    const location = useLocation();
    const email = location.state?.email || '';
    const verified = location.state?.verified || false;
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const CODE_EXPIRY_KEY = "code_expiry_time";
    const EXPIRY_SECONDS = 600;

    const getInitialSecondsLeft = () => {
        const expiry = localStorage.getItem(CODE_EXPIRY_KEY);
        if (expiry) {
            const msLeft = parseInt(expiry, 10) - Date.now();
            return msLeft > 0 ? Math.floor(msLeft / 1000) : 0;
        }
        return EXPIRY_SECONDS;
    };

    const [secondsLeft, setSecondsLeft] = useState(getInitialSecondsLeft());
    const [expired, setExpired] = useState(getInitialSecondsLeft() <= 0);

    useEffect(() => {
        if (!verified || !email) {
            navigate('/login');
        }
    }, [verified, email, navigate]);

    useEffect(() => {
        if (expired) return;
        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    setExpired(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [expired]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyCode(email, code);
            setMessage(res.data.message || 'Code verified!');
            navigate('/reset-password', { state: { email, verified: true } });
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                error.message ||
                'Invalid code or network error.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.verifyCodePage}>

            {loading && (
                <div className={style.loadingOverlay}>
                    <div className={style.loadingSpinner}></div>
                    <div className={style.loadingText}>Processing...</div>
                </div>
            )}

            <div className={style.verifyCodeContainer}>
                <h1 className={style.verifyCodeTitle}>Verify Your Code</h1>
                
                <img className={style.DMIcon} src={dmIcon} alt="DM Icon" />
                
                <p className={style.description}>Please enter the 6-digit code sent <br />to your email.</p>
                
                <div className={style.timer}>
                    {expired
                        ? "Expired"
                        : `Code expires in ${Math.floor(secondsLeft / 60)
                        .toString()
                        .padStart(2, "0")}:${(secondsLeft % 60)
                        .toString()
                        .padStart(2, "0")}`}
                </div>

                <form className={style.verifyCodeForm} onSubmit={handleSubmit}>
                    <input
                        className={style.codeInput}
                        type="text"
                        placeholder="Enter your code"
                        required
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        maxLength={6}
                        disabled={expired}
                    />
                    <button className={style.submitButton} type="submit" disabled={expired}>Verify Code</button>
                </form>
                
                {expired && (
                    <p className={style.expiredMessage}>
                        The code has expired. Please request a new one.
                    </p>
                )}                
                
                {message && <p>{message}</p>}
                
                <Link to="/login" className={style.backToLogin}>Back to Login</Link>
            </div>
        </div>
    );
}