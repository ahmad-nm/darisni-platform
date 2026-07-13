import { useState } from "react";
import { CartTab } from "@/Components/CartTab/CartTab";
import cartIcon from "../../../../assets/Icons/cart.png";
import style from "../../Courses.module.css";

export function CartSidebar({
    cartItems,
    removeFromCart,
    setCartItems,
    specialCategory
}) {
    const [cartToggle, setCartToggle] = useState(false);

    if (specialCategory) return null;

    return (
        <>
            <button
                className={`${style.cartToggleButton} ${
                    cartToggle ? style.cartOpen : ""
                }`}
                onClick={() => setCartToggle(!cartToggle)}
            >
                <span className={style.cartIcon}>
                    <img src={cartIcon} alt="Cart" />
                </span>
            </button>

            {cartToggle && (
                <div
                    className={style.cartOverlay}
                    onClick={() => setCartToggle(false)}
                />
            )}

            <CartTab
                cartItems={cartItems}
                onRemoveFromCart={removeFromCart}
                cartToggle={cartToggle}
                setCartItems={setCartItems}
            />
        </>
    );
}