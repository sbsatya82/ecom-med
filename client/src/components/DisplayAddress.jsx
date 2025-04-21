import React, { useState, useEffect } from 'react';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';

const DisplayAddress = ({ address_id }) => {
  const [addressList, setAddressList] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAllAddress });
      setAddressList(response.data.data); // ✅ Update address list
    } catch (error) {
      console.error("Failed to fetch address list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    if (addressList.length > 0 && address_id) {
      const foundAddress = addressList.find(item => item._id === address_id);
      setAddress(foundAddress || null);
    }
  }, [address_id, addressList]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading address...</p>;
  }

  if (!address) {
    return <p className="text-center text-gray-500">Address not found</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Delivery Address</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><span className="font-medium">Address:</span> {address.address_line}</p>
        <p><span className="font-medium">Mobile:</span> {address.mobile}</p>
        <p><span className="font-medium">City:</span> {address.city}</p>
        <p><span className="font-medium">State:</span> {address.state}</p>
        <p><span className="font-medium">Country:</span> {address.country}</p>
        <p><span className="font-medium">Pincode:</span> {address.pincode}</p>
      </div>
    </div>
  );
};

export default DisplayAddress;
