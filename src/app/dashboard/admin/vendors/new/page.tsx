import VendorForm from "@/components/dashboard/VendorForm";

export default function NewVendorPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Kita panggil VendorForm tanpa props initialData agar masuk mode "Add" */}
      <VendorForm />
    </div>
  );
}
