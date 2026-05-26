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
import html2pdf from "html2pdf.js";
import {
  STAT_KEYS,
  SKILLS,
  SAVE_PROFICIENCIES,
  getClassColor,
  getHitDie,
  getAverageHitDie,
  getProficiencyBonus,
  calculateModifier,
  scaleStat,
} from "./utils/characterUtils";
import {
  rootStyle,
  contentWrapperStyle,
  pdfRootStyle,
  headerRowStyle,
  logoBaseStyle,
  heroTitleStyle,
  heroSubtitleStyle,
  optionsCardStyle,
  optionsGridStyle,
  scalingBoxStyle,
  scalingLabelStyle,
  progressContainerStyle,
  progressBarStyle,
  generateButtonStyle,
  characterSheetCardStyle,
  watermarkStyle,
  glowStyle,
  characterSheetBodyStyle,
  leftColumnStyle,
  portraitCardStyle,
  nameStyle,
  subclassBadgeStyle,
  skillBadgeStyle,
  downloadButtonStyle,
} from "./styles/appStyles";

export default function App() {
  const [race, setRace] = useState("Random");
  const [dndClass, setDndClass] = useState("Random");
  const [subclass, setSubclass] = useState("None");
  const [background, setBackground] = useState("Random");
  const [specialTrait, setSpecialTrait] = useState("");
  const [gender, setGender] = useState("Random");
  const [level, setLevel] = useState(1);
  const [useScaling, setUseScaling] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [loadingNpc, setLoadingNpc] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [loadingPortrait, setLoadingPortrait] = useState(false);
  const [portraitRevealing, setPortraitRevealing] = useState(false);

const [npcData, setNpcData] = useState({
  name: "",
  race: "",
  class: "",
  subclass: "",
  background: "",
  personality: "",
  personalityTraits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  specialTrait: "",
  portraitPrompt: "",
  portraitUrl: "",
  skillProficiencies: [],
  skills: {},     
  savingThrowProficiencies: [],
  savingThrows: {},        
  stats: {
    STR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    WIS: 0,
    CHA: 0,
  },
  combat: {               
    armorClass: 10,
    initiative: 0,
    speed: 30,
    maxHP: 1,
    currentHP: 1,
    proficiencyBonus: 2,
    passivePerception: 10,
  },
});
const [spells, setSpells] = useState([]);
const [loadingSpells, setLoadingSpells] = useState(false);
const [spellError, setSpellError] = useState("");
const [selectedSpell, setSelectedSpell] = useState(null);
const [loadingSpellDetails, setLoadingSpellDetails] = useState(false);


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
  gender,
  level,
});

console.log("📦 Backend response:", data);

if (data?.error) {
  setErrorText(`❌ ${data.error}`);
  return;
}

const scaledStats = Object.fromEntries(
  STAT_KEYS.map((key) => [
    key,
    useScaling
      ? scaleStat(data?.stats?.[key] || 0, level)
      : data?.stats?.[key] || 0,
  ])
);
const skillProficiencies = data.skillProficiencies || [];

const dexMod = calculateModifier(scaledStats.DEX);
const conMod = calculateModifier(scaledStats.CON);
const wisMod = calculateModifier(scaledStats.WIS);

const hitDie = getHitDie(data.class);
const cappedLevel = Math.max(1, Number(level) || 1);
const maxHP = Math.max(
  1,
  hitDie + conMod + (cappedLevel - 1) * (getAverageHitDie(hitDie) + conMod)
);

const armorClass = 10 + dexMod;
const initiative = dexMod;
const speed = 30;
const proficiencyBonus = getProficiencyBonus(level);
const passivePerception =
  10 + wisMod + (skillProficiencies.includes("Perception") ? proficiencyBonus : 0);

const savingThrowProficiencies = SAVE_PROFICIENCIES[data.class] || [];
const savingThrows = Object.fromEntries(
  STAT_KEYS.map((ability) => {
    const mod = calculateModifier(scaledStats[ability]);
    const proficient = savingThrowProficiencies.includes(ability);
    return [ability, { value: mod + (proficient ? proficiencyBonus : 0), proficient }];
  })
);

