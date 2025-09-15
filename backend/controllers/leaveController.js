import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";

const workflow = ["Team Lead", "Project Lead", "HR", "CEO"];

function nextApprover(current) {
  const i = workflow.indexOf(current);
  if (i === -1 || i === workflow.length - 1) return null;
  return workflow[i + 1];
}

// ------------------ APPLY ------------------
// ------------------ APPLY ------------------
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start and End dates are required" });
    }

    const user = await User.findById(req.user.id);

    // figure out the first approver based on applicant role
    let currentApprover = null;

    if (user.role === "Employee") {
      currentApprover = "Team Lead";
    } else if (user.role === "Team Lead") {
      currentApprover = "Project Lead";
    } else if (user.role === "Project Lead") {
      currentApprover = "HR";
    } else if (user.role === "HR") {
      currentApprover = "CEO";
    } else if (user.role === "CEO") {
      currentApprover = null; // CEO has no approver above them
    }

    const leave = await LeaveRequest.create({
      employeeId: req.user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: currentApprover ? "Pending" : "Approved", // CEO auto-approved
      currentApprover,
    });

    res.status(201).json(leave);
  } catch (err) {
    console.error("❌ APPLY LEAVE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ------------------ GET LEAVES (list) ------------------
export const getLeaves = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "Employee") {
      query = { employeeId: req.user.id };
    }

    const leaves = await LeaveRequest.find(query)
      .populate("employeeId", "name role profileImage")
      .populate("approvals.approverId", "name role profileImage")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error("❌ GET LEAVES ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET LEAVE BY ID ------------------
export const getLeaveById = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)
      .populate("employeeId", "name role profileImage")
      .populate("approvals.approverId", "name role profileImage");

    if (!leave) return res.status(404).json({ message: "Not found" });

    const approvers = await User.find(
      { role: { $in: workflow } },
      "name role profileImage"
    );

    res.json({ leave, approvers });
  } catch (err) {
    console.error("❌ GET LEAVE BY ID ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ APPROVE ------------------
export const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Not found" });
    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const approverRole = req.user.role;
    const approverId = req.user.id;

    // 🔎 Debug logs
    console.log("👉 ApproverRole from JWT:", approverRole);
    console.log("👉 Leave.currentApprover from DB:", leave.currentApprover);

    // ✅ Normalize strings before comparing
    if (
      approverRole.trim().toLowerCase() !==
      leave.currentApprover.trim().toLowerCase()
    ) {
      return res.status(403).json({
        message: `Not allowed: Expected ${leave.currentApprover}, got ${approverRole}`,
      });
    }

    leave.approvals.push({
      role: approverRole,
      approverId,
      decision: "Approved",
      comment: req.body?.comment || "",
    });

    const next = nextApprover(approverRole);
    if (!next) {
      leave.status = "Approved";
      leave.currentApprover = null;
    } else {
      leave.currentApprover = next;
    }

    await leave.save();

    const updated = await LeaveRequest.findById(leave._id)
      .populate("employeeId", "name role profileImage")
      .populate("approvals.approverId", "name role profileImage");

    const approvers = await User.find(
      { role: { $in: workflow } },
      "name role profileImage"
    );

    res.json({ leave: updated, approvers });
  } catch (err) {
    console.error("❌ APPROVE LEAVE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ REJECT ------------------
export const rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Not found" });
    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const approverRole = req.user.role;
    const approverId = req.user.id;

    if (approverRole !== leave.currentApprover) {
      return res.status(403).json({ message: "Not allowed" });
    }

    leave.approvals.push({
      role: approverRole,
      approverId,
      decision: "Rejected",
      comment: req.body.comment || "",
    });

    leave.status = "Rejected";
    leave.currentApprover = null;

    await leave.save();

    const updated = await LeaveRequest.findById(leave._id)
      .populate("employeeId", "name role profileImage")
      .populate("approvals.approverId", "name role profileImage");

    const approvers = await User.find(
      { role: { $in: workflow } },
      "name role profileImage"
    );

    res.json({ leave: updated, approvers });
  } catch (err) {
    console.error("❌ REJECT LEAVE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
