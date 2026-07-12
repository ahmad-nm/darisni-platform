import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useAuth } from '../../Context/AuthContext';
import { Loader } from '../../Components/Loader/Loader';
import { courseOptions } from '../../Objects/FormCourses';
import style from './JoinTeam.module.css';

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
            // Create FormData for file upload
            const formDataToSubmit = new FormData();
            
            // Append all form fields
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('email', formData.email);
            formDataToSubmit.append('phone', formData.phone);
            formDataToSubmit.append('age', formData.age);
            formDataToSubmit.append('university', formData.university);
            formDataToSubmit.append('year', formData.year);
            formDataToSubmit.append('whereYouSeeYourself', formData.whereYouSeeYourself);
            formDataToSubmit.append('pay', formData.pay);
            formDataToSubmit.append('otherCourses', formData.otherCourses);
            formDataToSubmit.append('goodTutor', formData.goodTutor);
            formDataToSubmit.append('user_id', user?.id || '');
            
            // Append courses array
            formData.coursesToGive.forEach((course, index) => {
                formDataToSubmit.append(`coursesToGive[${index}]`, course);
            });
            
            // Append CV file
            if (formData.cv) {
                formDataToSubmit.append('cv', formData.cv);
            }

            // Submit using router.post for proper CSRF handling
            router.post('/tutor-applications', formDataToSubmit, {
                forceFormData: true,
                onSuccess: (page) => {
                    // Show success message and redirect
                    setShowSuccess(true);
                    
                    // Reset form after successful submission
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
                        goodTutor: ""
                    });

                    const fileInput = document.getElementById("cv");
                    if (fileInput) {
                        fileInput.value = "";
                    }
                    
                    // Redirect to homepage after 3 seconds
                    setTimeout(() => {
                        router.visit('/');
                    }, 3000);
                },
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    let errorMessage = "Failed to submit application. Please check the following:\n";
                    
                    Object.keys(errors).forEach(key => {
                        if (Array.isArray(errors[key])) {
                            errorMessage += `• ${errors[key][0]}\n`;
                        } else {
                            errorMessage += `• ${errors[key]}\n`;
                        }
                    });
                    
                    alert(errorMessage);
                },
                onFinish: () => {
                    setLoading(false);
                    
                }
            });

        } catch (error) {
            alert("Failed to submit application. Please try again.");
            console.error(error);
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
                <div className={style.successContainer}>
                    <div className={style.successCard}>
                        <div className={style.successIcon}>✅</div>
                        <h2 className={style.successTitle}>Application Submitted Successfully!</h2>
                        <p className={style.successMessage}>
                            Thank you for your interest in joining our team! We have received your application 
                            and will review it carefully. We'll get back to you soon with updates on your application status.
                        </p>
                        <div className={style.redirectMessage}>
                            <p>You will be redirected to the homepage in a few seconds...</p>
                        </div>
                        <button 
                            onClick={() => router.visit('/')}
                            className={style.homeButton}
                        >
                            Go to Homepage Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show authentication required message if user is not logged in
    if (!isAuthenticated) {
        return (
            <div className={style.JoinTeamPage}>
                <div className={style.authRequiredContainer}>
                    <div className={style.authCard}>
                        <h2 className={style.authTitle}>Authentication Required</h2>
                        <p className={style.authMessage}>
                            You need to be logged in to apply for a tutor position. 
                            Please log in to your account or create a new one to continue.
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
            </div>
        );
    }

    return (
        <div className={style.JoinTeamPage}>
            <div className={style.JoinTeamContainer}>
                <h1 className={style.title}>Join Our Team Form</h1>
                <div className={style.userInfo}>
                    <p>Welcome, <strong>{user.name}</strong>! Complete the form below to apply as a tutor.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={style.formInputGroup}>
                        <label htmlFor="name">Full Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., 70123456"
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            min={15}
                            max={99}
                            required
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="university">University:</label>
                        <input
                            type="text"
                            id="university"
                            name="university"
                            required
                            value={formData.university}
                            onChange={handleChange}
                            placeholder="e.g., Lebanese University"
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="year">Year:</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            min={1}
                            max={7}
                            required
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="Current academic year (1-7)"
                        />
                    </div>

                    <p className={style.courseSelectionTitle}>Courses to Give:</p>
                    <div className={style.courseSelectionContainer}>
                        {courseOptions.map((course) => (
                            <div className={style.checkboxGroup} key={course.id}>
                                <input
                                    type="checkbox"
                                    id={`courseToGive${course.id}`}
                                    name="coursesToGive"
                                    checked={formData.coursesToGive.includes(course.name)}
                                    onChange={e =>
                                        handleCourseCheckbox(course.name, e.target.checked)
                                    }
                                />
                                <label htmlFor={`courseToGive${course.id}`}>{course.name}</label>
                            </div>
                        ))}
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="whereYouSeeYourself">Where do you see yourself in the future?</label>
                        <textarea
                            id="whereYouSeeYourself"
                            name="whereYouSeeYourself"
                            required
                            value={formData.whereYouSeeYourself}
                            onChange={handleChange}
                            placeholder="Describe your future goals and aspirations..."
                            rows={3}
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="cv">CV / Resume / Grades:</label>
                        <input
                            type="file"
                            id="cv"
                            name="cv"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            required
                            onChange={handleChange}
                        />
                        <small className={style.fileNote}>
                            Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                        </small>
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="pay">Expected hourly rate (USD):</label>
                        <input
                            type="number"
                            id="pay"
                            name="pay"
                            min={5}
                            max={100}
                            required
                            value={formData.pay}
                            onChange={handleChange}
                            placeholder="e.g., 15"
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="otherCourses">Do you want to teach other courses? If yes, please specify:</label>
                        <textarea
                            id="otherCourses"
                            name="otherCourses"
                            value={formData.otherCourses}
                            onChange={handleChange}
                            placeholder="List any additional subjects you'd like to teach..."
                            rows={2}
                        />
                    </div>

                    <div className={style.formInputGroup}>
                        <label htmlFor="goodTutor">What makes you a good tutor?</label>
                        <textarea
                            id="goodTutor"
                            name="goodTutor"
                            required
                            value={formData.goodTutor}
                            onChange={handleChange}
                            placeholder="Describe your teaching style, experience, and what sets you apart..."
                            rows={4}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={style.submitButton}
                        disabled={Loading}
                    >
                        {Loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
}