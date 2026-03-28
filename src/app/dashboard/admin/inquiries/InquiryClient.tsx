"use client";

import { useState } from "react";
import { updateInquiry } from "@/actions/inquiries";
import InquiryDrawerAdmin from "@/components/dashboard/InquiryDrawerAdmin";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress"; // Pastikan sudah install: npx shadcn-ui@latest add progress

export function InquiryClient({
  initialData,
  staff,
}: {
  initialData: any[];
  staff: any[];
}) {
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const handleAssign = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    e.stopPropagation();
    const res = await updateInquiry(id, { assignedTo: e.target.value });
    if (res.success) toast.success("PIC has been assigned.");
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    e.stopPropagation();
    const res = await updateInquiry(id, { status: e.target.value as any });
    if (res.success) toast.success("Inquiry status updated.");
  };

  // Fungsi helper untuk menghitung progress
  const calculateProgress = (planItems: any[]) => {
    if (!planItems || planItems.length === 0) return 0;
    const completed = planItems.filter(
      (item) => item.status === "completed"
    ).length;
    return Math.round((completed / planItems.length) * 100);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                Plan Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-4 text-center text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                Progress
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                Assign PIC
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialData.map((item) => {
              const progressValue = calculateProgress(item.planItems);
              const totalItems = item.planItems?.length || 0;
              const completedItems =
                item.planItems?.filter((i: any) => i.status === "completed")
                  .length || 0;

              return (
                <tr
                  key={item.id}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => setSelectedInquiry(item)}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">
                      {item.planName || "Untitled Plan"}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase">
                      {item.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.user?.name || "User"}
                  </td>

                  {/* KOLOM PROGRESS BAR */}
                  <td className="min-w-[150px] px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500">
                        <span>{progressValue}% Done</span>
                        <span>
                          {completedItems}/{totalItems} Vendors
                        </span>
                      </div>
                      <Progress value={progressValue} className="h-1.5" />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={item.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(e, item.id)}
                      className="rounded-md border bg-white p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="managed_by_wo">Managed By WO</option>
                      <option value="checking_availability">
                        Checking Availability
                      </option>
                      <option value="negotiating">Negotiating</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={item.assignedTo || ""}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleAssign(e, item.id)}
                      className="w-full max-w-[150px] rounded-md border bg-white p-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No PIC Assigned</option>
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <InquiryDrawerAdmin
        data={selectedInquiry}
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
      />
    </>
  );
}
