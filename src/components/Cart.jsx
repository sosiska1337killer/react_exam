import { formatPrice } from "../utils";

export default function Cart({ items, total, onChangeQty, onClose }) {
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="cart">
        <div className="cart__head">
          <h2>Корзина</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <p className="muted">Корзина пуста</p>
        ) : (
          <>
            {items.map(({ product, qty }) => (
              <div key={product.id} className="cart__item">
                <div>
                  <div>{product.name}</div>
                  <div className="muted">{formatPrice(product.price * qty)}</div>
                </div>
                <div className="qty">
                  <button onClick={() => onChangeQty(product.id, -1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => onChangeQty(product.id, 1)}>+</button>
                </div>
              </div>
            ))}
            <div className="cart__total">Итого: {formatPrice(total)}</div>
          </>
        )}
      </aside>
    </>
  );
}
