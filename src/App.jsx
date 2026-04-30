import { useMemo, useState } from "react";
import { SUBCLASSES } from "./data/subclassOptions";
import { SUBCLASS_FEATURES } from "./data/subclassFeatures";
import FeatureCard from "./components/FeatureCard";
import { RACES, CLASSES, BACKGROUNDS } from "./data/optionsData";
import StyledSelect from "./components/StyledSelect";
import StyledInput from "./components/StyledInput";
import FieldCard from "./components/FieldCard";
import { panelStyle, sectionTitle } from "./styles/uiStyles";
import StatBox from "./components/StatBox";
import { RACE_TRAITS } from "./data/raceTraits";
import { generateNpcRequest } from "./services/npcService";

const CLASS_COLORS = {
  Barbarian: "#f87171",
  Bard: "#fbbf24",
  Cleric: "#fcd34d",
  Druid: "#86efac",
  Fighter: "#fca5a5",
  Monk: "#fde68a",
  Paladin: "#fef08a",
  Ranger: "#6ee7b7",
  Rogue: "#d1d5db",
  Sorcerer: "#c084fc",
  Warlock: "#a78bfa",
  Wizard: "#93c5fd",
};

function getClassColor(className) {
  return CLASS_COLORS[className] || "#ffd166";
}

function logoStyleBase() {
  return {
    objectFit: "contain",
    display: "block",
  };
}

