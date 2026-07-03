import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COLORS = {
  primary:"#00B4A2", primaryDark:"#008F7F", primaryLight:"#E0F7F5",
  accent:"#FF6B35", gold:"#D4A017", goldLight:"#FFF8E7",
  bg:"#F5FAFA", card:"#FFFFFF", text:"#1A2E2C", textMuted:"#5A7875",
  border:"#C5E8E5", danger:"#E53E3E", success:"#38A169", warning:"#D69E2E",
};

const CATEGORIES = [
  { id:"visa",   en:"Visa & Immigration",       tr:"Vize & Göçmenlik",         icon:"🛂" },
  { id:"jobs",   en:"Job Opportunities",         tr:"İş Fırsatları",            icon:"💼" },
  { id:"market", en:"Marketplace",               tr:"Pazar Yeri",               icon:"🛍️" },
  { id:"edu",    en:"Education & Academic Life", tr:"Eğitim & Akademik Yaşam", icon:"🎓" },
  { id:"general",en:"General Chat",              tr:"Genel Sohbet",             icon:"💬" },
];

// Countries with Turkish translations
const COUNTRIES = [
  { en:"Algeria",        tr:"Cezayir" },
  { en:"Argentina",      tr:"Arjantin" },
  { en:"Australia",      tr:"Avustralya" },
  { en:"Austria",        tr:"Avusturya" },
  { en:"Azerbaijan",     tr:"Azerbaycan" },
  { en:"Bahrain",        tr:"Bahreyn" },
  { en:"Belgium",        tr:"Belçika" },
  { en:"Brazil",         tr:"Brezilya" },
  { en:"Bulgaria",       tr:"Bulgaristan" },
  { en:"Canada",         tr:"Kanada" },
  { en:"Cyprus",         tr:"Kıbrıs" },
  { en:"Czech Republic", tr:"Çek Cumhuriyeti" },
  { en:"Denmark",        tr:"Danimarka" },
  { en:"Egypt",          tr:"Mısır" },
  { en:"France",         tr:"Fransa" },
  { en:"Georgia",        tr:"Gürcistan" },
  { en:"Germany",        tr:"Almanya" },
  { en:"Greece",         tr:"Yunanistan" },
  { en:"Hungary",        tr:"Macaristan" },
  { en:"Indonesia",      tr:"Endonezya" },
  { en:"Israel",         tr:"İsrail" },
  { en:"Italy",          tr:"İtalya" },
  { en:"Japan",          tr:"Japonya" },
  { en:"Jordan",         tr:"Ürdün" },
  { en:"Kazakhstan",     tr:"Kazakistan" },
  { en:"Kuwait",         tr:"Kuveyt" },
  { en:"Libya",          tr:"Libya" },
  { en:"Malaysia",       tr:"Malezya" },
  { en:"Morocco",        tr:"Fas" },
  { en:"Netherlands",    tr:"Hollanda" },
  { en:"New Zealand",    tr:"Yeni Zelanda" },
  { en:"Norway",         tr:"Norveç" },
  { en:"Oman",           tr:"Umman" },
  { en:"Poland",         tr:"Polonya" },
  { en:"Qatar",          tr:"Katar" },
  { en:"Romania",        tr:"Romanya" },
  { en:"Russia",         tr:"Rusya" },
  { en:"Saudi Arabia",   tr:"Suudi Arabistan" },
  { en:"Singapore",      tr:"Singapur" },
  { en:"South Africa",   tr:"Güney Afrika" },
  { en:"South Korea",    tr:"Güney Kore" },
  { en:"Spain",          tr:"İspanya" },
  { en:"Sweden",         tr:"İsveç" },
  { en:"Switzerland",    tr:"İsviçre" },
  { en:"Tunisia",        tr:"Tunus" },
  { en:"UAE",            tr:"BAE" },
  { en:"Ukraine",        tr:"Ukrayna" },
  { en:"United Kingdom", tr:"Birleşik Krallık" },
  { en:"United States",  tr:"Amerika Birleşik Devletleri" },
  { en:"Uzbekistan",     tr:"Özbekistan" },
].sort((a,b)=>a.en.localeCompare(b.en));

