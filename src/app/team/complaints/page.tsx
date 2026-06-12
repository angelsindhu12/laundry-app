"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllComplaints } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  COMPLAINT_TYPE_LABELS,
  COMPLAINT_STATUS_LABELS,
  formatRelative,
  getComplaintStatusColor,
} from "@/lib/utils";
import type { Complaint, ComplaintStatus } from "@/lib/types";

export default function TeamComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<ComplaintStatus | "all">("all");

  useEffect(() => {
    const refresh = () => setComplaints(getAllComplaints());
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, []);

  const filtered = complaints.filter((c) => filter === "all" || c.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-slate-500 mt-1">Review and respond to student complaints</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as ComplaintStatus | "all")}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-bu-blue focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Link key={c.id} href={`/team/complaints/${c.id}`}>
            <Card className="hover:shadow-md hover:border-bu-blue/30 transition cursor-pointer">
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-bu-blue/10 text-bu-blue">{COMPLAINT_TYPE_LABELS[c.type]}</Badge>
                      <Badge className={getComplaintStatusColor(c.status)}>
                        {COMPLAINT_STATUS_LABELS[c.status]}
                      </Badge>
                    </div>
                    <p className="font-semibold text-slate-900">{c.subject}</p>
                    <p className="text-sm text-slate-500">{c.studentName} · {formatRelative(c.createdAt)}</p>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                    {c.messages.length > 0 && (
                      <p className="text-xs text-bu-blue mt-2">{c.messages.length} message(s)</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardBody className="text-center py-8 text-slate-500">No complaints found</CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
