import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import LeaveStatusPanel from "../components/LeaveStatusPanel";

export default function LeaveDetails() {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [approvers, setApprovers] = useState([]);

  useEffect(() => {
    api.get(`/leaves/${id}`).then((res) => {
      setLeave(res.data.leave);
      setApprovers(res.data.approvers);
    });
  }, [id]);

  if (!leave) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <LeaveStatusPanel
        leave={leave}
        approvers={approvers}
        setLeave={setLeave}
        setApprovers={setApprovers} // ✅ new
      />
    </div>
  );
}
