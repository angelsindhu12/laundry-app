"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getAllBags, updateBagStatus } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { BAG_STATUS_LABELS, BAG_STATUS_ORDER, formatDate, getStatusColor, isOverdue } from "@/lib/utils";
import type { BagStatus, LaundryBag } from "@/lib/types";

export default function TeamBagsPage() {
  const [bags, setBags] = useState<LaundryBag[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BagStatus | "all">("all");

  useEffect(() => {
    const refresh = () => setBags(getAllBags());
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, []);

  const filtered = bags.filter((b) => {
    const matchSearch =
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.slipNo.toLowerCase().includes(search.toLowerCase()) ||
      b.hostel.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleStatusChange = (bagId: string, status: BagStatus) => {
    updateBagStatus(bagId, status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Bags</h1>
        <p className="text-slate-500 mt-1">Update bag status and track all laundry</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slip, or hostel..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-bu-blue focus:outline-none focus:ring-2 focus:ring-bu-blue/20"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as BagStatus | "all")}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-bu-blue focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {BAG_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{BAG_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((bag) => (
          <Card key={bag.id}>
            <CardBody>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900">{bag.studentName}</p>
                    <Badge className={getStatusColor(bag.status)}>{BAG_STATUS_LABELS[bag.status]}</Badge>
                    {isOverdue(bag.expectedReadyAt, bag.status) && (
                      <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {bag.slipNo} · {bag.hostel}, Room {bag.roomNo} · {bag.itemCount} items
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted: {formatDate(bag.submittedAt)} · Expected: {formatDate(bag.expectedReadyAt)}
                  </p>
                </div>
                <div className="w-full lg:w-48">
                  <Select
                    value={bag.status}
                    onChange={(e) => handleStatusChange(bag.id, e.target.value as BagStatus)}
                  >
                    {BAG_STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>{BAG_STATUS_LABELS[s]}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardBody className="text-center py-8 text-slate-500">No bags found</CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
