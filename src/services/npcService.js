export async function generateNpcRequest({
  race,
  npcClass,
  subclass,
  background,
  specialTrait,
}) {
  console.log("📡 Anfrage wird gesendet...", {
    race,
    npcClass,
    subclass,
    background,
    specialTrait,
  });

  const response = await fetch("http://localhost:3001/api/npc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      race,
      npcClass,
      subclass,
      background,
      specialTrait,
    }),
  });

  const data = await response.json();

  console.log("✅ Backend Antwort:", data);

  return data;
}