export default function App() {
  const [race, setRace] = useState("Random");
  const [dndClass, setDndClass] = useState("Random");
  const [subclass, setSubclass] = useState("None");
  const [background, setBackground] = useState("Random");
  const [specialTrait, setSpecialTrait] = useState("");

  const [loadingNpc, setLoadingNpc] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [npcData, setNpcData] = useState({
    name: "",
    race: "",
    class: "",
    subclass: "",
    background: "",
    personality: "",
    specialTrait: "",
    portraitPrompt: "",
    portraitUrl: "",
    stats: {
      STR: 0,
      DEX: 0,
      CON: 0,
      INT: 0,
      WIS: 0,
      CHA: 0,
    },
  });

  const subclassOptions = useMemo(() => {
    if (!dndClass || dndClass === "Random") return ["None"];
    return SUBCLASSES[dndClass] || ["None"];
  }, [dndClass]);

  const subclassFeatures = useMemo(() => {
    if (!npcData.class || !npcData.subclass) return [];
    return SUBCLASS_FEATURES[npcData.class]?.[npcData.subclass] || [];
  }, [npcData.class, npcData.subclass]);

  const hasNpc = Boolean(npcData.name);
  const raceMeta = RACE_TRAITS[npcData.race] || RACE_TRAITS.Random;

  const initials = useMemo(() => {
    if (!npcData.name) return "DM";
    return npcData.name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("");
  }, [npcData.name]);

const generateNpc = async () => {
  try {
    console.log("✅ Generate NPC clicked");

    setLoadingNpc(true);
    setErrorText("");

    const data = await generateNpcRequest({
      race,
      npcClass: dndClass,
      subclass,
      background,
      specialTrait,
    });

    console.log("📦 Backend response:", data);

    if (data?.error) {
      setErrorText(`❌ ${data.error}`);
      return;
    }

    setNpcData({
      name: data.name || "",
      race: data.race || "",
      class: data.class || "",
      subclass: data.subclass || "",
      background: data.background || "",
      personality: data.personality || "",
      specialTrait: data.specialTrait || "",
      portraitPrompt: data.portraitPrompt || "",
      portraitUrl: "",
      stats: {
        STR: data?.stats?.STR || 0,
        DEX: data?.stats?.DEX || 0,
        CON: data?.stats?.CON || 0,
        INT: data?.stats?.INT || 0,
        WIS: data?.stats?.WIS || 0,
        CHA: data?.stats?.CHA || 0,
      },
    });

    // 🔥 Portrait API FIX
    const portraitResponse = await fetch("http://localhost:3001/api/portrait", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.portraitPrompt
          ? `${data.portraitPrompt}, fantasy character portrait, highly detailed, cinematic lighting, D&D style, 4k, dramatic shadows, concept art`
          : "fantasy character portrait, highly detailed, cinematic lighting, D&D style, 4k, dramatic shadows, concept art",
      }),
    });

    const portraitData = await portraitResponse.json();

    setNpcData((prev) => ({
      ...prev,
      portraitUrl: portraitData?.data?.[0]?.url || ""
    }));

  } catch (err) {
    console.error(err);
    setErrorText("❌ Could not reach the backend. Is localhost:3001 running?");
  } finally {
    setLoadingNpc(false);
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
background: `
  radial-gradient(
    circle at top,
    ${getClassColor(npcData.class)}33 0%,
    #3b2052 20%,
    #1d1228 55%,
    #0d0912 100%
  )
`,
transition: "background 0.6s ease",
        color: "#f7f1e3",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "28px 16px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            justifyContent: "center",
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
<img
  src="/dungeonmind-logo.png"
  alt="DungeonMind logo"
  style={{
    ...logoStyleBase(),
    width: 120,
    height: 120,
    borderRadius: "40%",
    objectFit: "cover",
    filter: `drop-shadow(0 0 10px ${getClassColor(npcData.class)}88)`,
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.filter = `
      drop-shadow(0 0 18px ${getClassColor(npcData.class)})
      drop-shadow(0 0 35px ${getClassColor(npcData.class)}aa)
    `;
    e.currentTarget.style.transform = "scale(1.08)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.filter = `
      drop-shadow(0 0 10px ${getClassColor(npcData.class)}88)
    `;
    e.currentTarget.style.transform = "scale(1)";
  }}
/>

<div>
  <h1
    style={{
      textAlign: "center",
      color: "#e9c46a",
      fontSize: "2.8rem",
      marginTop: 0,
      marginBottom: "8px",
      lineHeight: 1.1,
      fontWeight: "bold",
      letterSpacing: "1px",
      textShadow:
        "0 0 6px rgba(255,209,102,0.6), 0 0 12px rgba(255,209,102,0.4)",
      fontFamily: "'Cinzel', 'Georgia', serif",
    }}
  >
    DungeonMind
  </h1>

  <p
    style={{
      textAlign: "center",
      color: "#e9d8a6",
      marginTop: 0,
      marginBottom: "20px",
      fontSize: "1rem",
      lineHeight: 1.6,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}
  >
    D&D 5e-inspired character sheet with races, classes, and subclasses
  </p>
</div>

        </div>

        {/* CHARACTER OPTIONS CARD */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 22,
            padding: "26px 24px 28px 24px",
            marginBottom: 28,
            boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 22,
              textAlign: "center",
              color: "#ffd166",
              fontSize: "1.9rem",
              fontFamily: "'Cinzel', 'Georgia', serif",
            }}
          >
            Character Options
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <StyledSelect
              label="Race"
              value={race}
              onChange={setRace}
              options={RACES}
            />

            <StyledSelect
              label="Class"
              value={dndClass}
              onChange={(value) => {
                setDndClass(value);
                setSubclass("None");
              }}
              options={CLASSES}
            />

            <StyledSelect
              label="Subclass"
              value={subclass}
              onChange={setSubclass}
              options={subclassOptions}
            />

            <StyledSelect
              label="Background"
              value={background}
              onChange={setBackground}
              options={BACKGROUNDS}
            />
          </div>

          <div
            style={{
              marginTop: 18,
              maxWidth: 360,
            }}
          >
            <StyledInput
              label="Special Trait"
              value={specialTrait}
              onChange={setSpecialTrait}
              placeholder="e.g. glowing violet eyes, runic scar, silver voice …"
            />
          </div>

          {loadingNpc && (
            <div
              style={{
                height: "8px",
                width: "100%",
                background: "rgba(255,255,255,0.12)",
                borderRadius: "999px",
                overflow: "hidden",
                marginTop: 18,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "40%",
                  background: "linear-gradient(135deg, #c4b5fd, #e9c46a)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "999px",
                  animation: "loading 1.1s linear infinite",
                }}
              />
            </div>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={generateNpc}
              disabled={loadingNpc}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.35), 0 0 20px rgba(196,181,253,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.25), 0 0 12px rgba(196,181,253,0.5)";
              }}
              style={{
                padding: "14px 22px",
                borderRadius: 14,
                border: "none",
                background: loadingNpc
                  ? "#8f8f8f"
                  : "linear-gradient(135deg, #c4b5fd, #ffd166)",
                color: "#1a1223",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: loadingNpc ? "not-allowed" : "pointer",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.25), 0 0 12px rgba(196,181,253,0.5)",
                transition: "all 0.2s ease",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {loadingNpc ? "Generating NPC…" : "Generate NPC"}
            </button>

            {errorText && (
              <div
                style={{
                  color: "#ffb3b3",
                  fontWeight: "bold",
                }}
              >
                {errorText}
              </div>
            )}
          </div>
        </div>

        {/* CHARACTER SHEET CARD */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
background:
  "linear-gradient(180deg, rgba(255,246,221,0.12), rgba(255,255,255,0.05))",
border: "1px solid rgba(255,214,102,0.35)",
borderRadius: 22,
padding: 26,
boxShadow:
  "0 20px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,214,102,0.05)",
backdropFilter: "blur(8px)",
          }}
        >
<img
  src="/dungeonmind-logo.png"
  alt="DungeonMind watermark"
  style={{
    ...logoStyleBase(),
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    opacity: 0.06,
    filter: "blur(2px)",
    pointerEvents: "none",
  }}
/>

          <div
  style={{
    position: "absolute",
    right: "-80px",
    bottom: "-50px",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,209,102,0.15), rgba(192,132,252,0.08), transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
  }}
/>

          <h2
            style={{
              marginTop: 0,
              textAlign: "center",
              color: "#ffd166",
              fontSize: "1.9rem",
              position: "relative",
              zIndex: 1,
              fontFamily: "'Cinzel', 'Georgia', serif",
            }}
          >
            Character Sheet
          </h2>

          {hasNpc ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "340px 1fr",
                gap: 22,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* LEFT COLUMN */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={panelStyle}>
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      margin: "0 auto 16px",
                      borderRadius: 18,
                      background:
                        "radial-gradient(circle at 30% 30%, #ffd166, #8d5a11)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: "#2a1b0b",                 
boxShadow: `
  0 10px 24px rgba(0,0,0,0.35),
  0 0 12px ${getClassColor(npcData.class)}88,
  0 0 30px ${getClassColor(npcData.class)}44
`,
                      fontFamily: "'Cinzel', 'Georgia', serif",
                    }}
                  >
                    {npcData.portraitUrl ? (
  <img
    src={npcData.portraitUrl}
    alt="NPC portrait"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 18,
      transition: "all 0.3s ease",
    }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
  />
) : (
  initials
)}
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "1.6rem",
                      fontWeight: "bold",
                      color: getClassColor(npcData.class),
                      fontFamily: "'Cinzel', 'Georgia', serif",
                    }}
                  >
                    <div style={{
  fontSize: "2rem",
  fontWeight: "bold",
  textAlign: "center",
  letterSpacing: "1px",
  color: getClassColor(npcData.class),
  textShadow: `0 0 8px ${getClassColor(npcData.class)}99`,
}}>
  {npcData.name}
</div>
                  </div>

<div
  style={{
    textAlign: "center",
    marginTop: 6,
    fontSize: "0.95rem",
    color: "#dbcdb0",
    letterSpacing: "0.04em",
  }}
>
  <span style={{ marginRight: 6 }}>{npcData.race}</span>

  <span
    style={{
      opacity: 0.6,
      margin: "0 4px",
    }}
  >
    •
  </span>

  <span
    style={{
      marginLeft: 6,
      color: getClassColor(npcData.class),
      fontWeight: "bold",
      textShadow: `0 0 6px ${getClassColor(npcData.class)}88`,
    }}
  >
    {npcData.class}
  </span>
</div>
<div style={{
  textAlign: "center",
  marginTop: 4,
  fontSize: "0.75rem",
  opacity: 0.6,
}}>
  Adventurer Profile
</div>


{npcData.subclass && npcData.subclass !== "None" && (
  <div style={{ marginTop: 10, textAlign: "center" }}>
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        background: `${getClassColor(npcData.class)}22`,
        border: `1px solid ${getClassColor(npcData.class)}66`,
        color: getClassColor(npcData.class),
        fontSize: "0.8rem",
        fontWeight: "bold",
        boxShadow: `0 0 12px ${getClassColor(npcData.class)}88`,
        letterSpacing: "0.06em",
      }}
    >
      {npcData.subclass.toUpperCase()}
    </span>
  </div>
)}
</div>


<FieldCard title="Special Trait" value={npcData.specialTrait} />

                <div style={panelStyle}>
                  <div style={sectionTitle}>Race Trait</div>

                  <div
                    style={{
                      lineHeight: 1.7,
                      marginBottom: raceMeta.tags.length ? 12 : 0,
                    }}
                  >
                    {raceMeta.summary}
                  </div>

                  {raceMeta.tags.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {raceMeta.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: `${raceMeta.accent}22`,
                            border: `1px solid ${raceMeta.accent}55`,
                            color: raceMeta.accent,
                            fontSize: "0.78rem",
                            fontWeight: "bold",
                            letterSpacing: "0.03em",
                            boxShadow: `0 0 8px ${raceMeta.accent}33`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <FieldCard
                  title="Portrait Prompt"
                  value={npcData.portraitPrompt}
                />
                              </div>

              {/* RIGHT COLUMN */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 12,
                  }}
                >
                  {Object.entries(npcData.stats).map(([key, value]) => (
                    <StatBox key={key} label={key} value={value} />
                  ))}
                </div>

                <FieldCard title="Background" value={npcData.background} />
                <FieldCard title="Personality" value={npcData.personality} />

                {subclassFeatures.length > 0 && (
                  <div style={panelStyle}>
                    <div style={sectionTitle}>Subclass Features</div>

                    <div
                      style={{
                        display: "grid",
                        gap: 10,
                      }}
                    >
                      {subclassFeatures.map((feature) => (
                        <FeatureCard
                          key={feature.title}
                          title={feature.title}
                          summary={feature.summary}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px dashed rgba(255,255,255,0.22)",
                borderRadius: 16,
                padding: "24px 20px",
                color: "#ead9bd",
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                fontSize: "1.05rem",
                lineHeight: 1.7,
              }}
            >
              No NPC generated yet. Choose your options above and click{" "}
              <strong>Generate NPC</strong>.
            </div>
          )}
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(320%); }
          }
        `}</style>
      </div>
    </div>
  );
}