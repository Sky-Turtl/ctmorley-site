import { useState } from "react";
import SectionTitle from "../components/SectionTitle";

// ---------------------------------------------------------------------------
// Where contact form submissions are emailed.
//
// This uses FormSubmit.co, which needs no account or API key — it forwards
// submissions to whatever address is set below. Replace this placeholder with
// the real CT Morley inbox once it exists; that's the only change required.
//
// NOTE: FormSubmit sends a one-time activation email to this address the first
// time the form is submitted. You must click the link in that email before any
// messages start forwarding, so use a real inbox you can actually open.
// ---------------------------------------------------------------------------
const CONTACT_EMAIL = "ctmorley-inbox@example.com";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!emailPattern.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Please enter your question.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            _subject: form.subject.trim()
              ? `Website contact: ${form.subject.trim()}`
              : "New website contact form submission",
            _template: "table",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setStatus("success");
      setForm(emptyForm);
    } catch {
      setStatus("error");
      setSubmitError(
        "Something went wrong sending your message. Please try again in a moment."
      );
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-sm border px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 ${
      errors[name] ? "border-red-400" : "border-slate-300"
    }`;

  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionTitle
            eyebrow="Contact"
            title="Contact and Support"
            description="Have a question about a product, an order, or becoming a distributor? Send us a message and our team will get back to you."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
            {status === "success" ? (
              <div className="rounded-sm border border-green-200 bg-green-50 p-6">
                <h3 className="text-lg font-semibold text-green-800">
                  Thanks — your message has been sent.
                </h3>
                <p className="mt-2 text-sm leading-7 text-green-700">
                  We&apos;ll get back to you at the email address you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 cursor-pointer text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot field for basic spam protection (hidden from users). */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className={`mt-1 ${fieldClass("name")}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={`mt-1 ${fieldClass("email")}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      className={`mt-1 ${fieldClass("phone")}`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      className={`mt-1 ${fieldClass("subject")}`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Your question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    className={`mt-1 ${fieldClass("message")}`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center rounded-sm bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>

                <p className="text-xs text-slate-500">
                  Fields marked <span className="text-red-500">*</span> are
                  required.
                </p>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900">
                What we can help with
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                <li>Product information and system selection</li>
                <li>Sales and pricing questions</li>
                <li>Support and distributor inquiries</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
