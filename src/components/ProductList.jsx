import ProductCard from "./ProductCard";

export default function ProductList({ products, favorites, onToggleFavorite, onAddToCart }) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
