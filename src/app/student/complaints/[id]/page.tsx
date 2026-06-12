"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getComplaintById } from "@/lib/store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ComplaintChat } from "@/components/ComplaintChat";
import {
  COMPLAINT_TYPE_LABELS,
  COMPLAINT_STATUS_LABELS,
  formatDate,
  getComplaintStatusColor,
} from "@/lib/utils";
import type { Complaint } from "@/lib/types";

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const refresh = () => {
    const c = getComplaintById(id);
    setComplaint(c ?? null);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, [id]);

  if (!complaint) {
    return <p className="text-slate-500">Complaint not found</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/student/complaints" className="inline-flex items-center gap-2 text-sm text-bu-blue hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to complaints
      </Link>

      <Card>
        <CardHeader
          title={complaint.subject}
          subtitle={`Filed on ${formatDate(complaint.createdAt)}`}
          action={
            <div className="flex gap-2">
              <Badge className="bg-bu-blue/10 text-bu-blue">{COMPLAINT_TYPE_LABELS[complaint.type]}</Badge>
              <Badge className={getComplaintStatusColor(complaint.status)}>
                {COMPLAINT_STATUS_LABELS[complaint.status]}
              </Badge>
            </div>
          }
        />
        <CardBody>
          <p className="text-slate-600">{complaint.description}</p>
          {complaint.photos.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {complaint.photos.map((p, i) => (
                <img key={i} src={p} alt={`Evidence ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border" />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Chat with Laundry Team" subtitle="Discuss your complaint here" />
        <CardBody>
          <ComplaintChat complaint={complaint} onUpdate={refresh} />
        </CardBody>
      </Card>
    </div>
  );
}
