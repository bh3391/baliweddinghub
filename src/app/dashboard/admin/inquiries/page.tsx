import { getAllInquiries } from "@/actions/inquiries";
import { InquiryClient } from "./InquiryClient";
import { db } from "../../../../../db";
import { user } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export default async function InquiriesPage() {
  const data = await getAllInquiries();

  // Ambil daftar staff untuk dropdown Assign PIC
  const staffList = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(eq(user.role, "admin")); // Asumsi PIC adalah admin/staff

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Inquiry Management</h1>
      <InquiryClient initialData={data} staff={staffList} />
    </div>
  );
}
