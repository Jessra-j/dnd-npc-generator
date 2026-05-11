export default function StyledInput({ label, value, onChange, placeholder }) {
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

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
      />
    </div>
  );
}