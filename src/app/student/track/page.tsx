"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getBagsForStudent } from "@/lib/store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { BagTracker } from "@/components/BagTracker";
import { Badge } from "@/components/ui/Badge";
import { BAG_STATUS_LABELS, getStatusColor } from "@/lib/utils";
import type { LaundryBag } from "@/lib/types";

export default function TrackPage() {
  const { user } = useAuth();
  const [bags, setBags] = useState<LaundryBag[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      const b = getBagsForStudent(user.id);
      setBags(b);
      if (!selected && b.length > 0) setSelected(b[0].id);
    };
    refresh();
    window.addEventListener("laundry-data-change", refresh);
    return () => window.removeEventListener("laundry-data-change", refresh);
  }, [user, selected]);

  const activeBag = bags.find((b) => b.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Track Your Bag</h1>
        <p className="text-slate-500 mt-1">Real-time status of your laundry</p>
      </div>

      {bags.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto" />
            <p className="text-slate-500 mt-4 font-medium">No laundry bags found</p>
            <p className="text-sm text-slate-400 mt-1">Submit your bag during a laundry slot to start tracking</p>
          </CardBody>
        </Card>
      ) : (
        <>
          {bags.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {bags.map((bag) => (
                <button
                  key={bag.id}
                  onClick={() => setSelected(bag.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition ${
                    selected === bag.id
                      ? "bg-bu-blue text-white border-bu-blue"
                      : "bg-white text-slate-600 border-slate-200 hover:border-bu-blue"
                  }`}
                >
                  {bag.slipNo}
                </button>
              ))}
            </div>
          )}

          {activeBag && (
            <Card>
              <CardHeader
                title={activeBag.slipNo}
                subtitle={`${activeBag.itemCount} items · ${activeBag.hostel}, Room ${activeBag.roomNo}`}
                action={
                  <Badge className={getStatusColor(activeBag.status)}>
                    {BAG_STATUS_LABELS[activeBag.status]}
                  </Badge>
                }
              />
              <CardBody>
                <BagTracker bag={activeBag} />
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody>
              <h3 className="font-semibold text-slate-900 mb-3">Bag History</h3>
              <div className="space-y-2">
                {bags.map((bag) => (
                  <button
                    key={bag.id}
                    onClick={() => setSelected(bag.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-left"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{bag.slipNo}</p>
                      <p className="text-sm text-slate-500">{bag.itemCount} items</p>
                    </div>
                    <Badge className={getStatusColor(bag.status)}>
                      {BAG_STATUS_LABELS[bag.status]}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
