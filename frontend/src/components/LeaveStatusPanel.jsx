import React, { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const steps = ["Employee", "Team Lead", "Project Lead", "HR", "CEO"];

export default function LeaveStatusPanel({
  leave,
  approvers,
  setLeave,
  setApprovers,
}) {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStepStatus = (step) => {
    if (step === "Employee") return "approved";
    if (
      leave.approvals?.some((a) => a.role === step && a.decision === "Approved")
    )
      return "approved";
    if (
      leave.approvals?.some((a) => a.role === step && a.decision === "Rejected")
    )
      return "rejected";
    if (leave.currentApprover === step && leave.status === "Pending")
      return "active";
    return "pending";
  };

  const handleAction = async (type) => {
    setLoading(true);
    try {
      const res = await api.put(
        `/leaves/${leave._id}/${type}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.leave) {
        setLeave(res.data.leave);
        if (res.data.approvers && setApprovers)
          setApprovers(res.data.approvers);
      } else {
        setLeave(res.data);
      }

      alert(
        `Leave ${type === "approve" ? "approved" : "rejected"} successfully!`
      );
    } catch (err) {
      console.error(
        "❌ Approve/Reject error:",
        err.response?.data || err.message
      );
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Adjusted coordinates for centered wave
  const stepCoords = [
    { x: 80, y: 120 }, // Employee (top)
    { x: 250, y: 200 }, // Team Lead (bottom)
    { x: 450, y: 120 }, // Project Lead (top)
    { x: 650, y: 200 }, // HR (bottom)
    { x: 850, y: 120 }, // CEO (top)
  ];

  return (
    <div className="bg-white p-6 rounded shadow relative">
      {/* Title with straight underline */}
      <h2 className="text-xl font-semibold pb-2 border-b border-gray-300 mb-6">
        Leave Status
      </h2>

      {/* Flowchart Centered */}
      <div className="flex justify-center">
        <div className="relative w-[950px] h-72">
          {/* Wavy connectors */}
          <svg className="absolute top-0 left-0 w-full h-full" fill="none">
            {stepCoords.slice(0, -1).map((pos, i) => {
              const stepStatus = getStepStatus(steps[i + 1]);
              let strokeColor = "#d1d5db"; // gray
              if (stepStatus === "approved") strokeColor = "#22c55e"; // green
              else if (stepStatus === "active") strokeColor = "#3b82f6"; // blue
              else if (stepStatus === "rejected") strokeColor = "#ef4444"; // red

              const next = stepCoords[i + 1];

              const d = `M ${pos.x} ${pos.y} 
                         C ${(pos.x + next.x) / 2} ${pos.y - 60}, 
                           ${(pos.x + next.x) / 2} ${next.y + 60}, 
                           ${next.x} ${next.y}`;

              return (
                <path
                  key={i}
                  d={d}
                  stroke={strokeColor}
                  strokeWidth="3"
                  strokeDasharray="6,6"
                  fill="none"
                />
              );
            })}
          </svg>

          {/* Steps */}
          {stepCoords.map((pos, index) => {
            const step = steps[index];
            const status = getStepStatus(step);
            const approver =
              step === "Employee"
                ? leave.employeeId
                : approvers?.find((a) => a.role === step);

            const borderColor =
              status === "approved"
                ? "border-green-400 shadow-lg shadow-green-300"
                : status === "active"
                ? "border-blue-400 shadow-lg shadow-blue-300"
                : status === "rejected"
                ? "border-red-400 shadow-lg shadow-red-300"
                : "border-gray-300";

            return (
              <div
                key={step}
                className="absolute flex flex-col items-center"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`w-16 h-16 rounded-full border-4 overflow-hidden flex items-center justify-center ${borderColor}`}
                >
                  {approver?.profileImage ? (
                    <img
                      src={approver.profileImage}
                      alt={step}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm font-semibold">
                      {step[0]}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm">{step}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons + Details section */}
      {user?.role === leave.currentApprover && leave.status === "Pending" && (
        <div className="mt-6">
          {/* Sentence + toggle */}
          <div className="flex justify-end mb-2">
            <p className="text-gray-700">
              Check details{" "}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-500 underline hover:text-blue-700"
              >
                {showDetails ? "Hide" : "View"}
              </button>{" "}
              then approve or reject:
            </p>
          </div>

          {/* Show details if open */}
          {showDetails && (
            <div className="mb-4 p-4 border rounded bg-gray-50 text-sm text-gray-700 text-left w-full">
              <p>
                <strong>Employee:</strong> {leave.employeeId?.name}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {leave.startDate
                  ? new Date(leave.startDate).toLocaleDateString()
                  : "—"}{" "}
                →{" "}
                {leave.endDate
                  ? new Date(leave.endDate).toLocaleDateString()
                  : "—"}
              </p>
              <p>
                <strong>Reason:</strong> {leave.reason || "—"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    leave.status === "Approved"
                      ? "text-green-600"
                      : leave.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {leave.status}
                </span>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              disabled={loading}
              onClick={() => handleAction("reject")}
              className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
            >
              Reject Leave
            </button>
            <button
              disabled={loading}
              onClick={() => handleAction("approve")}
              className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600"
            >
              Approve Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
