import SectionTitle from "../components/SectionTitle";

export default function HomePage({ openProducts, setPage }) {
  return (
    <>
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-sm bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
              Heating and Cooling Solutions
            </div>

            <h1 className="mt-8 text-4xl font-semibold text-slate-900 md:text-5xl">
              Reliable heating and cooling systems for residential and light commercial applications.
            </h1>

            <p className="mt-6 text-base text-slate-600">
              CT Morley offers equipment organized by residential and light commercial use so customers
              can quickly find the right system for each project.
            </p>

            <div className="mt-8 flex gap-6">
              <button
                onClick={() => openProducts()}
                className="cursor-pointer bg-orange-600 px-6 py-3 text-sm font-semibold text-white"
              >
                View Products
              </button>

              <button
                onClick={() => setPage("contact")}
                className="cursor-pointer border px-6 py-3 text-sm font-semibold"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="border bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">
              Browse Products
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => openProducts("Residential")}
                className="w-full cursor-pointer border-b pb-3 text-left"
              >
                <div className="font-semibold">Residential</div>
                <div className="text-sm text-slate-600">
                  Single-zone, multi-zone, and shared indoor systems
                </div>
              </button>

              <button
                onClick={() => openProducts("Light Commercial")}
                className="w-full cursor-pointer text-left"
              >
                <div className="font-semibold">Light Commercial</div>
                <div className="text-sm text-slate-600">
                  Larger capacity ducted, cassette, and AHU systems
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Featured Systems"
          title="Explore products by application and system type"
          description="Browse residential and light commercial systems organized by installation type and compatibility."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="border bg-white p-8">
            <div className="h-44 bg-slate-100" />
            <h3 className="mt-6 text-2xl font-semibold">Residential Systems</h3>
            <p className="mt-3 text-slate-600">
              Single-zone pairings, multi-zone outdoor units, and shared indoor families.
            </p>
            <button
              onClick={() => openProducts("Residential")}
              className="mt-6 cursor-pointer text-sm font-semibold text-orange-700"
            >
              Explore Residential →
            </button>
          </div>

          <div className="border bg-white p-8">
            <div className="h-44 bg-slate-100" />
            <h3 className="mt-6 text-2xl font-semibold">Light Commercial</h3>
            <p className="mt-3 text-slate-600">
              EVOX, ducted, cassette, and AHU systems for larger applications.
            </p>
            <button
              onClick={() => openProducts("Light Commercial")}
              className="mt-6 cursor-pointer text-sm font-semibold text-orange-700"
            >
              Explore Light Commercial →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}