import style from './CourseSuggestionForm.module.css';

export function CourseSuggestionForm() {
  return (
    <div className={style.courseSuggestionForm}>
      <h2 className={style.courseFormTitle}>What Courses Would You Like to See?</h2>
      <form className={style.courseForm} action="/submit-course-suggestion" method="POST">
        <input
          type="hidden"
          name="_token"
          value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}
        />
        
        <label htmlFor="userName" className={style.courseFormLabel}>Your Name:</label>
        <input type="text" id="userName" className={style.courseFormInput} name="userName" placeholder='Your name' required />
        
        <label htmlFor="phone" className={style.courseFormLabel}>Phone:</label>
        <input type="tel" id="phone" className={style.courseFormInput} name="phone" placeholder='Your phone number' required />
        
        <label htmlFor='courseSuggestion' className={style.courseFormLabel}>Course Suggestion:</label>
        <textarea id="courseSuggestion" className={style.courseFormTextarea} name="courseSuggestion" placeholder='Describe the course you would like to see' required></textarea>
        
        <button type="submit" className={style.courseFormButton}>Submit Suggestion</button>
      </form>
    </div>
  );
}