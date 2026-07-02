import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#00B4A2",
  primaryDark: "#008F7F",
  primaryLight: "#E0F7F5",
  primaryMid: "#00CDB8",
  accent: "#FF6B35",
  accentLight: "#FFF0EB",
  gold: "#D4A017",
  goldLight: "#FFF8E7",
  bg: "#F5FAFA",
  card: "#FFFFFF",
  text: "#1A2E2C",
  textMuted: "#5A7875",
  border: "#C5E8E5",
  danger: "#E53E3E",
  success: "#38A169",
  warning: "#D69E2E",
};

const CATEGORIES = [
  { id: "visa", en: "Visa & Immigration", tr: "Vize & Göçmenlik", icon: "🛂" },
  { id: "jobs", en: "Job Opportunities", tr: "İş Fırsatları", icon: "💼" },
  { id: "market", en: "Marketplace", tr: "Pazar Yeri", icon: "🛍️" },
  { id: "edu", en: "Education & Academic Life", tr: "Eğitim & Akademik Yaşam", icon: "🎓" },
  { id: "general", en: "General Chat", tr: "Genel Sohbet", icon: "💬" },
];

const COUNTRIES = [
  "Germany","United States","Netherlands","France","United Kingdom","Austria","Belgium","Switzerland","Sweden","Australia","Canada","Denmark","Norway","Saudi Arabia","UAE","Qatar","Kuwait","Bahrain","Oman","Jordan","Egypt","Algeria","Tunisia","Morocco","Libya","Netherlands","Spain","Italy","Greece","Hungary","Czech Republic","Poland","Romania","Bulgaria","Russia","Kazakhstan","Azerbaijan","Uzbekistan","Georgia","Ukraine","New Zealand","Brazil","Argentina","Japan","South Korea","Singapore","Malaysia","Indonesia","South Africa","Israel","Cyprus"
].sort();

const SAMPLE_TOPICS = {
  germany: {
    visa: [
      { id: 1, title: "Blue Card application process 2024", titleTr: "Mavi Kart başvuru süreci 2024", author: "mehmet_k", replies: 23, views: 412, date: "2025-12-10", pinned: true },
      { id: 2, title: "Family reunification visa timeline", titleTr: "Aile birleşimi vizesi süreci", author: "ayse_d", replies: 11, views: 189, date: "2025-12-08" },
      { id: 3, title: "Niederlassungserlaubnis requirements", titleTr: "Oturma izni gereksinimleri", author: "ibrahim_y", replies: 7, views: 95, date: "2025-12-05" },
    ],
    jobs: [
      { id: 4, title: "Software engineer positions in Berlin", titleTr: "Berlin'de yazılım mühendisi pozisyonları", author: "fatma_s", replies: 15, views: 330, date: "2025-12-09" },
      { id: 5, title: "Nursing jobs in Bavaria", titleTr: "Bavyera'da hemşirelik işleri", author: "hasan_b", replies: 9, views: 201, date: "2025-12-07" },
    ],
    market: [
      { id: 6, title: "Selling Turkish spices and products", titleTr: "Türk baharat ve ürünleri satılık", author: "zeynep_m", replies: 4, views: 78, date: "2025-12-06" },
    ],
    edu: [
      { id: 7, title: "DAAD scholarship experiences", titleTr: "DAAD burs deneyimleri", author: "ali_c", replies: 19, views: 445, date: "2025-12-11" },
      { id: 8, title: "Best universities for medicine in Germany", titleTr: "Almanya'da en iyi tıp üniversiteleri", author: "emine_t", replies: 12, views: 267, date: "2025-12-04" },
    ],
    general: [
      { id: 9, title: "Weekend activities for Turkish families in Frankfurt", titleTr: "Frankfurt'ta Türk aileleri için hafta sonu aktiviteleri", author: "mustafa_a", replies: 31, views: 567, date: "2025-12-12", pinned: true },
      { id: 10, title: "Best Turkish restaurants in Munich", titleTr: "Münih'in en iyi Türk restoranları", author: "selin_k", replies: 18, views: 392, date: "2025-12-03" },
    ],
  },
  usa: {
    visa: [
      { id: 11, title: "H1-B lottery tips 2025", titleTr: "H1-B piyangosunda ipuçları 2025", author: "kemal_y", replies: 44, views: 890, date: "2025-12-10", pinned: true },
      { id: 12, title: "Green card through employer sponsorship", titleTr: "İşveren sponsorluğuyla yeşil kart", author: "burak_s", replies: 27, views: 612, date: "2025-12-07" },
    ],
    jobs: [
      { id: 13, title: "Turkish engineers at FAANG companies", titleTr: "FAANG şirketlerinde Türk mühendisler", author: "ceren_a", replies: 38, views: 755, date: "2025-12-09" },
    ],
    market: [
      { id: 14, title: "Online Turkish grocery stores in US", titleTr: "ABD'de online Türk market mağazaları", author: "deniz_b", replies: 16, views: 340, date: "2025-12-06" },
    ],
    edu: [
      { id: 15, title: "Fulbright scholarship application guide", titleTr: "Fulbright burs başvuru rehberi", author: "neslihan_c", replies: 22, views: 489, date: "2025-12-08" },
    ],
    general: [
      { id: 16, title: "Turkish community centers across the US", titleTr: "ABD genelinde Türk kültür merkezleri", author: "erkan_d", replies: 29, views: 523, date: "2025-12-11" },
    ],
  },
};

const generateTopicsForCountry = (countrySlug) => {
  if (SAMPLE_TOPICS[countrySlug]) return SAMPLE_TOPICS[countrySlug];
  const base = {};
  CATEGORIES.forEach((cat) => {
    base[cat.id] = [
      { id: Math.random(), title: `General ${cat.en} discussion`, titleTr: `Genel ${cat.tr} tartışması`, author: "admin", replies: 0, views: 1, date: "2025-12-01" },
    ];
  });
  return base;
};

const countrySlug = (name) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const countryToSlug = {};
COUNTRIES.forEach((c) => { countryToSlug[c] = countrySlug(c); });
const slugToCountry = {};
COUNTRIES.forEach((c) => { slugToCountry[countrySlug(c)] = c; });

const topicsDb = {};
COUNTRIES.forEach((c) => {
  const slug = countrySlug(c);
  if (slug === "germany") topicsDb[slug] = SAMPLE_TOPICS.germany;
  else if (slug === "united-states") topicsDb[slug] = SAMPLE_TOPICS.usa;
  else topicsDb[slug] = generateTopicsForCountry(slug);
});

const repliesDb = {};
const usersDb = {
  admin: { username: "admin", password: "admin123", role: "admin", joined: "2025-01-01", banned: false, email: "admin@dunyadaturk.com" },
  mehmet_k: { username: "mehmet_k", password: "pass123", role: "user", joined: "2025-03-15", banned: false, email: "mehmet@example.com" },
  ayse_d: { username: "ayse_d", password: "pass123", role: "user", joined: "2025-05-20", banned: false, email: "ayse@example.com" },
};

const i18n = {
  en: {
    siteName: "Dünyada Türk",
    siteTagline: "Turkish Community Around the World",
    selectCountry: "Select Your Country",
    selectPlaceholder: "Choose a country...",
    explore: "Explore Forum",
    categories: "Categories",
    topics: "Topics",
    replies: "Replies",
    views: "Views",
    newTopic: "New Topic",
    reply: "Reply",
    login: "Login",
    register: "Register",
    logout: "Logout",
    username: "Username",
    password: "Password",
    email: "Email",
    admin: "Admin Panel",
    home: "Home",
    back: "Back",
    submit: "Submit",
    cancel: "Cancel",
    pinned: "Pinned",
    by: "by",
    on: "on",
    signUpPrompt: "Sign up to create topics and join the conversation!",
    noTopics: "No topics yet. Be the first to start one!",
    topicTitle: "Topic Title",
    topicContent: "Content",
    memberSince: "Member since",
    role: "Role",
    banned: "Banned",
    active: "Active",
    manage: "Manage",
    users: "Users",
    posts: "Posts",
    countries: "Countries",
    ban: "Ban",
    unban: "Unban",
    delete: "Delete",
    save: "Save",
    welcome: "Welcome",
    manageUsers: "Manage Users",
    managePosts: "Manage Posts",
    manageCountries: "Manage Countries",
    statistics: "Statistics",
    totalUsers: "Total Users",
    totalTopics: "Total Topics",
    totalReplies: "Total Replies",
    activeCountries: "Active Countries",
    confirmDelete: "Are you sure you want to delete this?",
    replyPlaceholder: "Write your reply here...",
    topicPlaceholder: "Describe your topic in detail...",
    language: "English",
    switchLang: "Türkçe",
    forum: "Forum",
    lastPost: "Last Post",
    postedOn: "Posted on",
    alreadyMember: "Already a member?",
    notMember: "Not a member?",
    passwordConfirm: "Confirm Password",
    registerSuccess: "Registration successful! You can now log in.",
    loginError: "Invalid username or password.",
    banMessage: "This user has been banned.",
    postDeleted: "This post has been deleted.",
    adminOnly: "Admin access only.",
    profile: "Profile",
    search: "Search",
    searchPlaceholder: "Search topics...",
    noResults: "No results found.",
    replyCount: (n) => `${n} ${n === 1 ? "reply" : "replies"}`,
  },
  tr: {
    siteName: "Dünyada Türk",
    siteTagline: "Dünyanın Dört Bir Yanındaki Türk Topluluğu",
    selectCountry: "Ülkenizi Seçin",
    selectPlaceholder: "Bir ülke seçin...",
    explore: "Forumu Keşfet",
    categories: "Kategoriler",
    topics: "Konular",
    replies: "Yanıtlar",
    views: "Görüntülemeler",
    newTopic: "Yeni Konu",
    reply: "Yanıtla",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    logout: "Çıkış Yap",
    username: "Kullanıcı Adı",
    password: "Şifre",
    email: "E-posta",
    admin: "Yönetici Paneli",
    home: "Ana Sayfa",
    back: "Geri",
    submit: "Gönder",
    cancel: "İptal",
    pinned: "Sabitlenmiş",
    by: "yazan",
    on: "tarihinde",
    signUpPrompt: "Konu açmak ve sohbete katılmak için kayıt olun!",
    noTopics: "Henüz konu yok. İlk konuyu siz açın!",
    topicTitle: "Konu Başlığı",
    topicContent: "İçerik",
    memberSince: "Üyelik tarihi",
    role: "Rol",
    banned: "Yasaklı",
    active: "Aktif",
    manage: "Yönet",
    users: "Kullanıcılar",
    posts: "Gönderiler",
    countries: "Ülkeler",
    ban: "Yasakla",
    unban: "Yasağı Kaldır",
    delete: "Sil",
    save: "Kaydet",
    welcome: "Hoşgeldiniz",
    manageUsers: "Kullanıcıları Yönet",
    managePosts: "Gönderileri Yönet",
    manageCountries: "Ülkeleri Yönet",
    statistics: "İstatistikler",
    totalUsers: "Toplam Kullanıcı",
    totalTopics: "Toplam Konu",
    totalReplies: "Toplam Yanıt",
    activeCountries: "Aktif Ülkeler",
    confirmDelete: "Bu öğeyi silmek istediğinizden emin misiniz?",
    replyPlaceholder: "Yanıtınızı buraya yazın...",
    topicPlaceholder: "Konunuzu detaylı olarak açıklayın...",
    language: "Türkçe",
    switchLang: "English",
    forum: "Forum",
    lastPost: "Son Gönderi",
    postedOn: "Tarih",
    alreadyMember: "Zaten üye misiniz?",
    notMember: "Üye değil misiniz?",
    passwordConfirm: "Şifreyi Onayla",
    registerSuccess: "Kayıt başarılı! Artık giriş yapabilirsiniz.",
    loginError: "Geçersiz kullanıcı adı veya şifre.",
    banMessage: "Bu kullanıcı yasaklanmıştır.",
    postDeleted: "Bu gönderi silindi.",
    adminOnly: "Sadece yönetici erişimi.",
    profile: "Profil",
    search: "Ara",
    searchPlaceholder: "Konu ara...",
    noResults: "Sonuç bulunamadı.",
    replyCount: (n) => `${n} yanıt`,
  },
};

const S = {
  page: { minHeight: "100vh", background: COLORS.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text },
  nav: { background: COLORS.primary, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, boxShadow: "0 2px 12px rgba(0,180,162,0.25)" },
  navBrand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navBrandText: { color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "-0.3px" },
  navBrandSub: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: -2 },
  navActions: { display: "flex", alignItems: "center", gap: 8 },
  btn: (variant = "primary", size = "md") => ({
    padding: size === "sm" ? "5px 12px" : size === "lg" ? "12px 28px" : "8px 18px",
    fontSize: size === "sm" ? 12 : size === "lg" ? 16 : 14,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.18s",
    background: variant === "primary" ? COLORS.primary : variant === "accent" ? COLORS.accent : variant === "ghost" ? "rgba(255,255,255,0.15)" : variant === "danger" ? COLORS.danger : variant === "outline" ? "transparent" : "#fff",
    color: variant === "outline" ? COLORS.primary : variant === "ghost" || variant === "primary" || variant === "accent" || variant === "danger" ? "#fff" : COLORS.primary,
    border: variant === "outline" ? `1.5px solid ${COLORS.primary}` : "none",
  }),
  card: { background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "20px 24px", marginBottom: 12 },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, color: COLORS.text, background: "#fff", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" },
  textarea: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, color: COLORS.text, background: "#fff", boxSizing: "border-box", outline: "none", minHeight: 120, resize: "vertical", fontFamily: "inherit" },
  label: { fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 4, display: "block" },
  container: { maxWidth: 900, margin: "0 auto", padding: "24px 16px" },
  badge: (color = COLORS.primaryLight, text = COLORS.primaryDark) => ({ background: color, color: text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "inline-block" }),
  heroSection: { background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding: "64px 24px 80px", textAlign: "center" },
  heroTitle: { color: "#fff", fontSize: 42, fontWeight: 800, marginBottom: 8, letterSpacing: "-1px" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 18, marginBottom: 36 },
  catCard: { background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "20px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 },
  topicRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modalBox: { background: "#fff", borderRadius: 16, padding: "28px 28px 24px", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  tableRow: { display: "grid", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` },
  adminSidebar: { width: 200, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "16px 0", height: "fit-content", flexShrink: 0 },
  adminSideItem: (active) => ({ padding: "10px 20px", cursor: "pointer", fontWeight: active ? 700 : 500, color: active ? COLORS.primary : COLORS.textMuted, background: active ? COLORS.primaryLight : "transparent", borderLeft: active ? `3px solid ${COLORS.primary}` : "3px solid transparent", fontSize: 14, transition: "all 0.15s" }),
};

const Flag = ({ country }) => {
  const flags = { "Germany": "🇩🇪", "United States": "🇺🇸", "United Kingdom": "🇬🇧", "France": "🇫🇷", "Netherlands": "🇳🇱", "Switzerland": "🇨🇭", "Austria": "🇦🇹", "Belgium": "🇧🇪", "Sweden": "🇸🇪", "Australia": "🇦🇺", "Canada": "🇨🇦", "Denmark": "🇩🇰", "Norway": "🇳🇴", "Saudi Arabia": "🇸🇦", "UAE": "🇦🇪", "Qatar": "🇶🇦", "Kuwait": "🇰🇼", "Bahrain": "🇧🇭", "Spain": "🇪🇸", "Italy": "🇮🇹", "Greece": "🇬🇷", "Russia": "🇷🇺", "Japan": "🇯🇵", "South Korea": "🇰🇷", "Singapore": "🇸🇬", "Brazil": "🇧🇷", "South Africa": "🇿🇦", "Israel": "🇮🇱", "Cyprus": "🇨🇾", "New Zealand": "🇳🇿" };
  return <span style={{ fontSize: 20 }}>{flags[country] || "🌍"}</span>;
};

let nextTopicId = 100;
let nextReplyId = 100;

export default function App() {
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [topics, setTopics] = useState(topicsDb);
  const [replies, setReplies] = useState({});
  const [users, setUsers] = useState(usersDb);
  const [adminTab, setAdminTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTopic, setNewTopic] = useState({ title: "", content: "" });
  const [newReply, setNewReply] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [countrySearch, setCountrySearch] = useState("");

  const t = i18n[lang];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    const u = users[loginForm.username];
    if (u && u.password === loginForm.password) {
      if (u.banned) { showToast(t.banMessage, "error"); return; }
      setUser(u);
      setModal(null);
      showToast(`${t.welcome}, ${u.username}!`);
    } else {
      showToast(t.loginError, "error");
    }
  };

  const handleRegister = () => {
    if (regForm.password !== regForm.confirm) { showToast("Passwords don't match", "error"); return; }
    if (users[regForm.username]) { showToast("Username already taken", "error"); return; }
    const newUser = { username: regForm.username, email: regForm.email, password: regForm.password, role: "user", joined: new Date().toISOString().slice(0, 10), banned: false };
    setUsers(prev => ({ ...prev, [regForm.username]: newUser }));
    setRegForm({ username: "", email: "", password: "", confirm: "" });
    showToast(t.registerSuccess);
    setModal("login");
  };

  const handleNewTopic = () => {
    if (!newTopic.title.trim()) return;
    const slug = countryToSlug[selectedCountry];
    const catId = selectedCategory.id;
    const topic = { id: nextTopicId++, title: newTopic.title, titleTr: newTopic.title, author: user.username, replies: 0, views: 0, date: new Date().toISOString().slice(0, 10), content: newTopic.content };
    setTopics(prev => ({ ...prev, [slug]: { ...prev[slug], [catId]: [topic, ...(prev[slug]?.[catId] || [])] } }));
    setNewTopic({ title: "", content: "" });
    setModal(null);
    showToast("Topic created!");
  };

  const handleNewReply = () => {
    if (!newReply.trim()) return;
    const topicKey = selectedTopic.id;
    const reply = { id: nextReplyId++, author: user.username, content: newReply, date: new Date().toISOString().slice(0, 10) };
    setReplies(prev => ({ ...prev, [topicKey]: [...(prev[topicKey] || []), reply] }));
    const slug = countryToSlug[selectedCountry];
    const catId = selectedCategory.id;
    setTopics(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [catId]: prev[slug][catId].map(t2 => t2.id === selectedTopic.id ? { ...t2, replies: (t2.replies || 0) + 1 } : t2)
      }
    }));
    setSelectedTopic(prev => ({ ...prev, replies: (prev.replies || 0) + 1 }));
    setNewReply("");
    showToast("Reply posted!");
  };

  const handleDeleteTopic = (topicId, slug, catId) => {
    if (!window.confirm(t.confirmDelete)) return;
    setTopics(prev => ({ ...prev, [slug]: { ...prev[slug], [catId]: prev[slug][catId].filter(t2 => t2.id !== topicId) } }));
    showToast("Topic deleted.");
  };

  const handleBanUser = (username) => {
    setUsers(prev => ({ ...prev, [username]: { ...prev[username], banned: !prev[username].banned } }));
    showToast("User status updated.");
  };

  const countryTopics = selectedCountry ? (topics[countryToSlug[selectedCountry]] || {}) : {};
  const catTopics = selectedCategory ? (countryTopics[selectedCategory.id] || []) : [];
  const filteredTopics = catTopics.filter(t2 => {
    const q = searchQuery.toLowerCase();
    return !q || t2.title.toLowerCase().includes(q) || t2.titleTr?.toLowerCase().includes(q);
  });

  const totalTopicsCount = Object.values(topics).reduce((s, ctry) => s + Object.values(ctry).reduce((s2, ts) => s2 + ts.length, 0), 0);
  const totalRepliesCount = Object.values(replies).reduce((s, rs) => s + rs.length, 0);

  const getTopicTitle = (topic) => lang === "tr" && topic.titleTr ? topic.titleTr : topic.title;

  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navBrand} onClick={() => { setView("home"); setSelectedCountry(null); setSelectedCategory(null); setSelectedTopic(null); }}>
          <span style={{ fontSize: 28 }}>🌙</span>
          <div>
            <div style={S.navBrandText}>{t.siteName}</div>
            <div style={S.navBrandSub}>{t.siteTagline}</div>
          </div>
        </div>
        <div style={S.navActions}>
          <button style={S.btn("ghost", "sm")} onClick={() => setLang(lang === "en" ? "tr" : "en")}>{t.switchLang}</button>
          {user?.role === "admin" && <button style={S.btn("ghost", "sm")} onClick={() => setView("admin")}>⚙️ {t.admin}</button>}
          {user ? (
            <>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>👤 {user.username}</span>
              <button style={S.btn("ghost", "sm")} onClick={() => { setUser(null); setView("home"); }}>{t.logout}</button>
            </>
          ) : (
            <>
              <button style={S.btn("ghost", "sm")} onClick={() => setModal("login")}>{t.login}</button>
              <button style={{ ...S.btn("accent", "sm") }} onClick={() => setModal("register")}>{t.register}</button>
            </>
          )}
        </div>
      </nav>

      {/* BREADCRUMB */}
      {view !== "home" && view !== "admin" && (
        <div style={{ background: COLORS.primaryLight, padding: "8px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, color: COLORS.primaryDark, borderBottom: `1px solid ${COLORS.border}` }}>
          <span style={{ cursor: "pointer", fontWeight: 600 }} onClick={() => { setView("home"); setSelectedCountry(null); setSelectedCategory(null); setSelectedTopic(null); }}>🏠 {t.home}</span>
          {selectedCountry && <>
            <span>›</span>
            <span style={{ cursor: "pointer", fontWeight: 600 }} onClick={() => { setView("country"); setSelectedCategory(null); setSelectedTopic(null); }}>
              <Flag country={selectedCountry} /> {selectedCountry}
            </span>
          </>}
          {selectedCategory && <>
            <span>›</span>
            <span style={{ cursor: "pointer", fontWeight: 600 }} onClick={() => { setView("category"); setSelectedTopic(null); }}>
              {selectedCategory.icon} {lang === "tr" ? selectedCategory.tr : selectedCategory.en}
            </span>
          </>}
          {selectedTopic && <><span>›</span><span style={{ fontWeight: 600, color: COLORS.text, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getTopicTitle(selectedTopic)}</span></>}
        </div>
      )}

      {/* HOME */}
      {view === "home" && (
        <>
          <div style={S.heroSection}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🌙✨</div>
            <h1 style={S.heroTitle}>{t.siteName}</h1>
            <p style={S.heroSub}>{t.siteTagline}</p>
            <div style={{ maxWidth: 480, margin: "0 auto" }}>
              <h2 style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{t.selectCountry}</h2>
              <input
                style={{ ...S.input, marginBottom: 10, fontSize: 15 }}
                placeholder="🔍 Search countries..."
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
              />
              <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 12, maxHeight: 260, overflowY: "auto", border: "none" }}>
                {filteredCountries.map(c => (
                  <div key={c} style={{ padding: "11px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${COLORS.border}`, fontSize: 15, color: COLORS.text, transition: "background 0.15s" }}
                    onClick={() => { setSelectedCountry(c); setView("country"); setSelectedCategory(null); setSelectedTopic(null); setSearchQuery(""); }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.primaryLight}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <Flag country={c} />
                    <span style={{ fontWeight: 500 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ ...S.container }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 8 }}>
              {[{ label: t.totalUsers, value: Object.keys(users).length, icon: "👥" }, { label: t.totalTopics, value: totalTopicsCount, icon: "📝" }, { label: t.totalReplies, value: totalRepliesCount, icon: "💬" }, { label: t.activeCountries, value: COUNTRIES.length, icon: "🌍" }].map(stat => (
                <div key={stat.label} style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "20px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.primary }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* COUNTRY PAGE */}
      {view === "country" && selectedCountry && (
        <div style={S.container}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <Flag country={selectedCountry} />
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{selectedCountry} {t.forum}</h1>
              <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>{t.categories}</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {CATEGORIES.map(cat => {
              const slug = countryToSlug[selectedCountry];
              const ts = topics[slug]?.[cat.id] || [];
              const lastPost = ts[0];
              return (
                <div key={cat.id} style={{ ...S.catCard }} onClick={() => { setSelectedCategory(cat); setView("category"); setSelectedTopic(null); setSearchQuery(""); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.background = COLORS.primaryLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.card; }}>
                  <div style={{ fontSize: 36, width: 56, height: 56, background: COLORS.primaryLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{lang === "tr" ? cat.tr : cat.en}</div>
                    {lastPost && <div style={{ fontSize: 12, color: COLORS.textMuted }}>{t.lastPost}: <span style={{ color: COLORS.primary, fontWeight: 600 }}>{getTopicTitle(lastPost)}</span></div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.primary }}>{ts.length}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.topics}</div>
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: 20 }}>›</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CATEGORY PAGE */}
      {view === "category" && selectedCategory && (
        <div style={S.container}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 32 }}>{selectedCategory.icon}</span>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{lang === "tr" ? selectedCategory.tr : selectedCategory.en}</h1>
            </div>
            {user && <button style={S.btn("primary")} onClick={() => setModal("newTopic")}>+ {t.newTopic}</button>}
          </div>
          {!user && <div style={{ background: COLORS.goldLight, border: `1px solid ${COLORS.gold}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#7A5900" }}>💡 {t.signUpPrompt} <span style={{ cursor: "pointer", fontWeight: 700, textDecoration: "underline" }} onClick={() => setModal("register")}>{t.register}</span></div>}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input style={{ ...S.input }} placeholder={`🔍 ${t.searchPlaceholder}`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16, padding: "10px 20px", background: COLORS.primaryLight, fontSize: 12, fontWeight: 700, color: COLORS.primaryDark, borderBottom: `1px solid ${COLORS.border}` }}>
              <span>{t.topics}</span><span>{t.replies}</span><span>{t.views}</span><span>{t.postedOn}</span>
            </div>
            {filteredTopics.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: COLORS.textMuted }}>{searchQuery ? t.noResults : t.noTopics}</div>
            ) : filteredTopics.map(topic => (
              <div key={topic.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center", cursor: "pointer", transition: "background 0.15s" }}
                onClick={() => { setSelectedTopic(topic); setView("topic"); }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.primaryLight}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div>
                  {topic.pinned && <span style={S.badge(COLORS.goldLight, COLORS.gold)}>📌 {t.pinned}</span>}
                  <div style={{ fontWeight: 600, color: COLORS.text, marginTop: topic.pinned ? 4 : 0 }}>{getTopicTitle(topic)}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{t.by} <span style={{ color: COLORS.primary, fontWeight: 600 }}>@{topic.author}</span></div>
                </div>
                <div style={{ textAlign: "center" }}><span style={{ fontWeight: 700, color: COLORS.text }}>{topic.replies || 0}</span></div>
                <div style={{ textAlign: "center" }}><span style={{ color: COLORS.textMuted, fontSize: 13 }}>{topic.views || 0}</span></div>
                <div style={{ textAlign: "right", fontSize: 12, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{topic.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPIC PAGE */}
      {view === "topic" && selectedTopic && (
        <div style={S.container}>
          <div style={{ ...S.card, marginBottom: 16 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px" }}>{getTopicTitle(selectedTopic)}</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <span style={S.badge(COLORS.primaryLight, COLORS.primaryDark)}>@{selectedTopic.author}</span>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{t.on} {selectedTopic.date}</span>
              {user?.role === "admin" && <button style={{ ...S.btn("danger", "sm"), marginLeft: "auto" }} onClick={() => { if (window.confirm(t.confirmDelete)) { setView("category"); setSelectedTopic(null); showToast("Topic deleted."); } }}>{t.delete}</button>}
            </div>
            {selectedTopic.content && <p style={{ color: COLORS.text, lineHeight: 1.7 }}>{selectedTopic.content}</p>}
          </div>
          {(replies[selectedTopic.id] || []).map(r => (
            <div key={r.id} style={{ ...S.card, display: "flex", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: COLORS.primaryDark, flexShrink: 0 }}>{r.author[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: COLORS.primary }}>@{r.author}</span>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{r.date}</span>
                </div>
                <p style={{ margin: 0, lineHeight: 1.7 }}>{r.content}</p>
              </div>
            </div>
          ))}
          {user ? (
            <div style={S.card}>
              <div style={S.label}>{t.reply}</div>
              <textarea style={S.textarea} placeholder={t.replyPlaceholder} value={newReply} onChange={e => setNewReply(e.target.value)} />
              <button style={{ ...S.btn("primary"), marginTop: 10 }} onClick={handleNewReply}>{t.submit}</button>
            </div>
          ) : (
            <div style={{ background: COLORS.goldLight, border: `1px solid ${COLORS.gold}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: "#7A5900", textAlign: "center" }}>
              {t.signUpPrompt} <span style={{ cursor: "pointer", fontWeight: 700, textDecoration: "underline" }} onClick={() => setModal("login")}>{t.login}</span> {t.alreadyMember ? `· ${t.alreadyMember}` : ""}
            </div>
          )}
        </div>
      )}

      {/* ADMIN PANEL */}
      {view === "admin" && user?.role === "admin" && (
        <div style={{ ...S.container, maxWidth: 1100 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>⚙️ {t.admin}</h1>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={S.adminSidebar}>
              {[["stats", "📊 " + t.statistics], ["users", "👥 " + t.manageUsers], ["posts", "📝 " + t.managePosts], ["countries", "🌍 " + t.manageCountries]].map(([id, label]) => (
                <div key={id} style={S.adminSideItem(adminTab === id)} onClick={() => setAdminTab(id)}>{label}</div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              {adminTab === "stats" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 20 }}>
                    {[{ label: t.totalUsers, value: Object.keys(users).length, icon: "👥", color: COLORS.primary }, { label: t.totalTopics, value: totalTopicsCount, icon: "📝", color: COLORS.accent }, { label: t.totalReplies, value: totalRepliesCount, icon: "💬", color: COLORS.gold }, { label: t.activeCountries, value: COUNTRIES.length, icon: "🌍", color: COLORS.primaryDark }].map(s => (
                      <div key={s.label} style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "20px", display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ fontSize: 32 }}>{s.icon}</div>
                        <div>
                          <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 600 }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={S.card}>
                    <h3 style={{ margin: "0 0 12px", fontWeight: 700 }}>Recent Users</h3>
                    {Object.values(users).slice(0, 5).map(u => (
                      <div key={u.username} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                        <span style={{ fontWeight: 600 }}>@{u.username}</span>
                        <span style={S.badge(u.role === "admin" ? COLORS.primaryLight : u.banned ? "#FED7D7" : "#F0FFF4", u.role === "admin" ? COLORS.primaryDark : u.banned ? COLORS.danger : COLORS.success)}>{u.role === "admin" ? "Admin" : u.banned ? t.banned : t.active}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {adminTab === "users" && (
                <div style={S.card}>
                  <h2 style={{ margin: "0 0 16px", fontWeight: 800 }}>{t.manageUsers}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, padding: "8px 0", borderBottom: `2px solid ${COLORS.border}`, fontWeight: 700, fontSize: 12, color: COLORS.textMuted }}>
                    <span>User</span><span>Role</span><span>Status</span><span>Actions</span>
                  </div>
                  {Object.values(users).map(u => (
                    <div key={u.username} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>@{u.username}</div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted }}>{u.email} · {t.memberSince} {u.joined}</div>
                      </div>
                      <span style={S.badge(COLORS.primaryLight, COLORS.primaryDark)}>{u.role}</span>
                      <span style={S.badge(u.banned ? "#FED7D7" : "#F0FFF4", u.banned ? COLORS.danger : COLORS.success)}>{u.banned ? t.banned : t.active}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {u.username !== "admin" && <button style={S.btn(u.banned ? "primary" : "danger", "sm")} onClick={() => handleBanUser(u.username)}>{u.banned ? t.unban : t.ban}</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {adminTab === "posts" && (
                <div style={S.card}>
                  <h2 style={{ margin: "0 0 16px", fontWeight: 800 }}>{t.managePosts}</h2>
                  {COUNTRIES.slice(0, 8).map(country => {
                    const slug = countryToSlug[country];
                    const ctryTopics = topics[slug] || {};
                    const allTopics = Object.entries(ctryTopics).flatMap(([catId, ts]) => ts.map(t2 => ({ ...t2, catId, country })));
                    if (!allTopics.length) return null;
                    return (
                      <div key={country} style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary, marginBottom: 6 }}><Flag country={country} /> {country}</div>
                        {allTopics.map(topic => (
                          <div key={topic.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: COLORS.bg, borderRadius: 8, marginBottom: 4 }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{topic.title}</span>
                              <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>by @{topic.author} · {topic.date}</span>
                            </div>
                            <button style={S.btn("danger", "sm")} onClick={() => handleDeleteTopic(topic.id, slug, topic.catId)}>{t.delete}</button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              {adminTab === "countries" && (
                <div style={S.card}>
                  <h2 style={{ margin: "0 0 16px", fontWeight: 800 }}>{t.manageCountries}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {COUNTRIES.map(c => {
                      const slug = countryToSlug[c];
                      const total = Object.values(topics[slug] || {}).reduce((s, ts) => s + ts.length, 0);
                      return (
                        <div key={c} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: COLORS.bg, borderRadius: 8 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}><Flag country={c} />{c}</span>
                          <span style={S.badge(COLORS.primaryLight, COLORS.primaryDark)}>{total} {t.topics}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal === "login" && (
        <div style={S.modal} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={S.modalBox}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800 }}>🔑 {t.login}</h2>
            <label style={S.label}>{t.username}</label>
            <input style={{ ...S.input, marginBottom: 12 }} value={loginForm.username} onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <label style={S.label}>{t.password}</label>
            <input style={{ ...S.input, marginBottom: 20 }} type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btn("primary"), flex: 1 }} onClick={handleLogin}>{t.login}</button>
              <button style={S.btn("outline")} onClick={() => setModal(null)}>{t.cancel}</button>
            </div>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: COLORS.textMuted }}>{t.notMember} <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 700 }} onClick={() => setModal("register")}>{t.register}</span></p>
            <p style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, marginTop: 8 }}>Demo admin: admin / admin123</p>
          </div>
        </div>
      )}
      {modal === "register" && (
        <div style={S.modal} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={S.modalBox}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800 }}>✨ {t.register}</h2>
            <label style={S.label}>{t.username}</label>
            <input style={{ ...S.input, marginBottom: 10 }} value={regForm.username} onChange={e => setRegForm(p => ({ ...p, username: e.target.value }))} />
            <label style={S.label}>{t.email}</label>
            <input style={{ ...S.input, marginBottom: 10 }} type="email" value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} />
            <label style={S.label}>{t.password}</label>
            <input style={{ ...S.input, marginBottom: 10 }} type="password" value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} />
            <label style={S.label}>{t.passwordConfirm}</label>
            <input style={{ ...S.input, marginBottom: 20 }} type="password" value={regForm.confirm} onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))} />
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btn("primary"), flex: 1 }} onClick={handleRegister}>{t.register}</button>
              <button style={S.btn("outline")} onClick={() => setModal(null)}>{t.cancel}</button>
            </div>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: COLORS.textMuted }}>{t.alreadyMember} <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 700 }} onClick={() => setModal("login")}>{t.login}</span></p>
          </div>
        </div>
      )}
      {modal === "newTopic" && (
        <div style={S.modal} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={{ ...S.modalBox, maxWidth: 560 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800 }}>📝 {t.newTopic}</h2>
            <label style={S.label}>{t.topicTitle}</label>
            <input style={{ ...S.input, marginBottom: 12 }} value={newTopic.title} onChange={e => setNewTopic(p => ({ ...p, title: e.target.value }))} />
            <label style={S.label}>{t.topicContent}</label>
            <textarea style={{ ...S.textarea, marginBottom: 20 }} placeholder={t.topicPlaceholder} value={newTopic.content} onChange={e => setNewTopic(p => ({ ...p, content: e.target.value }))} />
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btn("primary"), flex: 1 }} onClick={handleNewTopic}>{t.submit}</button>
              <button style={S.btn("outline")} onClick={() => setModal(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? COLORS.danger : COLORS.success, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", animation: "fadeIn 0.3s" }}>
          {toast.type === "error" ? "❌ " : "✅ "}{toast.msg}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: COLORS.primaryDark, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "24px", marginTop: 48, fontSize: 13 }}>
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 16, marginBottom: 4 }}>🌙 Dünyada Türk</div>
        <div>Dünyanın her köşesindeki Türkleri birleştiriyoruz · Connecting Turks around the world</div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>© 2025 Dünyada Türk. All rights reserved.</div>
      </footer>
    </div>
  );
}
