import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const DisplayAddress = ({ address_id }) => {
  const { addressList } = useSelector(state => state.addresses); // Get all addresses
  const [address, setAddress] = useState(null);

  useEffect(() => {    
    const foundAddress = addressList.find(item => item._id === address_id);
    setAddress(foundAddress || null); // If not found, set to null
  }, [address_id, addressList]);

  if (!address) {
    return <p className="text-gray-500 text-center">Address not found</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-5 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Delivery Address</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><span className="font-medium">Name:</span> {address.address_line}</p>
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
