import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { fetchMockResults } from "./api/mockApi";
import { PRODUCTS } from "./data/products";
import SearchBar from "./components/SearchBar";
import CategoryTabs from "./components/CategoryTabs";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [favorites, setFavorites] = useLocalStorage("shop:favorites", []);
  const [cart, setCart] = useLocalStorage("shop:cart", {});
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Ввод мгновенный, запрос стартует после паузы 500 мс
  const debouncedSearch = useDebounce(search, 500);

  // Симуляция API (600 мс) + защита от Race Condition
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timerId = setTimeout(() => {
      if (!isCancelled) {
        console.log("API request:", debouncedSearch);
        setProducts(fetchMockResults(debouncedSearch));
        setIsLoading(false);
      }
    }, 600);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [debouncedSearch]);

  // Категория + избранное + сортировка по цене
  const visibleProducts = useMemo(() => {
    let list = category === "Все" ? products : products.filter((p) => p.category === category);
    if (onlyFavorites) list = list.filter((p) => favorites.includes(p.id));

    const copy = [...list];
    if (sort === "asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "desc") copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [products, category, sort, onlyFavorites, favorites]);

  const cartItems = useMemo(
    () =>
      PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ product: p, qty: cart[p.id] })),
    [cart]
  );
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  const toggleFavorite = useCallback(
    (id) =>
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavorites]
  );

  const changeQty = useCallback(
    (id, delta) =>
      setCart((prev) => {
        const q = (prev[id] || 0) + delta;
        const next = { ...prev };
        if (q <= 0) delete next[id];
        else next[id] = q;
        return next;
      }),
    [setCart]
  );

  const addToCart = useCallback((id) => changeQty(id, 1), [changeQty]);

  return (
    <div className="page">
      <header className="header">
        <h1>Mini Shop 2.0</h1>
        <button className="btn btn--cart" onClick={() => setCartOpen(true)}>
          🛒 Корзина {cartCount > 0 && <span className="count">{cartCount}</span>}
        </button>
      </header>

      <SearchBar value={search} onChange={setSearch} />
      <CategoryTabs active={category} onChange={setCategory} />

      <div className="toolbar">
        <div className="toolbar__left">
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">По умолчанию</option>
            <option value="asc">Сначала недорогие (↑)</option>
            <option value="desc">Сначала дорогие (↓)</option>
          </select>
          <button
            className={"fav-filter" + (onlyFavorites ? " fav-filter--on" : "")}
            onClick={() => setOnlyFavorites((v) => !v)}
          >
            ♥ Только избранное
          </button>
        </div>

        {!isLoading && <span className="badge">Найдено товаров: {visibleProducts.length}</span>}
      </div>

      {isLoading ? (
        <div className="loading">
          <span className="spinner" />
          Ищем товары на сервере...
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="empty">Ничего не найдено</div>
      ) : (
        <ProductList
          products={visibleProducts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
        />
      )}

      {cartOpen && (
        <Cart
          items={cartItems}
          total={cartTotal}
          onChangeQty={changeQty}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
