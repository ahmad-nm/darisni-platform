import style from './WhatWeOffer.module.css';
import { WWOItem } from './WWOItem.jsx';
import groupImage from '../../../../assets/Icons/group.png';
import digitalImage from '../../../../assets/Icons/programming.png';
import goalImage from '../../../../assets/Icons/trophy.png';

const items = [
    {
        title: "Exclusive Advisor",
        description: "Get a free guidance session from our tutors to help you navigate your academic journey.",
        image: groupImage,
        link: "/docs#getting-started",
        color: "#925aacff"
    },
    {
        title: "Private Sessions",
        description: "Enhance your learning with our private sessions, designed to provide personalized support and attention.",
        image: digitalImage,
        link: "/docs#faq",
        color: "#007bff"
    },
    {
        title: "Supportive Community",
        description: "Join our supportive community to connect with peers, share knowledge, and grow together.",
        image: goalImage,
        link: "/docs#support",
        color: "#e33e3eff"
    }
]

export function WhatWeOffer() {
    

    return (
        <div className={style.WWOContainer}>
            <div className={style.WWOHeader}>
                <h1>What We Offer For Growth of Your Study</h1>
                <p>We provide high-quality educational programs designed to inspire learning, build skills, and support personal growth. Our experienced instructors, modern resources, and engaging activities ensure every student receives the guidance they need to succeed academically and beyond.</p>
            </div>
            
            <div className={style.WWOContent}>
                {items.map((item) => (
                    <WWOItem key={item.title} Item={item} />
                ))}
            </div>
        </div>
    );
}