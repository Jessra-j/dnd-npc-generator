export default function StyledSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#ffe7b0",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #6d597a",
          background: "#2c1f38",
          color: "#ffffff",
          boxSizing: "border-box",
          outline: "none",
          fontSize: "0.98rem",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}