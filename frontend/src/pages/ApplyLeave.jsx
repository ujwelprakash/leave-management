import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ApplyLeave() {
  const { user, token } = useContext(AuthContext); // ✅ user + token
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // ✅ Frontend validation
    if (!startDate || !endDate) {
      return setError("Start and End dates are required");
    }
    if (new Date(startDate) > new Date(endDate)) {
      return setError("End date cannot be before start date");
    }
    if (!reason.trim()) {
      return setError("Reason is required");
    }

    try {
      const res = await api.post(
        "/leaves",
        { startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Leave applied successfully!");
      setStartDate("");
      setEndDate("");
      setReason("");
      console.log("Created leave:", res.data);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to apply leave");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Apply Leave</h2>

      {/* Feedback messages */}
      {message && <p className="mb-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </label>
        <label className="flex flex-col">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </label>
        <label className="flex flex-col">
          Reason:
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Leave
        </button>
      </form>
    </div>
  );
}
