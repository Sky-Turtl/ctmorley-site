export default function SearchResultsPage({
  query,
  results,
  openProductDetail,
}) {
  const filteredResults = results || [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="text-sm font-semibold text-orange-700">Search</div>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">
        Results for “{query}”
      </h2>

      <p className="mt-4 text-sm text-slate-600">
        {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"} found
      </p>

      {filteredResults.length === 0 ? (
        <div className="mt-5 border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            No products matched your search.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredResults.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openProductDetail(item.id)}
              className="cursor-pointer border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-orange-300 hover:bg-orange-50"
            >
              <div className="text-sm font-semibold text-slate-900">
                {item.title}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {item.subtitle}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}