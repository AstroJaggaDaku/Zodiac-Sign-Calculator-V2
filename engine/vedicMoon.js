// ---------- Helpers ----------
function norm(d){ return ((d % 360) + 360) % 360; }

function lahiriAyanamsa(year){
  return 23.85 + (year - 2000) * 0.013;
}

function julianDay(y,m,d,h){
  if(m<=2){ y--; m+=12; }
  const A=Math.floor(y/100);
  const B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))
    +Math.floor(30.6001*(m+1))
    +d+B-1524.5+h/24;
}

function moonLongitude(jd){
  const T=(jd-2451545)/36525;
  let L=218.3164477+481267.88123421*T;
  let M=134.9633964+477198.8675055*T;
  let D=297.8501921+445267.1114034*T;

  L+=6.289*Math.sin(M*Math.PI/180);
  L-=1.274*Math.sin((2*D-M)*Math.PI/180);
  L+=0.658*Math.sin(2*D*Math.PI/180);

  return norm(L);
}

// ---------- MAIN ----------
export function getVedicMoon(dob,time){
  const [Y,M,D]=dob.split("-").map(Number);
  const [hh,mm]=time.split(":").map(Number);

  const utcHour=hh+mm/60-5.5; // IST → UTC
  const jd=julianDay(Y,M,D,utcHour);

  const tropical=moonLongitude(jd);
  const sidereal=norm(tropical-lahiriAyanamsa(Y));

  const signs=[
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];

  const sign=signs[Math.floor(sidereal/30)];

  return {
    sign,
    moon_degree:sidereal.toFixed(2)
  };
}
