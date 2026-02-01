import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null);

  /* ================= LOAD / CLEAR CART ================= */
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem("cart");
      setCart(stored ? JSON.parse(stored) : []);
    } else {
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [user]);

  /* ================= PERSIST CART ================= */
  useEffect(() => {
    if (user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  /* ================= CART ACTIONS ================= */

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* ================= CALCULATIONS ================= */

 /* ================= CALCULATIONS ================= */

const FREE_DELIVERY_THRESHOLD = 1000;
const DELIVERY_CHARGE = 80;

const subtotal = cart.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

const deliveryFee =
  subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0
    ? 0
    : DELIVERY_CHARGE;

const total = subtotal + deliveryFee;

const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);


  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        total,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        buyNowItem,
       setBuyNowItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
