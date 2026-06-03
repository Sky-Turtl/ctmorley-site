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
        <div className="space-y-6">
          <p className="text-base leading-8 text-slate-600">
            CTM is a world-class leader in heat pump systems and solutions. At CTM we provide our customers with innovative products that optimize indoor environments through a broad range of energy-efficient single-zone and multi-zone heat pump systems. From our flexible controls to our industry-leading air handlers, CTM has a solution for any residential and light commercial application.
          </p>
          <p className="text-base leading-8 text-slate-600">
            CTM heat pump systems have a reputation for reliability, premium quality, and advanced features. Our products are available through an expansive network of suppliers, known for their skills in distributing, marketing, and supporting both residential and light commercial systems.
          </p>
          <p className="text-base leading-8 text-slate-600">
            CTM is a brand rooted in innovation, conservation, and diversity. In conjunction with providing energy-efficient heat pump solutions, CTM also has a deep commitment to our environment. We support sustainable equipment production by incorporating renewable, reusable, and recyclable materials while minimizing the use of toxic substances in manufacturing our products.
          </p>
        </div>
      </section>
    </>
  );
}