const COUNTRY_NAMES_EN = COUNTRIES.map(c=>c.en);

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
  en:{
    siteName:"Dünyada Türk", siteTagline:"Turkish Community Around the World",
    selectCountry:"Select Your Country", categories:"Categories", topics:"Topics",
    replies:"Replies", views:"Views", newTopic:"New Topic", reply:"Reply",
    login:"Login", register:"Register", logout:"Logout", username:"Username",
    password:"Password", email:"Email", admin:"Admin Panel", home:"Home",
    submit:"Submit", cancel:"Cancel", save:"Save Changes", pinned:"Pinned",
    by:"by", on:"on", signUpPrompt:"Sign up to create topics and join the conversation!",
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
    edit:"Edit", editTopic:"Edit Topic", pin:"Pin", unpin:"Unpin",
    topicTitleTr:"Topic Title (Turkish)", saved:"Saved successfully!",
    filterCountry:"Filter by country", filterCategory:"Filter by category",
    allCountries:"All Countries", allCategories:"All Categories",
    countryActive:"Active", countryInactive:"Hidden",
    topicsCount:"Topics", makeAdmin:"Make Admin", removeAdmin:"Remove Admin",
    confirmBan:"Are you sure you want to ban this user?",
    confirmMakeAdmin:"Are you sure you want to make this user an admin?",
    insertImage:"Insert Image", insertLink:"Insert Link", linkUrl:"Link URL",
    linkText:"Link Text", imageUrl:"Image URL", imageAlt:"Alt text (optional)",
  },
  tr:{
    siteName:"Dünyada Türk", siteTagline:"Dünyanın Dört Bir Yanındaki Türk Topluluğu",
    selectCountry:"Ülkenizi Seçin", categories:"Kategoriler", topics:"Konular",
    replies:"Yanıtlar", views:"Görüntülemeler", newTopic:"Yeni Konu", reply:"Yanıtla",
    login:"Giriş Yap", register:"Kayıt Ol", logout:"Çıkış Yap", username:"Kullanıcı Adı",
    password:"Şifre", email:"E-posta", admin:"Yönetici Paneli", home:"Ana Sayfa",
    submit:"Gönder", cancel:"İptal", save:"Değişiklikleri Kaydet", pinned:"Sabitlenmiş",
    by:"yazan", on:"tarihinde", signUpPrompt:"Konu açmak ve sohbete katılmak için kayıt olun!",
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
    edit:"Düzenle", editTopic:"Konuyu Düzenle", pin:"Sabitle", unpin:"Sabitlemeyi Kaldır",
    topicTitleTr:"Konu Başlığı (Türkçe)", saved:"Başarıyla kaydedildi!",
    filterCountry:"Ülkeye göre filtrele", filterCategory:"Kategoriye göre filtrele",
    allCountries:"Tüm Ülkeler", allCategories:"Tüm Kategoriler",
    countryActive:"Aktif", countryInactive:"Gizli",
    topicsCount:"Konu", makeAdmin:"Admin Yap", removeAdmin:"Admin'i Kaldır",
    confirmBan:"Bu kullanıcıyı yasaklamak istediğinizden emin misiniz?",
    confirmMakeAdmin:"Bu kullanıcıyı admin yapmak istediğinizden emin misiniz?",
    insertImage:"Resim Ekle", insertLink:"Bağlantı Ekle", linkUrl:"Bağlantı URL",
    linkText:"Bağlantı Metni", imageUrl:"Resim URL", imageAlt:"Alt metin (opsiyonel)",
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
    background:v==="primary"?COLORS.primary:v==="accent"?COLORS.accent:v==="ghost"?"rgba(255,255,255,0.15)":v==="danger"?COLORS.danger:v==="warning"?COLORS.warning:v==="success"?COLORS.success:v==="outline"?"transparent":v==="toolbar"?"#f0f0f0":"#fff",
    color:v==="outline"?COLORS.primary:v==="toolbar"?COLORS.text:["ghost","primary","accent","danger","warning","success"].includes(v)?"#fff":COLORS.primary,
    border:v==="outline"?`1.5px solid ${COLORS.primary}`:v==="toolbar"?`1px solid #ddd`:"none",
  }),
  card:{ background:COLORS.card, borderRadius:12, border:`1px solid ${COLORS.border}`, padding:"20px 24px", marginBottom:12 },
  input:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:14, color:COLORS.text, background:"#fff", boxSizing:"border-box", outline:"none" },
  textarea:{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:14, color:COLORS.text, background:"#fff", boxSizing:"border-box", outline:"none", minHeight:120, resize:"vertical", fontFamily:"inherit" },
  select:{ padding:"8px 12px", borderRadius:8, border:`1.5px solid ${COLORS.border}`, fontSize:13, color:COLORS.text, background:"#fff", cursor:"pointer", outline:"none" },
  label:{ fontSize:13, fontWeight:600, color:COLORS.textMuted, marginBottom:4, display:"block" },
  container:{ maxWidth:900, margin:"0 auto", padding:"24px 16px" },
  badge:(bg=COLORS.primaryLight,tx=COLORS.primaryDark)=>({ background:bg, color:tx, padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-block" }),
  heroSection:{ background:`linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, padding:"64px 24px 80px", textAlign:"center" },
  heroTitle:{ color:"#fff", fontSize:42, fontWeight:800, marginBottom:8, letterSpacing:"-1px" },
  heroSub:{ color:"rgba(255,255,255,0.85)", fontSize:18, marginBottom:36 },
  catCard:{ background:COLORS.card, borderRadius:14, border:`1px solid ${COLORS.border}`, padding:"20px", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:14 },
  modal:{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 },
  modalBox:{ background:"#fff", borderRadius:16, padding:"28px 28px 24px", maxWidth:520, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" },
  adminSidebar:{ width:210, background:COLORS.card, borderRadius:12, border:`1px solid ${COLORS.border}`, padding:"16px 0", height:"fit-content", flexShrink:0 },
  adminSideItem:(a)=>({ padding:"10px 20px", cursor:"pointer", fontWeight:a?700:500, color:a?COLORS.primary:COLORS.textMuted, background:a?COLORS.primaryLight:"transparent", borderLeft:a?`3px solid ${COLORS.primary}`:"3px solid transparent", fontSize:14, transition:"all 0.15s" }),
  th:{ padding:"10px 12px", textAlign:"left", fontSize:12, fontWeight:700, color:COLORS.textMuted, borderBottom:`2px solid ${COLORS.border}`, background:COLORS.primaryLight },
  td:{ padding:"10px 12px", fontSize:13, borderBottom:`1px solid ${COLORS.border}`, verticalAlign:"middle" },
};

const Flag = ({country}) => <span style={{fontSize:18}}>{FLAGS[country]||"🌍"}</span>;
const Spinner = () => <div style={{textAlign:"center",padding:40,color:COLORS.textMuted,fontSize:24}}>⏳</div>;

// ─── RICH TEXT EDITOR ────────────────────────────────────────────────────────
function RichEditor({ value, onChange, placeholder, minHeight=160 }) {
  const editorRef = useRef(null);
  const [linkModal, setLinkModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [linkForm, setLinkForm] = useState({ url:"", text:"" });
  const [imgForm, setImgForm] = useState({ url:"", alt:"" });
  const savedRange = useRef(null);

  // Sync external value changes (e.g. clearing form)
  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreRange = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  };

  const exec = (cmd, val=null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    triggerChange();
  };

  const triggerChange = () => {
    if (onChange) onChange(editorRef.current?.innerHTML || "");
  };

  const insertLink = () => {
    restoreRange();
    if (!linkForm.url) return;
    const text = linkForm.text || linkForm.url;
    const html = `<a href="${linkForm.url}" target="_blank" rel="noopener" style="color:#00B4A2;text-decoration:underline;">${text}</a>`;
    document.execCommand("insertHTML", false, html);
    setLinkModal(false);
    setLinkForm({ url:"", text:"" });
    triggerChange();
  };

  const insertImage = () => {
    restoreRange();
    if (!imgForm.url) return;
    const html = `<img src="${imgForm.url}" alt="${imgForm.alt||""}" style="max-width:100%;border-radius:8px;margin:8px 0;display:block;" />`;
    document.execCommand("insertHTML", false, html);
    setImgModal(false);
    setImgForm({ url:"", alt:"" });
    triggerChange();
  };

  const toolbarBtns = [
    { label:"B",  title:"Bold",          cmd:()=>exec("bold"),           style:{fontWeight:"bold"} },
    { label:"I",  title:"Italic",        cmd:()=>exec("italic"),         style:{fontStyle:"italic"} },
    { label:"U",  title:"Underline",     cmd:()=>exec("underline"),      style:{textDecoration:"underline"} },
    { label:"S",  title:"Strikethrough", cmd:()=>exec("strikeThrough"),  style:{textDecoration:"line-through"} },
    { label:"H2", title:"Heading",       cmd:()=>exec("formatBlock","h3"),style:{fontWeight:"bold",fontSize:12} },
    { label:"≡",  title:"Bullet list",   cmd:()=>exec("insertUnorderedList"), style:{fontSize:16} },
    { label:"1.", title:"Numbered list", cmd:()=>exec("insertOrderedList"),   style:{fontSize:12} },
    { label:"«»", title:"Quote",         cmd:()=>exec("formatBlock","blockquote"), style:{fontSize:13} },
    { label:"—",  title:"Horizontal rule",cmd:()=>exec("insertHorizontalRule"), style:{} },
  ];

  return (
    <div style={{ border:`1.5px solid ${COLORS.border}`, borderRadius:10, overflow:"hidden", background:"#fff" }}>
      {/* Toolbar */}
      <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:3, padding:"8px 10px", borderBottom:`1px solid ${COLORS.border}`, background:"#f8fffe" }}>
        {toolbarBtns.map(btn => (
          <button key={btn.label} title={btn.title} onMouseDown={e=>{e.preventDefault();saveRange();btn.cmd();}}
            style={{ ...S.btn("toolbar","sm"), minWidth:30, padding:"4px 8px", ...btn.style }}>
            {btn.label}
          </button>
        ))}
        <div style={{ width:1, height:22, background:COLORS.border, margin:"0 4px" }}/>
        {/* Text color */}
        <label title="Text color" style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:3, ...S.btn("toolbar","sm"), padding:"4px 8px" }}>
          <span style={{ fontSize:13 }}>A</span>
          <input type="color" defaultValue="#000000" style={{ width:16, height:16, border:"none", padding:0, cursor:"pointer", background:"none" }}
            onChange={e=>{saveRange();exec("foreColor",e.target.value);}} />
        </label>
        {/* Highlight */}
        <label title="Highlight" style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:3, ...S.btn("toolbar","sm"), padding:"4px 8px" }}>
          <span style={{ fontSize:13 }}>🖍</span>
          <input type="color" defaultValue="#ffff00" style={{ width:16, height:16, border:"none", padding:0, cursor:"pointer", background:"none" }}
            onChange={e=>{saveRange();exec("hiliteColor",e.target.value);}} />
        </label>
        <div style={{ width:1, height:22, background:COLORS.border, margin:"0 4px" }}/>
        {/* Link */}
        <button title="Insert link" onMouseDown={e=>{e.preventDefault();saveRange();setLinkModal(true);}}
          style={{ ...S.btn("toolbar","sm"), padding:"4px 8px" }}>🔗</button>
        {/* Image */}
        <button title="Insert image" onMouseDown={e=>{e.preventDefault();saveRange();setImgModal(true);}}
          style={{ ...S.btn("toolbar","sm"), padding:"4px 8px" }}>🖼️</button>
        <div style={{ width:1, height:22, background:COLORS.border, margin:"0 4px" }}/>
        {/* Align */}
        {[["◀","justifyLeft"],["≡","justifyCenter"],["▶","justifyRight"]].map(([lbl,cmd])=>(
          <button key={cmd} title={cmd} onMouseDown={e=>{e.preventDefault();saveRange();exec(cmd);}}
            style={{ ...S.btn("toolbar","sm"), padding:"4px 8px" }}>{lbl}</button>
        ))}
        <div style={{ marginLeft:"auto" }}>
          <button title="Clear formatting" onMouseDown={e=>{e.preventDefault();exec("removeFormat");}}
            style={{ ...S.btn("toolbar","sm"), padding:"4px 8px", fontSize:11, color:COLORS.danger }}>✕ Clear</button>
        </div>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerChange}
        onBlur={triggerChange}
        data-placeholder={placeholder||"Write here..."}
        style={{
          minHeight, padding:"14px 16px", outline:"none", fontSize:14, lineHeight:1.75,
          color:COLORS.text, wordBreak:"break-word",
        }}
        dangerouslySetInnerHTML={value && value !== (editorRef.current?.innerHTML||"") ? undefined : undefined}
      />

      {/* Link modal */}
      {linkModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}
          onClick={e=>{if(e.target===e.currentTarget)setLinkModal(false);}}>
          <div style={{ background:"#fff", borderRadius:12, padding:"24px", width:360, boxShadow:"0 10px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:700 }}>🔗 Insert Link</h3>
            <label style={S.label}>URL</label>
            <input style={{ ...S.input, marginBottom:10 }} placeholder="https://example.com" value={linkForm.url} onChange={e=>setLinkForm(p=>({...p,url:e.target.value}))} autoFocus/>
            <label style={S.label}>Display Text (optional)</label>
            <input style={{ ...S.input, marginBottom:16 }} placeholder="Click here" value={linkForm.text} onChange={e=>setLinkForm(p=>({...p,text:e.target.value}))}/>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...S.btn("primary"), flex:1 }} onClick={insertLink}>Insert</button>
              <button style={S.btn("outline")} onClick={()=>setLinkModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Image modal */}
      {imgModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}
          onClick={e=>{if(e.target===e.currentTarget)setImgModal(false);}}>
          <div style={{ background:"#fff", borderRadius:12, padding:"24px", width:380, boxShadow:"0 10px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:700 }}>🖼️ Insert Image</h3>
            <label style={S.label}>Image URL</label>
            <input style={{ ...S.input, marginBottom:10 }} placeholder="https://example.com/image.jpg" value={imgForm.url} onChange={e=>setImgForm(p=>({...p,url:e.target.value}))} autoFocus/>
            {imgForm.url && (
              <img src={imgForm.url} alt="preview" style={{ width:"100%", maxHeight:160, objectFit:"cover", borderRadius:8, marginBottom:10 }} onError={e=>e.target.style.display="none"}/>
            )}
            <label style={S.label}>Alt Text (optional)</label>
            <input style={{ ...S.input, marginBottom:16 }} placeholder="Image description" value={imgForm.alt} onChange={e=>setImgForm(p=>({...p,alt:e.target.value}))}/>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ ...S.btn("primary"), flex:1 }} onClick={insertImage}>Insert</button>
              <button style={S.btn("outline")} onClick={()=>setImgModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #9fb8b5; pointer-events:none; }
        [contenteditable] blockquote { border-left:4px solid #00B4A2; margin:8px 0; padding:6px 14px; background:#E0F7F5; border-radius:0 6px 6px 0; }
        [contenteditable] h3 { font-size:17px; font-weight:700; margin:10px 0 4px; }
        [contenteditable] ul, [contenteditable] ol { padding-left:24px; margin:6px 0; }
        [contenteditable] li { margin:2px 0; }
        [contenteditable] hr { border:none; border-top:2px solid #C5E8E5; margin:12px 0; }
        [contenteditable] a { color:#00B4A2; }
        [contenteditable] img { max-width:100%; border-radius:8px; }
      `}</style>
    </div>
  );
}

