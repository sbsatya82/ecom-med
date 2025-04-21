import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

import { handleAddItemCart } from "../store/cartProduct";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import fetchAllOrders from "../utils/AdminGetOrders";
import { setOrders } from "../store/adminOrderSlice";

// Create Global Context
export const GlobalContext = createContext(null);

// Custom Hook for consuming Global Context
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Redux State
  const cartItems = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  // Memoized Total Quantity
  const totalQty = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Memoized Discounted Price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const discounted = pricewithDiscount(item?.productId?.price, item?.productId?.discount);
      return total + discounted * item.quantity;
    }, 0);
  }, [cartItems]);

  // Memoized Original Price
  const notDiscountTotalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item?.productId?.price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Fetch all cart items
  const fetchCartItems = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCartItem });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Update quantity of a cart item
  const updateCartItemQty = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        await fetchCartItems();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  // Delete a cart item
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Clear user session data
  const handleLogout = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  // Fetch user address
  const fetchUserAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      const { data: responseData } = response;
      console.log("address:", responseData);
      
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getOrderItems });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Fetch on user login
  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        await fetchCartItems();
        await fetchUserAddress();
        await fetchUserOrders();
  
        // Only if user is admin
        if (user.role === "ADMIN") {
          try {
            const response = await fetchAllOrders();
            const sortedOrders = response.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            dispatch(setOrders(sortedOrders));
          } catch (error) {
            AxiosToastError(error);
          }
        }
      }
    };
  
    initializeData();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItemQty,
        deleteCartItem,
        fetchUserAddress,
        fetchUserOrders,
        handleLogout,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
