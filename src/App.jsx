import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
const SKILLS = {
  Acrobatics: "DEX",
  AnimalHandling: "WIS",
  Arcana: "INT",
  Athletics: "STR",
  Deception: "CHA",
  History: "INT",
  Insight: "WIS",
  Intimidation: "CHA",
  Investigation: "INT",
  Medicine: "WIS",
  Nature: "INT",
  Perception: "WIS",
  Performance: "CHA",
  Persuasion: "CHA",
  Religion: "INT",
  SleightOfHand: "DEX",
  Stealth: "DEX",
  Survival: "WIS",
};

const SAVE_PROFICIENCIES = {
  Barbarian: ["STR", "CON"],
  Bard: ["DEX", "CHA"],
  Cleric: ["WIS", "CHA"],
  Druid: ["INT", "WIS"],
  Fighter: ["STR", "CON"],
  Monk: ["STR", "DEX"],
  Paladin: ["WIS", "CHA"],
  Ranger: ["STR", "DEX"],
  Rogue: ["DEX", "INT"],
  Sorcerer: ["CON", "CHA"],
  Warlock: ["WIS", "CHA"],
  Wizard: ["INT", "WIS"],
};

function getClassColor(className) {
  return CLASS_COLORS[className] || "#ffd166";
}
function scaleStat(stat, level) {
  const boost = Math.floor((level - 1) / 4);
  return stat + boost;
}
function getProficiencyBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function getPassivePerception(wis) {
  const mod = Math.floor((wis - 10) / 2);
  return 10 + mod;
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
  const [gender, setGender] = useState("Random");
  const [level, setLevel] = useState(1);
  const [useScaling, setUseScaling] = useState(true);


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

// ✅ Stats zuerst sauber bauen
const scaledStats = {
  STR: useScaling ? scaleStat(data?.stats?.STR || 0, level) : (data?.stats?.STR || 0),
  DEX: useScaling ? scaleStat(data?.stats?.DEX || 0, level) : (data?.stats?.DEX || 0),
  CON: useScaling ? scaleStat(data?.stats?.CON || 0, level) : (data?.stats?.CON || 0),
  INT: useScaling ? scaleStat(data?.stats?.INT || 0, level) : (data?.stats?.INT || 0),
  WIS: useScaling ? scaleStat(data?.stats?.WIS || 0, level) : (data?.stats?.WIS || 0),
  CHA: useScaling ? scaleStat(data?.stats?.CHA || 0, level) : (data?.stats?.CHA || 0),
};
const skillProficiencies = data.skillProficiencies || [];

// ✅ Helper für Modifiers
const calculateModifier = (stat) =>
  Math.floor(((Number(stat) || 0) - 10) / 2);

const dexMod = calculateModifier(scaledStats.DEX);
const conMod = calculateModifier(scaledStats.CON);
const wisMod = calculateModifier(scaledStats.WIS);

// ✅ HIT DIE je Klasse
function getHitDie(cls) {
  const c = (cls || "").toLowerCase();
  if (c.includes("barbarian")) return 12;
  if (c.includes("fighter") || c.includes("paladin") || c.includes("ranger")) return 10;
  if (
    c.includes("rogue") ||
    c.includes("bard") ||
    c.includes("cleric") ||
    c.includes("druid") ||
    c.includes("monk") ||
    c.includes("warlock")
  ) return 8;
  return 6;
}

const hitDie = getHitDie(data.class);

// ✅ HP CALCULATOR
let maxHP = hitDie + conMod;

for (let i = 2; i <= (Number(level) || 1); i++) {
  const avg =
    hitDie === 12 ? 7 :
    hitDie === 10 ? 6 :
    hitDie === 8 ? 5 : 4;

  maxHP += avg + conMod;
}

maxHP = Math.max(1, maxHP);

// ✅ COMBAT BASICS
const armorClass = 10 + dexMod;
const initiative = dexMod;
const speed = 30;

// ✅ PROFICIENCY BONUS
const proficiencyBonus =
  level >= 17 ? 6 :
  level >= 13 ? 5 :
  level >= 9 ? 4 :
  level >= 5 ? 3 : 2;

// ✅ PASSIVE PERCEPTION FIX
const hasPerceptionProficiency =
  skillProficiencies.includes("Perception");

const passivePerception =
  10 + wisMod + (hasPerceptionProficiency ? proficiencyBonus : 0);

// ✅ SAVING THROWS
const savingThrowProficiencies =
  SAVE_PROFICIENCIES[data.class] || [];

const savingThrows = {};

["STR", "DEX", "CON", "INT", "WIS", "CHA"].forEach((ability) => {
  const mod = calculateModifier(scaledStats[ability]);
  const proficient = savingThrowProficiencies.includes(ability);

  savingThrows[ability] = {
    value: proficient ? mod + proficiencyBonus : mod,
    proficient,
  };
});

// ✅ SKILLS (FINAL VERSION)
const skills = {};

Object.entries(SKILLS).forEach(([skill, ability]) => {
  const mod = calculateModifier(scaledStats[ability]);
  const proficient = skillProficiencies.includes(skill);

  skills[skill] = {
    value: proficient ? mod + proficiencyBonus : mod,
    ability,
    proficient,
  };
});


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
const downloadCharacterSheet = async () => {
  const element = document.getElementById("character-sheet");

  if (!element) {
    console.error("❌ Character sheet not found");
    return;
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  const canvas = await html2canvas(element, {
    scale: Math.max(3, window.devicePixelRatio || 2),
    useCORS: true,
    backgroundColor: null,
    scrollY: -window.scrollY,

    ignoreElements: (el) =>
      el?.getAttribute?.("data-html2canvas-ignore") === "true",

    onclone: (doc) => {
      const cloned = doc.getElementById("character-sheet");
      if (!cloned) return;

      cloned.style.webkitFontSmoothing = "antialiased";

      const img = cloned.querySelector("img[alt='NPC portrait']");
      if (img) {
        img.style.objectFit = "contain";
        img.style.objectPosition = "center";
      }
    },
  });

  const imgData = canvas.toDataURL("image/png");

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    pdf.addPage();
    position = margin - (imgHeight - heightLeft);
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(`${npcData?.name || "npc"}-character-sheet.pdf`);
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
  label="Level"
  value={level}
  onChange={(val) => setLevel(Number(val))}
  options={[...Array(20)].map((_, i) => String(i + 1))}
/>
{/* ✅ SCALING MODE BOX */}
<div
  style={{
    gridColumn: "1 / -1",

    background: `${getClassColor(npcData.class)}22`,
    border: `1px solid ${getClassColor(npcData.class)}55`,
    padding: "6px 10px",
    borderRadius: "10px",
    marginTop: 10,
  }}
>
  <label
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: "0.85rem",
      color: "#dbcdb0",
      cursor: "pointer",
    }}
  >
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
              marginbottom: 20,
              fontSize: "1.8rem",
              position: "relative",
              zIndex: 1,
              fontFamily: "'Cinzel', 'Georgia', serif",
            }}
          >
            Character Sheet
          </h2>

          {hasNpc ? (
  <div
    id="character-sheet" 
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
                      position: "relative",
                      overflow: "hidden",
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
                  gap: 16,
                }}
              >
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(90px, 1fr))",
    gap: 16,
    padding: "18px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.35))",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    boxShadow: `
      0 20px 40px rgba(0,0,0,0.5),
      0 0 25px ${getClassColor(npcData.class)}22
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
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        background: meta.proficient
          ? `${getClassColor(npcData.class)}22`
          : "rgba(0,0,0,0.25)",
        border: meta.proficient
          ? `1px solid ${getClassColor(npcData.class)}55`
          : "1px solid rgba(255,255,255,0.05)",
        fontSize: "0.85rem",
        fontWeight: meta.proficient ? "bold" : "normal",
      }}
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
    Download Character Sheet (PDF)
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