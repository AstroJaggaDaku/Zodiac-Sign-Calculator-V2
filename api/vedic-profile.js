import { getVedicMoon } from "../engine/vedicMoon";
import { getNakshatra } from "../engine/nakshatra";
import { getNumerology } from "../engine/numerology";
import { getRemedy } from "../engine/remedy";

/* ✅ GOOGLE SHEET WEB APP (FINAL) */
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzGcWsEmjYNdosIoaOZJ3dXuhuc3M2iacvhp-gUkdSD5nVwGdEqzlyUsSQmlQ2ZfEW_/exec";

export default async function handler(req, res) {

  /* ===============================
     ✅ HARD CORS FIX (ODOO SAFE)
  =============================== */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  /* ✅ PREFLIGHT */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    /* ===============================
       ✅ SAFE BODY PARSE
    =============================== */
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const { name, phone, dob, time } = body || {};

    if (!name || !phone || !dob || !time) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    /* ===============================
       🌙 VEDIC CALCULATION (VERCEL)
    =============================== */
    const moon = getVedicMoon(dob, time);
    const nakshatra = getNakshatra(
      Number(moon.moon_degree)
    );
    const numerology = getNumerology(name, dob);
    const remedy = getRemedy(moon.sign);

    /* ===============================
       📄 GOOGLE SHEET SAVE (SILENT)
       ❗ UI কখনো block হবে না
    =============================== */
    fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        dob,
        time,
        zodiac: moon.sign,
        moon_degree: moon.moon_degree,
        nakshatra,
        name_number: numerology.name_number,
        life_path: numerology.life_path,
        source: "Odoo – 51kalibari"
      })
    }).catch(() => {});

    /* ===============================
       ✅ FINAL RESPONSE (ONLY JSON)
    =============================== */
    return res.status(200).json({
      branding: "Astrologer Joydev Sastri",
      zodiac: moon.sign,
      moon_degree: moon.moon_degree,
      nakshatra,
      numerology,
      remedy,
      prediction:
        `${moon.sign} রাশিতে চন্দ্র অবস্থান জাতকের মানসিক শক্তি, কর্মপ্রবণতা ও সিদ্ধান্ত গ্রহণে গভীর প্রভাব ফেলে। ধৈর্য ও আত্মবিশ্বাস বজায় রাখলে সাফল্য নিশ্চিত।`
    });

  } catch (err) {
    console.error("Vedic Engine Error:", err);
    return res.status(500).json({
      error: "Internal astrology engine error"
    });
  }
}


