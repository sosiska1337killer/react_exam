import { PRODUCTS } from "../data/products";

// Имитация серверного поиска: по названию И категории
export function fetchMockResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}
