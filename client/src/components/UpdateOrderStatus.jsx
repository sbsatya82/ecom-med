import { useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../store/adminOrderSlice';

const statusOptions = ['Confirm', 'Packed', 'Delivered', 'Cancel By Seller'];

const UpdateOrderStatus = ({ orderId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [statusInput, setStatusInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(statusOptions);
  const [loading, setLoading] = useState(false); // ✅ Added
  const dispatch = useDispatch();


  const handleInputChange = (e) => {
    const value = e.target.value;
    setStatusInput(value);
    setFilteredOptions(
      statusOptions.filter((status) =>
        status.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const UpdateOrderStatusInDb = async (status, orderId) => {
    try {
      setLoading(true); // ✅ Start loading
      const response = await Axios({
        ...SummaryApi.setOrderStatus,
        data: {
          status,
          orderId,
        },
      });

      dispatch(updateOrderStatus({orderId, status}));

    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  const handleSelect = (status) => {
    setStatusInput(status);
    setShowPopup(false);
    UpdateOrderStatusInDb(status, orderId);
  };

  return (
    <div>
      <button
        onClick={() => setShowPopup(true)}
        disabled={loading} // ✅ Disabled while loading
        style={{
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: '#fff',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s',
        }}
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>

      {showPopup && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: '#fff',
            padding: '1rem',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '250px',
            marginTop: '10px'
          }}
        >
          <input
            type="text"
            placeholder="Enter or choose status"
            value={statusInput}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filteredOptions.map((status, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(status)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#f7f7f7',
                  marginBottom: '0.3rem',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e2e6ea')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#f7f7f7')}
              >
                {status}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowPopup(false)}
            style={{
              marginTop: '0.8rem',
              padding: '8px 12px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateOrderStatus;
