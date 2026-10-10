import { memo } from "react";
import { formatPrice } from "../utils";

function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart }) {
  return (
    <div className="card">
      <button
        className={"heart" + (isFavorite ? " heart--on" : "")}
        onClick={() => onToggleFavorite(product.id)}
        aria-label="В избранное"
      >
        {isFavorite ? "♥" : "♡"}
      </button>
      <div className="card__category">{product.category}</div>
      <h3 className="card__name">{product.name}</h3>
      <div className="card__price">{formatPrice(product.price)}</div>
      <span className={"stock " + (product.inStock ? "stock--yes" : "stock--no")}>
        {product.inStock ? "В наличии" : "Нет в наличии"}
      </span>
      <button
        className="btn"
        disabled={!product.inStock}
        onClick={() => onAddToCart(product.id)}
      >
        В корзину
      </button>
    </div>
  );
}

export default memo(ProductCard);
