/* MaitiHub24 Advanced Search: fuzzy spelling + Bangla aliases */
document.addEventListener("DOMContentLoaded", async () => {
  const openBtn = document.getElementById("open-movie-search");
  const panel = document.getElementById("movie-search-panel");
  const closeBtn = document.getElementById("close-movie-search");
  const input = document.getElementById("movie-search-input");
  const results = document.getElementById("movie-search-results");
  if (!openBtn || !panel || !closeBtn || !input || !results) return;

  const aliases = {
    "avengers infinity war": ["অ্যাভেঞ্জার্স ইনফিনিটি ওয়ার"],
    "avengers endgame": ["অ্যাভেঞ্জার্স এন্ডগেম"],
    "the avengers": ["অ্যাভেঞ্জার্স", "দ্য অ্যাভেঞ্জার্স"],
    "spider man": ["স্পাইডারম্যান", "স্পাইডার ম্যান"],
    "spider man no way home": ["স্পাইডারম্যান নো ওয়ে হোম"],
    "loki": ["লোকি"], "doctor strange": ["ডক্টর স্ট্রেঞ্জ"],
    "x men": ["এক্স মেন", "এক্সম্যান"], "black panther": ["ব্ল্যাক প্যান্থার"],
    "deadpool": ["ডেডপুল"], "shang chi": ["শাং চি", "শ্যাং চি"],
    "captain america": ["ক্যাপ্টেন আমেরিকা"], "ramayana": ["রামায়ণ", "রামায়ণ"],
    "toxic": ["টক্সিক"], "thunderbolts": ["থান্ডারবোল্টস"],
    "fantastic four": ["ফ্যান্টাস্টিক ফোর"], "avengers doomsday": ["অ্যাভেঞ্জার্স ডুমসডে"]
  };
  const norm = s => String(s || "").toLocaleLowerCase().normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");

  function distance(a,b) {
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){
      const cur=[i];
      for(let j=1;j<=b.length;j++)
        cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
      prev=cur;
    }
    return prev[b.length];
  }
  function similarity(a,b) {
    if(!a||!b)return 0;
    if(a===b)return 1;
    if(Math.min(a.length,b.length)>=4 && (a.includes(b)||b.includes(a))) return .96;
    return 1-distance(a,b)/Math.max(a.length,b.length);
  }
  function score(movie,q) {
    const title=norm(movie.title), id=norm(movie.id);
    let best=Math.max(similarity(title,q),similarity(id,q));
    const qw=q.split(" "), tw=title.split(" ");
    if(qw.length>1){
      const hit=qw.filter(w=>tw.some(t=>similarity(t,w)>=.58)).length;
      best=Math.max(best,hit/qw.length*.9);
    }
    for(const [en,bn] of Object.entries(aliases)){
      if([en,...bn].map(norm).some(n=>similarity(n,q)>=.72)){
        const key=norm(en);
        if(title.includes(key)||id.includes(key)||key.includes(title))best=.99;
      }
    }
    return best;
  }

  let movies=[];
  try{
    const response=await fetch("/movies.json",{cache:"no-cache"});
    if(!response.ok)throw new Error("movies.json could not be loaded");
    movies=await response.json();
    if(!Array.isArray(movies))throw new Error("movies.json must be an array");
  }catch(error){
    console.error("[MaitiHub24 Search]",error);
    input.placeholder="Search temporarily unavailable";
    return;
  }

  function render(value){
    results.replaceChildren();
    const q=norm(value);
    if(q.length<2)return;
    const found=movies.map(movie=>({movie,score:score(movie,q)}))
      .filter(x=>x.score>=.50).sort((a,b)=>b.score-a.score).slice(0,8);
    if(!found.length){
      const empty=document.createElement("div");
      empty.className="maiti-search-empty";
      const message=document.createElement("p");
      message.textContent="No movies found. Try a different spelling or send a request on WhatsApp. / कोई फिल्म नहीं मिली। कृपया दूसरी स्पेलिंग आज़माएं या WhatsApp पर अनुरोध भेजें। / কোনো সিনেমা পাওয়া যায়নি। অন্য বানানে চেষ্টা করুন অথবা WhatsApp-এ Request পাঠান।";
      const request=document.createElement("a");
      request.className="maiti-search-request";
      request.textContent="Request on WhatsApp";
      request.target="_blank";
      request.rel="noopener noreferrer";
      const requestText = `Hello MaitiHub24, I would like to request this movie: ${String(value).trim()}\nWebsite: MaitiHub24\nPlease let me know if it becomes available through an official/legal source.`;
      request.href="https://wa.me/918967284080?text="+encodeURIComponent(requestText);
      const note=document.createElement("div");
      note.className="maiti-search-request-note";
      note.textContent="Click here 👆Open WhatsApp click send / WhatsApp खुलने पर Send दबाएँ। / WhatsApp খুললে Send চাপুন।";
      empty.append(message,request,note);
      results.append(empty); return;
    }
    if(found[0].score<.88){
      const tip=document.createElement("div");
      tip.className="maiti-search-suggestion";
      tip.textContent="✨ Did you mean: "+found[0].movie.title+"?";
      results.append(tip);
    }
    found.forEach(({movie})=>{
      const a=document.createElement("a");
      a.className="maiti-search-result";
      a.href="/movie/"+encodeURIComponent(movie.id)+"/";
      const img=document.createElement("img");
      img.src="/"+String(movie.image||"").replace(/^\/+/,"");
      img.alt=movie.title||"Movie poster"; img.loading="lazy";
      img.onerror=()=>img.style.visibility="hidden";
      const title=document.createElement("span");
      title.textContent=movie.title||"Untitled movie";
      a.append(img,title); results.append(a);
    });
  }
  function openPanel(){
    panel.hidden=false; document.body.classList.add("maiti-search-open");
    setTimeout(()=>input.focus(),50);
  }
  function closePanel(){
    panel.hidden=true; document.body.classList.remove("maiti-search-open");
    input.value=""; results.replaceChildren();
  }
  openBtn.addEventListener("click",openPanel);
  closeBtn.addEventListener("click",closePanel);
  input.addEventListener("input",()=>render(input.value));
  panel.addEventListener("click",e=>{if(e.target===panel)closePanel();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)closePanel();});
});
