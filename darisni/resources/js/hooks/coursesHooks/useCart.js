import { useEffect, useState } from "react";

export function useCart() {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (course) => {
        if (!cartItems.some(item => item.id === course.id)) {
            setCartItems([...cartItems, course]);
        }
    };

    const removeFromCart = (courseId) => {
        setCartItems(cartItems.filter(item => item.id !== courseId));
    };

    return {
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart
    };
}