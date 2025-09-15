import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function LeavesList() {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get("/leaves"); // backend filters based on role
        setLeaves(res.data);
      } catch (err) {
        console.error("❌ Fetch leaves error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLeaves();
  }, [user]);

  if (!user) {
    return <div className="p-6">Please login to view leaves.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading leaves...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leaves</h2>

        {/* ✅ Show Apply Leave button only for Employees */}
        {user.role === "Employee" && (
          <Link
            to="/apply-leave"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Leave
          </Link>
        )}
      </div>

      {leaves.length === 0 ? (
        <p className="text-gray-500">No leaves found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Dates</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-50">
                <td className="p-2 border">{leave.employeeId?.name}</td>
                <td className="p-2 border">
                  {new Date(leave.startDate).toLocaleDateString()} →{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">{leave.reason}</td>
                <td
                  className={`p-2 border font-semibold ${
                    leave.status === "Approved"
                      ? "text-green-600"
                      : leave.status === "Rejected"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {leave.status}
                </td>
                <td className="p-2 border">
                  <Link
                    to={`/leave/${leave._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
