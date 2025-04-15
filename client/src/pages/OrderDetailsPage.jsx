import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DisplayAddress from '../components/DisplayAddress.jsx'

const OrderDetailsPage = () => {
  const orders = useSelector((state) => state.adminOrders.orders);
  const [order, setOrder] = useState(null);
  const params = useParams();
  

  useEffect(() => {
    const found = orders.find(o => o._id === params["order-details"]);
    if (found) setOrder(found);
  }, [orders]);

  if (!order) return <div className="text-center mt-10 text-gray-500">Loading Order Details...</div>;

  const {
    orderId,
    payment_status,
    delivery_address,
    product_details,
    subTotalAmt,
    totalAmt,
    createdAt,
    updatedAt,
    status,
    invoice_receipt
  } = order;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Order Details</h1>

      <div className="mb-4">
        <p><span className="font-semibold">Order ID:</span> {orderId}</p>
        <p><span className="font-semibold">Status:</span> {status}</p>
        <p><span className="font-semibold">Payment Status:</span> {payment_status}</p>
        <p><span className="font-semibold">Created At:</span> {new Date(createdAt).toLocaleString()}</p>
        <p><span className="font-semibold">Updated At:</span> {new Date(updatedAt).toLocaleString()}</p>
      </div>

      <DisplayAddress address_id={delivery_address}/>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Product Details</h2>
        <div className="flex items-center gap-4">
          <img
            src={product_details.image[0]}
            alt="Product"
            className="w-20 h-20 object-cover rounded"
          />
          <p className="font-medium text-gray-800">{product_details.name}</p>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <p><span className="font-semibold">Subtotal:</span> ₹{subTotalAmt}</p>
        <p><span className="font-semibold">Total Amount:</span> ₹{totalAmt}</p>
      </div>

      {invoice_receipt && (
        <div className="mt-4">
          <a
            href={invoice_receipt}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Invoice Receipt
          </a>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
