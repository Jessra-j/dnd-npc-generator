const FEATURE_ICONS = {
  storm: "⚡",
  thunder: "🌩️",
  lightning: "⚡",
  fire: "🔥",
  radiant: "☀️",
  holy: "✝️",
  divine: "✨",
  shadow: "🌑",
  illusion: "🎭",
  arcane: "🪄",
  magic: "🔮",
  death: "💀",
  undead: "🦴",
  beast: "🐾",
  nature: "🌿",
  rage: "💢",
  fury: "💢",
  war: "⚔️",
  strike: "🗡️",
  teleport: "🌀",
  healing: "💖",
  heal: "💖",
  flight: "🪽",
};

function getFeatureIcon(title) {
  const lower = title.toLowerCase();

  for (const key in FEATURE_ICONS) {
    if (lower.includes(key)) return FEATURE_ICONS[key];
  }

  return "✨";
}

function getFeatureAccent(title) {
  const lower = title.toLowerCase();

  if (lower.includes("storm") || lower.includes("thunder") || lower.includes("lightning")) return "#7dd3fc";
  if (lower.includes("fire")) return "#fca5a5";
  if (lower.includes("holy") || lower.includes("divine") || lower.includes("radiant") || lower.includes("healing")) return "#fcd34d";
  if (lower.includes("shadow") || lower.includes("illusion")) return "#c4b5fd";
  if (lower.includes("nature") || lower.includes("beast")) return "#86efac";
  if (lower.includes("arcane") || lower.includes("magic") || lower.includes("teleport")) return "#93c5fd";
  if (lower.includes("death") || lower.includes("undead")) return "#f87171";
  if (lower.includes("war") || lower.includes("strike") || lower.includes("rage") || lower.includes("fury")) return "#fbbf24";

  return "#c4b5fd";
}

function getPowerLevel(title) {
  const lower = title.toLowerCase();

  if (
    lower.includes("storm") ||
    lower.includes("divine") ||
    lower.includes("holy") ||
    lower.includes("death") ||
    lower.includes("shadow")
  ) {
    return "epic";
  }

  if (
    lower.includes("arcane") ||
    lower.includes("fire") ||
    lower.includes("rage") ||
    lower.includes("war") ||
    lower.includes("strike")
  ) {
    return "rare";
  }

  return "common";
}

export default function FeatureCard({ title, summary }) {
  const icon = getFeatureIcon(title);
  const level = getPowerLevel(title);

  let accent = getFeatureAccent(title);
  if (level === "epic") accent = "#facc15";
  if (level === "rare") accent = "#c4b5fd";

  const baseShadow =
    level === "epic"
      ? `0 8px 18px rgba(0,0,0,0.22), 0 0 10px ${accent}55`
      : `0 8px 18px rgba(0,0,0,0.22), 0 0 8px ${accent}33`;

  const hoverShadow =
    level === "epic"
      ? `0 12px 24px rgba(0,0,0,0.30), 0 0 20px ${accent}aa`
      : `0 10px 22px rgba(0,0,0,0.28), 0 0 14px ${accent}88`;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
        borderRadius: 16,
        padding: "14px 16px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: baseShadow,
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = baseShadow;
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${accent}33, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            minWidth: 42,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${accent}22`,
            border: `1px solid ${accent}55`,
            fontSize: "1.2rem",
            boxShadow: `0 0 0 1px ${accent}18 inset`,
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              color: accent,
              fontWeight: "bold",
              marginBottom: 2,
              fontSize: "1rem",
              letterSpacing: "0.03em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              opacity: 0.72,
              marginBottom: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {level}
          </div>

          <div
            style={{
              lineHeight: 1.65,
              color: "#f3ead8",
              fontSize: "0.95rem",
            }}
          >
            {summary}
          </div>
        </div>
      </div>
    </div>
  );
}