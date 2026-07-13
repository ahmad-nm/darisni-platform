import style from "../JoinTeam.module.css";

export default function AuthRequired({ handleLogin, handleSignup }) {
    return (
        <div className={style.authRequiredContainer}>
            <div className={style.authCard}>
                <h2 className={style.authTitle}>Authentication Required</h2>
                <p className={style.authMessage}>
                    You need to be logged in to apply for a tutor position.
                    Please log in to your account or create a new one to
                    continue.
                </p>
                <div className={style.authButtons}>
                    <button
                        onClick={handleLogin}
                        className={`${style.authButton} ${style.loginButton}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignup}
                        className={`${style.authButton} ${style.signupButton}`}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
