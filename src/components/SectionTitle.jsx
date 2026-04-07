export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-semibold tracking-[0.04em] text-orange-700">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base leading-8 text-slate-600">{description}</p>
      )}
    </div>
  );
} 