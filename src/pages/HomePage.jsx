import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const productsPath = (market) =>
  market ? `/products?market=${encodeURIComponent(market)}` : "/products";

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto grid min-h-[75vh] max-w-7xl gap-16 px-6 py-24 sm:min-h-[80vh] sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:min-h-[85vh] lg:py-32">
          <div>
            <div className="inline-flex rounded-sm bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
              Heating and Cooling Solutions
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Reliable heating and cooling systems for residential and light commercial applications.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
              CT Morley offers equipment organized by residential and light commercial use so customers
              can quickly find the right system for each project.
            </p>

            <div className="mt-8 flex gap-6">
              <Link
                to={productsPath()}
                className="cursor-pointer bg-orange-600 px-7 py-3.5 text-sm font-semibold text-white"
              >
                View Products
              </Link>

              <Link
                to="/contact"
                className="cursor-pointer border px-7 py-3.5 text-sm font-semibold"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="border bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">
              Browse Products
            </div>

            <div className="mt-4 space-y-3">
              <Link
                to={productsPath("Residential")}
                className="block w-full cursor-pointer border-b pb-3 text-left"
              >
                <div className="font-semibold">Residential</div>
                <div className="text-sm text-slate-600">
                  Single-zone, multi-zone, and shared indoor systems
                </div>
              </Link>

              <Link
                to={productsPath("Light Commercial")}
                className="block w-full cursor-pointer text-left"
              >
                <div className="font-semibold">Light Commercial</div>
                <div className="text-sm text-slate-600">
                  Larger capacity ducted, cassette, and AHU systems
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <SectionTitle
          eyebrow="Featured Systems"
          title="Explore products by application and system type"
          description="Browse residential and light commercial systems organized by installation type and compatibility."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="flex min-h-min flex-col items-start border bg-white p-8 text-left">
            <div className="w-full flex justify-center items-center h-56 overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}product-images/single-zone-wall-mounted-pairings-cover-454b.png`}
                alt="Residential HVAC system"
                className="max-h-full w-auto object-contain"
              />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Residential Systems</h3>
            <p className="mt-3 text-slate-600">
              Single-zone pairings, multi-zone outdoor units, and shared indoor families.
            </p>
            <Link
              to={productsPath("Residential")}
              className="mt-6 cursor-pointer text-sm font-semibold text-orange-700"
            >
              Explore Residential →
            </Link>
          </div>

          <div className="flex min-h-min flex-col items-start border bg-white p-8 text-left">
            <div className="w-full flex justify-center items-center h-56 overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}product-images/ducted-systems-cover-454b.png`}
                alt="Light commercial HVAC system"
                className="max-h-full w-auto object-contain"
              />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Light Commercial</h3>
            <p className="mt-3 text-slate-600">
              EVOX, ducted, cassette, and AHU systems for larger applications.
            </p>
            <Link
              to={productsPath("Light Commercial")}
              className="mt-6 cursor-pointer text-sm font-semibold text-orange-700"
            >
              Explore Light Commercial →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
