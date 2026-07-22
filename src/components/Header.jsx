import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSearchResults } from "../utils/search";
import { productPath } from "../utils/routes";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Locator", to: "/locator" },
];

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const containerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const suggestions = query.trim() ? getSearchResults(query, 6) : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !containerRef.current?.contains(event.target) &&
        !mobileMenuRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSuggestionClick = () => {
    setQuery("");
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="cursor-pointer flex items-center gap-6 text-left"
        >
          <img
            src={`${import.meta.env.BASE_URL}logos/CTM.png`}
            alt="CT Morley logo"
            className="h-10 w-auto"
          />
          <div className="logo-text">
            <div className="text-lg font-semibold text-slate-900">
              CT MORLEY
            </div>
            <div className="logo-subtitle text-sm text-slate-500">
              Heating & Cooling Systems
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `cursor-pointer text-sm font-medium ${
                  isActive
                    ? "text-orange-700"
                    : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="absolute left-1/2 top-full z-40 mt-2 min-w-[18rem] max-w-sm -translate-x-1/2 rounded-sm border border-slate-200 bg-white px-6 py-4 shadow-lg md:hidden"
          >
            <div className="space-y-3 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full rounded-sm px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 rounded-sm bg-slate-50 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-center">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setShowDropdown(true);
                    }}
                    placeholder="Search by product code"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-sm bg-orange-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

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
                      <Link
                        key={item.id}
                        to={productPath(item.id)}
                        onClick={handleSuggestionClick}
                        className="cursor-pointer block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <div className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.subtitle}
                        </div>
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="cursor-pointer block w-full bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-orange-700 hover:bg-orange-50"
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
