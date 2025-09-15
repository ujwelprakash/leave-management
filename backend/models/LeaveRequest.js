import mongoose from "mongoose";

const ApprovalSchema = new mongoose.Schema({
  role: { type: String, required: true },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  decision: { type: String, enum: ["Approved", "Rejected"], required: true },
  decidedAt: { type: Date, default: Date.now },
  comment: { type: String },
});

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    currentApprover: {
      type: String,
      enum: ["Team Lead", "Project Lead", "HR", "CEO", null],
      default: "Team Lead",
    },
    approvals: [ApprovalSchema],
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

const LeaveRequest = mongoose.model("LeaveRequest", leaveSchema);
export default LeaveRequest;
