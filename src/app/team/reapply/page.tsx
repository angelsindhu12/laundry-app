"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { getAllReapplyRequests, updateReapplyStatus } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { REAPPLY_STATUS_LABELS, formatDate } from "@/lib/utils";
import type { ReapplyRequest, ReapplyStatus } from "@/lib/types";

export default function TeamReapplyPage() {
  const [requests, setRequests] = useState<ReapplyRequest[]>([]);
  const [filter, setFilter] = useState<ReapplyStatus | "all">("all");
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});

  useEffect(() => {
    const refresh = () => setRequests(getAllReapplyRequests());
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, []);

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  const handleReview = (id: string, status: "approved" | "rejected") => {
    updateReapplyStatus(id, status, reviewNote[id]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reapply Requests</h1>
          <p className="text-slate-500 mt-1">Review lost slip and bag applications</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as ReapplyStatus | "all")}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-bu-blue focus:outline-none"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((req) => (
          <Card key={req.id}>
            <CardBody>
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="font-semibold text-slate-900">{req.studentName}</p>
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
                  <p className="text-sm text-slate-500">
                    {req.enrollmentNo} · {req.hostel}, Room {req.roomNo}
                  </p>
                  <p className="text-sm font-medium text-bu-blue mt-2 capitalize">
                    Requesting: {req.requestType === "both" ? "Slip & Bag" : req.requestType}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">{req.reason}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatDate(req.createdAt)}</p>
                </div>

                {req.status === "pending" && (
                  <div className="w-full lg:w-72 space-y-3">
                    <textarea
                      placeholder="Add a note (optional)..."
                      value={reviewNote[req.id] ?? ""}
                      onChange={(e) => setReviewNote((prev) => ({ ...prev, [req.id]: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none focus:border-bu-blue focus:outline-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleReview(req.id, "approved")}
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        className="flex-1"
                        onClick={() => handleReview(req.id, "rejected")}
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  </div>
                )}

                {req.reviewNote && req.status !== "pending" && (
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl lg:w-72">
                    Note: {req.reviewNote}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardBody className="text-center py-8 text-slate-500">No reapply requests found</CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
