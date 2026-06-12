"use client";

import { Check, Clock, AlertTriangle } from "lucide-react";
import type { LaundryBag } from "@/lib/types";
import {
  BAG_STATUS_LABELS,
  BAG_STATUS_ORDER,
  formatDate,
  isOverdue,
} from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { getStatusColor } from "@/lib/utils";

export function BagTracker({ bag }: { bag: LaundryBag }) {
  const overdue = isOverdue(bag.expectedReadyAt, bag.status);
  const currentIdx = BAG_STATUS_ORDER.indexOf(bag.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={getStatusColor(bag.status)}>{BAG_STATUS_LABELS[bag.status]}</Badge>
        {overdue && (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </Badge>
        )}
        <span className="text-sm text-slate-500">Slip: <strong>{bag.slipNo}</strong></span>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
        <div className="space-y-4">
          {BAG_STATUS_ORDER.map((status, idx) => {
            const done = idx <= currentIdx;
            const active = idx === currentIdx;
            return (
              <div key={status} className="flex items-start gap-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                    done
                      ? active
                        ? "bg-bu-blue text-white ring-4 ring-bu-blue/20"
                        : "bg-bu-blue text-white"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {done && idx < currentIdx ? (
                    <Check className="w-4 h-4" />
                  ) : active ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="pt-1">
                  <p className={`font-medium ${active ? "text-bu-blue" : done ? "text-slate-700" : "text-slate-400"}`}>
                    {BAG_STATUS_LABELS[status]}
                  </p>
                  {active && (
                    <p className="text-sm text-slate-500 mt-0.5">Currently in this stage</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Submitted</p>
          <p className="font-medium text-slate-900 mt-1">{formatDate(bag.submittedAt)}</p>
        </div>
        <div className={`rounded-xl p-4 ${overdue ? "bg-red-50" : "bg-blue-50"}`}>
          <p className={`text-xs uppercase tracking-wide ${overdue ? "text-red-600" : "text-bu-blue"}`}>
            Expected Ready
          </p>
          <p className={`font-medium mt-1 ${overdue ? "text-red-800" : "text-bu-blue"}`}>
            {formatDate(bag.expectedReadyAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
