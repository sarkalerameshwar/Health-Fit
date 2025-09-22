// pages/Users.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import DataTable from '../components/DataTable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // call your backend API
        const response = await fetch('http://localhost:5000/api/user'); 
        const data = await response.json();

        console.log('Fetched users:', data); // log the fetched data

        setUsers(data); // directly from backend
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // show fields: name, email, verified status
  const columns = [
    { header: 'Name', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Join Date',
      accessor: 'date',
      render: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      header: 'Verified',
      accessor: 'ifVerified',
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.ifVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {item.ifVerified ? 'Verified' : 'Not Verified'}
        </span>
      ),
    },
  ];

  const handleViewDetails = (user) => {
    alert(`Viewing details for user: ${user.username}`);
  };

  return (
    <div>
      <Header title="Users" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-dark mb-6">All Users</h2>

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default Users;
