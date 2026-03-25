import { getUserPlans } from "@/actions/plan-actions";
import MyPlansClient from "@/app/dashboard/user/my-plans/MyPlansClient";

export default async function MyPlansPage() {
  const plans = await getUserPlans();

  return (
    <div className="mx-auto max-w-7xl p-2 lg:p-10">
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-stone-900">
          Rencana Pernikahan Saya
        </h1>
        <p className="mt-2 text-stone-500">
          Kelola hingga 3 draf rencana pernikahan terbaik Anda di Singaraja.
        </p>
      </div>

      <MyPlansClient initialPlans={plans} />
    </div>
  );
}
