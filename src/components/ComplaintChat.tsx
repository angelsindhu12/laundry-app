"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ImagePlus } from "lucide-react";
import type { Complaint } from "@/lib/types";
import { addComplaintMessage, fileToBase64 } from "@/lib/store";
import { formatRelative } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";

export function ComplaintChat({
  complaint,
  onUpdate,
}: {
  complaint: Complaint;
  onUpdate: () => void;
}) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [complaint.messages]);

  const handleSend = async (imageUrl?: string) => {
    if (!user || (!message.trim() && !imageUrl)) return;
    setSending(true);
    addComplaintMessage(complaint.id, {
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: message.trim() || "Sent a photo",
      imageUrl,
    });
    setMessage("");
    onUpdate();
    setSending(false);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    await handleSend(base64);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-xl">
        {complaint.messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">No messages yet. Start the conversation.</p>
        )}
        {complaint.messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isOwn ? "bg-bu-blue text-white rounded-br-md" : "bg-white border border-slate-200 rounded-bl-md"
                }`}
              >
                <p className={`text-xs font-semibold mb-1 ${isOwn ? "text-blue-100" : "text-bu-blue"}`}>
                  {msg.senderName}
                </p>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Attachment" className="rounded-lg max-w-full mb-2 max-h-48 object-cover" />
                )}
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${isOwn ? "text-blue-200" : "text-slate-400"}`}>
                  {formatRelative(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {complaint.status !== "resolved" && (
        <div className="flex gap-2 mt-3">
          <label className="cursor-pointer flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 transition shrink-0">
            <ImagePlus className="w-5 h-5 text-slate-500" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-bu-blue focus:outline-none focus:ring-2 focus:ring-bu-blue/20"
          />
          <Button onClick={() => handleSend()} loading={sending} className="shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
