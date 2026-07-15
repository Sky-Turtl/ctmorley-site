import SectionTitle from "../components/SectionTitle";

export default function WholesaleDistributorsPage() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionTitle
            eyebrow="Wholesale Distribution"
            title="Purchase CTM products through our distributor network"
            description="CTM is the company behind the products, and we are one of many distributors serving customers. This page highlights a current wholesale purchasing location."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-semibold text-slate-900">
              Wholesale location
            </h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This location at 131-10 Avery Ave is a place to purchase CTM products. We are one of many distributors in the network, and this is the current location we are highlighting while we continue to grow our presence.
            </p>

            <div className="mt-8 rounded-sm border border-orange-100 bg-orange-50 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.08em] text-orange-700">
                Location
              </div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                131-10 Avery Ave
              </div>
              <div className="mt-2 text-sm text-slate-600">
                A wholesale purchasing location for CTM products.
              </div>
            </div>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-8">
            <h3 className="text-xl font-semibold text-slate-900">
              Ordering details
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Please contact us for availability, pricing, and ordering details for CTM products.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
