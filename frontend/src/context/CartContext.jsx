import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cart");

            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Failed to load cart:", error);
            return [];
        }
    });

    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Add product
    const addToCart = (product) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item._id === product._id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  product.stock
                              )
                          }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    // Increase quantity
    const increaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item._id !== productId) {
                    return item;
                }

                return {
                    ...item,
                    quantity: Math.min(
                        item.quantity + 1,
                        item.stock
                    )
                };
            })
        );
    };

    // Decrease quantity
    const decreaseQuantity = (productId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) => {
                    if (item._id !== productId) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity: item.quantity - 1
                    };
                })
                .filter((item) => item.quantity > 0)
        );
    };

    // Remove item
    const removeFromCart = (productId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item._id !== productId
            )
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Number of products
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Total price
    const cartTotal = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
