export function getRemedy(sign){
  const map = {
    Aries: "Offer red flowers to Hanuman on Tuesday",
    Taurus: "Donate food on Friday",
    Gemini: "Chant Vishnu Sahasranama",
    Cancer: "Milk abhishek to Shiva",
    Leo: "Aditya Hridaya Stotra",
    Virgo: "Serve cows",
    Libra: "Ghee lamp to Lakshmi",
    Scorpio: "Red lentil donation",
    Sagittarius: "Yellow cloth donation",
    Capricorn: "Serve poor on Saturday",
    Aquarius: "Water Peepal tree",
    Pisces: "Gayatri mantra"
  };
  return map[sign] || "Daily prayer advised";
}
