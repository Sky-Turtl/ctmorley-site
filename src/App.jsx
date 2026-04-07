import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { productFamilies } from "./data/products";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const buildSearchIndex = (families) => {
  const results = [];

  Object.entries(families || {}).forEach(([slug, family]) => {
    const familyTitle = family.title || "";
    const familyDescription = family.description || "";
    const refrigerant =
      family.specs?.find((spec) => spec.label === "Refrigerant")?.value || "";
    const market = family.eyebrow || "";

    if (Array.isArray(family.indoorUnits)) {
      family.indoorUnits.forEach((unit) => {
        if (!unit?.model) return;

        results.push({
          id: `${slug}__indoor__${unit.model}`,
          model: unit.model,
          title: unit.model,
          subtitle: `${familyTitle} · Indoor Unit`,
          familyTitle,
          familySlug: slug,
          market,
          refrigerant,
          type: "indoor",
          searchText: normalize(
            [
              unit.model,
              familyTitle,
              familyDescription,
              market,
              refrigerant,
              "indoor unit",
            ].join(" ")
          ),
        });
      });
    }

    const collections = [
      family.singleZoneOutdoorUnits,
      family.multiZoneOutdoorUnits,
      family.outdoorUnits,
    ];

    collections.forEach((collection) => {
      if (!collection || typeof collection !== "object") return;

      Object.entries(collection).forEach(([groupName, values]) => {
        if (Array.isArray(values)) {
          values.forEach((model) => {
            if (!model) return;

            results.push({
              id: `${slug}__${groupName}__${model}`,
              model,
              title: model,
              subtitle: `${familyTitle} · ${groupName}`,
              familyTitle,
              familySlug: slug,
              market,
              refrigerant,
              type: groupName,
              searchText: normalize(
                [
                  model,
                  familyTitle,
                  familyDescription,
                  market,
                  refrigerant,
                  groupName,
                ].join(" ")
              ),
            });
          });
        } else if (values && typeof values === "object") {
          Object.values(values).forEach((nestedValues) => {
            if (!Array.isArray(nestedValues)) return;

            nestedValues.forEach((model) => {
              if (!model) return;

              results.push({
                id: `${slug}__${groupName}__${model}`,
                model,
                title: model,
                subtitle: `${familyTitle} · ${groupName}`,
                familyTitle,
                familySlug: slug,
                market,
                refrigerant,
                type: groupName,
                searchText: normalize(
                  [
                    model,
                    familyTitle,
                    familyDescription,
                    market,
                    refrigerant,
                    groupName,
                  ].join(" ")
                ),
              });
            });
          });
        }
      });
    });
  });

  return results;
};

const scoreSearchResult = (item, query) => {
  const q = normalize(query);
  if (!q) return -1;

  const model = normalize(item.model);
  const title = normalize(item.familyTitle);
  const text = item.searchText;

  let score = 0;

  if (model === q) score += 2000;
  if (model.startsWith(q)) score += 1200;
  if (model.includes(q)) score += 600;

  if (title.includes(q)) score += 120;
  if (text.includes(q)) score += 80;

  const queryParts = q
    .split(" ")
    .filter((part) => part.length >= 3);

  queryParts.forEach((part) => {
    if (model.startsWith(part)) score += 120;
    else if (model.includes(part)) score += 60;

    if (title.includes(part)) score += 20;
    if (text.includes(part)) score += 10;
  });

  const wantsMOU = q.includes("mou");
  const wantsMIU = q.includes("miu");

  if (wantsMOU && !model.includes("mou")) {
    score -= 500;
  }

  if (wantsMIU && !model.includes("miu")) {
    score -= 500;
  }

  return score;
};
  
