import removeIcon from '../../assets/Icons/minusSign.png';
import emptyCartImage from '../../assets/Background/emptyCart.png';
import { Link } from '@inertiajs/react';
import style from './CartTab.module.css';

export function CartTab({ cartItems, onRemoveFromCart, cartToggle, setCartItems }) {

    function handleClearCart() {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }

    function CalculateTotal(cartItems) {
        let sum = 0;

        cartItems.forEach(item => {
            sum += parseFloat(item.price);
        });

        return sum.toFixed(2);
    }

    return (
        <div className={`${style.cartTab} ${cartToggle ? style.show : style.hidden}`}>
            <h2 className={style.cartTitle}>Your Cart</h2>
            {cartItems.length === 0 ? (
                <div className={style.emptyCart}>
                    <img src={emptyCartImage} alt="Empty Cart" className={style.emptyCartImage} />
                    <p className={style.emptyCartMessage}>Ohhh... Your cart is empty <br /><span>But it doesn't have to be</span></p>
                </div>
            ) : (
                <>
                    <ul className={style.cartItemList}>
                        {cartItems.map(item => (
                            <li key={item.id} className={style.cartItem}>
                                <div className={style.codeRemove}>
                                    <p className={style.itemCode}>{item.code}</p>
                                    <button className={style.removeButton} onClick={() => onRemoveFromCart(item.id)}><img src={removeIcon} alt="Remove" /></button>
                                </div>
                                <p className={style.itemName}>{item.title}</p>
                                <p className={style.itemPrice}>Price: {item.price}$</p>
                            </li>
                        ))}
                    </ul>
                    <div className={style.cartTotal}>
                        <div className={style.totalPriceContainer}>
                            <p>Total:</p>
                            <p className={style.totalPrice}>
                                {CalculateTotal(cartItems)}$
                            </p>
                        </div>
                        <div className={style.cartActions}>
                            <Link href="/payment" className={style.checkoutButton}>Buy Cart</Link>
                            <button className={style.clearCartButton} onClick={handleClearCart}>Clear Cart</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}