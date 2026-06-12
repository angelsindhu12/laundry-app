"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shirt, MessageSquareWarning, ClipboardList, AlertTriangle, ChevronRight } from "lucide-react";
import { getAllBags, getAllComplaints, getAllReapplyRequests } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BAG_STATUS_LABELS, getStatusColor, isOverdue } from "@/lib/utils";
import type { LaundryBag } from "@/lib/types";

export default function TeamDashboard() {
  const [bags, setBags] = useState<LaundryBag[]>([]);
  const [openComplaints, setOpenComplaints] = useState(0);
  const [pendingReapply, setPendingReapply] = useState(0);
  const [overdueBags, setOverdueBags] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const allBags = getAllBags();
      setBags(allBags);
      setOpenComplaints(getAllComplaints().filter((c) => c.status !== "resolved").length);
      setPendingReapply(getAllReapplyRequests().filter((r) => r.status === "pending").length);
      setOverdueBags(allBags.filter((b) => isOverdue(b.expectedReadyAt, b.status)).length);
    };
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, []);

  const statusCounts = bags.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Laundry Team Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage bags, complaints, and reapply requests</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bags", value: bags.length, color: "from-bu-blue to-bu-blue-dark", icon: Shirt },
          { label: "Open Complaints", value: openComplaints, color: "from-bu-red to-bu-red-dark", icon: MessageSquareWarning },
          { label: "Pending Reapply", value: pendingReapply, color: "from-amber-500 to-amber-600", icon: ClipboardList },
          { label: "Overdue Bags", value: overdueBags, color: "from-red-500 to-red-600", icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className={`bg-gradient-to-br ${color} text-white border-0`}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{label}</p>
                  <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <Icon className="w-8 h-8 text-white/40" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/team/bags", icon: Shirt, label: "Manage Bags" },
          { href: "/team/complaints", icon: MessageSquareWarning, label: "Complaints" },
          { href: "/team/reapply", icon: ClipboardList, label: "Reapply Requests" },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md hover:border-bu-blue/30 transition cursor-pointer">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bu-blue/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-bu-blue" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-400">View & manage</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardBody>
          <h3 className="font-semibold text-slate-900 mb-4">Bags by Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(BAG_STATUS_LABELS).map(([status, label]) => (
              <div key={status} className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-bu-blue">{statusCounts[status] ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Active Bags</h3>
            <Link href="/team/bags" className="text-sm text-bu-blue font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {bags
              .filter((b) => b.status !== "delivered")
              .slice(0, 5)
              .map((bag) => (
                <div key={bag.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">{bag.studentName}</p>
                    <p className="text-sm text-slate-500">{bag.slipNo} · {bag.hostel}</p>
                  </div>
                  <Badge className={getStatusColor(bag.status)}>{BAG_STATUS_LABELS[bag.status]}</Badge>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
