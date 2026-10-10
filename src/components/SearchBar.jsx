export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Поиск по названию или категории..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
