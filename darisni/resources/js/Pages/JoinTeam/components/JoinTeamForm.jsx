import { courseOptions } from "../../../Objects/FormCourses";
import style from "../JoinTeam.module.css";

export default function JoinTeamForm({
    user,
    formData,
    Loading,
    handleSubmit,
    handleChange,
    handleCourseCheckbox,
}) {
    return (
        <div className={style.JoinTeamContainer}>
            <h1 className={style.title}>Join Our Team Form</h1>
            <div className={style.userInfo}>
                <p>
                    Welcome, <strong>{user.name}</strong>! Complete the form
                    below to apply as a tutor.
                </p>
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
                                checked={formData.coursesToGive.includes(
                                    course.name,
                                )}
                                onChange={(e) =>
                                    handleCourseCheckbox(
                                        course.name,
                                        e.target.checked,
                                    )
                                }
                            />
                            <label htmlFor={`courseToGive${course.id}`}>
                                {course.name}
                            </label>
                        </div>
                    ))}
                </div>

                <div className={style.formInputGroup}>
                    <label htmlFor="whereYouSeeYourself">
                        Where do you see yourself in the future?
                    </label>
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
                    <label htmlFor="otherCourses">
                        Do you want to teach other courses? If yes, please
                        specify:
                    </label>
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
                    <label htmlFor="goodTutor">
                        What makes you a good tutor?
                    </label>
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
                    {Loading ? "Submitting..." : "Submit Application"}
                </button>
            </form>
        </div>
    );
}
