// pages/Dashboard.jsx
import Header from "../components/Layout/Header";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    totalUsers: 0,
    totalFeedback: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken"); // JWT stored after login
        if (!token) throw new Error("No token found. Please login.");

        const headers = { authorization: token }; // no "Bearer " prefix


        // Fetch subscriptions
        const subsRes = await fetch("http://localhost:5000/api/orders", {
          headers,
        });
        const subsData = await subsRes.json();

        // Fetch users
        const usersRes = await fetch("http://localhost:5000/api/user", {
          headers,
        });
        const usersData = await usersRes.json();

        // Fetch feedback
        const feedbackRes = await fetch(
          "http://localhost:5000/api/feedback/all",
          { headers }
        );
        const feedbackData = await feedbackRes.json();

        // Calculate average rating
        let avgRating = 0;
        if (
          feedbackData.success &&
          Array.isArray(feedbackData.data) &&
          feedbackData.data.length > 0
        ) {
          const totalRating = feedbackData.data.reduce(
            (acc, item) => acc + (item.rating || 0),
            0
          );
          avgRating = (totalRating / feedbackData.data.length).toFixed(1);
        }

        setStats({
          totalSubscriptions:
            subsData.success && subsData.data ? subsData.data.total : 0,
          totalUsers:
            usersData.success && Array.isArray(usersData.data)
              ? usersData.data.length
              : 0,
          totalFeedback:
            feedbackData.success && Array.isArray(feedbackData.data)
              ? feedbackData.data.length
              : 0,
          averageRating: avgRating || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-dark mb-6">Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white p-6 rounded-lg shadow animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              <StatCard
                title="Total Subscriptions"
                value={stats.totalSubscriptions}
                icon="📦"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
              />
              <StatCard
                title="Feedback Count"
                value={stats.totalFeedback}
                icon="❓"
              />
              <StatCard
                title="Average Rating"
                value={`${stats.averageRating}/5`}
                icon="⭐"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline mt-2">
          <span className="text-2xl font-semibold">{value}</span>
        </div>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

export default Dashboard;
