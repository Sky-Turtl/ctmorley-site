import SectionTitle from "../components/SectionTitle";

export default function ContactPage() {
  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionTitle
            eyebrow="Contact"
            title="Contact and Support"
            description="Get in touch with our team for product information, support, or distributor inquiries. We are here to help with your project needs."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Request product information",
            "Talk to sales",
            "Find support and distributor contacts",
          ].map((item) => (
            <div key={item} className="border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900">{item}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Placeholder area for the appropriate form, contact details, or support workflow.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}