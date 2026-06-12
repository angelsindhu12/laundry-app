"use client";

import { useState } from "react";
import { User, Mail, Phone, Home, Hash, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [hostel, setHostel] = useState(user?.hostel ?? "");
  const [roomNo, setRoomNo] = useState(user?.roomNo ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    updateUser(user.id, { name, phone, hostel, roomNo });
    refresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account details</p>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bu-blue to-bu-red flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.enrollmentNo}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: Mail, label: "Email", value: user?.email },
              { icon: Hash, label: "Slip No.", value: user?.slipNo ?? "Not assigned" },
              { icon: Hash, label: "Bag ID", value: user?.bagId ?? "Not assigned" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Icon className="w-5 h-5 text-bu-blue shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-4 border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-bu-blue" /> Edit Details
            </h3>
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Hostel"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                placeholder="e.g. Boys Hostel A"
              />
              <Input
                label="Room No."
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                placeholder="e.g. 204"
              />
            </div>
            {saved && <p className="text-sm text-green-600 font-medium">Profile updated successfully!</p>}
            <Button type="submit" loading={saving}>
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
