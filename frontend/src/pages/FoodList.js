import React, { useEffect, useState, useCallback } from "react";
import FoodCard from "../components/FoodCard";
import MapView from "../components/MapView";
import { getAllFood } from "../utils/api";
import { toast } from "react-toastify";

const CATEGORIES = ["all", "cooked", "raw", "packaged", "beverages", "other"];
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "expiry", label: "Expiring soon" },
  { value: "oldest", label: "Oldest first" },
];

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: LIMIT };
      if (category !== "all") params.category = category;
      if (search.trim()) params.search = search.trim();
      const { data } = await getAllFood(params);
      // Handle both old array response and new paginated response
      if (Array.isArray(data)) {
        setFoods(data);
        setTotal(data.length);
      } else {
        setFoods(data.foods);
        setTotal(data.total);
      }
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchFoods();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchFoods();
  }, [category, sort]);
  useEffect(() => {
    fetchFoods();
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h2 style={S.heroTitle}>Browse Available Food</h2>
        <p style={S.heroSub}>
          {total} listing{total !== 1 ? "s" : ""} available
        </p>
        {/* Search bar */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>&#128269;</span>
          <input
            style={S.searchInput}
            placeholder="Search food, address, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={S.clearBtn} onClick={() => setSearch("")}>
              &#10005;
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div style={S.filterBar}>
        <div style={S.filterLeft}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{ ...S.catBtn, ...(category === c ? S.catActive : {}) }}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div style={S.filterRight}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={S.select}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setView("grid")}
            style={{ ...S.viewBtn, ...(view === "grid" ? S.viewActive : {}) }}
          >
            &#8864; Grid
          </button>
          <button
            onClick={() => setView("map")}
            style={{ ...S.viewBtn, ...(view === "map" ? S.viewActive : {}) }}
          >
            &#9654; Map
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div style={S.emptyState}>
          <div style={S.spinner} />
          Loading...
        </div>
      ) : foods.length === 0 ? (
        <div style={S.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>&#127869;</div>
          <p style={{ color: "#666" }}>
            No listings found{search ? ` for "${search}"` : ""}.
          </p>
          {search && (
            <button style={S.clearSearch} onClick={() => setSearch("")}>
              Clear search
            </button>
          )}
        </div>
      ) : view === "map" ? (
        <div style={{ padding: "0 32px 40px" }}>
          <MapView foods={foods} />
        </div>
      ) : (
        <div style={S.grid}>
          {foods.map((f) => (
            <FoodCard key={f._id} food={f} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && view === "grid" && !loading && (
        <div style={S.pagination}>
          <button
            style={S.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            &#8592; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              style={{ ...S.pageBtn, ...(p === page ? S.pageActive : {}) }}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            style={S.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

const S = {
  page: { minHeight: "90vh", background: "#fafafa", paddingBottom: 60 },
  hero: {
    background: "linear-gradient(135deg,#2e7d32,#43a047)",
    padding: "40px 32px 32px",
    textAlign: "center",
  },
  heroTitle: { color: "#fff", fontSize: 28, margin: "0 0 6px" },
  heroSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    margin: "0 0 20px",
  },
  searchWrap: {
    position: "relative",
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    fontSize: 16,
    color: "#999",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "13px 44px",
    borderRadius: 10,
    border: "none",
    fontSize: 15,
    outline: "none",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
  },
  clearBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    fontSize: 14,
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 32px",
    background: "#fff",
    borderBottom: "1px solid #e8f5e9",
    flexWrap: "wrap",
    gap: 10,
  },
  filterLeft: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterRight: { display: "flex", gap: 8, alignItems: "center" },
  catBtn: {
    padding: "6px 16px",
    borderRadius: 20,
    border: "1.5px solid #c8e6c9",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    color: "#2e7d32",
    fontWeight: 500,
  },
  catActive: {
    background: "#2e7d32",
    color: "#fff",
    border: "1.5px solid #2e7d32",
  },
  select: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "1.5px solid #c8e6c9",
    fontSize: 13,
    color: "#2e7d32",
    cursor: "pointer",
    outline: "none",
  },
  viewBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1.5px solid #c8e6c9",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    color: "#2e7d32",
  },
  viewActive: { background: "#2e7d32", color: "#fff" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: 24,
    padding: "28px 32px",
  },
  emptyState: { textAlign: "center", padding: "80px 20px", color: "#888" },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #c8e6c9",
    borderTop: "3px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 16px",
  },
  clearSearch: {
    marginTop: 12,
    padding: "8px 20px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    padding: "16px 32px 40px",
    flexWrap: "wrap",
  },
  pageBtn: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "1.5px solid #c8e6c9",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  pageActive: {
    background: "#2e7d32",
    color: "#fff",
    border: "1.5px solid #2e7d32",
  },
};

export default FoodList;
