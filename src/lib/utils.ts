import { format, formatDistanceToNow, isPast } from "date-fns";
import type { BagStatus, ComplaintStatus, ComplaintType, ReapplyStatus } from "./types";

export function formatDate(date: string) {
  return format(new Date(date), "dd MMM yyyy, h:mm a");
}

export function formatRelative(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(expectedReadyAt: string, status: BagStatus) {
  return !["ready", "delivered"].includes(status) && isPast(new Date(expectedReadyAt));
}

export const BAG_STATUS_LABELS: Record<BagStatus, string> = {
  submitted: "Submitted",
  washing: "Washing",
  drying: "Drying",
  ironing: "Ironing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
};

export const BAG_STATUS_ORDER: BagStatus[] = [
  "submitted",
  "washing",
  "drying",
  "ironing",
  "ready",
  "delivered",
];

export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  slot: "Slot Issue",
  bag: "Bag Issue",
  damaged: "Damaged Cloth",
  unironed: "Unironed Cloth",
  other: "Other",
};

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const REAPPLY_STATUS_LABELS: Record<ReapplyStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

export function getStatusColor(status: BagStatus) {
  const colors: Record<BagStatus, string> = {
    submitted: "bg-slate-100 text-slate-700",
    washing: "bg-blue-100 text-blue-800",
    drying: "bg-cyan-100 text-cyan-800",
    ironing: "bg-amber-100 text-amber-800",
    ready: "bg-green-100 text-green-800",
    delivered: "bg-emerald-100 text-emerald-800",
  };
  return colors[status];
}

export function getComplaintStatusColor(status: ComplaintStatus) {
  const colors: Record<ComplaintStatus, string> = {
    open: "bg-red-100 text-red-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-800",
  };
  return colors[status];
}
