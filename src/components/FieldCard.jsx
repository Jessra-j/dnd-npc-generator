export default function FieldCard({ title, value }) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.22)",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div
        style={{
          color: "#ffd166",
          fontSize: "0.9rem",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </div>

      <div style={{ lineHeight: 1.7 }}>
        {value || "—"}
      </div>
    </div>
  );
}