const skills = Object.fromEntries(
  Object.entries(SKILLS).map(([skill, ability]) => {
    const mod = calculateModifier(scaledStats[ability]);
    const proficient = skillProficiencies.includes(skill);
    return [skill, { value: mod + (proficient ? proficiencyBonus : 0), ability, proficient }];
  })
);


setNpcData({
  name: data.name || "",
  race: data.race || "",
  class: data.class || "",
  subclass: data.subclass || "",
  background: data.background || "",
  personality: data.personality || "",

  personalityTraits: data.personalityTraits || "",
  ideals: data.ideals || "",
  bonds: data.bonds || "",
  flaws: data.flaws || "",

  specialTrait: data.specialTrait || "",
  portraitPrompt: data.portraitPrompt || "",
  portraitUrl: "",

  stats: scaledStats,

  combat: {
    armorClass,
    initiative,
    speed,
    maxHP,
    currentHP: maxHP,
    proficiencyBonus,
    passivePerception,
  },

  skills,
  skillProficiencies,

  savingThrowProficiencies,
  savingThrows
});

    console.log("[Portrait Prompt]", data.portraitPrompt);

    let portraitPrompt = data.portraitPrompt && data.portraitPrompt.trim();
    if (!portraitPrompt) {
      console.warn("[Portrait Prompt] Empty or missing, using fallback.");
      portraitPrompt = "fantasy character portrait, highly detailed, cinematic lighting, D&D style, 4k, dramatic shadows, concept art";
    } else {
      portraitPrompt = `${portraitPrompt}, fantasy character portrait, highly detailed, cinematic lighting, D&D style, 4k, dramatic shadows, concept art`;
    }

