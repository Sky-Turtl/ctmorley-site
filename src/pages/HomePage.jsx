import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import ProductCarousel from "../components/ProductCarousel";

const BASE = import.meta.env.BASE_URL;

const productsPath = (market) =>
  market ? `/products?market=${encodeURIComponent(market)}` : "/products";

// A lineup of units sitting above the text as a product showcase. Widths vary
// and a small downward shift on the outer units forms a gentle arch — higher in
// the middle, lower toward the edges. Mixed types (one wall unit) keep it a
// touch asymmetric.
const floatingUnits = [
  { src: `${BASE}unit-images/MOU-3B18G-2-cover.png`, className: "w-40 translate-y-8" },
  { src: `${BASE}unit-images/MIU-B09D-2-cover.png`, className: "w-44 translate-y-3" },
  { src: `${BASE}unit-images/MIU-B12W-2-cover.png`, className: "w-52 mr-6" },
  { src: `${BASE}unit-images/MIU-B09C-2-cover.png`, className: "w-40 ml-6" },
  { src: `${BASE}unit-images/MIU-B18F-2-cover.png`, className: "w-44 translate-y-3" },
  { src: `${BASE}unit-images/MIU-B24V-2-cover.png`, className: "h-48 w-auto translate-y-6" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        {/* Soft blurred gradient accents kept in the upper area so the lower
            half stays clean white and fades seamlessly into the page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
        />

        <div className="pt-20 sm:pt-24 mb-12 lg:hidden">
          <ProductCarousel items={floatingUnits} />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-0 sm:pb-24 lg:py-20">
          {/* Product lineup above the text (large screens only) */}
          <div
            aria-hidden="true"
            className="mb-12 hidden w-full items-center justify-center gap-6 lg:flex"
          >
            {floatingUnits.map((unit) => (
              <img
                key={unit.src}
                src={unit.src}
                alt=""
                className={`${unit.className} object-contain mix-blend-multiply`}
                loading="eager"
              />
            ))}
          </div>

          {/* Center content */}
          <div className="relative max-w-2xl text-center">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Reliable heating and cooling systems for residential and light commercial applications.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              CT Morley offers equipment organized by residential and light commercial use so
              customers can quickly find the right system for each project.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to={productsPath()}
                className="cursor-pointer rounded-sm bg-orange-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                View Products
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
                src={`${BASE}product-images/single-zone-wall-mounted-pairings-cover-454b.png`}
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
                src={`${BASE}product-images/ducted-systems-cover-454b.png`}
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
