import { CATEGORIES } from "../data/products";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="tabs">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={"tab" + (c === active ? " tab--active" : "")}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