try {
  setLoadingPortrait(true);

  const portraitResponse = await fetch("http://localhost:3001/api/portrait", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: portraitPrompt }),
  });

  if (!portraitResponse.ok) {
    const errText = await portraitResponse.text();
    throw new Error(`Portrait API failed (${portraitResponse.status}): ${errText}`);
  }

  const portraitJson = await portraitResponse.json();

  console.log("🖼️ portraitJson:", portraitJson);
  console.log("🖼️ portraitUrl:", portraitJson?.imageUrl);

  const imageUrl = portraitJson?.imageUrl || "";

  setNpcData((prev) => ({
    ...prev,
    portraitUrl: imageUrl,
  }));

} catch (err) {
  console.error("❌ Portrait fetch error:", err);
} finally {
  setLoadingPortrait(false);
};

  } catch (err) {
    console.error(err);
    setErrorText("❌ Could not reach the backend. Is localhost:3001 running?");
  } finally {
    setLoadingNpc(false);
  }
};
const SPELLCASTER_CLASS_MAP = {
  Bard: "bard",
  Cleric: "cleric",
  Druid: "druid",
  Paladin: "paladin",
  Ranger: "ranger",
  Sorcerer: "sorcerer",
  Warlock: "warlock",
  Wizard: "wizard",
};
const fetchSpells = async (className = npcData.class) => {
  try {
    setLoadingSpells(true);
    setSpellError("");
    setSelectedSpell(null);

    const apiClass = SPELLCASTER_CLASS_MAP[className];

    // Keine Zauberklasse → leer
    if (!apiClass) {
      setSpells([]);
      return;
    }

    const [cantripRes, level1Res] = await Promise.all([
      fetch(`https://www.dnd5eapi.co/api/2014/spells?level=0&classes=${apiClass}`),
      fetch(`https://www.dnd5eapi.co/api/2014/spells?level=1&classes=${apiClass}`)
    ]);

    const cantripData = await cantripRes.json();
    const level1Data = await level1Res.json();

    const merged = [
      ...(cantripData.results || []),
      ...(level1Data.results || [])
    ];

    const uniqueSpells = Array.from(
      new Map(merged.map((s) => [s.index, s])).values()
    );

    setSpells(uniqueSpells.slice(0, 12));
  } catch (error) {
    console.error("Spell API Error:", error);
    setSpellError("Failed to load class spellbook");
    setSpells([]);
  } finally {
    setLoadingSpells(false);
  }
};
const downloadCharacterSheet = async () => {
  const element = document.getElementById("character-sheet");

  if (!element) {
    console.error("❌ Character sheet not found");
    return;
  }

  try {
    setIsExporting(true);

    // ✅ warten bis React re-render
    await new Promise((r) => setTimeout(r, 300));

    const opt = {
      margin: 0,
      filename: `${npcData?.name || "npc"}-character-sheet.pdf`,
      image: { type: "jpeg", quality: 1 },

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#2d1e43",
      },

      jsPDF: {
        unit: "px",
        format: [
          element.scrollWidth,
          element.scrollHeight,
        ],
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(element).save();

  } catch (err) {
    console.error("❌ PDF export failed:", err);
  } finally {
    setIsExporting(false);
  }
};

  return (
    <div style={rootStyle(getClassColor(npcData.class))}>
      <div style={contentWrapperStyle}>
        <div id="pdf-root" style={pdfRootStyle(getClassColor(npcData.class))}>
        </div>
        {/* HEADER */}
        <div style={headerRowStyle}>
<img
  src="/dungeonmind-logo.png"
  alt="DungeonMind logo"
  style={{
    ...logoBaseStyle,
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
  <h1 style={heroTitleStyle}>
    DungeonMind
  </h1>

  <p style={heroSubtitleStyle}>
    D&D 5e-inspired character sheet with races, classes, and subclasses
  </p>
</div>

        </div>

        {/* CHARACTER OPTIONS CARD */}
        <div style={optionsCardStyle(isExporting)}>
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

          <div style={optionsGridStyle}>
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
  label="Level"
  value={level}
  onChange={(val) => setLevel(Number(val))}
  options={[...Array(20)].map((_, i) => String(i + 1))}
/>


            <StyledSelect
              label="Subclass"
              value={subclass}
              onChange={setSubclass}
              options={subclassOptions}
            />
            
<StyledSelect
  label="Gender / Apperance"
  value={gender}
  onChange={setGender}
  options={["Random", "Male", "Female"]}
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
{/* SCALING MODE BOX */}
<div style={scalingBoxStyle(getClassColor(npcData.class))}>
  <label style={scalingLabelStyle}>
    <input
      type="checkbox"
      checked={useScaling}
      onChange={(e) => setUseScaling(e.target.checked)}
      style={{
        accentColor: "#ffd166",
        transform: "scale(1.2)",
      }}
    />
    Scaling Mode (Enhanced RPG Stats)
  </label>
</div>
          {loadingNpc && (
            <div style={progressContainerStyle}>
              <div style={progressBarStyle} />
            </div>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 20,
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
              style={generateButtonStyle(loadingNpc)}
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
<div id="pdf-export-area" style={characterSheetCardStyle(getClassColor(npcData.class))}>
{/* ✅ Export-only header (auf Webseite unsichtbar, im PDF sichtbar) */}
<div
  id="pdf-export-header"
  style={{
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    marginBottom: 24,
  }}
>
  <img
    src="/dungeonmind-logo.png"
    alt="DungeonMind Logo"
    style={{ width: 80, height: 80, objectFit: "contain" }}
  />

  <div style={{ textAlign: "left" }}>
    <div
      style={{
        fontSize: "2.4rem",
        fontFamily: "'Cinzel', serif",
        color: "#ffd166",
        letterSpacing: "2px",
        lineHeight: 1,
      }}
    >
      DungeonMind
    </div>

    <div
      style={{
        fontSize: "0.9rem",
        color: "#fceabb",
        marginTop: 6,
        opacity: 0.95,
      }}
    >
      D&D 5e-inspired character sheet with races, classes, and subclasses
    </div>
  </div>
</div>

{/* ✅ WATERMARK (bleibt ganz oben) */}
<img
  src="/dungeonmind-logo.png"
  alt="DungeonMind Logo"
  style={{
    ...logoBaseStyle,
    ...watermarkStyle,
  }}
/>
{/* ✅ GLOW EFFECT */}
<div style={glowStyle} />

          {hasNpc ? (
<div
id="character-sheet"
style={{
  ...characterSheetBodyStyle(getClassColor(npcData.class), isExporting),
  display: window.innerWidth < 1000 ? "flex" : "grid",
  flexDirection: window.innerWidth < 1000 ? "column" : undefined,
  gridTemplateColumns:
    window.innerWidth < 1000 ? undefined : "minmax(300px, 380px) 1fr",
}}
>
 {/* ✅ WATERMARK (GENAU HIER!) */}
  <img
    src="/dungeonmind-logo.png"
    alt="watermark"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 420,
      opacity: 0.06,
      pointerEvents: "none",
    }}
  />
{/* LEFT COLUMN */}
<div style={leftColumnStyle}>
                <div style={panelStyle}>
                  <div style={portraitCardStyle(getClassColor(npcData.class))}>
                    <div
  style={{
    position: "relative",
    width: "100%",
    height: "100%",
  }}
>
{/* Portrait / Initials */}
{npcData.portraitUrl ? (
<img
  src={npcData.portraitUrl}
  alt="NPC portrait"
  className={`portraitFadeIn ${portraitRevealing ? "portraitReveal" : ""}`}
  
onLoad={() => {
  setPortraitRevealing(true);
  setTimeout(() => setPortraitRevealing(false), 700);
}}
  style={{
    position: "relative",
    width: "100%",
    height: "100%",
   objectFit: "cover",
   objectPosition: "center",
    borderRadius: 18,
    transition: "transform 0.3s ease",
    zIndex: 1,
  }}
  
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
/>
) : (
  <span
  style={{
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  }}
>
  {initials}
</span>
)}

{/* ✅ LOADER OVERLAY */}
{loadingPortrait && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.25)",
      backdropFilter: "blur(2px)",
      zIndex: 2,
    }}
  >
    <div
      className="spinnerDeluxe"
      style={{
        "--spinner-accent": getClassColor(npcData.class),
      }}
    />
    <div className="portraitShimmer" />
  </div>
)}

</div>
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
                    <div style={nameStyle(getClassColor(npcData.class))}>
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
  
  {/* SPELLBOOK PANEL */}
<div
  style={{
    background: "rgba(20, 20, 40, 0.9)",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "16px",
    boxShadow: "0 0 15px rgba(138, 92, 255, 0.6)",
    border: "1px solid rgba(255,255,255,0.1)"
  }}
>
  <h3
    style={{
      color: "#ffd166",
      marginBottom: "10px",
      textShadow: "0 0 8px rgba(255,209,102,0.7)"
    }}
  >
    📜 Spellbook
  </h3>

  <button
    onClick={fetchSpells}
    style={{
      width: "100%",
      padding: "8px",
      marginBottom: "8px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #5e3b92, #ffd166)",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer"
    }}
  >
    Load Spells
  </button>

  <button
    onClick={() =>
      window.open(
        "https://www.dndbeyond.com/spells",
        "_blank",
        "noopener,noreferrer"
      )
    }
    style={{
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      borderRadius: "10px",
      border: "none",
      background: "#222",
      color: "#ffd166",
      cursor: "pointer"
    }}
  >
    Open Full Spellbook
  </button>

  {loadingSpells && <p style={{ color: "#aaa" }}>Loading spells...</p>}
  {spellError && <p style={{ color: "red" }}>{spellError}</p>}

  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
    {spells.map((spell) => (
      <div
        key={spell.index}
        style={{
          padding: "6px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "#ddd"
        }}
      >
        ✨ {spell.name}
      </div>
    ))}
  </div>
</div>
  <span style={{ marginRight: 6 }}>{npcData.race}</span>

  <span style={{ opacity: 0.6, margin: "0 4px" }}>
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

  {/* ✅ LEVEL */}
  <span style={{ opacity: 0.6, margin: "0 6px" }}>
    •
  </span>

  <span
    style={{
      color: "#ffd166",
      fontWeight: "bold",
    }}
  >
    Level {level}
  </span>
</div>
<div style={{
  textAlign: "center",
  marginTop: 4,
  fontSize: "0.75rem",
  opacity: 0.6,
}}>
</div>

{npcData.subclass && npcData.subclass !== "None" && (
  <div style={{ marginTop: 10, textAlign: "center" }}>
    <span style={subclassBadgeStyle(getClassColor(npcData.class))}>
      {npcData.subclass.toUpperCase()}
    </span>
  </div>
)}
</div>
<FieldCard title="Special Trait" value={npcData.specialTrait} />


 {/* RACE TRAIT */}
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {raceMeta.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    )}
  </div>
              {/* ✅ SAVING THROWS */}
<div style={panelStyle}>
  <div
    style={{
      textAlign: "center",
      color: "#ffd166",
      marginBottom: 10,
      letterSpacing: "0.05em",
    }}
  >
    SAVING THROWS
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {npcData.savingThrows &&
      Object.entries(npcData.savingThrows).map(([ability, meta]) => (
        <div
          key={ability}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 8px",
            borderRadius: 6,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Kreis */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "2px solid #c9b37a",
                background: meta.proficient ? "#c9b37a" : "transparent",
              }}
            />

            <span>{ability}</span>
          </div>

          <span style={{ fontWeight: "bold" }}>
            {meta.value >= 0 ? `+${meta.value}` : meta.value}
          </span>
        </div>
      ))}
  </div>
