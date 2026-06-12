"use client";

import { useEffect, useState } from "react";
import { FilePlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createReapplyRequest, getReapplyRequestsForStudent } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { REAPPLY_STATUS_LABELS, formatDate } from "@/lib/utils";
import type { ReapplyRequest } from "@/lib/types";

export default function ReapplyPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ReapplyRequest[]>([]);
  const [requestType, setRequestType] = useState<"slip" | "bag" | "both">("slip");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setRequests(getReapplyRequestsForStudent(user.id));
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    createReapplyRequest({
      studentId: user.id,
      studentName: user.name,
      enrollmentNo: user.enrollmentNo ?? "",
      hostel: user.hostel ?? "",
      roomNo: user.roomNo ?? "",
      requestType,
      reason,
    });
    setReason("");
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const statusIcon = (status: ReapplyRequest["status"]) => {
    if (status === "approved") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "rejected") return <XCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-amber-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lost Slip / Bag</h1>
        <p className="text-slate-500 mt-1">Apply for a new laundry slip or bag if yours is lost</p>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <FilePlus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">New Application</p>
              <p className="text-sm text-slate-500">Fill the form below to request a replacement</p>
            </div>
          </div>

          {submitted && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-xl text-sm font-medium">
              Application submitted successfully! The laundry team will review it shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="What do you need?"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as "slip" | "bag" | "both")}
            >
              <option value="slip">New Laundry Slip</option>
              <option value="bag">New Laundry Bag</option>
              <option value="both">Both Slip & Bag</option>
            </Select>
            <Textarea
              label="Reason"
              placeholder="Explain how your slip/bag was lost..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <Button type="submit" loading={submitting} className="w-full">
              Submit Application
            </Button>
          </form>
        </CardBody>
      </Card>

      {requests.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="font-semibold text-slate-900 mb-4">Your Applications</h3>
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {statusIcon(req.status)}
                      <div>
                        <p className="font-medium text-slate-900 capitalize">
                          {req.requestType === "both" ? "Slip & Bag" : req.requestType}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(req.createdAt)}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        req.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {REAPPLY_STATUS_LABELS[req.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{req.reason}</p>
                  {req.reviewNote && (
                    <p className="text-sm text-bu-blue mt-2 bg-blue-50 p-2 rounded-lg">
                      Team note: {req.reviewNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
