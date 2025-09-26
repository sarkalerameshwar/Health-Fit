import { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import DataTable from "../components/DataTable";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    if (!token) {
      alert("You are not authenticated. Please login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://health-fit-uyi4.onrender.com/api/inquiries/all`, {
        headers: {
          authorization: token, // plain token, no 'Bearer ' prefix
        },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setInquiries(data.success ? data.inquiries : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError("Failed to load inquiries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    if (!token) {
      alert("You are not authenticated. Please login.");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const response = await fetch(
        `https://health-fit-uyi4.onrender.com/api/inquiries/update-status/${inquiryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry._id === inquiryId
            ? { ...inquiry, status: newStatus }
            : inquiry
        )
      );

      return { success: true };
    } catch (err) {
      console.error("Error updating inquiry status:", err);
      return { success: false, error: "Failed to update inquiry status" };
    }
  };

  const handleStatusChange = async (inquiry, newStatus) => {
    const result = await updateInquiryStatus(inquiry._id, newStatus);
    if (!result.success) alert(`Error: ${result.error}`);
  };

  const handleViewDetails = (inquiry) => {
    alert(`Inquiry Details:
User: ${inquiry.userId?.name || "N/A"} (${inquiry.userId?.email || "N/A"})
Subject: ${inquiry.subject}
Message: ${inquiry.message}
Date: ${new Date(inquiry.createdAt).toLocaleDateString()}
Status: ${inquiry.status}`);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      header: "User",
      accessor: "userId",
      render: (item) => (
        <div>
          <div className="font-medium">{item.userId?.name || "N/A"}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
    },
    {
      header: "Subject",
      accessor: "subject",
      render: (item) => <div className="truncate max-w-xs">{item.subject}</div>,
    },
    {
      header: "Message Preview",
      accessor: "message",
      render: (item) => (
        <div className="truncate max-w-md text-gray-600">
          {item.message.length > 50
            ? `${item.message.substring(0, 50)}...`
            : item.message}
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: "status",
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item, e.target.value)}
          className={`px-2 py-1 rounded text-xs font-medium border-none focus:ring-2 focus:ring-opacity-50 ${
            item.status === "open"
              ? "bg-blue-100 text-blue-800 focus:ring-blue-500"
              : item.status === "in progress"
              ? "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
              : "bg-green-100 text-green-800 focus:ring-green-500"
          }`}
        >
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      ),
    },
  ];

  return (
    <div>
      <Header title="Inquiries" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-dark">
            Customer Inquiries
          </h2>
          <button
            onClick={fetchInquiries}
            className="flex items-center text-primary hover:text-green-700"
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredInquiries}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default Inquiries;
