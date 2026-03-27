import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import settings from "@/data/settings.json";

// Komponen Shimmer (efek kilatan cahaya)
const Shimmer = () => (
  <div className="absolute inset-0 z-10 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

export default function VendorsLoading() {
  // Buat array 6 elemen untuk skeleton grid
  const skeletonCards = Array(6).fill(0);

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <Navbar />

      {/* Header Skeleton */}
      <section className="relative overflow-hidden bg-stone-900 pt-32 pb-16 text-white">
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="relative mx-auto mb-4 h-12 w-2/3 overflow-hidden rounded-2xl bg-stone-800">
            <Shimmer />
          </div>
          <div className="relative mx-auto h-4 w-1/2 overflow-hidden rounded-lg bg-stone-800">
            <Shimmer />
          </div>
        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <section className="sticky top-[72px] z-30 border-b border-stone-100 bg-white py-4">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto md:w-auto">
            {settings.vendor_categories.map((_, i) => (
              <div
                key={i}
                className="relative h-9 w-24 flex-shrink-0 overflow-hidden rounded-full bg-stone-100"
              >
                <Shimmer />
              </div>
            ))}
          </div>
          <div className="relative h-10 w-full overflow-hidden rounded-2xl bg-stone-100 md:w-72">
            <Shimmer />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.map((_, index) => (
            <div key={index} className="group">
              {/* Image Skeleton */}
              <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100">
                <Shimmer />
              </div>

              {/* Details Skeleton */}
              <div className="flex items-center justify-between px-2">
                <div>
                  <div className="relative mb-1 h-3 w-20 overflow-hidden rounded bg-stone-100">
                    <Shimmer />
                  </div>
                  <div className="relative h-6 w-32 overflow-hidden rounded bg-stone-100">
                    <Shimmer />
                  </div>
                </div>
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-stone-100">
                  <Shimmer />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
