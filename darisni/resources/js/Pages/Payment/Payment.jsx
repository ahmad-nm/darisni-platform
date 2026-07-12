import { router } from '@inertiajs/react';
import style from './Payment.module.css';

export default function Payment() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const CalculateTotal = (items) => {
        let total = 0;
        items.forEach(item => {
            total += parseFloat(item.price);
        });
        return total.toFixed(2);
    }

    const handleConfirmPayment = () => {
        const whatsappMessage = `I would like to confirm my payment for the courses: ${cartItems.map(item => item.title).join(', ')}.\nTotal: $${CalculateTotal(cartItems)}.`;
        const whatsappURL = `https://wa.me/96178795366?text=${encodeURIComponent(whatsappMessage)}`;
        
        localStorage.removeItem('cartItems');
        
        window.open(whatsappURL, '_blank');
        
        router.visit('/');
    }

    return (
        <div className={style.paymentContainer}>
            <div className={style.paymentContent}>
                <h1 className={style.paymentTitle}>Payment Summary</h1>
                
                {cartItems.length === 0 ? (
                    <div className={style.emptyCart}>
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className={style.receipt}>
                            <h2 className={style.receiptTitle}>Order Details</h2>
                            <ul className={style.receiptList}>
                                {cartItems.map((item, index) => (
                                    <li key={index} className={style.receiptItem}>
                                        <span>{item.title}</span>
                                        <span>${item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className={style.total}>
                            <h2 className={style.totalTitle}>Total Amount</h2>
                            <p className={style.totalAmount}>
                                ${CalculateTotal(cartItems)}
                            </p>
                            <button 
                                className={style.confirmButton}
                                onClick={handleConfirmPayment}
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </>
                )}
                
                <div className={style.footer}>
                    <p className={style.footerText}>Thank you for choosing Darisni!</p>
                    <p className={style.footerText}>For support, contact us anytime</p>
                </div>
            </div>
        </div>
    );
}