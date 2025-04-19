import { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'

const AddToCartButton = ({ data }) => {
    const {
        fetchCartItems,
        updateCartItemQty,
        deleteCartItem,
      } = useGlobalContext();
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()
    const user = useSelector(state => state?.user)
    const navigate = useNavigate()

    // Handle add to cart button click
    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Redirect to login if user is not logged in
        if (user._id === "") {
            toast.error("Please login to add items to cart")
            return navigate('/login')
        }

        try {
            setLoading(true)

            // API call to add item to cart
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            // Show success toast and refetch cart items
            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItems) {
                    fetchCartItems()
                }
            }
        } catch (error) {
            // Handle API error with toast
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    // Check if this item is already in the cart when component mounts or cart updates
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])

    // Handle quantity increase
    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Redirect to login if user not logged in
        if (user._id === '') {
            toast.error("Please login to update cart")
            return navigate('/login')
        }

        // API call to update cart item quantity
        const response = await updateCartItemQty(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added")
        }
    }

    // Handle quantity decrease
    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Redirect to login if user not logged in
        if (user._id ==='') {
            toast.error("Please login to update cart")
            return navigate('/login')
        }

        // If quantity is 1, remove the item from cart
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            // Else, decrease the quantity
            const response = await updateCartItemQty(cartItemDetails?._id, qty - 1)

            if (response.success) {
                toast.success("Item remove")
            }
        }
    }

    return (
        <div className='w-full max-w-[150px]'>
            {
                // If item is already in cart, show quantity control UI
                isAvailableCart ? (
                    <div className='flex w-full h-full'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'>
                            <FaMinus />
                        </button>

                        <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'>
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    // If not in cart, show "Add" button
                    <button onClick={handleADDTocart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCartButton
