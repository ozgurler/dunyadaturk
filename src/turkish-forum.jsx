import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COLORS = {
  primary: "#00B4A2",
  primaryDark: "#008F7F",
  primaryLight: "#E0F7F5",
  accent: "#FF6B35",
  gold: "#D4A017",
  goldLight: "#FFF8E7",
  bg: "#F5FAFA",
  card: "#FFFFFF",
  text: "#1A2E2C",
  textMuted: "#5A7875",
  border: "#C5E8E5",
  danger: "#E53E3E",
  success: "#38A169",
};

const CATEGORIES = [
  { id: "visa",    en: "Visa & Immigration",        tr: "Vize & Göçmenlik",          icon: "🛂" },
  { id: "jobs",    en: "Job Opportunities",          tr: "İş Fırsatları",             icon: "💼" },
  { id: "market",  en: "Marketplace",               tr: "Pazar Yeri",                icon: "🛍️" },
  { id: "edu",     en: "Education & Academic Life",  tr: "Eğitim & Akademik Yaşam",  icon: "🎓" },
  { id: "general", en: "General Chat",              tr: "Genel Sohbet",              icon: "💬" },
];

const COUNTRIES = [
  "Algeria","Argentina","Australia","Austria","Azerbaijan","Bahrain","Belgium","Brazil",
  "Bulgaria","Canada","Cyprus","Czech Republic","Denmark","Egypt","France","Georgia",
  "Germany","Greece","Hungary","Indonesia","Israel","Italy","Japan","Jordan","Kazakhstan",
  "Kuwait","Libya","Malaysia","Morocco","Netherlands","New Zealand","Norway","Oman",
  "Poland","Qatar","Romania","Russia","Saudi Arabia","Singapore","South Africa","South Korea",
  "Spain","Sweden","Switzerland","Tunisia","UAE","Ukraine","United Kingdom","United States","Uzbekistan"
].sort();

const slug = (name) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const FLAGS = {
  "Germany":"🇩🇪","United States":"🇺🇸","United Kingdom":"🇬🇧","France":"🇫🇷",
  "Netherlands":"🇳🇱","Switzerland":"🇨🇭","Austria":"🇦🇹","Belgium":"🇧🇪",
  "Sweden":"🇸🇪","Australia":"🇦🇺","Canada":"🇨🇦","Denmark":"🇩🇰","Norway":"🇳🇴",
  "Saudi Arabia":"🇸🇦","UAE":"🇦🇪","Qatar":"🇶🇦","Kuwait":"🇰🇼","Bahrain":"🇧🇭",
  "Spain":"🇪🇸","Italy":"🇮🇹","Greece":"🇬🇷","Russia":"🇷🇺","Japan":"🇯🇵",
  "South Korea":"🇰🇷","Singapore":"🇸🇬","Brazil":"🇧🇷","South Africa":"🇿🇦",
  "Israel":"🇮🇱","Cyprus":"🇨🇾","New Zealand":"🇳🇿","Poland":"🇵🇱","Romania":"🇷🇴",
  "Hungary":"🇭🇺","Czech Republic":"🇨🇿","Bulgaria":"🇧🇬","Ukraine":"🇺🇦",
  "Georgia":"🇬🇪","Azerbaijan":"🇦🇿","Kazakhstan":"🇰🇿","Uzbekistan":"🇺🇿",
  "Egypt":"🇪🇬","Morocco":"🇲🇦","Algeria":"🇩🇿","Tunisia":"🇹🇳","Libya":"🇱🇾",
  "Jordan":"🇯🇴","Oman":"🇴🇲","Indonesia":"🇮🇩","Malaysia":"🇲🇾","Argentina":"🇦🇷",
};

const i18n = {
  en: {
    siteName:"Dünyada Türk", siteTagline:"Turkish Community Around the World",
    selectCountry:"Select Your Country", explore:"Explore Forum",
    categories:"Categories", topics:"Topics", replies:"Replies", views:"Views",
    newTopic:"New Topic", reply:"Reply", login:"Login", register:"Register", logout:"Logout",
    username:"Username", password:"Password", email:"Email", admin:"Admin Panel",
    home:"Home", submit:"Submit", cancel:"Cancel", pinned:"Pinned", by:"by", on:"on",
    signUpPrompt:"Sign up to create topics and join the conversation!",
    noTopics:"No topics yet. Be the first to start one!", topicTitle:"Topic Title",
    topicContent:"Content", memberSince:"Member since", role:"Role", banned:"Banned",
    active:"Active", ban:"Ban", unban:"Unban", delete:"Delete", welcome:"Welcome",
    manageUsers:"Manage Users", managePosts:"Manage Posts", manageCountries:"Manage Countries",
    statistics:"Statistics", totalUsers:"Total Users", totalTopics:"Total Topics",
    totalReplies:"Total Replies", activeCountries:"Active Countries",
    confirmDelete:"Are you sure you want to delete this?",
    replyPlaceholder:"Write your reply here...", topicPlaceholder:"Describe your topic in detail...",
    switchLang:"Türkçe", forum:"Forum", lastPost:"Last Post", postedOn:"Posted on",
    alreadyMember:"Already a member?", notMember:"Not a member?", passwordConfirm:"Confirm Password",
    registerSuccess:"Registration successful! You can now log in.",
    loginError:"Invalid email or password.", banMessage:"Your account has been banned.",
    searchPlaceholder:"Search topics...", noResults:"No results found.", loading:"Loading...",
    passwordMismatch:"Passwords do not match.", emailRequired:"Please enter a valid email.",
  },
  tr: {
    siteName:"Dünyada Türk", siteTagline:"Dünyanın Dört Bir Yanındaki Türk Topluluğu",
    selectCountry:"Ülkenizi Seçin", explore:"Forumu Keşfet",
    categories:"Kategoriler", topics:"Konular", replies:"Yanıtlar", views:"Görüntülemeler",
    newTopic:"Yeni Konu", reply:"Yanıtla", login:"Giriş Yap", register:"Kayıt Ol", logout:"Çıkış Yap",
    username:"Kullanıcı Adı", password:"Şifre", email:"E-posta", admin:"Yönetici Paneli",
    home:"Ana Sayfa", submit:"Gönder", cancel:"İptal", pinned:"Sabitlenmiş", by:"yazan", on:"tarihinde",
    signUpPrompt:"Konu açmak ve sohbete katılmak için kayıt olun!",
    noTopics:"Henüz konu yok. İlk konuyu siz açın!", topicTitle:"Konu Başlığı",
    topicContent:"İçerik", memberSince:"Üyelik tarihi", role:"Rol", banned:"Yasaklı",
    active:"Aktif", ban:"Yasakla", unban:"Yasağı Kaldır", delete:"Sil", welcome:"Hoşgeldiniz",
    manageUsers:"Kullanıcıları Yönet", managePosts:"Gönderileri Yönet", manageCountries:"Ülkeleri Yönet",
    statistics:"İstatistikler", totalUsers:"Toplam Kullanıcı", totalTopics:"Toplam Konu",
    totalReplies:"Toplam Yanıt", activeCountries:"Aktif Ülkeler",
    confirmDelete:"Bu öğeyi silmek istediğinizden emin misiniz?",
    replyPlaceholder:"Yanıtınızı buraya yazın...", topicPlaceholder:"Konunuzu detaylı olarak açıklayın...",
    switchLang:"English", forum:"Forum", lastPost:"Son Gönderi", postedOn:"Tarih",
    alreadyMember:"Zaten üye misiniz?", notMember:"Üye değil misiniz?", passwordConfirm:"Şifreyi Onayla",
    registerSuccess:"Kayıt başarılı! Artık giriş yapabilirsiniz.",
    loginError:"Geçersiz e-posta veya şifre.", banMessage:"Hesabınız yasaklanmıştır.",
    searchPlaceholder:"Konu ara...", noResults:"Sonuç bulunamadı.", loading:"Yükleniyor...",
    passwordMismatch:"Şifreler eşleşmiyor.", emailRequired:"Geçerli bir e-posta giriniz.",
  },
};

const S = {
  page:{ minHeight:"100vh", background:COLORS.bg, fontFamily:"'Segoe UI',system-ui,sans-serif", color:COLORS.text },
  nav:{ background:COLORS.primary, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, boxShadow:"0 2px 12px rgba(0,180,162,0.25)" },
  navBrand:{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" },
  navBrandText:{ color:"#fff", fontWeight:700, fontSize:20, letterSpacing:"-0.3px" },
  navBrandSub:{ color:"rgba(255,255,255,0.75)", fontSize:11, marginTop:-2 },
  navActions:{ display:"flex", alignItems:"center", gap:8 },
  btn:(v="primary",sz="md")=>({
    padding:sz==="sm"?"5px 12px":sz==="lg"?"12px 28px":"8px 18px",
    fontSize:sz==="sm"?12:sz==="lg"?16:14, borderRadius:8, cursor:"pointer", fontWeight:600, transition:"all 0.18s",
    background:v==="primary"?COLORS.primary:v==="accent"?COLORS.accent:v==="ghost"?"rgba(255,255,255,0.15)":v==="danger"?COLORS.danger:v==="outline"?"transparent":"#fff",
    color:v==="outline"?COLORS.primary:v==="ghost"||v==="primary"||v==="accent"||v==="danger"?"#fff":COLORS.primary,
    border:v==="outline"?`1.5px solid ${COLORS.primary}`:"none",
  }),
  card:{ background:COLORS.card, borderRadius:12, border:`1px solid ${COLORS.border}`, padding:"20px 24px", marginBottom:12 },
  input:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:14, color:COLORS.text, background:"#fff", boxSizing:"border-box", outline:"none" },
  textarea:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:14, color:COLORS.text, background:"#fff", boxSizing:"border-box", outline:"none", minHeight:120, resize:"vertical", fontFamily:"inherit" },
  label:{ fontSize:13, fontWeight:600, color:COLORS.textMuted, marginBottom:4, display:"block" },
  container:{ maxWidth:900, margin:"0 auto", padding:"24px 16px" },
  badge:(bg=COLORS.primaryLight,tx=COLORS.primaryDark)=>({ background:bg, color:tx, padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-block" }),
  heroSection:{ background:`linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding:"64px 24px 80px", textAlign:"center" },
  heroTitle:{ color:"#fff", fontSize:42, fontWeight:800, marginBottom:8, letterSpacing:"-1px" },
  heroSub:{ color:"rgba(255,255,255,0.85)", fontSize:18, marginBottom:36 },
  catCard:{ background:COLORS.card, borderRadius:14, border:`1px solid ${COLORS.border}`, padding:"20px", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:14 },
  modal:{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 },
  modalBox:{ background:"#fff", borderRadius:16, padding:"28px 28px 24px", maxWidth:480, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
  adminSidebar:{ width:200, background:COLORS.card, borderRadius:12, border:`1px solid ${COLORS.border}`, padding:"16px 0", height:"fit-content", flexShrink:0 },
  adminSideItem:(a)=>({ padding:"10px 20px", cursor:"pointer", fontWeight:a?700:500, color:a?COLORS.primary:COLORS.textMuted, background:a?COLORS.primaryLight:"transparent", borderLeft:a?`3px solid ${COLORS.primary}`:"3px solid transparent", fontSize:14, transition:"all 0.15s" }),
};

const Flag = ({ country }) => <span style={{fontSize:20}}>{FLAGS[country]||"🌍"}</span>;

const Spinner = () => (
  <div style={{textAlign:"center",padding:40,color:COLORS.textMuted}}>
    <div style={{fontSize:28,marginBottom:8}}>⏳</div>Loading...
  </div>
);

export default function App() {
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [topics, setTopics] = useState([]);
  const [replies, setReplies] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({ users:0, topics:0, replies:0 });
  const [adminTab, setAdminTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTopic, setNewTopic] = useState({ title:"", content:"" });
  const [newReply, setNewReply] = useState("");
  const [loginForm, setLoginForm] = useState({ email:"", password:"" });
  const [regForm, setRegForm] = useState({ username:"", email:"", password:"", confirm:"" });
  const [countrySearch, setCountrySearch] = useState("");

  const t = i18n[lang];

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data:{ session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch stats for homepage
  useEffect(() => { fetchStats(); }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
  };

  const fetchStats = async () => {
    const [{ count:uc }, { count:tc }, { count:rc }] = await Promise.all([
      supabase.from("profiles").select("*", { count:"exact", head:true }),
      supabase.from("topics").select("*", { count:"exact", head:true }),
      supabase.from("replies").select("*", { count:"exact", head:true }),
    ]);
    setStats({ users:uc||0, topics:tc||0, replies:rc||0 });
  };

  const fetchTopics = async (country, category) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("topics")
      .select("*, profiles(username)")
      .eq("country", country)
      .eq("category", category)
      .order("pinned", { ascending:false })
      .order("created_at", { ascending:false });
    if (!error) setTopics(data || []);
    setLoading(false);
  };

  const fetchCategoryTopicCounts = async (country) => {
    const { data } = await supabase
      .from("topics")
      .select("category")
      .eq("country", country);
    return data || [];
  };

  const fetchReplies = async (topicId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("replies")
      .select("*, profiles(username)")
      .eq("topic_id", topicId)
      .order("created_at", { ascending:true });
    if (!error) setReplies(data || []);
    setLoading(false);
  };

  const fetchAllUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending:false });
    setAllUsers(data || []);
  };

  // AUTH
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email:loginForm.email, password:loginForm.password });
    if (error) { showToast(t.loginError, "error"); }
    else { setModal(null); setLoginForm({ email:"", password:"" }); showToast(`${t.welcome}!`); }
  };

  const handleRegister = async () => {
    if (regForm.password !== regForm.confirm) { showToast(t.passwordMismatch, "error"); return; }
    if (!regForm.email.includes("@")) { showToast(t.emailRequired, "error"); return; }
    const { data, error } = await supabase.auth.signUp({ email:regForm.email, password:regForm.password });
    if (error) { showToast(error.message, "error"); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id:data.user.id, username:regForm.username, email:regForm.email, role:"user", banned:false });
    }
    setRegForm({ username:"", email:"", password:"", confirm:"" });
    setModal(null);
    showToast(t.registerSuccess);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setView("home");
  };

  // TOPICS
  const handleNewTopic = async () => {
    if (!newTopic.title.trim()) return;
    const { error } = await supabase.from("topics").insert({
      title: newTopic.title,
      title_tr: newTopic.title,
      content: newTopic.content,
      author_id: user.id,
      country: selectedCountry,
      category: selectedCategory.id,
      pinned: false,
      views: 0,
    });
    if (error) { showToast(error.message, "error"); return; }
    setNewTopic({ title:"", content:"" });
    setModal(null);
    showToast("Topic created!");
    fetchTopics(selectedCountry, selectedCategory.id);
    fetchStats();
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm(t.confirmDelete)) return;
    await supabase.from("replies").delete().eq("topic_id", topicId);
    await supabase.from("topics").delete().eq("id", topicId);
    showToast("Topic deleted.");
    fetchTopics(selectedCountry, selectedCategory.id);
    fetchStats();
    setView("category");
    setSelectedTopic(null);
  };

  const handleViewTopic = async (topic) => {
    setSelectedTopic(topic);
    setView("topic");
    await supabase.from("topics").update({ views:(topic.views||0)+1 }).eq("id", topic.id);
    fetchReplies(topic.id);
  };

  // REPLIES
  const handleNewReply = async () => {
    if (!newReply.trim()) return;
    const { error } = await supabase.from("replies").insert({
      topic_id: selectedTopic.id,
      author_id: user.id,
      content: newReply,
    });
    if (error) { showToast(error.message, "error"); return; }
    // update reply count on topic
    await supabase.from("topics").update({ replies:(selectedTopic.replies||0)+1 }).eq("id", selectedTopic.id);
    setNewReply("");
    showToast("Reply posted!");
    fetchReplies(selectedTopic.id);
    fetchStats();
  };

  // ADMIN
  const handleBanUser = async (userId, currentBanned) => {
    await supabase.from("profiles").update({ banned:!currentBanned }).eq("id", userId);
    showToast("User status updated.");
    fetchAllUsers();
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm(t.confirmDelete)) return;
    await supabase.from("replies").delete().eq("id", replyId);
    showToast("Reply deleted.");
    fetchReplies(selectedTopic.id);
    fetchStats();
  };

  const handlePinTopic = async (topicId, currentPinned) => {
    await supabase.from("topics").update({ pinned:!currentPinned }).eq("id", topicId);
    showToast(currentPinned ? "Topic unpinned." : "Topic pinned!");
    fetchTopics(selectedCountry, selectedCategory?.id);
  };

  const getTopicTitle = (topic) => lang === "tr" && topic.title_tr ? topic.title_tr : topic.title;
  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));
  const filteredTopics = topics.filter(tp => {
    const q = searchQuery.toLowerCase();
    return !q || tp.title?.toLowerCase().includes(q) || tp.title_tr?.toLowerCase().includes(q);
  });

  const goHome = () => { setView("home"); setSelectedCountry(null); setSelectedCategory(null); setSelectedTopic(null); fetchStats(); };
  const goCountry = () => { setView("country"); setSelectedCategory(null); setSelectedTopic(null); };
  const goCategory = () => { setView("category"); setSelectedTopic(null); };

  const isAdmin = profile?.role === "admin";

  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navBrand} onClick={goHome}>
          <span style={{fontSize:28}}>🌙</span>
          <div>
            <div style={S.navBrandText}>{t.siteName}</div>
            <div style={S.navBrandSub}>{t.siteTagline}</div>
          </div>
        </div>
        <div style={S.navActions}>
          <button style={S.btn("ghost","sm")} onClick={() => setLang(lang==="en"?"tr":"en")}>{t.switchLang}</button>
          {isAdmin && <button style={S.btn("ghost","sm")} onClick={() => { setView("admin"); fetchAllUsers(); fetchStats(); }}>⚙️ {t.admin}</button>}
          {user ? (
            <>
              <span style={{color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:600}}>👤 {profile?.username || user.email}</span>
              <button style={S.btn("ghost","sm")} onClick={handleLogout}>{t.logout}</button>
            </>
          ) : (
            <>
              <button style={S.btn("ghost","sm")} onClick={() => setModal("login")}>{t.login}</button>
              <button style={S.btn("accent","sm")} onClick={() => setModal("register")}>{t.register}</button>
            </>
          )}
        </div>
      </nav>

      {/* BREADCRUMB */}
      {view !== "home" && view !== "admin" && (
        <div style={{background:COLORS.primaryLight,padding:"8px 24px",fontSize:13,display:"flex",alignItems:"center",gap:6,color:COLORS.primaryDark,borderBottom:`1px solid ${COLORS.border}`}}>
          <span style={{cursor:"pointer",fontWeight:600}} onClick={goHome}>🏠 {t.home}</span>
          {selectedCountry && <><span>›</span><span style={{cursor:"pointer",fontWeight:600}} onClick={goCountry}><Flag country={selectedCountry}/> {selectedCountry}</span></>}
          {selectedCategory && <><span>›</span><span style={{cursor:"pointer",fontWeight:600}} onClick={goCategory}>{selectedCategory.icon} {lang==="tr"?selectedCategory.tr:selectedCategory.en}</span></>}
          {selectedTopic && <><span>›</span><span style={{fontWeight:600,color:COLORS.text,maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{getTopicTitle(selectedTopic)}</span></>}
        </div>
      )}

      {/* HOME */}
      {view === "home" && (
        <>
          <div style={S.heroSection}>
            <div style={{fontSize:56,marginBottom:12}}>🌙✨</div>
            <h1 style={S.heroTitle}>{t.siteName}</h1>
            <p style={S.heroSub}>{t.siteTagline}</p>
            <div style={{maxWidth:480,margin:"0 auto"}}>
              <h2 style={{color:"rgba(255,255,255,0.9)",fontSize:16,fontWeight:600,marginBottom:12}}>{t.selectCountry}</h2>
              <input style={{...S.input,marginBottom:10,fontSize:15}} placeholder="🔍 Search countries..." value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
              <div style={{background:"rgba(255,255,255,0.95)",borderRadius:12,maxHeight:260,overflowY:"auto"}}>
                {filteredCountries.map(c=>(
                  <div key={c} style={{padding:"11px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${COLORS.border}`,fontSize:15,color:COLORS.text,transition:"background 0.15s"}}
                    onClick={()=>{setSelectedCountry(c);setView("country");setSelectedCategory(null);setSelectedTopic(null);setSearchQuery("");}}
                    onMouseEnter={e=>e.currentTarget.style.background=COLORS.primaryLight}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Flag country={c}/><span style={{fontWeight:500}}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={S.container}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginTop:8}}>
              {[{label:t.totalUsers,value:stats.users,icon:"👥"},{label:t.totalTopics,value:stats.topics,icon:"📝"},{label:t.totalReplies,value:stats.replies,icon:"💬"},{label:t.activeCountries,value:COUNTRIES.length,icon:"🌍"}].map(s=>(
                <div key={s.label} style={{background:COLORS.card,borderRadius:12,border:`1px solid ${COLORS.border}`,padding:"20px 24px",textAlign:"center"}}>
                  <div style={{fontSize:32,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontSize:28,fontWeight:800,color:COLORS.primary}}>{s.value}</div>
                  <div style={{fontSize:13,color:COLORS.textMuted,fontWeight:600}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* COUNTRY PAGE */}
      {view === "country" && selectedCountry && (
        <CountryPage
          country={selectedCountry} t={t} lang={lang} S={S} COLORS={COLORS}
          CATEGORIES={CATEGORIES} slug={slug}
          onSelectCategory={(cat)=>{setSelectedCategory(cat);setView("category");setSelectedTopic(null);setSearchQuery("");fetchTopics(selectedCountry,cat.id);}}
          supabase={supabase}
        />
      )}

      {/* CATEGORY PAGE */}
      {view === "category" && selectedCategory && (
        <div style={S.container}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:32}}>{selectedCategory.icon}</span>
              <h1 style={{fontSize:24,fontWeight:800,margin:0}}>{lang==="tr"?selectedCategory.tr:selectedCategory.en}</h1>
            </div>
            {user && <button style={S.btn("primary")} onClick={()=>setModal("newTopic")}>+ {t.newTopic}</button>}
          </div>
          {!user && <div style={{background:COLORS.goldLight,border:`1px solid ${COLORS.gold}`,borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:14,color:"#7A5900"}}>💡 {t.signUpPrompt} <span style={{cursor:"pointer",fontWeight:700,textDecoration:"underline"}} onClick={()=>setModal("register")}>{t.register}</span></div>}
          <input style={{...S.input,marginBottom:16}} placeholder={`🔍 ${t.searchPlaceholder}`} value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:16,padding:"10px 20px",background:COLORS.primaryLight,fontSize:12,fontWeight:700,color:COLORS.primaryDark,borderBottom:`1px solid ${COLORS.border}`}}>
              <span>{t.topics}</span><span>{t.replies}</span><span>{t.views}</span><span>{t.postedOn}</span>
            </div>
            {loading ? <Spinner/> : filteredTopics.length === 0 ? (
              <div style={{padding:"32px",textAlign:"center",color:COLORS.textMuted}}>{searchQuery?t.noResults:t.noTopics}</div>
            ) : filteredTopics.map(topic=>(
              <div key={topic.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:16,padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,alignItems:"center",cursor:"pointer",transition:"background 0.15s"}}
                onClick={()=>handleViewTopic(topic)}
                onMouseEnter={e=>e.currentTarget.style.background=COLORS.primaryLight}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  {topic.pinned && <span style={S.badge(COLORS.goldLight,COLORS.gold)}>📌 {t.pinned}</span>}
                  <div style={{fontWeight:600,color:COLORS.text,marginTop:topic.pinned?4:0}}>{getTopicTitle(topic)}</div>
                  <div style={{fontSize:12,color:COLORS.textMuted,marginTop:2}}>{t.by} <span style={{color:COLORS.primary,fontWeight:600}}>@{topic.profiles?.username||"user"}</span></div>
                </div>
                <div style={{textAlign:"center"}}><span style={{fontWeight:700}}>{topic.replies||0}</span></div>
                <div style={{textAlign:"center"}}><span style={{color:COLORS.textMuted,fontSize:13}}>{topic.views||0}</span></div>
                <div style={{textAlign:"right",fontSize:12,color:COLORS.textMuted,whiteSpace:"nowrap"}}>{topic.created_at?.slice(0,10)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPIC PAGE */}
      {view === "topic" && selectedTopic && (
        <div style={S.container}>
          <div style={{...S.card,marginBottom:16}}>
            <h1 style={{fontSize:22,fontWeight:800,margin:"0 0 12px"}}>{getTopicTitle(selectedTopic)}</h1>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <span style={S.badge(COLORS.primaryLight,COLORS.primaryDark)}>@{selectedTopic.profiles?.username||"user"}</span>
              <span style={{fontSize:12,color:COLORS.textMuted}}>{t.on} {selectedTopic.created_at?.slice(0,10)}</span>
              {isAdmin && (
                <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  <button style={S.btn(selectedTopic.pinned?"primary":"outline","sm")} onClick={()=>handlePinTopic(selectedTopic.id,selectedTopic.pinned)}>
                    {selectedTopic.pinned?"📌 Unpin":"📌 Pin"}
                  </button>
                  <button style={S.btn("danger","sm")} onClick={()=>handleDeleteTopic(selectedTopic.id)}>{t.delete}</button>
                </div>
              )}
            </div>
            {selectedTopic.content && <p style={{color:COLORS.text,lineHeight:1.7,margin:0}}>{selectedTopic.content}</p>}
          </div>
          {loading ? <Spinner/> : replies.map(r=>(
            <div key={r.id} style={{...S.card,display:"flex",gap:14}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:COLORS.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:COLORS.primaryDark,flexShrink:0}}>
                {(r.profiles?.username||"U")[0].toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontWeight:700,color:COLORS.primary}}>@{r.profiles?.username||"user"}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,color:COLORS.textMuted}}>{r.created_at?.slice(0,10)}</span>
                    {isAdmin && <button style={S.btn("danger","sm")} onClick={()=>handleDeleteReply(r.id)}>{t.delete}</button>}
                  </div>
                </div>
                <p style={{margin:0,lineHeight:1.7}}>{r.content}</p>
              </div>
            </div>
          ))}
          {user ? (
            <div style={S.card}>
              <div style={S.label}>{t.reply}</div>
              <textarea style={S.textarea} placeholder={t.replyPlaceholder} value={newReply} onChange={e=>setNewReply(e.target.value)}/>
              <button style={{...S.btn("primary"),marginTop:10}} onClick={handleNewReply}>{t.submit}</button>
            </div>
          ) : (
            <div style={{background:COLORS.goldLight,border:`1px solid ${COLORS.gold}`,borderRadius:10,padding:"14px 18px",fontSize:14,color:"#7A5900",textAlign:"center"}}>
              {t.signUpPrompt} <span style={{cursor:"pointer",fontWeight:700,textDecoration:"underline"}} onClick={()=>setModal("login")}>{t.login}</span>
            </div>
          )}
        </div>
      )}

      {/* ADMIN PANEL */}
      {view === "admin" && isAdmin && (
        <div style={{...S.container,maxWidth:1100}}>
          <h1 style={{fontSize:26,fontWeight:800,marginBottom:20}}>⚙️ {t.admin}</h1>
          <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
            <div style={S.adminSidebar}>
              {[["stats","📊 "+t.statistics],["users","👥 "+t.manageUsers],["posts","📝 "+t.managePosts],["countries","🌍 "+t.manageCountries]].map(([id,label])=>(
                <div key={id} style={S.adminSideItem(adminTab===id)} onClick={()=>{ setAdminTab(id); if(id==="users")fetchAllUsers(); if(id==="stats")fetchStats(); }}>{label}</div>
              ))}
            </div>
            <div style={{flex:1}}>
              {adminTab==="stats" && (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:20}}>
                    {[{label:t.totalUsers,value:stats.users,icon:"👥",color:COLORS.primary},{label:t.totalTopics,value:stats.topics,icon:"📝",color:COLORS.accent},{label:t.totalReplies,value:stats.replies,icon:"💬",color:COLORS.gold},{label:t.activeCountries,value:COUNTRIES.length,icon:"🌍",color:COLORS.primaryDark}].map(s=>(
                      <div key={s.label} style={{background:COLORS.card,borderRadius:12,border:`1px solid ${COLORS.border}`,padding:"20px",display:"flex",gap:16,alignItems:"center"}}>
                        <div style={{fontSize:32}}>{s.icon}</div>
                        <div>
                          <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div>
                          <div style={{fontSize:13,color:COLORS.textMuted,fontWeight:600}}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={S.card}>
                    <h3 style={{margin:"0 0 12px",fontWeight:700}}>Recent Users</h3>
                    {allUsers.slice(0,5).map(u=>(
                      <div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                        <div><span style={{fontWeight:600}}>@{u.username}</span> <span style={{fontSize:12,color:COLORS.textMuted}}>{u.email}</span></div>
                        <span style={S.badge(u.role==="admin"?COLORS.primaryLight:u.banned?"#FED7D7":"#F0FFF4",u.role==="admin"?COLORS.primaryDark:u.banned?COLORS.danger:COLORS.success)}>{u.role==="admin"?"Admin":u.banned?t.banned:t.active}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {adminTab==="users" && (
                <div style={S.card}>
                  <h2 style={{margin:"0 0 16px",fontWeight:800}}>{t.manageUsers}</h2>
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:12,padding:"8px 0",borderBottom:`2px solid ${COLORS.border}`,fontWeight:700,fontSize:12,color:COLORS.textMuted}}>
                    <span>User</span><span>Role</span><span>Status</span><span>Actions</span>
                  </div>
                  {allUsers.map(u=>(
                    <div key={u.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:12,padding:"12px 0",borderBottom:`1px solid ${COLORS.border}`,alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:600}}>@{u.username}</div>
                        <div style={{fontSize:12,color:COLORS.textMuted}}>{u.email} · {t.memberSince} {u.created_at?.slice(0,10)}</div>
                      </div>
                      <span style={S.badge(COLORS.primaryLight,COLORS.primaryDark)}>{u.role}</span>
                      <span style={S.badge(u.banned?"#FED7D7":"#F0FFF4",u.banned?COLORS.danger:COLORS.success)}>{u.banned?t.banned:t.active}</span>
                      <div style={{display:"flex",gap:6}}>
                        {u.role!=="admin" && (
                          <button style={S.btn(u.banned?"primary":"danger","sm")} onClick={()=>handleBanUser(u.id,u.banned)}>{u.banned?t.unban:t.ban}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {adminTab==="posts" && (
                <AdminPostsTab supabase={supabase} S={S} COLORS={COLORS} COUNTRIES={COUNTRIES} slug={slug} t={t} FLAGS={FLAGS} onDelete={async(id,country,cat)=>{ if(!window.confirm(t.confirmDelete))return; await supabase.from("replies").delete().eq("topic_id",id); await supabase.from("topics").delete().eq("id",id); showToast("Deleted."); fetchStats(); }}/>
              )}
              {adminTab==="countries" && (
                <AdminCountriesTab supabase={supabase} S={S} COLORS={COLORS} COUNTRIES={COUNTRIES} FLAGS={FLAGS} t={t}/>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {modal==="login" && (
        <div style={S.modal} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={S.modalBox}>
            <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800}}>🔑 {t.login}</h2>
            <label style={S.label}>{t.email}</label>
            <input style={{...S.input,marginBottom:12}} type="email" value={loginForm.email} onChange={e=>setLoginForm(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            <label style={S.label}>{t.password}</label>
            <input style={{...S.input,marginBottom:20}} type="password" value={loginForm.password} onChange={e=>setLoginForm(p=>({...p,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("primary"),flex:1}} onClick={handleLogin}>{t.login}</button>
              <button style={S.btn("outline")} onClick={()=>setModal(null)}>{t.cancel}</button>
            </div>
            <p style={{textAlign:"center",marginTop:16,fontSize:13,color:COLORS.textMuted}}>{t.notMember} <span style={{color:COLORS.primary,cursor:"pointer",fontWeight:700}} onClick={()=>setModal("register")}>{t.register}</span></p>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {modal==="register" && (
        <div style={S.modal} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={S.modalBox}>
            <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800}}>✨ {t.register}</h2>
            <label style={S.label}>{t.username}</label>
            <input style={{...S.input,marginBottom:10}} value={regForm.username} onChange={e=>setRegForm(p=>({...p,username:e.target.value}))}/>
            <label style={S.label}>{t.email}</label>
            <input style={{...S.input,marginBottom:10}} type="email" value={regForm.email} onChange={e=>setRegForm(p=>({...p,email:e.target.value}))}/>
            <label style={S.label}>{t.password}</label>
            <input style={{...S.input,marginBottom:10}} type="password" value={regForm.password} onChange={e=>setRegForm(p=>({...p,password:e.target.value}))}/>
            <label style={S.label}>{t.passwordConfirm}</label>
            <input style={{...S.input,marginBottom:20}} type="password" value={regForm.confirm} onChange={e=>setRegForm(p=>({...p,confirm:e.target.value}))}/>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("primary"),flex:1}} onClick={handleRegister}>{t.register}</button>
              <button style={S.btn("outline")} onClick={()=>setModal(null)}>{t.cancel}</button>
            </div>
            <p style={{textAlign:"center",marginTop:16,fontSize:13,color:COLORS.textMuted}}>{t.alreadyMember} <span style={{color:COLORS.primary,cursor:"pointer",fontWeight:700}} onClick={()=>setModal("login")}>{t.login}</span></p>
          </div>
        </div>
      )}

      {/* NEW TOPIC MODAL */}
      {modal==="newTopic" && (
        <div style={S.modal} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{...S.modalBox,maxWidth:560}}>
            <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800}}>📝 {t.newTopic}</h2>
            <label style={S.label}>{t.topicTitle}</label>
            <input style={{...S.input,marginBottom:12}} value={newTopic.title} onChange={e=>setNewTopic(p=>({...p,title:e.target.value}))}/>
            <label style={S.label}>{t.topicContent}</label>
            <textarea style={{...S.textarea,marginBottom:20}} placeholder={t.topicPlaceholder} value={newTopic.content} onChange={e=>setNewTopic(p=>({...p,content:e.target.value}))}/>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("primary"),flex:1}} onClick={handleNewTopic}>{t.submit}</button>
              <button style={S.btn("outline")} onClick={()=>setModal(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,background:toast.type==="error"?COLORS.danger:COLORS.success,color:"#fff",padding:"12px 20px",borderRadius:10,fontWeight:600,fontSize:14,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
          {toast.type==="error"?"❌ ":"✅ "}{toast.msg}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{background:COLORS.primaryDark,color:"rgba(255,255,255,0.7)",textAlign:"center",padding:"24px",marginTop:48,fontSize:13}}>
        <div style={{fontWeight:700,color:"#fff",fontSize:16,marginBottom:4}}>🌙 Dünyada Türk</div>
        <div>Dünyanın her köşesindeki Türkleri birleştiriyoruz · Connecting Turks around the world</div>
        <div style={{marginTop:8,fontSize:11,opacity:0.6}}>© 2025 Dünyada Türk · dunyadaturk.com</div>
      </footer>
    </div>
  );
}

// Country page with live per-category counts
function CountryPage({ country, t, lang, S, COLORS, CATEGORIES, slug, onSelectCategory, supabase }) {
  const [counts, setCounts] = useState({});
  const [lastPosts, setLastPosts] = useState({});
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("topics").select("category, title, title_tr, created_at").eq("country", country).order("created_at",{ascending:false});
      if (!data) return;
      const c = {}; const lp = {};
      data.forEach(r => {
        c[r.category] = (c[r.category]||0)+1;
        if (!lp[r.category]) lp[r.category] = r;
      });
      setCounts(c); setLastPosts(lp);
    };
    load();
  }, [country]);

  return (
    <div style={S.container}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <span style={{fontSize:32}}>{FLAGS[country]||"🌍"}</span>
        <div>
          <h1 style={{fontSize:28,fontWeight:800,margin:0}}>{country} {t.forum}</h1>
          <p style={{color:COLORS.textMuted,margin:0,fontSize:14}}>{t.categories}</p>
        </div>
      </div>
      <div style={{display:"grid",gap:12}}>
        {CATEGORIES.map(cat=>(
          <div key={cat.id} style={S.catCard}
            onClick={()=>onSelectCategory(cat)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=COLORS.primary;e.currentTarget.style.background=COLORS.primaryLight;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=COLORS.border;e.currentTarget.style.background=COLORS.card;}}>
            <div style={{fontSize:36,width:56,height:56,background:COLORS.primaryLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cat.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:16,marginBottom:2}}>{lang==="tr"?cat.tr:cat.en}</div>
              {lastPosts[cat.id] && <div style={{fontSize:12,color:COLORS.textMuted}}>{t.lastPost}: <span style={{color:COLORS.primary,fontWeight:600}}>{lang==="tr"&&lastPosts[cat.id].title_tr?lastPosts[cat.id].title_tr:lastPosts[cat.id].title}</span></div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:700,fontSize:18,color:COLORS.primary}}>{counts[cat.id]||0}</div>
              <div style={{fontSize:11,color:COLORS.textMuted}}>{t.topics}</div>
            </div>
            <div style={{color:COLORS.textMuted,fontSize:20}}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Posts Tab
function AdminPostsTab({ supabase, S, COLORS, COUNTRIES, slug, t, FLAGS, onDelete }) {
  const [posts, setPosts] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  useEffect(() => { load(); }, [filterCountry]);
  const load = async () => {
    let q = supabase.from("topics").select("*, profiles(username)").order("created_at",{ascending:false}).limit(50);
    if (filterCountry) q = q.eq("country", filterCountry);
    const { data } = await q;
    setPosts(data||[]);
  };
  return (
    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h2 style={{margin:0,fontWeight:800}}>{t.managePosts}</h2>
        <select style={{...S.input,width:"auto",padding:"6px 12px"}} value={filterCountry} onChange={e=>setFilterCountry(e.target.value)}>
          <option value="">All Countries</option>
          {COUNTRIES.map(c=><option key={c} value={c}>{FLAGS[c]||"🌍"} {c}</option>)}
        </select>
      </div>
      {posts.map(p=>(
        <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:COLORS.bg,borderRadius:8,marginBottom:6}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:13}}>{p.title}</div>
            <div style={{fontSize:11,color:COLORS.textMuted}}>@{p.profiles?.username} · {p.country} · {p.category} · {p.created_at?.slice(0,10)}</div>
          </div>
          <button style={S.btn("danger","sm")} onClick={()=>onDelete(p.id,p.country,p.category).then(()=>load())}>{t.delete}</button>
        </div>
      ))}
      {posts.length===0 && <div style={{textAlign:"center",color:COLORS.textMuted,padding:24}}>No posts found.</div>}
    </div>
  );
}

// Admin Countries Tab
function AdminCountriesTab({ supabase, S, COLORS, COUNTRIES, FLAGS, t }) {
  const [counts, setCounts] = useState({});
  useEffect(()=>{
    supabase.from("topics").select("country").then(({data})=>{
      const c={};
      (data||[]).forEach(r=>{c[r.country]=(c[r.country]||0)+1;});
      setCounts(c);
    });
  },[]);
  return (
    <div style={S.card}>
      <h2 style={{margin:"0 0 16px",fontWeight:800}}>{t.manageCountries}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
        {COUNTRIES.map(c=>(
          <div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:COLORS.bg,borderRadius:8}}>
            <span style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:500}}><span>{FLAGS[c]||"🌍"}</span>{c}</span>
            <span style={S.badge(COLORS.primaryLight,COLORS.primaryDark)}>{counts[c]||0} {t.topics}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