export default function App() {
  const [page, setPage] = useState("home");
  const [activeMarket, setActiveMarket] = useState("Residential");
  const [activeProductId, setActiveProductId] = useState(null);
  const [activeRefrigerant, setActiveRefrigerant] = useState("R454B");
  const [searchQuery, setSearchQuery] = useState("");

  const searchIndex = useMemo(() => buildSearchIndex(productFamilies), []);

  const getSearchResults = (query, limit = 50) => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const normalizedQuery = normalize(trimmed);
    const queryParts = normalizedQuery
      .split(" ")
      .filter((part) => part.length >= 3);

    return searchIndex
      .filter((item) => {
        const model = normalize(item.model);
        const title = normalize(item.familyTitle);
        const text = item.searchText;

        if (
          model === normalizedQuery ||
          model.startsWith(normalizedQuery) ||
          model.includes(normalizedQuery)
        ) {
          return true;
        }

        return queryParts.every(
          (part) =>
            model.includes(part) ||
            title.includes(part) ||
            text.includes(part)
        );
      })
      .map((item) => ({
        ...item,
        score: scoreSearchResult(item, trimmed),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, limit);
  };

  useEffect(() => {
    const initialState = {
      page: "home",
      activeProductId: null,
      activeMarket: "Residential",
      activeRefrigerant: "R454B",
      searchQuery: "",
    };

    window.history.replaceState(initialState, "", "");

    const handlePopState = (event) => {
      const state = event.state;

      if (state) {
        setPage(state.page || "home");
        setActiveProductId(state.activeProductId || null);
        setActiveMarket(state.activeMarket || "Residential");
        setActiveRefrigerant(state.activeRefrigerant || "R454B");
        setSearchQuery(state.searchQuery || "");
      } else {
        setPage("home");
        setActiveProductId(null);
        setActiveMarket("Residential");
        setActiveRefrigerant("R454B");
        setSearchQuery("");
      }

      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    window.history.replaceState(
      {
        page,
        activeProductId,
        activeMarket,
        activeRefrigerant,
        searchQuery,
      },
      "",
      ""
    );
  }, [page, activeProductId, activeMarket, activeRefrigerant, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, activeProductId]);

  const navigateToPage = (nextPage) => {
    const nextState = {
      page: nextPage,
      activeProductId: null,
      activeMarket,
      activeRefrigerant,
      searchQuery: "",
    };

    setPage(nextPage);
    setActiveProductId(null);
    setSearchQuery("");
    window.history.pushState(nextState, "", "");
  };

  const openProducts = (
    market = activeMarket,
    refrigerant = activeRefrigerant
  ) => {
    const nextState = {
      page: "products",
      activeProductId: null,
      activeMarket: market,
      activeRefrigerant: refrigerant,
      searchQuery: "",
    };

    setActiveMarket(market);
    setActiveRefrigerant(refrigerant);
    setActiveProductId(null);
    setSearchQuery("");
    setPage("products");
    window.history.pushState(nextState, "", "");
  };

  const openProductDetail = (productId) => {
    const nextState = {
      page: "product-detail",
      activeProductId: productId,
      activeMarket,
      activeRefrigerant,
      searchQuery,
    };

    setActiveProductId(productId);
    setPage("product-detail");
    window.history.pushState(nextState, "", "");
  };

  const openSearchResults = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const nextState = {
      page: "search-results",
      activeProductId: null,
      activeMarket,
      activeRefrigerant,
      searchQuery: trimmed,
    };

    setSearchQuery(trimmed);
    setActiveProductId(null);
    setPage("search-results");
    window.history.pushState(nextState, "", "");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header
        page={page}
        setPage={navigateToPage}
        onSearch={openSearchResults}
        onOpenProduct={openProductDetail}
        getSearchResults={getSearchResults}
      />

      <main>
        {page === "home" && (
          <HomePage openProducts={openProducts} setPage={navigateToPage} />
        )}

        {page === "products" && (
          <ProductsPage
            productFamilies={productFamilies}
            activeMarket={activeMarket}
            setActiveMarket={setActiveMarket}
            activeRefrigerant={activeRefrigerant}
            setActiveRefrigerant={setActiveRefrigerant}
            openProductDetail={openProductDetail}
          />
        )}

        {page === "product-detail" && (
          <ProductDetailPage
            productFamilies={productFamilies}
            activeProductId={activeProductId}
            openProductDetail={openProductDetail}
          />
        )}

        {page === "search-results" && (
          <SearchResultsPage
            query={searchQuery}
            results={getSearchResults(searchQuery, 100)}
            activeMarket={activeMarket}
            setActiveMarket={setActiveMarket}
            activeRefrigerant={activeRefrigerant}
            setActiveRefrigerant={setActiveRefrigerant}
            openProductDetail={openProductDetail}
          />
        )}

        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
      </main>
    </div>
  );
}