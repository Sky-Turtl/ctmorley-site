import { useEffect, useRef, useState } from "react";

export default function Header({
  page,
  setPage,
  onSearch,
  onOpenProduct,
  getSearchResults,
}) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const navItems = [
    { label: "Home", key: "home" },
    { label: "Products", key: "products" },
    { label: "About", key: "about" },
    { label: "Contact", key: "contact" },
  ];

  const suggestions =
    query.trim() && typeof getSearchResults === "function"
      ? getSearchResults(query, 6)
      : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim() || typeof onSearch !== "function") return;

    setShowDropdown(false);
    onSearch(query);
  };

  const handleSuggestionClick = (productId) => {
    if (typeof onOpenProduct !== "function") return;

    setQuery("");
    setShowDropdown(false);
    onOpenProduct(productId);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-6 text-left"
        >
          <img
            src={`${import.meta.env.BASE_URL}logos/CTM.png`}
            alt="CT Morley logo"
            className="h-10 w-auto"
          />
          <div>
            <div className="text-lg font-semibold text-slate-900">
              CT MORLEY
            </div>
            <div className="text-sm text-slate-500">
              Heating & Cooling Systems
            </div>
          </div>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`text-sm font-medium ${
                  active
                    ? "text-orange-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex md:items-center">
          <div ref={containerRef} className="relative">
            <form
              onSubmit={handleSubmit}
              className="flex items-center rounded-sm border border-slate-300 bg-white px-3 py-2"
            >
              <svg
                className="h-4 w-4 text-slate-400"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M14.1667 14.1667L17.5 17.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="8.75"
                  cy="8.75"
                  r="5.83333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

              <input
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by product code"
                className="ml-2 w-52 border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </form>

            {showDropdown && query.trim() && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-lg">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSuggestionClick(item.id)}
                        className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.subtitle}
                        </div>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        if (!query.trim() || typeof onSearch !== "function") return;
                        setShowDropdown(false);
                        onSearch(query);
                      }}
                      className="block w-full bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-orange-700 hover:bg-orange-50"
                    >
                      View all results
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No matching products found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}