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
      {/* HERO */}
      <div style={S.hero}>
        <h2 style={S.heroTitle}>Browse Available Food</h2>
        <p style={S.heroSub}>
          🔥 {total} listing{total !== 1 ? "s" : ""} available
        </p>

        {/* Search */}
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input
            style={S.searchInput}
            placeholder="Search food, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={S.clearBtn} onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={S.filterBar}>
        <div style={S.filterLeft}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{ ...S.catBtn, ...(category === c ? S.catActive : {}) }}
              onMouseEnter={(e) =>
                (e.target.style.background =
                  category === c ? "#2e7d32" : "#e8f5e9")
              }
              onMouseLeave={(e) =>
                (e.target.style.background =
                  category === c ? "#2e7d32" : "#fff")
              }
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
            ⊞ Grid
          </button>

          <button
            onClick={() => setView("map")}
            style={{ ...S.viewBtn, ...(view === "map" ? S.viewActive : {}) }}
          >
            ▶ Map
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div style={S.emptyState}>
          <div style={S.spinner} />
          Loading...
        </div>
      ) : foods.length === 0 ? (
        <div style={S.emptyState}>
          <div style={{ fontSize: 48 }}>🍽</div>
          <p>No listings found</p>
        </div>
      ) : view === "map" ? (
        <div style={{ padding: "0 32px 40px" }}>
          <MapView foods={foods} />
        </div>
      ) : (
        <div style={S.grid}>
          {foods.map((f) => (
            <div
              key={f._id}
              style={S.cardWrap}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <FoodCard food={f} />
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && view === "grid" && !loading && (
        <div style={S.pagination}>
          <button
            style={S.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
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
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

const S = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    paddingBottom: 60,
    animation: "fadeIn 0.5s ease",
  },

  hero: {
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
      url('https://images.unsplash.com/photo-1498837167922-ddd27525d352')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "60px 32px",
    textAlign: "center",
  },

  heroTitle: { color: "#fff", fontSize: 30, fontWeight: 800 },
  heroSub: { color: "#ddd", marginBottom: 20 },

  searchWrap: {
    position: "relative",
    maxWidth: 500,
    margin: "0 auto",
  },

  searchIcon: { position: "absolute", left: 12, top: 12 },

  searchInput: {
    width: "100%",
    padding: "12px 40px",
    borderRadius: 12,
    border: "none",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
  },

  clearBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    border: "none",
    background: "none",
    cursor: "pointer",
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    background: "#fff",
    margin: "20px 32px",
    borderRadius: 12,
  },

  filterLeft: { display: "flex", gap: 8 },
  filterRight: { display: "flex", gap: 10 },

  catBtn: {
    padding: "6px 14px",
    borderRadius: 20,
    border: "1px solid #ccc",
    cursor: "pointer",
    transition: "0.2s",
  },

  catActive: {
    background: "#2e7d32",
    color: "#fff",
  },

  select: { padding: 8, borderRadius: 8 },

  viewBtn: {
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    background: "#eee",
  },

  viewActive: {
    background: "#2e7d32",
    color: "#fff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: 24,
    padding: "0 32px",
  },

  cardWrap: {
    transition: "all 0.3s ease",
  },

  emptyState: {
    textAlign: "center",
    padding: 60,
  },

  spinner: {
    width: 30,
    height: 30,
    border: "3px solid #ccc",
    borderTop: "3px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },

  pageBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    cursor: "pointer",
  },

  pageActive: {
    background: "#2e7d32",
    color: "#fff",
  },
};

export default FoodList;