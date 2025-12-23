export function getNumerology(name, dob) {
  const n = name.toUpperCase().replace(/[^A-Z]/g,"");
  const map = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
               J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
               S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};

  let nameNum = [...n].reduce((s,c)=>s+(map[c]||0),0);
  while (nameNum > 9) nameNum = [...String(nameNum)].reduce((a,b)=>a+ +b,0);

  let lifePath = dob.replace(/-/g,"").split("").reduce((a,b)=>a+ +b,0);
  while (lifePath > 9) lifePath = [...String(lifePath)].reduce((a,b)=>a+ +b,0);

  return { name_number: nameNum, life_path: lifePath };
}
