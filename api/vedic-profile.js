import { getVedicMoon } from "../engine/vedicMoon";
import { getNakshatra } from "../engine/nakshatra";
import { getNumerology } from "../engine/numerology";
import { getRemedy } from "../engine/remedy";

export default async function handler(req, res) {

  /* ===============================
     ✅ HARD CORS FIX (ODOO SAFE)
  =============================== */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  /* ✅ Preflight request handle */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /* ❌ Only POST allowed */
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
       🌙 CORE VEDIC ENGINE
    =============================== */
    const moon = getVedicMoon(dob, time);
    const nakshatra = getNakshatra(
      Number(moon.moon_degree)
    );
    const numerology = getNumerology(name, dob);
    const remedy = getRemedy(moon.sign);

    /* ===============================
       ✅ FINAL RESPONSE
    =============================== */
    return res.status(200).json({
      branding: "Astrologer Joydev Sastri",
      name,
      phone,
      zodiac: moon.sign,
      moon_degree: moon.moon_degree,
      nakshatra,
      numerology,
      remedy,
      prediction:
        `${moon.sign} রাশিতে চন্দ্র অবস্থানের ফলে আজ মানসিক স্থিরতা, কর্মপ্রবণতা ও সিদ্ধান্ত গ্রহণের ক্ষমতা বৃদ্ধি পাবে। আত্মবিশ্বাস বজায় রাখলে সাফল্য নিশ্চিত।`
    });

  } catch (err) {
    console.error("Vedic API Error:", err);
    return res.status(500).json({
      error: "Internal astrology engine error"
    });
  }
}