// Render HTML content safely
function RichContent({ html }) {
  if (!html) return null;
  const isRich = html.includes("<") && html.includes(">");
  if (!isRich) return <p style={{ margin:0, lineHeight:1.75, whiteSpace:"pre-wrap" }}>{html}</p>;
  return (
    <>
      <style>{`
        .rich-content blockquote { border-left:4px solid #00B4A2; margin:8px 0; padding:6px 14px; background:#E0F7F5; border-radius:0 6px 6px 0; }
        .rich-content h3 { font-size:17px; font-weight:700; margin:10px 0 4px; }
        .rich-content ul, .rich-content ol { padding-left:24px; margin:6px 0; }
        .rich-content li { margin:2px 0; }
        .rich-content hr { border:none; border-top:2px solid #C5E8E5; margin:12px 0; }
        .rich-content a { color:#00B4A2; text-decoration:underline; }
        .rich-content img { max-width:100%; border-radius:8px; margin:8px 0; display:block; }
        .rich-content p { margin:4px 0; line-height:1.75; }
      `}</style>
      <div className="rich-content" style={{ lineHeight:1.75, wordBreak:"break-word" }} dangerouslySetInnerHTML={{ __html:html }}/>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modal, setModal] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [toast, setToast] = useState(null);
  const [topics, setTopics] = useState([]);
  const [replies, setReplies] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({users:0,topics:0,replies:0});
  const [adminTab, setAdminTab] = useState("stats");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [loginForm, setLoginForm] = useState({email:"",password:""});
  const [regForm, setRegForm] = useState({username:"",email:"",password:"",confirm:""});
  const [countrySearch, setCountrySearch] = useState("");
  const [hiddenCountries, setHiddenCountries] = useState([]);

  const t = i18n[lang];

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3500);
  };

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null);
      if(session?.user) fetchProfile(session.user.id);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_e,session)=>{
      setUser(session?.user??null);
      if(session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    fetchStats();
    loadHiddenCountries();
    return ()=>subscription.unsubscribe();
  },[]);

  const loadHiddenCountries = async () => {
    const {data} = await supabase.from("countries").select("id,active").eq("active",false);
    if(data) setHiddenCountries(data.map(r=>r.id));
  };

  const fetchProfile = async(userId)=>{
    const {data}=await supabase.from("profiles").select("*").eq("id",userId).single();
    setProfile(data);
  };

  const fetchStats = async()=>{
    const [a,b,c]=await Promise.all([
      supabase.from("profiles").select("*",{count:"exact",head:true}),
      supabase.from("topics").select("*",{count:"exact",head:true}),
      supabase.from("replies").select("*",{count:"exact",head:true}),
    ]);
    setStats({users:a.count||0,topics:b.count||0,replies:c.count||0});
  };

  const fetchTopics = async(country,category)=>{
    setLoading(true);
    const {data,error}=await supabase.from("topics").select("*, profiles(username)").eq("country",country).eq("category",category).order("pinned",{ascending:false}).order("created_at",{ascending:false});
    if(!error) setTopics(data||[]);
    setLoading(false);
  };

  const fetchReplies = async(topicId)=>{
    setLoading(true);
    const {data,error}=await supabase.from("replies").select("*, profiles(username)").eq("topic_id",topicId).order("created_at",{ascending:true});
    if(!error) setReplies(data||[]);
    setLoading(false);
  };

  const fetchAllUsers = async()=>{
    const {data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});
    setAllUsers(data||[]);
  };

  const handleLogin=async()=>{
    const {error}=await supabase.auth.signInWithPassword({email:loginForm.email,password:loginForm.password});
    if(error){showToast(t.loginError,"error");}
    else{setModal(null);setLoginForm({email:"",password:""});showToast(`${t.welcome}!`);}
  };

  const handleRegister=async()=>{
    if(regForm.password!==regForm.confirm){showToast(t.passwordMismatch,"error");return;}
    if(!regForm.email.includes("@")){showToast(t.emailRequired,"error");return;}
    const {data,error}=await supabase.auth.signUp({email:regForm.email,password:regForm.password});
    if(error){showToast(error.message,"error");return;}
    if(data.user){
      await supabase.from("profiles").insert({id:data.user.id,username:regForm.username,email:regForm.email,role:"user",banned:false});
    }
    setRegForm({username:"",email:"",password:"",confirm:""});
    setModal(null);
    showToast(t.registerSuccess);
  };

  const handleLogout=async()=>{
    await supabase.auth.signOut();
    setUser(null);setProfile(null);setView("home");
  };

  const handleNewTopic=async()=>{
    if(!newTopicTitle.trim())return;
    const {error}=await supabase.from("topics").insert({title:newTopicTitle,title_tr:newTopicTitle,content:newTopicContent,author_id:user.id,country:selectedCountry,category:selectedCategory.id,pinned:false,views:0});
    if(error){showToast(error.message,"error");return;}
    setNewTopicTitle(""); setNewTopicContent(""); setModal(null);
    showToast("Topic created!");
    fetchTopics(selectedCountry,selectedCategory.id); fetchStats();
  };

  const handleDeleteTopic=async(topicId)=>{
    if(!window.confirm(t.confirmDelete))return;
    await supabase.from("replies").delete().eq("topic_id",topicId);
    await supabase.from("topics").delete().eq("id",topicId);
    showToast("Topic deleted."); fetchStats();
    if(view==="topic"){setView("category");setSelectedTopic(null);fetchTopics(selectedCountry,selectedCategory.id);}
  };

  const handleViewTopic=async(topic)=>{
    setSelectedTopic(topic); setView("topic");
    await supabase.from("topics").update({views:(topic.views||0)+1}).eq("id",topic.id);
    fetchReplies(topic.id);
  };

  const handleSaveTopic=async()=>{
    if(!editingTopic.title.trim())return;
    const {error}=await supabase.from("topics").update({
      title:editingTopic.title, title_tr:editingTopic.title_tr||editingTopic.title,
      content:editingTopic.content, category:editingTopic.category,
      country:editingTopic.country, pinned:editingTopic.pinned,
    }).eq("id",editingTopic.id);
    if(error){showToast(error.message,"error");return;}
    showToast(t.saved); setModal(null); setEditingTopic(null);
    if(selectedCountry&&selectedCategory) fetchTopics(selectedCountry,selectedCategory.id);
  };

  const handlePinTopic=async(topicId,currentPinned)=>{
    await supabase.from("topics").update({pinned:!currentPinned}).eq("id",topicId);
    showToast(currentPinned?"Unpinned.":"Pinned!");
    if(selectedCountry&&selectedCategory) fetchTopics(selectedCountry,selectedCategory.id);
  };

  const handleNewReply=async()=>{
    if(!newReplyContent.trim())return;
    const {error}=await supabase.from("replies").insert({topic_id:selectedTopic.id,author_id:user.id,content:newReplyContent});
    if(error){showToast(error.message,"error");return;}
    await supabase.from("topics").update({replies:(selectedTopic.replies||0)+1}).eq("id",selectedTopic.id);
    setNewReplyContent(""); showToast("Reply posted!");
    fetchReplies(selectedTopic.id); fetchStats();
  };

  const handleDeleteReply=async(replyId)=>{
    if(!window.confirm(t.confirmDelete))return;
    await supabase.from("replies").delete().eq("id",replyId);
    showToast("Reply deleted."); fetchReplies(selectedTopic.id); fetchStats();
  };

  const handleBanUser=async(userId,currentBanned)=>{
    if(!currentBanned&&!window.confirm(t.confirmBan))return;
    await supabase.from("profiles").update({banned:!currentBanned}).eq("id",userId);
    showToast("User status updated."); fetchAllUsers();
  };

  const handleToggleAdmin=async(userId,currentRole)=>{
    const newRole=currentRole==="admin"?"user":"admin";
    if(newRole==="admin"&&!window.confirm(t.confirmMakeAdmin))return;
    await supabase.from("profiles").update({role:newRole}).eq("id",userId);
    showToast("Role updated."); fetchAllUsers();
  };

  const handleToggleCountry=async(countryId,currentActive)=>{
    const {error}=await supabase.from("countries").upsert({id:countryId,name:countryId,active:!currentActive},{onConflict:"id"});
    if(error){showToast(error.message,"error");return;}
    setHiddenCountries(prev=>currentActive?[...prev,countryId]:prev.filter(c=>c!==countryId));
    showToast(currentActive?"Country hidden.":"Country visible.");
  };

  const isAdmin = profile?.role==="admin";
  const getTopicTitle = (topic)=>lang==="tr"&&topic.title_tr?topic.title_tr:topic.title;

  // Filter countries by search — in current language
  const visibleCountries = COUNTRIES.filter(c=>!hiddenCountries.includes(c.en));
  const filteredCountries = visibleCountries.filter(c=>{
    const q = countrySearch.toLowerCase();
    return !q || c.en.toLowerCase().includes(q) || c.tr.toLowerCase().includes(q);
  });

  const filteredTopics = topics.filter(tp=>{
    const q=searchQuery.toLowerCase();
    return !q||tp.title?.toLowerCase().includes(q)||tp.title_tr?.toLowerCase().includes(q);
  });

  const goHome=()=>{setView("home");setSelectedCountry(null);setSelectedCategory(null);setSelectedTopic(null);fetchStats();};
  const goCountry=()=>{setView("country");setSelectedCategory(null);setSelectedTopic(null);};
  const goCategory=()=>{setView("category");setSelectedTopic(null);};

  // Get Turkish name for a country
  const countryDisplayName = (en) => {
    if (lang === "tr") {
      const found = COUNTRIES.find(c=>c.en===en);
      return found ? found.tr : en;
    }
    return en;
  };

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
          <button style={S.btn("ghost","sm")} onClick={()=>setLang(lang==="en"?"tr":"en")}>{t.switchLang}</button>
          {isAdmin&&<button style={S.btn("ghost","sm")} onClick={()=>{setView("admin");fetchAllUsers();fetchStats();}}>⚙️ {t.admin}</button>}
          {user?(
            <>
              <span style={{color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:600}}>👤 {profile?.username||user.email}</span>
              <button style={S.btn("ghost","sm")} onClick={handleLogout}>{t.logout}</button>
            </>
          ):(
            <>
              <button style={S.btn("ghost","sm")} onClick={()=>setModal("login")}>{t.login}</button>
              <button style={S.btn("accent","sm")} onClick={()=>setModal("register")}>{t.register}</button>
            </>
          )}
        </div>
      </nav>

      {/* BREADCRUMB */}
      {view!=="home"&&view!=="admin"&&(
        <div style={{background:COLORS.primaryLight,padding:"8px 24px",fontSize:13,display:"flex",alignItems:"center",gap:6,color:COLORS.primaryDark,borderBottom:`1px solid ${COLORS.border}`}}>
          <span style={{cursor:"pointer",fontWeight:600}} onClick={goHome}>🏠 {t.home}</span>
          {selectedCountry&&<><span>›</span><span style={{cursor:"pointer",fontWeight:600}} onClick={goCountry}><Flag country={selectedCountry}/> {countryDisplayName(selectedCountry)}</span></>}
          {selectedCategory&&<><span>›</span><span style={{cursor:"pointer",fontWeight:600}} onClick={goCategory}>{selectedCategory.icon} {lang==="tr"?selectedCategory.tr:selectedCategory.en}</span></>}
          {selectedTopic&&<><span>›</span><span style={{fontWeight:600,color:COLORS.text,maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{getTopicTitle(selectedTopic)}</span></>}
        </div>
      )}

      {/* HOME */}
      {view==="home"&&(
        <>
          <div style={S.heroSection}>
            <div style={{fontSize:56,marginBottom:12}}>🌙✨</div>
            <h1 style={S.heroTitle}>{t.siteName}</h1>
            <p style={S.heroSub}>{t.siteTagline}</p>
            <div style={{maxWidth:480,margin:"0 auto"}}>
              <h2 style={{color:"rgba(255,255,255,0.9)",fontSize:16,fontWeight:600,marginBottom:12}}>{t.selectCountry}</h2>
              <input style={{...S.input,marginBottom:10,fontSize:15}} placeholder={lang==="tr"?"🔍 Ülke ara...":"🔍 Search countries..."} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)}/>
              <div style={{background:"rgba(255,255,255,0.95)",borderRadius:12,maxHeight:260,overflowY:"auto"}}>
                {filteredCountries.map(c=>(
                  <div key={c.en} style={{padding:"11px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${COLORS.border}`,fontSize:15,color:COLORS.text,transition:"background 0.15s"}}
                    onClick={()=>{setSelectedCountry(c.en);setView("country");setSelectedCategory(null);setSelectedTopic(null);setSearchQuery("");}}
                    onMouseEnter={e=>e.currentTarget.style.background=COLORS.primaryLight}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Flag country={c.en}/>
                    <span style={{fontWeight:500}}>{lang==="tr"?c.tr:c.en}</span>
                    {lang==="tr"&&<span style={{fontSize:12,color:COLORS.textMuted,marginLeft:"auto"}}>{c.en}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={S.container}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginTop:8}}>
              {[{label:t.totalUsers,value:stats.users,icon:"👥"},{label:t.totalTopics,value:stats.topics,icon:"📝"},{label:t.totalReplies,value:stats.replies,icon:"💬"},{label:t.activeCountries,value:visibleCountries.length,icon:"🌍"}].map(s=>(
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
      {view==="country"&&selectedCountry&&(
        <CountryPage country={selectedCountry} countryDisplayName={countryDisplayName} t={t} lang={lang} S={S} COLORS={COLORS} CATEGORIES={CATEGORIES} FLAGS={FLAGS}
          onSelectCategory={(cat)=>{setSelectedCategory(cat);setView("category");setSelectedTopic(null);setSearchQuery("");fetchTopics(selectedCountry,cat.id);}}
          supabase={supabase}/>
      )}

      {/* CATEGORY PAGE */}
      {view==="category"&&selectedCategory&&(
        <div style={S.container}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:32}}>{selectedCategory.icon}</span>
              <h1 style={{fontSize:24,fontWeight:800,margin:0}}>{lang==="tr"?selectedCategory.tr:selectedCategory.en}</h1>
            </div>
            {user&&<button style={S.btn("primary")} onClick={()=>setModal("newTopic")}>+ {t.newTopic}</button>}
          </div>
          {!user&&<div style={{background:COLORS.goldLight,border:`1px solid ${COLORS.gold}`,borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:14,color:"#7A5900"}}>💡 {t.signUpPrompt} <span style={{cursor:"pointer",fontWeight:700,textDecoration:"underline"}} onClick={()=>setModal("register")}>{t.register}</span></div>}
          <input style={{...S.input,marginBottom:16}} placeholder={`🔍 ${t.searchPlaceholder}`} value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:16,padding:"10px 20px",background:COLORS.primaryLight,fontSize:12,fontWeight:700,color:COLORS.primaryDark,borderBottom:`1px solid ${COLORS.border}`}}>
              <span>{t.topics}</span><span>{t.replies}</span><span>{t.views}</span><span>{t.postedOn}</span>
            </div>
            {loading?<Spinner/>:filteredTopics.length===0?(
              <div style={{padding:"32px",textAlign:"center",color:COLORS.textMuted}}>{searchQuery?t.noResults:t.noTopics}</div>
            ):filteredTopics.map(topic=>(
              <div key={topic.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:16,padding:"14px 20px",borderBottom:`1px solid ${COLORS.border}`,alignItems:"center",cursor:"pointer",transition:"background 0.15s"}}
                onClick={()=>handleViewTopic(topic)}
                onMouseEnter={e=>e.currentTarget.style.background=COLORS.primaryLight}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  {topic.pinned&&<span style={S.badge(COLORS.goldLight,COLORS.gold)}>📌 {t.pinned}</span>}
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
      {view==="topic"&&selectedTopic&&(
        <div style={S.container}>
          <div style={{...S.card,marginBottom:16}}>
            <h1 style={{fontSize:22,fontWeight:800,margin:"0 0 12px"}}>{getTopicTitle(selectedTopic)}</h1>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <span style={S.badge(COLORS.primaryLight,COLORS.primaryDark)}>@{selectedTopic.profiles?.username||"user"}</span>
              <span style={{fontSize:12,color:COLORS.textMuted}}>{t.on} {selectedTopic.created_at?.slice(0,10)}</span>
              {isAdmin&&(
                <div style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button style={S.btn("outline","sm")} onClick={()=>{setEditingTopic({...selectedTopic});setModal("editTopic");}}>✏️ {t.edit}</button>
                  <button style={S.btn(selectedTopic.pinned?"warning":"success","sm")} onClick={()=>handlePinTopic(selectedTopic.id,selectedTopic.pinned)}>{selectedTopic.pinned?`📌 ${t.unpin}`:`📌 ${t.pin}`}</button>
                  <button style={S.btn("danger","sm")} onClick={()=>handleDeleteTopic(selectedTopic.id)}>{t.delete}</button>
                </div>
              )}
            </div>
            <RichContent html={selectedTopic.content}/>
          </div>
          {loading?<Spinner/>:replies.map(r=>(
            <div key={r.id} style={{...S.card,display:"flex",gap:14}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:COLORS.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:COLORS.primaryDark,flexShrink:0}}>
                {(r.profiles?.username||"U")[0].toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                  <span style={{fontWeight:700,color:COLORS.primary}}>@{r.profiles?.username||"user"}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,color:COLORS.textMuted}}>{r.created_at?.slice(0,10)}</span>
                    {isAdmin&&<button style={S.btn("danger","sm")} onClick={()=>handleDeleteReply(r.id)}>{t.delete}</button>}
                  </div>
                </div>
                <RichContent html={r.content}/>
              </div>
            </div>
          ))}
          {user?(
            <div style={S.card}>
              <div style={{...S.label,marginBottom:8}}>{t.reply}</div>
              <RichEditor value={newReplyContent} onChange={setNewReplyContent} placeholder={t.replyPlaceholder} minHeight={120}/>
              <button style={{...S.btn("primary"),marginTop:12}} onClick={handleNewReply}>{t.submit}</button>
            </div>
          ):(
            <div style={{background:COLORS.goldLight,border:`1px solid ${COLORS.gold}`,borderRadius:10,padding:"14px 18px",fontSize:14,color:"#7A5900",textAlign:"center"}}>
              {t.signUpPrompt} <span style={{cursor:"pointer",fontWeight:700,textDecoration:"underline"}} onClick={()=>setModal("login")}>{t.login}</span>
            </div>
          )}
        </div>
      )}

      {/* ADMIN PANEL */}
      {view==="admin"&&isAdmin&&(
        <div style={{...S.container,maxWidth:1100}}>
          <h1 style={{fontSize:26,fontWeight:800,marginBottom:20}}>⚙️ {t.admin}</h1>
          <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
            <div style={S.adminSidebar}>
              {[["stats","📊 "+t.statistics],["users","👥 "+t.manageUsers],["posts","📝 "+t.managePosts],["countries","🌍 "+t.manageCountries]].map(([id,label])=>(
                <div key={id} style={S.adminSideItem(adminTab===id)} onClick={()=>{setAdminTab(id);if(id==="users")fetchAllUsers();if(id==="stats"){fetchStats();fetchAllUsers();}}}>{label}</div>
              ))}
            </div>
            <div style={{flex:1}}>
              {adminTab==="stats"&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:20}}>
                    {[{label:t.totalUsers,value:stats.users,icon:"👥",color:COLORS.primary},{label:t.totalTopics,value:stats.topics,icon:"📝",color:COLORS.accent},{label:t.totalReplies,value:stats.replies,icon:"💬",color:COLORS.gold},{label:t.activeCountries,value:visibleCountries.length,icon:"🌍",color:COLORS.primaryDark}].map(s=>(
                      <div key={s.label} style={{background:COLORS.card,borderRadius:12,border:`1px solid ${COLORS.border}`,padding:"20px",display:"flex",gap:16,alignItems:"center"}}>
                        <div style={{fontSize:32}}>{s.icon}</div>
                        <div><div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div><div style={{fontSize:13,color:COLORS.textMuted,fontWeight:600}}>{s.label}</div></div>
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
              {adminTab==="users"&&(
                <div style={S.card}>
                  <h2 style={{margin:"0 0 16px",fontWeight:800}}>{t.manageUsers}</h2>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr>{["User","Email",t.memberSince,t.role,"Status","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {allUsers.map(u=>(
                        <tr key={u.id}>
                          <td style={S.td}><span style={{fontWeight:600}}>@{u.username}</span></td>
                          <td style={S.td}><span style={{fontSize:12,color:COLORS.textMuted}}>{u.email}</span></td>
                          <td style={S.td}><span style={{fontSize:12,color:COLORS.textMuted}}>{u.created_at?.slice(0,10)}</span></td>
                          <td style={S.td}><span style={S.badge(COLORS.primaryLight,COLORS.primaryDark)}>{u.role}</span></td>
                          <td style={S.td}><span style={S.badge(u.banned?"#FED7D7":"#F0FFF4",u.banned?COLORS.danger:COLORS.success)}>{u.banned?t.banned:t.active}</span></td>
                          <td style={S.td}>
                            {u.role!=="admin"&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                              <button style={S.btn(u.banned?"success":"danger","sm")} onClick={()=>handleBanUser(u.id,u.banned)}>{u.banned?t.unban:t.ban}</button>
                              <button style={S.btn("outline","sm")} onClick={()=>handleToggleAdmin(u.id,u.role)}>{t.makeAdmin}</button>
                            </div>}
                            {u.role==="admin"&&profile?.id!==u.id&&<button style={S.btn("warning","sm")} onClick={()=>handleToggleAdmin(u.id,u.role)}>{t.removeAdmin}</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {adminTab==="posts"&&(
                <AdminPostsTab supabase={supabase} S={S} COLORS={COLORS} COUNTRIES={COUNTRY_NAMES_EN} CATEGORIES={CATEGORIES} FLAGS={FLAGS} t={t}
                  onEdit={(topic)=>{setEditingTopic({...topic});setModal("editTopic");}}
                  onDelete={async(id)=>{
                    if(!window.confirm(t.confirmDelete))return;
                    await supabase.from("replies").delete().eq("topic_id",id);
                    await supabase.from("topics").delete().eq("id",id);
                    showToast("Deleted."); fetchStats();
                  }}
                  onPin={async(id,pinned)=>{
                    await supabase.from("topics").update({pinned:!pinned}).eq("id",id);
                    showToast(pinned?"Unpinned.":"Pinned!");
                  }}
                />
              )}
              {adminTab==="countries"&&(
                <AdminCountriesTab supabase={supabase} S={S} COLORS={COLORS} COUNTRIES={COUNTRIES} FLAGS={FLAGS} t={t}
                  hiddenCountries={hiddenCountries} onToggle={handleToggleCountry}/>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {modal==="login"&&(
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
      {modal==="register"&&(
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
      {modal==="newTopic"&&(
        <div style={S.modal} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{...S.modalBox,maxWidth:640}}>
            <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800}}>📝 {t.newTopic}</h2>
            <label style={S.label}>{t.topicTitle}</label>
            <input style={{...S.input,marginBottom:14}} value={newTopicTitle} onChange={e=>setNewTopicTitle(e.target.value)}/>
            <label style={{...S.label,marginBottom:8}}>{t.topicContent}</label>
            <RichEditor value={newTopicContent} onChange={setNewTopicContent} placeholder={t.topicPlaceholder} minHeight={180}/>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button style={{...S.btn("primary"),flex:1}} onClick={handleNewTopic}>{t.submit}</button>
              <button style={S.btn("outline")} onClick={()=>setModal(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TOPIC MODAL */}
      {modal==="editTopic"&&editingTopic&&(
        <div style={S.modal} onClick={e=>{if(e.target===e.currentTarget){setModal(null);setEditingTopic(null);}}}>
          <div style={{...S.modalBox,maxWidth:640}}>
            <h2 style={{margin:"0 0 20px",fontSize:22,fontWeight:800}}>✏️ {t.editTopic}</h2>
            <label style={S.label}>{t.topicTitle} (English)</label>
            <input style={{...S.input,marginBottom:10}} value={editingTopic.title||""} onChange={e=>setEditingTopic(p=>({...p,title:e.target.value}))}/>
            <label style={S.label}>{t.topicTitleTr}</label>
            <input style={{...S.input,marginBottom:10}} value={editingTopic.title_tr||""} onChange={e=>setEditingTopic(p=>({...p,title_tr:e.target.value}))}/>
            <label style={{...S.label,marginBottom:8}}>{t.topicContent}</label>
            <RichEditor value={editingTopic.content||""} onChange={v=>setEditingTopic(p=>({...p,content:v}))} minHeight={150}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12,marginBottom:12}}>
              <div>
                <label style={S.label}>Country</label>
                <select style={{...S.select,width:"100%"}} value={editingTopic.country||""} onChange={e=>setEditingTopic(p=>({...p,country:e.target.value}))}>
                  {COUNTRY_NAMES_EN.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Category</label>
                <select style={{...S.select,width:"100%"}} value={editingTopic.category||""} onChange={e=>setEditingTopic(p=>({...p,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.en}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <input type="checkbox" id="pinnedCheck" checked={!!editingTopic.pinned} onChange={e=>setEditingTopic(p=>({...p,pinned:e.target.checked}))} style={{width:16,height:16,cursor:"pointer"}}/>
              <label htmlFor="pinnedCheck" style={{...S.label,marginBottom:0,cursor:"pointer"}}>📌 Pin this topic</label>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("primary"),flex:1}} onClick={handleSaveTopic}>{t.save}</button>
              <button style={S.btn("outline")} onClick={()=>{setModal(null);setEditingTopic(null);}}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:24,right:24,background:toast.type==="error"?COLORS.danger:COLORS.success,color:"#fff",padding:"12px 20px",borderRadius:10,fontWeight:600,fontSize:14,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
          {toast.type==="error"?"❌ ":"✅ "}{toast.msg}
        </div>
      )}

      <footer style={{background:COLORS.primaryDark,color:"rgba(255,255,255,0.7)",textAlign:"center",padding:"24px",marginTop:48,fontSize:13}}>
        <div style={{fontWeight:700,color:"#fff",fontSize:16,marginBottom:4}}>🌙 Dünyada Türk</div>
        <div>Dünyanın her köşesindeki Türkleri birleştiriyoruz · Connecting Turks around the world</div>
        <div style={{marginTop:8,fontSize:11,opacity:0.6}}>© 2025 Dünyada Türk · dunyadaturk.com</div>
      </footer>
    </div>
  );
}

// ─── COUNTRY PAGE ─────────────────────────────────────────────────────────────
function CountryPage({country,countryDisplayName,t,lang,S,COLORS,CATEGORIES,FLAGS,onSelectCategory,supabase}){
  const [counts,setCounts]=useState({});
  const [lastPosts,setLastPosts]=useState({});
  useEffect(()=>{
    supabase.from("topics").select("category,title,title_tr,created_at").eq("country",country).order("created_at",{ascending:false}).then(({data})=>{
      const c={},lp={};
      (data||[]).forEach(r=>{c[r.category]=(c[r.category]||0)+1;if(!lp[r.category])lp[r.category]=r;});
      setCounts(c);setLastPosts(lp);
    });
  },[country]);
  return(
    <div style={S.container}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <span style={{fontSize:32}}>{FLAGS[country]||"🌍"}</span>
        <div>
          <h1 style={{fontSize:28,fontWeight:800,margin:0}}>{countryDisplayName(country)} {t.forum}</h1>
          {lang==="tr"&&<p style={{color:COLORS.textMuted,margin:"2px 0 0",fontSize:13}}>{country}</p>}
          <p style={{color:COLORS.textMuted,margin:0,fontSize:14}}>{t.categories}</p>
        </div>
      </div>
      <div style={{display:"grid",gap:12}}>
        {CATEGORIES.map(cat=>(
          <div key={cat.id} style={S.catCard} onClick={()=>onSelectCategory(cat)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=COLORS.primary;e.currentTarget.style.background=COLORS.primaryLight;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=COLORS.border;e.currentTarget.style.background=COLORS.card;}}>
            <div style={{fontSize:36,width:56,height:56,background:COLORS.primaryLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cat.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:16,marginBottom:2}}>{lang==="tr"?cat.tr:cat.en}</div>
              {lastPosts[cat.id]&&<div style={{fontSize:12,color:COLORS.textMuted}}>{t.lastPost}: <span style={{color:COLORS.primary,fontWeight:600}}>{lang==="tr"&&lastPosts[cat.id].title_tr?lastPosts[cat.id].title_tr:lastPosts[cat.id].title}</span></div>}
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

// ─── ADMIN POSTS TAB ──────────────────────────────────────────────────────────
function AdminPostsTab({supabase,S,COLORS,COUNTRIES,CATEGORIES,FLAGS,t,onEdit,onDelete,onPin}){
  const [posts,setPosts]=useState([]);
  const [filterCountry,setFilterCountry]=useState("");
  const [filterCategory,setFilterCategory]=useState("");
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{load();},[filterCountry,filterCategory]);

  const load=async()=>{
    setLoading(true);
    let q=supabase.from("topics").select("*, profiles(username)").order("created_at",{ascending:false}).limit(100);
    if(filterCountry) q=q.eq("country",filterCountry);
    if(filterCategory) q=q.eq("category",filterCategory);
    const {data}=await q;
    setPosts(data||[]);
    setLoading(false);
  };

  const filtered=posts.filter(p=>{
    const q=search.toLowerCase();
    return !q||p.title?.toLowerCase().includes(q)||p.profiles?.username?.toLowerCase().includes(q);
  });

  return(
    <div style={S.card}>
      <h2 style={{margin:"0 0 16px",fontWeight:800}}>{t.managePosts}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        <select style={S.select} value={filterCountry} onChange={e=>setFilterCountry(e.target.value)}>
          <option value="">{t.allCountries}</option>
          {COUNTRIES.map(c=><option key={c} value={c}>{FLAGS[c]||"🌍"} {c}</option>)}
        </select>
        <select style={S.select} value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}>
          <option value="">{t.allCategories}</option>
          {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.en}</option>)}
        </select>
        <input style={S.select} placeholder="🔍 Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      {loading?<div style={{textAlign:"center",padding:24}}>⏳</div>:filtered.length===0?(
        <div style={{textAlign:"center",color:COLORS.textMuted,padding:24}}>{t.noResults}</div>
      ):filtered.map(p=>(
        <div key={p.id} style={{border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8,background:COLORS.bg}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                {p.pinned&&<span style={{...S.badge(COLORS.goldLight,COLORS.gold),fontSize:10}}>📌 Pinned</span>}
                <span style={{...S.badge(COLORS.primaryLight,COLORS.primaryDark),fontSize:10}}>{FLAGS[p.country]||"🌍"} {p.country}</span>
                <span style={{...S.badge("#F0F0FF","#5555AA"),fontSize:10}}>{CATEGORIES.find(c=>c.id===p.category)?.icon} {p.category}</span>
              </div>
              <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{p.title}</div>
              <div style={{fontSize:11,color:COLORS.textMuted}}>@{p.profiles?.username||"user"} · {p.created_at?.slice(0,10)} · {p.replies||0} replies · {p.views||0} views</div>
            </div>
            <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
              <button style={S.btn("outline","sm")} onClick={()=>onEdit(p)}>{t.edit}</button>
              <button style={S.btn(p.pinned?"warning":"success","sm")} onClick={()=>onPin(p.id,p.pinned).then(load)}>{p.pinned?t.unpin:t.pin}</button>
              <button style={S.btn("danger","sm")} onClick={()=>onDelete(p.id).then(load)}>{t.delete}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN COUNTRIES TAB ──────────────────────────────────────────────────────
function AdminCountriesTab({supabase,S,COLORS,COUNTRIES,FLAGS,t,hiddenCountries,onToggle}){
  const [counts,setCounts]=useState({});
  const [search,setSearch]=useState("");

  useEffect(()=>{
    supabase.from("topics").select("country").then(({data})=>{
      const c={};
      (data||[]).forEach(r=>{c[r.country]=(c[r.country]||0)+1;});
      setCounts(c);
    });
  },[]);

  const filtered=COUNTRIES.filter(c=>
    c.en.toLowerCase().includes(search.toLowerCase())||
    c.tr.toLowerCase().includes(search.toLowerCase())
  );

  return(
    <div style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2 style={{margin:0,fontWeight:800}}>{t.manageCountries}</h2>
        <input style={{...S.select,width:200}} placeholder="🔍 Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div style={{marginBottom:12,fontSize:13,color:COLORS.textMuted}}>💡 Hidden countries won't appear in the homepage country selector.</div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr>{["Country","Turkish Name","Topics","Status","Action"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {filtered.map(c=>{
            const isHidden=hiddenCountries.includes(c.en);
            return(
              <tr key={c.en}>
                <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{FLAGS[c.en]||"🌍"}</span><span style={{fontWeight:600}}>{c.en}</span></div></td>
                <td style={S.td}><span style={{color:COLORS.textMuted}}>{c.tr}</span></td>
                <td style={S.td}><span style={S.badge(COLORS.primaryLight,COLORS.primaryDark)}>{counts[c.en]||0}</span></td>
                <td style={S.td}><span style={S.badge(isHidden?"#FED7D7":"#F0FFF4",isHidden?COLORS.danger:COLORS.success)}>{isHidden?t.countryInactive:t.countryActive}</span></td>
                <td style={S.td}><button style={S.btn(isHidden?"success":"warning","sm")} onClick={()=>onToggle(c.en,!isHidden)}>{isHidden?"👁️ Show":"🚫 Hide"}</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
