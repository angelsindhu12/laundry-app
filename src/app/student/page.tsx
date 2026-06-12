"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MessageSquareWarning, FilePlus, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getBagsForStudent, getComplaintsForStudent, getAppData } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BAG_STATUS_LABELS, formatDate, getStatusColor, isOverdue } from "@/lib/utils";
import type { LaundryBag } from "@/lib/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [bags, setBags] = useState<LaundryBag[]>([]);
  const [openComplaints, setOpenComplaints] = useState(0);

  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      setBags(getBagsForStudent(user.id));
      setOpenComplaints(
        getComplaintsForStudent(user.id).filter((c) => c.status !== "resolved").length
      );
    };
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, [user]);

  const activeBag = bags.find((b) => b.status !== "delivered");
  const slots = getAppData().slots;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hello, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-slate-500 mt-1">Here&apos;s your laundry status overview</p>
      </div>

      {user?.slipNo && (
        <Card className="bg-gradient-to-r from-bu-blue to-bu-blue-dark text-white border-0">
          <CardBody>
            <p className="text-blue-100 text-sm">Your Laundry Slip</p>
            <p className="text-2xl font-bold mt-1">{user.slipNo}</p>
            {user.bagId && <p className="text-blue-200 text-sm mt-1">Bag ID: {user.bagId}</p>}
          </CardBody>
        </Card>
      )}

      {activeBag ? (
        <Card>
          <CardBody>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Active Bag</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{activeBag.slipNo}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={getStatusColor(activeBag.status)}>
                    {BAG_STATUS_LABELS[activeBag.status]}
                  </Badge>
                  {isOverdue(activeBag.expectedReadyAt, activeBag.status) && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1 inline" /> Overdue
                    </Badge>
                  )}
                </div>
              </div>
              <Link
                href="/student/track"
                className="text-bu-blue text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                Track <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              Expected ready: {formatDate(activeBag.expectedReadyAt)}
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="text-center py-8">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 mt-3">No active laundry bag</p>
            <p className="text-sm text-slate-400">Submit your bag at the laundry counter during your slot</p>
          </CardBody>
        </Card>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/student/track", icon: Package, label: "Track Bag", color: "bg-blue-50 text-bu-blue" },
          { href: "/student/complaints", icon: MessageSquareWarning, label: "Complaints", color: "bg-red-50 text-bu-red", badge: openComplaints },
          { href: "/student/reapply", icon: FilePlus, label: "Lost Slip", color: "bg-amber-50 text-amber-700" },
        ].map(({ href, icon: Icon, label, color, badge }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md hover:border-bu-blue/30 transition-all cursor-pointer h-full">
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{label}</p>
                  {badge ? (
                    <p className="text-xs text-bu-red font-medium">{badge} open</p>
                  ) : (
                    <p className="text-xs text-slate-400">View details</p>
                  )}
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardBody>
          <h3 className="font-semibold text-slate-900 mb-4">Laundry Slots</h3>
          <div className="space-y-3">
            {slots.map((slot) => {
              const available = slot.maxBags - slot.booked;
              const full = available <= 0;
              return (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">{slot.day}</p>
                    <p className="text-sm text-slate-500">{slot.time}</p>
                  </div>
                  <Badge className={full ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {full ? "Full" : `${available} slots left`}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
