import { CourseSuggestionForm } from '@/Pages/Home/components/CourseSuggestionForm/CourseSuggestionForm';

import style from '../../Home.module.css';

export default function CourseSuggestionSection() {
  return (
    <div className={style.CourseSuggestionFormContainer}>
      <div className={`${style.bgCircle} ${style.bgCircle1}`}></div>

      <div className={`${style.bgCircle} ${style.bgCircle2}`}></div>

      <svg
        className={style.bgTriangle}
        viewBox="0 0 60 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="30,4 56,48 4,48" />
      </svg>

      <div className={style.bgSquare}></div>

      <div className={style.bgSquare2}></div>

      <div className={style.bgLine}></div>

      <CourseSuggestionForm />
    </div>
  );
}