import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NoData from '../components/NoData';
import { setOrders } from '../store/adminOrderSlice';
import fetchAllOrders from '../utils/AdminGetOrders';
import { useNavigate } from 'react-router-dom';

const AllOrders = () => {
  const orders = useSelector((state) => state.adminOrders.orders); // Get orders from Redux
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      const fetchedOrders = await fetchAllOrders();
      console.log(fetchedOrders.data);
      
      // Sort orders by newest first (assuming createdAt is in ISO format)
      const sortedOrders = fetchedOrders.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  
      dispatch(setOrders(sortedOrders)); // Set sorted orders
    };
    getOrders();
  }, [dispatch]);
  

  


  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Orders</h1>
      </div>
      {orders.length === 0 ? (
        <NoData />
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id + index + 'order'}
            className="order rounded p-4 text-sm border mb-2 flex justify-between items-center"
          >
            <div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <p>Order No: {order.orderId}</p>
                <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Address: {order.delivery_address}</p>
              </div>

              <div className="flex gap-3 mt-2">
                <img
                  src={order.product_details.image[0]}
                  className="w-14 h-14"
                  alt="Product"
                />
                <p className="font-medium">{order.product_details.name}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/dashboard/orders-details/${order._id}`)}
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >Order Details</button>
              </div>
            </div>
            <p
              className={`font-semibold px-3 py-1 rounded ${
                order.status === 'Pending'
                  ? 'bg-yellow-300'
                  : order.status === 'Order Confirm'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {order.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllOrders;
