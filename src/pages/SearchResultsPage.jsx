export default function SearchResultsPage({
  query,
  results,
  activeMarket,
  setActiveMarket,
  activeRefrigerant,
  setActiveRefrigerant,
  openProductDetail,
}) {
  const filteredResults = (results || []).filter((item) => {
    const marketText = (item.market || "").toLowerCase();
    const refrigerantText = item.refrigerant || "";

    const matchesMarket =
      activeMarket === "Residential"
        ? marketText.includes("residential")
        : activeMarket === "Light Commercial"
        ? marketText.includes("light commercial")
        : marketText.includes("accessories");

    const matchesRefrigerant = refrigerantText.includes(activeRefrigerant);

    return matchesMarket && matchesRefrigerant;
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="text-sm font-semibold text-orange-700">Search</div>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">
        Results for “{query}”
      </h2>

      <div className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">
              Refrigerant Platform
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["R454B", "R410A"].map((refrigerant) => (
                <button
                  key={refrigerant}
                  onClick={() => setActiveRefrigerant(refrigerant)}
                  className={`rounded-sm border px-3 py-2 text-xs font-semibold ${
                    activeRefrigerant === refrigerant
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {refrigerant}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-500">
              Application
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Residential", "Light Commercial", "Accessories"].map(
                (market) => (
                  <button
                    key={market}
                    onClick={() => setActiveMarket(market)}
                    className={`rounded-sm border px-3 py-2 text-xs font-semibold ${
                      activeMarket === market
                        ? "border-orange-600 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {market}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Selected:</span>
          <span>{activeRefrigerant}</span>
          <span className="text-slate-400">/</span>
          <span>{activeMarket}</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"} found
      </p>

      {filteredResults.length === 0 ? (
        <div className="mt-5 border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            No products matched your search and filter combination.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {filteredResults.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openProductDetail(item.id)}
              className="border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-orange-300 hover:bg-orange-50"
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