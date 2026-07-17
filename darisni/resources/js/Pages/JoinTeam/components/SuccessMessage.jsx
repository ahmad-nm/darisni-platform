import { router } from "@inertiajs/react";
import style from "../JoinTeam.module.css";
import { navigate } from "@/utils/navigationService";
import { ROUTES } from "@/constants/routes";

export default function SuccessMessage() {
    return (
        <div className={style.successContainer}>
            <div className={style.successCard}>
                <div className={style.successIcon}>✅</div>
                <h2 className={style.successTitle}>
                    Application Submitted Successfully!
                </h2>
                <p className={style.successMessage}>
                    Thank you for your interest in joining our team! We have
                    received your application and will review it carefully.
                    We'll get back to you soon with updates on your application
                    status.
                </p>
                <div className={style.redirectMessage}>
                    <p>
                        You will be redirected to the homepage in a few
                        seconds...
                    </p>
                </div>
                <button
                    onClick={() => navigate(ROUTES.HOME)}
                    className={style.homeButton}
                >
                    Go to Homepage Now
                </button>
            </div>
        </div>
    );
}
