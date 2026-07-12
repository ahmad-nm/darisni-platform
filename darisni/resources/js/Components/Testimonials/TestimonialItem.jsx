import style from './TestimonialItem.module.css';
import RatingStar from '../../assets/Icons/testStar.png';
import EmptyStar from '../../assets/Icons/testStarEmpty.png';

export function Testimonials({ Testimonial }) {
    const testimonialImage = Testimonial.image || '/images/default-avatar.svg';
    const testimonialText = Testimonial.testimonial || Testimonial.feedback || 'No feedback provided';
    const testimonialName = Testimonial.name || 'Anonymous';
    const testimonialMajor = Testimonial.major || 'Student';
    const rating = parseInt(Testimonial.rating) || 0;

    return (
        <div className={style.TestimonialItem}>
            <div className={style.TestimonialContent}>
                <img 
                    src={testimonialImage} 
                    alt={testimonialName}
                    onError={(e) => {
                        e.target.src = '/images/default-avatar.svg';
                    }}
                />
                <p className={style.review}>"{testimonialText}"</p>
            </div>
            
            <div className={style.TestimonialAuthorRating}>
                <div className={style.TestimonialAuthor}>
                    <h3 className={style.TestimonialName}>{testimonialName}</h3>
                    <p className={style.TestimonialMajor}>{testimonialMajor}</p>
                </div>

                <div className={style.TestimonialRating}>
                    {[...Array(rating)].map((_, index) => (
                        <p key={index} className={style.star}><img src={RatingStar} alt='star' /></p>
                    ))}
                    {[...Array(5 - rating)].map((_, index) => (
                        <p key={index} className={style.emptyStar}><img src={EmptyStar} alt='empty star' /></p>
                    ))}
                    <p style={{fontSize: '12px', fontWeight: 'bold'}}>({rating})</p>
                </div>
            </div>
        </div>
    )
}