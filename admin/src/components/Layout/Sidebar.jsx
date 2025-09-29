import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div
        className="p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </div>
      <div
        className="p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => navigate("/subscriptions")}
      >
        Subscriptions
      </div>
      <div
        className="p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => navigate("/users")}
      >
        Users
      </div>
      <div
        className="p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => navigate("/feedback")}
      >
        Feedback
      </div>
      <div
        className="p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => navigate("/inquiries")}
      >
        Inquiries
      </div>
    </div>
  );
};

export default Sidebar;
