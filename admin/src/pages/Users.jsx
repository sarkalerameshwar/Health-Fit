import { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import DataTable from "../components/DataTable";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found. Please login.");

        const response = await fetch("http://localhost:5000/api/user/all", {
          headers: {
            authorization: token, // plain token, no 'Bearer ' prefix
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log("Fetched users:", data);

        // assuming backend response: { success: true, data: [...] }
        if (data.success && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // show fields: name, email, verified status
  const columns = [
    { header: "Name", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "Join Date",
      accessor: "date",
      render: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      header: "Verified",
      accessor: "ifVerified",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.ifVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.ifVerified ? "Verified" : "Not Verified"}
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
