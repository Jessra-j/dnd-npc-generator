import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend läuft – Foundry Responses API");
});


// ==============================
// ✅ ROBUSTER RESPONSE PARSER
// ==============================

function extractTextFromResponsesApi(data) {
  console.log("🔍 Raw structure:", JSON.stringify(data, null, 2));

  if (typeof data?.output_text === "string") {
    return data.output_text;
  }

  if (!Array.isArray(data?.output)) return "";

  let text = "";

  for (const block of data.output) {
    if (block.type === "output_text" && block.text) {
      text += block.text + "\n";
    }

    if (Array.isArray(block.content)) {
      for (const item of block.content) {
        if (
          (item.type === "output_text" || item.type === "text") &&
          item.text
        ) {
          text += item.text + "\n";
        }
      }
    }
  }

  return text.trim();
}


// ==============================
// ✅ ROBUSTER JSON PARSER
// ==============================

function safeParseJson(content) {
  try {
    let cleaned = String(content || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch {
    console.warn("⚠️ Direct JSON parse failed – trying recovery...");

    try {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON found");

      return JSON.parse(match[0]);

    } catch (error) {
      console.error("❌ JSON completely failed");
      throw error;
    }
  }
}


// ==============================
// ✅ NPC ENDPOINT
// ==============================

app.post("/api/npc", async (req, res) => {
  try {
    const {
      race,
      npcClass,
      subclass,
      background,
      specialTrait,
      gender,
    } = req.body || {};
    const safeGender = gender || "Random";

    const endpoint = process.env.FOUNDRY_RESPONSES_ENDPOINT;
    const apiKey = process.env.FOUNDRY_API_KEY;
    const model = process.env.FOUNDRY_MODEL;

    if (!endpoint || !apiKey || !model) {
      return res.status(500).json({
        error: "❌ Missing environment variables",
      });
    }

const prompt = `
Create a Dungeons & Dragons 5e inspired NPC in English (United States).

${safeGender !== "Random"
  ? `a clearly ${safeGender} ${race} ${npcClass} with distinct ${safeGender === "female" ? "feminine" : "masculine"} features`
  : `${race} ${npcClass}`
}
Requirements:
- Race: ${race}
- Class: ${npcClass}
- Subclass: ${subclass}
- Background: ${background}
- Special Trait: ${specialTrait || "Creative trait"}

IMPORTANT:
- The character MUST clearly appear as ${safeGender !== "Random" ? safeGender : "the defined gender"}.
- The appearance description MUST strongly reflect this gender.
- Avoid ambiguous or androgynous descriptions unless explicitly requested.
Generate a detailed NPC including personality, appearance and backstory.

Also generate:
- Personality Traits (1–2 short sentences)
- Ideals (short statement)
- Bonds (short statement)
- Flaws (short statement)
Also generate:
- skillProficiencies: an array of 2 to 4 skills this character is proficient in, based on class, background and personality.

Return STRICTLY valid JSON.

Use exactly this JSON structure:
{
  "name": "string",
  "race": "string",
  "class": "string",
  "subclass": "string",
  "background": "string",
  "personality": "string",
  "specialTrait": "string",
  "personalityTraits": "string",
  "ideals": "string",
  "bonds": "string",
  "flaws": "string",
  "skillProficiencies": ["string"],
  "portraitPrompt": "string",
  "stats": {
    "STR": number,
    "DEX": number,
    "CON": number,
    "INT": number,
    "WIS": number,
    "CHA": number
  }
}
`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        model,
        input: prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "❌ Foundry API error",
        details: data,
      });
    }

    const text = extractTextFromResponsesApi(data);

    let npcObject;

    try {
      npcObject = safeParseJson(text);
    } catch {
      return res.status(500).json({
        error: "❌ JSON parsing failed",
        raw: text,
      });
    }

    return res.json(npcObject);

  } catch (error) {
    console.error("❌ Backend crash:", error);

    return res.status(500).json({
      error: "❌ Internal server error",
    });
  }
});


// ==============================
// ✅ PORTRAIT ENDPOINT
// ==============================
app.post("/api/portrait", async (req, res) => {
  try {
    console.log("[Portrait API] Incoming req.body:", req.body);

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "❌ Missing prompt" });
    }

const azureEndpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.FOUNDRY_API_KEY;
const deploymentName = process.env.FOUNDRY_IMAGE_DEPLOYMENT || "gpt-image-1";

if (!azureEndpoint || !apiKey) {
  return res.status(500).json({
    error: "❌ Missing environment variables (AZURE_ENDPOINT / FOUNDRY_API_KEY)",
  });
}

const url = `${azureEndpoint}/openai/v1/images/generations`;

console.log("🎨 Generating portrait...");
console.log("➡️ Deployment:", deploymentName);
console.log("➡️ URL:", url);
console.log("➡️ Prompt:", prompt);
console.log("🌍 AZURE_ENDPOINT:", process.env.AZURE_ENDPOINT);

const genderGuard =
  safeGender === "female"
    ? "clearly female, feminine face, no masculine traits"
    : safeGender === "male"
    ? "clearly male, masculine face, no feminine traits"
    : "androgynous fantasy character";
    
const imagePrompt = `
${genderGuard},
${prompt},
fantasy RPG character portrait, highly detailed, centered composition
`;


const payload = {
  model: "gpt-image-1",
  prompt: imagePrompt,
  size: "1024x1024",
};

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": apiKey,
  },
  body: JSON.stringify(payload),
});

const rawText = await response.text();
console.log("📡 STATUS:", response.status);
console.log("🧾 RAW RESPONSE:", rawText || "(empty)");

if (!response.ok) {
  return res.status(response.status).json({
    error: "❌ Image generation failed",
    raw: rawText,
  });
}

if (!rawText) {
  return res.status(500).json({
    error: "❌ Empty response from Azure",
  });
}

let data;
try {
  data = JSON.parse(rawText);
} catch {
  return res.status(500).json({
    error: "❌ Invalid JSON from Azure",
    raw: rawText,
  });
}

const base64Image = data?.data?.[0]?.b64_json;

console.log("📸 Base64 length:", base64Image?.length);

if (!base64Image) {
  return res.status(500).json({
    error: "❌ No image returned",
    raw: data,
  });
}

const imageUrl = `data:image/png;base64,${base64Image}`;

return res.json({ imageUrl });

  } catch (error) {
    console.error("❌ Portrait error:", error);
    return res.status(500).json({
      error: "❌ Portrait generation failed",
      details: error?.message || String(error),
    });
  }
});


app.listen(3001, () => {
  console.log("✅ Server läuft auf http://localhost:3001");
});