"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ImagePlus, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createComplaint, fileToBase64, getComplaintsForStudent } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  COMPLAINT_TYPE_LABELS,
  COMPLAINT_STATUS_LABELS,
  formatRelative,
  getComplaintStatusColor,
} from "@/lib/utils";
import type { Complaint, ComplaintType } from "@/lib/types";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<ComplaintType>("damaged");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const refresh = () => setComplaints(getComplaintsForStudent(user.id));
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, [user]);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (const file of Array.from(files)) {
      newPhotos.push(await fileToBase64(file));
    }
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    createComplaint({
      studentId: user.id,
      studentName: user.name,
      bagId: user.bagId,
      type,
      subject,
      description,
      photos,
    });
    setShowForm(false);
    setSubject("");
    setDescription("");
    setPhotos([]);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-slate-500 mt-1">Report slot, bag, or cloth issues with photos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "secondary"}>
          <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "New Complaint"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select label="Complaint Type" value={type} onChange={(e) => setType(e.target.value as ComplaintType)}>
                {Object.entries(COMPLAINT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
              <Input
                label="Subject"
                placeholder="Brief description of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <Textarea
                label="Description"
                placeholder="Describe the issue in detail..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photos (up to 4)</label>
                <div className="flex flex-wrap gap-3">
                  {photos.map((p, i) => (
                    <img key={i} src={p} alt={`Photo ${i + 1}`} className="w-20 h-20 rounded-xl object-cover border" />
                  ))}
                  {photos.length < 4 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-bu-blue transition">
                      <ImagePlus className="w-6 h-6 text-slate-400" />
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhoto} />
                    </label>
                  )}
                </div>
              </div>
              <Button type="submit" loading={submitting} className="w-full">
                Submit Complaint
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {complaints.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-slate-500">No complaints filed yet</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Link key={c.id} href={`/student/complaints/${c.id}`}>
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
                      <p className="font-semibold text-slate-900 truncate">{c.subject}</p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                      <p className="text-xs text-slate-400 mt-2">{formatRelative(c.createdAt)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                  </div>
                  {c.photos.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {c.photos.slice(0, 3).map((p, i) => (
                        <img key={i} src={p} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
