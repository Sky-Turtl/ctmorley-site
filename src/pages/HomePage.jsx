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
                className="bg-orange-600 px-6 py-3 text-sm font-semibold text-white"
              >
                View Products
              </button>

              <button
                onClick={() => setPage("contact")}
                className="border px-6 py-3 text-sm font-semibold"
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
                className="w-full border-b pb-3 text-left"
              >
                <div className="font-semibold">Residential</div>
                <div className="text-sm text-slate-600">
                  Single-zone, multi-zone, and shared indoor systems
                </div>
              </button>

              <button
                onClick={() => openProducts("Light Commercial")}
                className="w-full text-left"
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
              className="mt-6 text-sm font-semibold text-orange-700"
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
              className="mt-6 text-sm font-semibold text-orange-700"
            >
              Explore Light Commercial →
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
          <div className="bg-slate-50 p-8">
            <div className="text-sm font-semibold tracking-[0.04em] text-orange-700">
              Where to Buy
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Visit Our Location
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              CT Morley products are currently available directly through our Flushing, NY location.
              Whether you're a contractor or homeowner, our team can help you select the right
              equipment and provide support for your project.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Visit us in person or contact our team to get assistance selecting the right system
              for your project and coordinating purchase.
            </p>

            <div className="mt-6 border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">CT Morley</div>
              <div className="mt-2 text-sm leading-7 text-slate-600">
                131-18 Avery Ave
                <br />
                Flushing, NY 11355
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => setPage("contact")}
                className="rounded-sm bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Contact Us
              </button>
              <button
                onClick={() => setPage("contact")}
                className="rounded-sm border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Contact Our Team
              </button>
            </div>
          </div>

          <div className="overflow-hidden bg-white">
            <iframe
              title="CT Morley location map"
              src="https://www.google.com/maps?q=131-18%20Avery%20Ave%2C%20Flushing%2C%20NY%2011355&z=14&output=embed"
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}