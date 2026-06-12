"use client";

import type {
  AppData,
  BagStatus,
  Complaint,
  ComplaintStatus,
  LaundryBag,
  ReapplyRequest,
  ReapplyStatus,
  User,
} from "./types";
import { getSeedData } from "./seed";

const STORAGE_KEY = "bu-laundry-data";
const SESSION_KEY = "bu-laundry-session";

function loadData(): AppData {
  if (typeof window === "undefined") return getSeedData();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = getSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as AppData;
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("laundry-data-change"));
}

export function getAppData(): AppData {
  return loadData();
}

export function resetData() {
  const seed = getSeedData();
  saveData(seed);
  return seed;
}

export function getSessionUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("laundry-session-change"));
}

export function getCurrentUser(): User | null {
  const id = getSessionUserId();
  if (!id) return null;
  return loadData().users.find((u) => u.id === id) ?? null;
}

export function login(email: string, password: string): User | null {
  const data = loadData();
  const user = data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) setSessionUserId(user.id);
  return user ?? null;
}

export function logout() {
  setSessionUserId(null);
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const data = loadData();
  const idx = data.users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  data.users[idx] = { ...data.users[idx], ...updates };
  saveData(data);
  return data.users[idx];
}

export function getBagsForStudent(studentId: string): LaundryBag[] {
  return loadData().bags.filter((b) => b.studentId === studentId);
}

export function getBagById(bagId: string): LaundryBag | undefined {
  return loadData().bags.find((b) => b.id === bagId);
}

export function updateBagStatus(bagId: string, status: BagStatus): LaundryBag | null {
  const data = loadData();
  const idx = data.bags.findIndex((b) => b.id === bagId);
  if (idx === -1) return null;
  data.bags[idx].status = status;
  if (status === "delivered") {
    data.bags[idx].deliveredAt = new Date().toISOString();
  }
  saveData(data);
  return data.bags[idx];
}

export function createComplaint(
  complaint: Omit<Complaint, "id" | "messages" | "createdAt" | "updatedAt" | "status">
): Complaint {
  const data = loadData();
  const now = new Date().toISOString();
  const newComplaint: Complaint = {
    ...complaint,
    id: `complaint-${Date.now()}`,
    status: "open",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  data.complaints.unshift(newComplaint);
  saveData(data);
  return newComplaint;
}

export function getComplaintsForStudent(studentId: string): Complaint[] {
  return loadData().complaints.filter((c) => c.studentId === studentId);
}

export function getAllComplaints(): Complaint[] {
  return loadData().complaints;
}

export function getComplaintById(id: string): Complaint | undefined {
  return loadData().complaints.find((c) => c.id === id);
}

export function updateComplaintStatus(id: string, status: ComplaintStatus): Complaint | null {
  const data = loadData();
  const idx = data.complaints.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  data.complaints[idx].status = status;
  data.complaints[idx].updatedAt = new Date().toISOString();
  saveData(data);
  return data.complaints[idx];
}

export function addComplaintMessage(
  complaintId: string,
  message: Omit<Complaint["messages"][0], "id" | "timestamp">
): Complaint | null {
  const data = loadData();
  const idx = data.complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) return null;
  data.complaints[idx].messages.push({
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
  data.complaints[idx].updatedAt = new Date().toISOString();
  saveData(data);
  return data.complaints[idx];
}

export function createReapplyRequest(
  request: Omit<ReapplyRequest, "id" | "status" | "createdAt">
): ReapplyRequest {
  const data = loadData();
  const newRequest: ReapplyRequest = {
    ...request,
    id: `reapply-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  data.reapplyRequests.unshift(newRequest);
  saveData(data);
  return newRequest;
}

export function getReapplyRequestsForStudent(studentId: string): ReapplyRequest[] {
  return loadData().reapplyRequests.filter((r) => r.studentId === studentId);
}

export function getAllReapplyRequests(): ReapplyRequest[] {
  return loadData().reapplyRequests;
}

export function updateReapplyStatus(
  id: string,
  status: ReapplyStatus,
  reviewNote?: string
): ReapplyRequest | null {
  const data = loadData();
  const idx = data.reapplyRequests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  data.reapplyRequests[idx].status = status;
  data.reapplyRequests[idx].reviewedAt = new Date().toISOString();
  if (reviewNote) data.reapplyRequests[idx].reviewNote = reviewNote;
  if (status === "approved") {
    const req = data.reapplyRequests[idx];
    const userIdx = data.users.findIndex((u) => u.id === req.studentId);
    if (userIdx !== -1) {
      const slipNo = `SLIP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      data.users[userIdx].slipNo = slipNo;
      if (req.requestType === "bag" || req.requestType === "both") {
        data.users[userIdx].bagId = `bag-${Date.now()}`;
      }
    }
  }
  saveData(data);
  return data.reapplyRequests[idx];
}

export function getAllBags(): LaundryBag[] {
  return loadData().bags;
}

export function getSlots() {
  return loadData().slots;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
