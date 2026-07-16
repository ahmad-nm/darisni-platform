import { router, usePage } from '@inertiajs/react';
import { useAuth } from '../../Context/AuthContext';
import { Loader } from '../../Components/Loader/Loader';
import AuthRequired from './components/AuthRequired';
import SuccessMessage from './components/SuccessMessage';
import JoinTeamForm from './components/JoinTeamForm';
import { useState, useEffect } from 'react';
import style from './JoinTeam.module.css';
import { submitTutorApplication } from '@/services/joinTeamService';

export default function JoinTeam() {
    const { user, isAuthenticated } = useAuth();
    const { props } = usePage();
    const [isLoading, setIsLoading] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    // Handle flash messages from Laravel
    useEffect(() => {
        if (props.flash) {
            if (props.flash.success) {
                setShowSuccess(true);
                // Redirect to homepage after 3 seconds
                setTimeout(() => {
                    router.visit('/');
                }, 3000);
            }
        }
        if (props.errors && Object.keys(props.errors).length > 0) {
            let errorMessage = "Please fix the following errors:\n";
            Object.keys(props.errors).forEach(key => {
                if (Array.isArray(props.errors[key])) {
                    errorMessage += `• ${props.errors[key][0]}\n`;
                } else {
                    errorMessage += `• ${props.errors[key]}\n`;
                }
            });
            alert(errorMessage);
        }
    }, [props.flash, props.errors]);

    useEffect(() => {
        const minLoadTime = 1500;
        const start = Date.now();

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = minLoadTime - elapsed;
            if (remaining > 0) {
                setTimeout(() => setIsLoading(false), remaining);
            } else {
                setIsLoading(false);
            }
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        university: "",
        year: "",
        coursesToGive: [],
        whereYouSeeYourself: "",
        cv: null,
        pay: "",
        otherCourses: "",
        goodTutor: ""
    });

    // Auto-fill user data if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCourseCheckbox = (courseName, checked) => {
        setFormData(prev => {
            const updated = checked
                ? [...prev.coursesToGive, courseName]
                : prev.coursesToGive.filter(c => c !== courseName);
            return { ...prev, coursesToGive: updated };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            await submitTutorApplication(formData, user?.id || "");

            setShowSuccess(true);

            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phone: "",
                age: "",
                university: "",
                year: "",
                coursesToGive: [],
                whereYouSeeYourself: "",
                cv: null,
                pay: "",
                otherCourses: "",
                goodTutor: "",
            });

            const fileInput = document.getElementById("cv");

            if (fileInput) {
                fileInput.value = "";
            }

            setTimeout(() => {
                router.visit("/");
            }, 3000);
        } catch (errors) {
            console.error(errors);

            let errorMessage =
                "Failed to submit application. Please check the following:\n";

            Object.keys(errors).forEach((key) => {
                if (Array.isArray(errors[key])) {
                    errorMessage += `• ${errors[key][0]}\n`;
                } else {
                    errorMessage += `• ${errors[key]}\n`;
                }
            });

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        router.visit('/login');
    };

    const handleSignup = () => {
        router.visit('/register');
    };

    // Show loader while checking authentication
    if (isLoading) {
        return (
            <div className={style.loaderWrapper}>
                <Loader />
            </div>
        );
    }

    // Show success message if submission was successful
    if (showSuccess) {
        return (
            <div className={style.JoinTeamPage}>
                <SuccessMessage />
            </div>
        );
    }

    // Show authentication required message if user is not logged in
    if (!isAuthenticated) {
        return (
            <div className={style.JoinTeamPage}>
                <AuthRequired
                    handleLogin={handleLogin}
                    handleSignup={handleSignup}
                />
            </div>
        );
    }

    return (
        <div className={style.JoinTeamPage}>
            <JoinTeamForm
                user={user}
                formData={formData}
                Loading={Loading}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleCourseCheckbox={handleCourseCheckbox}
            />
        </div>
    );
}