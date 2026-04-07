import SectionTitle from "../components/SectionTitle";

export default function AboutPage() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionTitle
            eyebrow="About"
            title="About CT Morley"
            description="Learn more about CT Morley, our mission, and our commitment to providing dependable HVAC solutions."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-semibold text-slate-900">Who we are</h3>
            <p className="mt-6 text-base leading-8 text-slate-600">
              CT Morley provides heating and cooling products across residential and light
              commercial applications, with solutions organized to help contractors,
              distributors, and homeowners identify the right equipment more efficiently.
            </p>
          </div>
          <div className="border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-semibold text-slate-900">Why customers choose us</h3>
            <p className="mt-6 text-base leading-8 text-slate-600">
              Our lineup supports multiple refrigerant platforms, installation styles, and
              heating configurations so customers can find dependable options for a wide range
              of project needs.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}