export type UserRole = "student" | "team";

export type BagStatus =
  | "submitted"
  | "washing"
  | "drying"
  | "ironing"
  | "ready"
  | "delivered";

export type ComplaintType = "slot" | "bag" | "damaged" | "unironed" | "other";

export type ComplaintStatus = "open" | "in_progress" | "resolved";

export type ReapplyStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  enrollmentNo?: string;
  hostel?: string;
  roomNo?: string;
  phone?: string;
  avatar?: string;
  bagId?: string;
  slipNo?: string;
}

export interface LaundrySlot {
  id: string;
  day: string;
  time: string;
  maxBags: number;
  booked: number;
}

export interface LaundryBag {
  id: string;
  slipNo: string;
  studentId: string;
  studentName: string;
  hostel: string;
  roomNo: string;
  status: BagStatus;
  slotId: string;
  submittedAt: string;
  expectedReadyAt: string;
  deliveredAt?: string;
  itemCount: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  imageUrl?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  bagId?: string;
  type: ComplaintType;
  subject: string;
  description: string;
  status: ComplaintStatus;
  photos: string[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ReapplyRequest {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  hostel: string;
  roomNo: string;
  requestType: "slip" | "bag" | "both";
  reason: string;
  status: ReapplyStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface AppData {
  users: User[];
  bags: LaundryBag[];
  complaints: Complaint[];
  reapplyRequests: ReapplyRequest[];
  slots: LaundrySlot[];
}
