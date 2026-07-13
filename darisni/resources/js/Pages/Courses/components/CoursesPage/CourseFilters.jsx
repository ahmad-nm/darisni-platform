import { CustomSelect } from "@/Pages/Courses/components/CustomSelect/CustomSelect"; 
import style from "../../Courses.module.css";

export function CourseFilters({
    subjectFilter,
    semesterFilter,
    dynamicSubjectOptions,
    dynamicSemesterOptions,
    handleFilter,
    subjectDropdownOpen,
    setSubjectDropdownOpen
}) {
    return (
        <div className={style.filterSection}>
            <div className={style.filterSubject}>
                <label
                    htmlFor="subjectFilter"
                    className={style.filterLabel}
                >
                    Subject:
                </label>

                <CustomSelect
                    id="subjectFilter"
                    value={subjectFilter}
                    onChange={handleFilter}
                    options={dynamicSubjectOptions}
                    placeholder="All Subjects"
                    onOpenChange={setSubjectDropdownOpen}
                />
            </div>

            {dynamicSemesterOptions.length > 1 && (
                <div
                    className={`${style.filterSemester} ${
                        subjectDropdownOpen
                            ? style.semesterPushDown
                            : ""
                    }`}
                >
                    <label
                        htmlFor="semesterFilter"
                        className={style.filterLabel}
                    >
                        Semester:
                    </label>

                    <CustomSelect
                        id="semesterFilter"
                        value={semesterFilter}
                        onChange={handleFilter}
                        options={dynamicSemesterOptions}
                        placeholder="All Semesters"
                    />
                </div>
            )}
        </div>
    );
}