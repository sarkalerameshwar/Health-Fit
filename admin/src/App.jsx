// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import OrderDetails from "./pages/OrderDetails";
import Users from "./pages/Users";
import Inquiries from './pages/Inquiries';
import Feedback from "./pages/Feedback";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
