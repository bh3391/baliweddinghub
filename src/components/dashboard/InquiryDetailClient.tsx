"use client";

import { useState, useMemo } from "react";
import { updateInquiry } from "@/actions/inquiries";
import InquiryDrawerAdmin from "@/components/dashboard/InquiryDrawerAdmin";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export function InquiryClient({
  initialData,
  staff,
}: {
  initialData: any[];
  staff: any[];
}) {
  // 1. Simpan ID saja, bukan seluruh objek agar data selalu sinkron dengan initialData
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null
  );

  // 2. State untuk Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // 3. Logic Filter & Search (Memoized agar performa kencang)
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch =
        item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.planName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService =
        serviceFilter === "all" || item.serviceType === serviceFilter;

      return matchesSearch && matchesService;
    });
  }, [initialData, searchTerm, serviceFilter]);

  // 4. Ambil data inquiry yang sedang dipilih dari initialData terbaru
  const selectedInquiry = initialData.find(
    (item) => item.id === selectedInquiryId
  );

  const handleAssign = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    e.stopPropagation();
    const res = await updateInquiry(id, { assignedTo: e.target.value });
    if (res.success) toast.success("PIC has been assigned.");
  };

  const handleStatusChange = async (val: string, id: string) => {
    const res = await updateInquiry(id, { status: val as any });
    if (res.success) toast.success("Inquiry status updated.");
  };

  const calculateProgress = (planItems: any[]) => {
    if (!planItems || planItems.length === 0) return 0;
    const completed = planItems.filter(
      (item) => item.status === "completed"
    ).length;
    return Math.round((completed / planItems.length) * 100);
  };

  return (
    <div className="space-y-4">
      {/* FILTER BOX */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search customer or plan name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex min-w-[200px] items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Service Types</SelectItem>
              <SelectItem value="full_managed">Full Managed (WO)</SelectItem>
              <SelectItem value="self_service">Self Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Plan Name
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Progress
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Assign PIC
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const progressValue = calculateProgress(item.planItems);
                const totalItems = item.planItems?.length || 0;
                const completedItems =
                  item.planItems?.filter((i: any) => i.status === "completed")
                    .length || 0;

                return (
                  <tr
                    key={item.id}
                    className="group cursor-pointer transition-colors hover:bg-slate-50"
                    onClick={() => setSelectedInquiryId(item.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 group-hover:text-blue-600">
                        {item.planName || "Untitled Plan"}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          {item.id.slice(0, 8)}
                        </span>
                        <span
                          className={`rounded px-1.5 text-[9px] font-bold uppercase ${
                            item.serviceType === "full_managed"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.serviceType?.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.user?.name || "User"}
                    </td>

                    <td className="min-w-[140px] px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-medium text-slate-500">
                          <span>{progressValue}% Done</span>
                          <span>
                            {completedItems}/{totalItems}
                          </span>
                        </div>
                        <Progress value={progressValue} className="h-1.5" />
                      </div>
                    </td>

                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={item.status}
                        onValueChange={(val) =>
                          handleStatusChange(val, item.id)
                        }
                      >
                        <SelectTrigger className="h-8 w-[160px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending_payment">
                            Pending Payment
                          </SelectItem>
                          <SelectItem value="managed_by_wo">
                            Managed By WO
                          </SelectItem>
                          <SelectItem value="checking_availability">
                            Checking Availability
                          </SelectItem>
                          <SelectItem value="negotiating">
                            Negotiating
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={item.assignedTo || ""}
                        onChange={(e) => handleAssign(e, item.id)}
                        className="w-full max-w-[150px] rounded-md border bg-white p-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
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
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-slate-400 italic"
                >
                  No inquiries found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL (Auto-Sync karena data diambil dari initialData by ID) */}
      <InquiryDrawerAdmin
        data={selectedInquiry}
        isOpen={!!selectedInquiryId}
        onClose={() => setSelectedInquiryId(null)}
      />
    </div>
  );
}