</div>
</div>
{/* RIGHT COLUMN */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 20,
  }}
>
<div
style={{
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(90px, 1fr))",
  gap: 18,

  marginBottom: "14px",

  padding: "22px",
  borderRadius: "20px",

  background: `
    radial-gradient(circle at 50% 120%, ${getClassColor(npcData.class)}33, transparent),
    linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.4))
  `,
border: `1px solid ${getClassColor(npcData.class)}55`,
boxShadow: `
  0 20px 40px rgba(0,0,0,0.6),
  0 0 45px ${getClassColor(npcData.class)}66
`,
  position: "relative",
  overflow: "hidden",
}}
>
  {/* ✨ GLOW OVERLAY */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 50% -20%, ${getClassColor(npcData.class)}22, transparent)`,
      pointerEvents: "none",
    }}
  />
  {Object.entries(npcData.stats).map(([key, value]) => (
    <div
      key={key}
      style={{
        textAlign: "center",
        transition: "transform 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      <StatBox label={key} value={value} />
    </div>
  ))}
</div>

                <FieldCard title="Background" value={npcData.background} />
                <FieldCard title="Personality" value={npcData.personality} />

{/* ✅ NEUE SEKTION: Traits */}
<div style={{ marginTop: 12 }}>
  <FieldCard title="Personality Traits" value={npcData.personalityTraits} />
  <FieldCard title="Ideals" value={npcData.ideals} />
  <FieldCard title="Bonds" value={npcData.bonds} />
  <FieldCard title="Flaws" value={npcData.flaws}/>
</div>
<div
  style={{
    marginTop: 16,
  }}
>
  <div
    style={{
      fontSize: "1.1rem",
      color: "#ffd166",
      marginBottom: 10,
      textAlign: "center",
      letterSpacing: "0.06em",
    }}
  >
    SKILLS
  </div>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 8,
    }}
  >
{npcData.skills &&
  Object.entries(npcData.skills).map(([skill, meta]) => (
    <div
      key={skill}
      style={skillBadgeStyle(getClassColor(npcData.class), meta.proficient)}
    >
      {meta.proficient ? "★ " : ""}
      {meta.value >= 0 ? `+${meta.value}` : meta.value}{" "}
      {skill.replace(/([A-Z])/g, " $1")} ({meta.ability})
    </div>
  ))}
  </div>
</div>
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
              
{/* DOWNLOAD BUTTON */}
<div
  style={{
    gridColumn: "1 / -1",
    textAlign: "center",
    marginTop: 20,
  }}
>
  <button
    data-html2canvas-ignore="true"
    onClick={downloadCharacterSheet}
    style={{
      padding: "12px 18px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: "#ffd166",
      color: "#2a1b0b",
      fontWeight: "bold",
      boxShadow: `0 0 12px ${getClassColor(npcData.class)}`,
    }}
  >
    Download Character Sheet
  </button>
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
        `}
        </style>
      </div>
    </div>
  );
}