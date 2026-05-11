export const FEATURE_ICONS = {
  "Wrath of the Storm": "⚡",
  "Frenzy": "🔥",
  "Cutting Words": "🗡️",
  "Natural Recovery": "🌿",
  "Improved Critical": "💥",
};

export function getFeatureIcon(title) {
  return FEATURE_ICONS[title] || "✦";
}