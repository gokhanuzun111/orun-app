export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  isPinned: boolean;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attendeeCount: number;
  description: string;
}

export interface WeeklyDiscussion {
  clubName: string;
  clubId: string;
  topic: string;
  replyCount: number;
}

export const MASTER_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "ORUN v2.1 Yayında",
    body: "Oda erişim sistemi, 7 günlük üyelik bekleme süreci ve master kulüp bu sürümle hayata geçti. Geri bildirimlerinizi Öneri Kutusu odasında paylaşabilirsiniz.",
    date: "15 Mayıs 2026",
    isPinned: true,
  },
  {
    id: "ann-2",
    title: "Yaz Buluşması — Yer ve Tarih Oylaması",
    body: "2026 ORUN Yaz Buluşması için İstanbul lokasyon ve tarih önerilerine oy verebilirsiniz. Etkinlikler odasında anket açık.",
    date: "12 Mayıs 2026",
    isPinned: true,
  },
  {
    id: "ann-3",
    title: "Yeni Kulüpler Geliyor",
    body: "Fotoğrafçılık, Satranç ve Mimarlik kulüpleri için ön kayıt listesi açıldı. İlgilenenler profil sayfasından tercihlerini belirtebilir.",
    date: "8 Mayıs 2026",
    isPinned: false,
  },
];

export const MASTER_EVENTS: ClubEvent[] = [
  {
    id: "evt-1",
    title: "ORUN Yaz Buluşması 2026",
    date: "21 Haziran 2026, Cumartesi",
    location: "İstanbul — Salon TBD",
    attendeeCount: 214,
    description: "Tüm kulüplerden üyelerin bir araya geldiği yıllık yüz yüze buluşma.",
  },
  {
    id: "evt-2",
    title: "Motosiklet Kulübü — Kapadokya Turu",
    date: "7–9 Haziran 2026",
    location: "Nevşehir, Kapadokya",
    attendeeCount: 38,
    description: "Güz öncesi Kapadokya rotası. Toplantı noktası ve program detayları oda içinde.",
  },
  {
    id: "evt-3",
    title: "Kitap Kulübü — Mayıs Tartışması",
    date: "29 Mayıs 2026, Perşembe 20:00",
    location: "Çevrimiçi — ORUN Odası",
    attendeeCount: 73,
    description: "Kazuo Ishiguro 'Klara and the Sun' — canlı bölüm tartışması.",
  },
];

export const WEEKLY_SUMMARY: WeeklyDiscussion[] = [
  {
    clubName: "Finans, Borsa ve Kripto",
    clubId: "finance",
    topic: "Bitcoin ETF sonrası: kurumsal giriş fiyatlaması tamamlandı mı?",
    replyCount: 187,
  },
  {
    clubName: "Perde",
    clubId: "film",
    topic: "Cannes 2026 En İyi Film: kazanan ve kaybeden değerlendirmesi",
    replyCount: 154,
  },
  {
    clubName: "Satır Arası",
    clubId: "books",
    topic: "Mayıs Kitabı: Kazuo Ishiguro — 'Klara and the Sun' bölüm tartışması",
    replyCount: 132,
  },
  {
    clubName: "Garaj",
    clubId: "cars",
    topic: "2026 F1 yeni regülasyonları: güç dengesi gerçekten değişiyor mu?",
    replyCount: 119,
  },
  {
    clubName: "Rezonans",
    clubId: "music",
    topic: "İstanbul Jazz Festivali 2026 beklentileri",
    replyCount: 98,
  },
];

export interface Club {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  waitlistCount: number;
  capacity: number;
  activeRooms: number;
  icon: string;
  category: string;
}

export interface Room {
  id: string;
  clubId: string;
  clubName: string;
  name: string;
  description: string;
  memberCount: number;
  maxCapacity: number;
  lastActivity: string;
  isActive: boolean;
  topic: string;
  isLanguageRoom?: boolean;
  targetLanguage?: "en" | "it" | "es" | "de";
}

export interface FlowItem {
  id: string;
  author: string;
  handle: string;
  clubName: string;
  content: string;
  timestamp: string;
  replyCount: number;
  membershipLevel: MembershipLevel;
}

export interface Message {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  membershipLevel: MembershipLevel;
  isAI?: boolean;
  replyTo?: string;
}

export interface UserProfile {
  id: string;
  handle: string;
  bio: string;
  membershipLevel: MembershipLevel;
  joinedClubs: string[];
  clubJoinDates: Record<string, string>;
  reputation: number;
  interests: string[];
  memberSince: string;
  isAdmin?: boolean;
}

export type MembershipLevel = 0 | 1 | 2 | 3;

export const MEMBERSHIP_LABELS: Record<MembershipLevel, string> = {
  0: "ADAY",
  1: "ÜYE",
  2: "MÜDAVİM",
  3: "SEÇKİN",
};

export const INTERESTS = [
  { id: "motorcycles", label: "Apex", icon: "bicycle" },
  { id: "watches", label: "Kadran", icon: "watch" },
  { id: "whisky", label: "Mahzen", icon: "wine-glass-empty" },
  { id: "cigars", label: "Amber", icon: "smoking" },
  { id: "books", label: "Satır Arası", icon: "book" },
  { id: "film", label: "Perde", icon: "film" },
  { id: "maritime", label: "Liman", icon: "anchor" },
  { id: "music", label: "Rezonans", icon: "music" },
  { id: "aviation", label: "İrtifa", icon: "plane" },
  { id: "gastronomy", label: "Sofra", icon: "utensils" },
  { id: "fitness", label: "Tempo", icon: "dumbbell" },
  { id: "cars", label: "Garaj", icon: "car" },
  { id: "philosophy", label: "Agora", icon: "brain" },
  { id: "history", label: "Tarih", icon: "landmark" },
  { id: "fashion", label: "Moda", icon: "shirt" },
  { id: "finance", label: "Finans ve Kripto", icon: "chart-line" },
  { id: "agriculture", label: "Tarım", icon: "seedling" },
  { id: "landscaping", label: "Peyzaj", icon: "tree" },
  { id: "mountaineering", label: "Dağcılık", icon: "mountain" },
  { id: "camping", label: "Kamp ve Karavan", icon: "campground" },
  { id: "models", label: "Maket ve Minyatür", icon: "cube" },
  { id: "dance", label: "Dans", icon: "music" },
  { id: "simracing", label: "Sim Yarış", icon: "gamepad" },
  { id: "archery", label: "Okçuluk ve Atıcılık", icon: "bullseye" },
  { id: "languages", label: "Dil Öğrenimi", icon: "language" },
  { id: "perfume", label: "Parfüm", icon: "flask" },
  { id: "atolye", label: "Atölye", icon: "paint-brush" },
];

export const CLUBS: Club[] = [
  {
    id: "master",
    slug: "master",
    name: "ORUN",
    description: "Tüm üyelerin ortak alanı. Duyurular, genel tartışmalar ve topluluk sohbeti.",
    memberCount: 1000,
    waitlistCount: 0,
    capacity: 1000,
    activeRooms: 8,
    icon: "layers",
    category: "Genel",
  },
  {
    id: "languages",
    slug: "languages",
    name: "Yabancı Dil",
    description: "AI destekli dil pratiği. İngilizce, İtalyanca, İspanyolca, Almanca ve daha fazlası.",
    memberCount: 1000,
    waitlistCount: 2841,
    capacity: 1000,
    activeRooms: 8,
    icon: "language",
    category: "Eğitim",
  },
  {
    id: "motorcycles",
    slug: "motorcycles",
    name: "Apex",
    description: "İki tekerlek, tek ruh. Café racer'dan ADV turaya.",
    memberCount: 1000,
    waitlistCount: 1847,
    capacity: 1000,
    activeRooms: 8,
    icon: "bicycle",
    category: "Yaşam Tarzı",
  },
  {
    id: "watches",
    slug: "watches",
    name: "Kadran",
    description: "Horoloji, zanaat ve zaman tutmanın sanatı.",
    memberCount: 1000,
    waitlistCount: 2421,
    capacity: 1000,
    activeRooms: 8,
    icon: "watch",
    category: "Yaşam Tarzı",
  },
  {
    id: "whisky",
    slug: "whisky",
    name: "Mahzen",
    description: "Viski, şarap, kokteyl ve distile — dünyanın en ince içecekleri.",
    memberCount: 1000,
    waitlistCount: 3102,
    capacity: 1000,
    activeRooms: 8,
    icon: "wine-glass-empty",
    category: "Gastronomi",
  },
  {
    id: "cigars",
    slug: "cigars",
    name: "Amber",
    description: "Premium yaprak, yavaş duman, rafine sohbet.",
    memberCount: 1000,
    waitlistCount: 893,
    capacity: 1000,
    activeRooms: 8,
    icon: "smoking",
    category: "Yaşam Tarzı",
  },
  {
    id: "books",
    slug: "books",
    name: "Satır Arası",
    description: "Edebiyat, felsefe ve yazılı sözcük.",
    memberCount: 1000,
    waitlistCount: 4204,
    capacity: 1000,
    activeRooms: 8,
    icon: "book",
    category: "Kültür",
  },
  {
    id: "film",
    slug: "film",
    name: "Perde",
    description: "Sanat olarak sinema. Bergman'dan Nolan'a, Criterion'dan A24'e.",
    memberCount: 1000,
    waitlistCount: 5318,
    capacity: 1000,
    activeRooms: 8,
    icon: "film",
    category: "Kültür",
  },
  {
    id: "aviation",
    slug: "aviation",
    name: "İrtifa",
    description: "Pilotlar, uçak meraklıları ve havacılık tutkunları.",
    memberCount: 1000,
    waitlistCount: 1156,
    capacity: 1000,
    activeRooms: 8,
    icon: "plane",
    category: "Teknik",
  },
  {
    id: "gastronomy",
    slug: "gastronomy",
    name: "Sofra",
    description: "Fine dining, malzeme, teknik, terroir.",
    memberCount: 1000,
    waitlistCount: 2897,
    capacity: 1000,
    activeRooms: 8,
    icon: "utensils",
    category: "Gastronomi",
  },
  {
    id: "cars",
    slug: "cars",
    name: "Garaj",
    description: "Klasikler, egzotikler ve bizi hareket ettiren makineler.",
    memberCount: 1000,
    waitlistCount: 3521,
    capacity: 1000,
    activeRooms: 8,
    icon: "car",
    category: "Yaşam Tarzı",
  },
  {
    id: "philosophy",
    slug: "philosophy",
    name: "Agora",
    description: "Önemli fikirler. Düşünce, güzellik, anlam ve insan psikolojisi.",
    memberCount: 1000,
    waitlistCount: 1934,
    capacity: 1000,
    activeRooms: 8,
    icon: "brain",
    category: "Kültür",
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finans, Borsa ve Kripto",
    description: "Piyasalar, borsa, kripto ve alternatif yatırımlar.",
    memberCount: 1000,
    waitlistCount: 4471,
    capacity: 1000,
    activeRooms: 8,
    icon: "chart-line",
    category: "Finans",
  },
  {
    id: "music",
    slug: "music",
    name: "Rezonans",
    description: "Caz, klasik, vinil — ibaret olarak müzik.",
    memberCount: 1000,
    waitlistCount: 3823,
    capacity: 1000,
    activeRooms: 8,
    icon: "music",
    category: "Kültür",
  },
  {
    id: "maritime",
    slug: "maritime",
    name: "Liman",
    description: "Yelken, dalış, balıkçılık ve tekne — denizle yaşamak.",
    memberCount: 1000,
    waitlistCount: 2103,
    capacity: 1000,
    activeRooms: 8,
    icon: "anchor",
    category: "Spor",
  },
  {
    id: "fitness",
    slug: "fitness",
    name: "Tempo",
    description: "Koşu, bisiklet, gym, yüzme ve sağlıklı yaşam.",
    memberCount: 1000,
    waitlistCount: 3847,
    capacity: 1000,
    activeRooms: 8,
    icon: "dumbbell",
    category: "Spor",
  },
  {
    id: "history",
    slug: "history",
    name: "Tarih",
    description: "Osmanlı'dan antike, askeri tarihten arkeolojiye.",
    memberCount: 1000,
    waitlistCount: 1562,
    capacity: 1000,
    activeRooms: 8,
    icon: "landmark",
    category: "Kültür",
  },
  {
    id: "fashion",
    slug: "fashion",
    name: "Moda",
    description: "Stil, vintage, tasarımcılar ve sürdürülebilir giyim.",
    memberCount: 1000,
    waitlistCount: 2289,
    capacity: 1000,
    activeRooms: 8,
    icon: "shirt",
    category: "Yaşam Tarzı",
  },
  {
    id: "agriculture",
    slug: "agriculture",
    name: "Tarım",
    description: "Bahçecilik, arıcılık, organik tarım ve tohumculuk.",
    memberCount: 1000,
    waitlistCount: 987,
    capacity: 1000,
    activeRooms: 8,
    icon: "seedling",
    category: "Doğa",
  },
  {
    id: "landscaping",
    slug: "landscaping",
    name: "Peyzaj",
    description: "Bahçe tasarımı, bitkiler, su özellikleri ve dış mekan.",
    memberCount: 1000,
    waitlistCount: 754,
    capacity: 1000,
    activeRooms: 8,
    icon: "tree",
    category: "Doğa",
  },
  {
    id: "mountaineering",
    slug: "mountaineering",
    name: "Dağcılık",
    description: "Kaya tırmanışı, yüksek rakım ve dağ güvenliği.",
    memberCount: 1000,
    waitlistCount: 1431,
    capacity: 1000,
    activeRooms: 8,
    icon: "mountain",
    category: "Spor",
  },
  {
    id: "camping",
    slug: "camping",
    name: "Kamp ve Karavan",
    description: "Kamp, van life, karavan yaşamı ve ultralight outdoor.",
    memberCount: 1000,
    waitlistCount: 2674,
    capacity: 1000,
    activeRooms: 8,
    icon: "campground",
    category: "Doğa",
  },
  {
    id: "models",
    slug: "models",
    name: "Maket ve Minyatür",
    description: "Askeri maketler, diorama, boyama ve 3D baskı.",
    memberCount: 1000,
    waitlistCount: 618,
    capacity: 1000,
    activeRooms: 8,
    icon: "cube",
    category: "Hobi",
  },
  {
    id: "dance",
    slug: "dance",
    name: "Dans",
    description: "Tango, salsa, bale, hip-hop ve halk dansları.",
    memberCount: 1000,
    waitlistCount: 1893,
    capacity: 1000,
    activeRooms: 8,
    icon: "bicycle",
    category: "Sanat",
  },
  {
    id: "simracing",
    slug: "simracing",
    name: "Sim Racing",
    description: "iRacing, Assetto Corsa, setup, ekipman ve ligler.",
    memberCount: 1000,
    waitlistCount: 2241,
    capacity: 1000,
    activeRooms: 8,
    icon: "gamepad",
    category: "Teknoloji",
  },
  {
    id: "archery",
    slug: "archery",
    name: "Atıcılık",
    description: "Uzun menzil, IPSC, okçuluk ve pratik atıcılık.",
    memberCount: 1000,
    waitlistCount: 1127,
    capacity: 1000,
    activeRooms: 8,
    icon: "bullseye",
    category: "Spor",
  },
  {
    id: "perfume",
    slug: "perfume",
    name: "Parfüm",
    description: "Oud, niche markalar, koku aileleri ve koleksiyon.",
    memberCount: 1000,
    waitlistCount: 1744,
    capacity: 1000,
    activeRooms: 8,
    icon: "flask",
    category: "Yaşam Tarzı",
  },
  {
    id: "atolye",
    slug: "atolye",
    name: "Atölye",
    description: "Resim, heykel, baskı sanatı ve çağdaş sanat dünyası.",
    memberCount: 714,
    waitlistCount: 2230,
    capacity: 1000,
    activeRooms: 8,
    icon: "paint-brush",
    category: "Sanat & Kültür",
  },
];

export const ROOM_CAPACITY = 125;

export const ROOMS: Room[] = [
  // ── Dil Odaları (5) ──────────────────────────────
  { id: "lang-en", clubId: "languages", clubName: "Yabancı Dil", name: "İngilizce Pratik", description: "AI destekli İngilizce konuşma pratiği.", memberCount: 34, maxCapacity: ROOM_CAPACITY, lastActivity: "1 dk önce", isActive: true, topic: "Daily Conversations — Günlük hayatta kullanılan ifadeler", isLanguageRoom: true, targetLanguage: "en" },
  { id: "lang-it", clubId: "languages", clubName: "Yabancı Dil", name: "İtalyanca Pratik", description: "AI destekli İtalyanca konuşma pratiği.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "3 dk önce", isActive: true, topic: "La Vita Quotidiana — Günlük yaşam ve İtalyan kültürü", isLanguageRoom: true, targetLanguage: "it" },
  { id: "lang-es", clubId: "languages", clubName: "Yabancı Dil", name: "İspanyolca Pratik", description: "AI destekli İspanyolca konuşma pratiği.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Conversación Natural — Doğal konuşma ve Latin Amerika kültürü", isLanguageRoom: true, targetLanguage: "es" },
  { id: "lang-de", clubId: "languages", clubName: "Yabancı Dil", name: "Almanca Pratik", description: "AI destekli Almanca konuşma pratiği.", memberCount: 21, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Alltagsgespräche — Günlük Almanca ve iş hayatı", isLanguageRoom: true, targetLanguage: "de" },
  { id: "lang-fr", clubId: "languages", clubName: "Yabancı Dil", name: "Fransızca Pratik", description: "AI destekli Fransızca konuşma pratiği.", memberCount: 18, maxCapacity: ROOM_CAPACITY, lastActivity: "14 dk önce", isActive: true, topic: "La Conversation Française — Günlük fransızca ve kültür", isLanguageRoom: true, targetLanguage: "en" },

  // ── Motosiklet (5) ───────────────────────────────
  { id: "moto-1", clubId: "motorcycles", clubName: "Apex", name: "Fincan", description: "Özel café racer projeleri, estetik ve etik.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "4 dk önce", isActive: true, topic: "Triumph Thruxton vs Honda CB1100 — hangisi daha özgün café?" },
  { id: "moto-2", clubId: "motorcycles", clubName: "Apex", name: "Bozkır", description: "Kıta geçişleri, rota planlaması, donanım.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "GS 1250 ve Tenere 700 — 2026 için hangisi daha mantıklı?" },
  { id: "moto-3", clubId: "motorcycles", clubName: "Apex", name: "Valf", description: "Motor bakımı, ayar, sorun giderme.", memberCount: 17, maxCapacity: ROOM_CAPACITY, lastActivity: "28 dk önce", isActive: true, topic: "Karbüratör senkronizasyonu: hâlâ elle mi, yoksa dijital ekipmanla mı?" },
  { id: "moto-4", clubId: "motorcycles", clubName: "Apex", name: "Ufuk", description: "Türkiye ve Avrupa rota paylaşımları.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "52 dk önce", isActive: true, topic: "Karadeniz kıyı yolu: Trabzon — Artvin segmenti hakkında güncel notlar" },
  { id: "moto-5", clubId: "motorcycles", clubName: "Apex", name: "Cromo", description: "Vintage, restorasyon ve koleksiyon.", memberCount: 14, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa önce", isActive: true, topic: "1970'lerin İngiliz twin'leri — BSA, Norton, Triumph" },

  // ── Saat ve Mücevher (5) ─────────────────────────
  { id: "watch-1", clubId: "watches", clubName: "Kadran", name: "Bilek", description: "Her gün takılan saatler, deneyimler, fikirler.", memberCount: 36, maxCapacity: ROOM_CAPACITY, lastActivity: "2 dk önce", isActive: true, topic: "Beadblasted çelik mi, satin mi — günlük kullanım için tercih" },
  { id: "watch-2", clubId: "watches", clubName: "Kadran", name: "Patina", description: "1950–1990 arası saatler, orijinallik, kayış.", memberCount: 27, maxCapacity: ROOM_CAPACITY, lastActivity: "19 dk önce", isActive: true, topic: "Ref. 1675 vs Ref. 16750 — Datejust mi GMT II mi?" },
  { id: "watch-3", clubId: "watches", clubName: "Kadran", name: "Kalibr", description: "Mekanik kalibreler, komplikasyonlar ve yüksek horoloji.", memberCount: 33, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "A. Lange & Söhne Datograph — hâlâ kıyas noktası mı?" },
  { id: "watch-4", clubId: "watches", clubName: "Kadran", name: "Wa", description: "Seiko, Grand Seiko, Citizen — doğu horolojisi.", memberCount: 23, maxCapacity: ROOM_CAPACITY, lastActivity: "37 dk önce", isActive: true, topic: "Grand Seiko SBGA211 'Snowflake' — fiyat-değer ilişkisi 2026'da nerede?" },
  { id: "watch-5", clubId: "watches", clubName: "Kadran", name: "Manifold", description: "F.P. Journe, MB&F, Voutilainen ve diğerleri.", memberCount: 12, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 20 dk önce", isActive: true, topic: "Kari Voutilainen — tanınan ama hâlâ erişilebilir mi?" },

  // ── Viski ve Distile (5) ─────────────────────────
  { id: "whisky-1", clubId: "whisky", clubName: "Mahzen", name: "Doğu", description: "Yamazaki, Hakushu, Nikka — Japon damıtıcılığının sanatı.", memberCount: 35, maxCapacity: ROOM_CAPACITY, lastActivity: "2 dk önce", isActive: true, topic: "Hibiki 21 günümüz piyasasında hâlâ premium fiyatı hak ediyor mu?" },
  { id: "whisky-2", clubId: "whisky", clubName: "Mahzen", name: "Sis", description: "Highlands, Islay, Speyside — bölge karakterleri.", memberCount: 40, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "Islay smoky karakteri: tercih mi, moda mı, gerçek mi?" },
  { id: "whisky-3", clubId: "whisky", clubName: "Mahzen", name: "Barel", description: "Amerikan bourbon, rye ve Tennessee whiskisi.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "22 dk önce", isActive: true, topic: "Pappy Van Winkle efsanesi: hype mı, hakikaten eşsiz mi?" },
  { id: "whisky-4", clubId: "whisky", clubName: "Mahzen", name: "Nadir", description: "1960–1990 arası şişeler, bağımsız şişeleyiciler.", memberCount: 16, maxCapacity: ROOM_CAPACITY, lastActivity: "44 dk önce", isActive: true, topic: "Gordon & MacPhail vs resmi şişelemeler — hangisi daha otantik?" },
  { id: "whisky-5", clubId: "whisky", clubName: "Mahzen", name: "Damla", description: "Yapılandırılmış tadımlar, not paylaşımı.", memberCount: 24, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa önce", isActive: true, topic: "Bu haftanın tadımı: Glenfarclas 25 vs Aberlour A'bunadh" },

  // ── Puro (5) ─────────────────────────────────────
  { id: "cigar-1", clubId: "cigars", clubName: "Amber", name: "Habana", description: "Cohiba, Montecristo, Partagás — Küba klasikleri.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "7 dk önce", isActive: true, topic: "Cohiba Behike 56 vs Siglo VI — günlük içim için hangisi daha makul?" },
  { id: "cigar-2", clubId: "cigars", clubName: "Amber", name: "Vuelta", description: "Nikaragua, Dominik, Honduras seçkileri.", memberCount: 21, maxCapacity: ROOM_CAPACITY, lastActivity: "31 dk önce", isActive: true, topic: "Padron 1964 Anniversary Series — değeri değişti mi?" },
  { id: "cigar-3", clubId: "cigars", clubName: "Amber", name: "Kasa", description: "Rutubet kontrolü, ahşap, uzun vadeli saklama.", memberCount: 18, maxCapacity: ROOM_CAPACITY, lastActivity: "55 dk önce", isActive: true, topic: "Kahverengi humidor vs elektronik — nem tutma karşılaştırması" },
  { id: "cigar-4", clubId: "cigars", clubName: "Amber", name: "Damla", description: "Detaylı tadım analizleri ve paylaşımlar.", memberCount: 14, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 10 dk önce", isActive: true, topic: "Bu haftanın tadımı: Trinidad Fundadores 2018 vs 2022" },
  { id: "cigar-5", clubId: "cigars", clubName: "Amber", name: "Lounge", description: "İstanbul ve dünyadan lounge tavsiyeleri.", memberCount: 11, maxCapacity: ROOM_CAPACITY, lastActivity: "2 sa önce", isActive: false, topic: "İstanbul'da Küba stoğu en iyi olan lounge hâlâ Çırağan mı?" },

  // ── Kitaplar (5) ─────────────────────────────────
  { id: "book-1", clubId: "books", clubName: "Satır Arası", name: "Sayfa", description: "Dünya edebiyatından seçkin romanlar.", memberCount: 37, maxCapacity: ROOM_CAPACITY, lastActivity: "3 dk önce", isActive: true, topic: "Orhan Pamuk'un son kitabı: eleştirmenler mi haklı, okuyucular mı?" },
  { id: "book-2", clubId: "books", clubName: "Satır Arası", name: "Portre", description: "Tarihî figürler, yaşam hikayeleri, anılar.", memberCount: 26, maxCapacity: ROOM_CAPACITY, lastActivity: "18 dk önce", isActive: true, topic: "Robert Caro — 'The Power Broker' hâlâ modern şehirciliğin temel metni mi?" },
  { id: "book-3", clubId: "books", clubName: "Satır Arası", name: "Raf", description: "Stoacılar, varoluşçular ve aralarındaki her şey.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "30 dk önce", isActive: true, topic: "Marcus Aurelius - Epiktetos: Kimin Stoacılığı daha doğrudan konuşur?" },
  { id: "book-4", clubId: "books", clubName: "Satır Arası", name: "Keşif", description: "Bilim insanları, keşifler, popüler bilim.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "49 dk önce", isActive: true, topic: "Humboldt'un Cosmos'u: 200 yıl sonra hâlâ okunabilir mi?" },
  { id: "book-5", clubId: "books", clubName: "Satır Arası", name: "Anadolu", description: "Cumhuriyet dönemi ve çağdaş Türk yazarlar.", memberCount: 19, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 5 dk önce", isActive: true, topic: "Sait Faik mi Sabahattin Ali mi — 20. yy Türk edebiyatının dönüm noktası" },

  // ── Film ve Dizi (5) ─────────────────────────────
  { id: "film-1", clubId: "film", clubName: "Perde", name: "Çerçeve", description: "Bergman, Tarkovsky, Godard ve sanat sineması külliyatı.", memberCount: 34, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Tarkovsky'nin 'Ayna'sı: bilinç akışı mı, öz biyografi mi?" },
  { id: "film-2", clubId: "film", clubName: "Perde", name: "Mercek", description: "Yönetmen sineması ve auteur teorisi.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "17 dk önce", isActive: true, topic: "Nolan ile Kubrick karşılaştırması: vizyon genişliği açısından" },
  { id: "film-3", clubId: "film", clubName: "Perde", name: "Külliyat", description: "Criterion seçkileri ve restorasyon projeleri.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "34 dk önce", isActive: true, topic: "Criterion'un 2025 seçimleri: hangileri gerçekten hak etti?" },
  { id: "film-4", clubId: "film", clubName: "Perde", name: "Bağımsız", description: "A24, MUBI ve bağımsız yapımlar.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "51 dk önce", isActive: true, topic: "A24'ün 2025 programı: marka kimliği mi güçleniyor, suluyor mu?" },
  { id: "film-5", clubId: "film", clubName: "Perde", name: "Altın Çağ", description: "1940–1975 arası Amerikan sineması.", memberCount: 16, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 18 dk önce", isActive: true, topic: "Billy Wilder'ın gişe başarısı ile eleştirmen sevgisi — çelişki mi?" },

  // ── Havacılık (5) ────────────────────────────────
  { id: "avia-1", clubId: "aviation", clubName: "İrtifa", name: "Piston", description: "Piston çağından jet devrimine.", memberCount: 24, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "De Havilland Comet trajedisi: havacılık güvenliğini nasıl yeniden yazdı?" },
  { id: "avia-2", clubId: "aviation", clubName: "İrtifa", name: "Kabin", description: "A320 ailesi — operasyonlar, teknik ve deneyimler.", memberCount: 19, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa önce", isActive: true, topic: "A321XLR'daki EFIS 2.0 ekran farklılıkları" },
  { id: "avia-3", clubId: "aviation", clubName: "İrtifa", name: "Pist", description: "Özel pilot lisansı, küçük uçaklar, serbest uçuş.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "26 dk önce", isActive: true, topic: "Cessna 172 vs Diamond DA40 — eğitim uçağı tercihi" },
  { id: "avia-4", clubId: "aviation", clubName: "İrtifa", name: "Simülatör", description: "MSFS, X-Plane ve profesyonel simülatörler.", memberCount: 36, maxCapacity: ROOM_CAPACITY, lastActivity: "13 dk önce", isActive: true, topic: "MSFS 2024 vs X-Plane 12 — gerçekçilik değerlendirmesi" },
  { id: "avia-5", clubId: "aviation", clubName: "İrtifa", name: "Ramp", description: "Spotting, havalimanları, nadir uçuşlar.", memberCount: 20, maxCapacity: ROOM_CAPACITY, lastActivity: "42 dk önce", isActive: true, topic: "İstanbul Atatürk üzerinden geçen son kargo trafiği" },

  // ── Gastronomi (5) ───────────────────────────────
  { id: "gastro-1", clubId: "gastronomy", clubName: "Sofra", name: "Yıldız", description: "Michelin yıldızlı restoranlar ve alta cucina.", memberCount: 30, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Noma kapandı — fine dining modeli gerçekten değişiyor mu?" },
  { id: "gastro-2", clubId: "gastronomy", clubName: "Sofra", name: "Terroir", description: "Terroir, bölge, yıl ve sofra uyumu.", memberCount: 25, maxCapacity: ROOM_CAPACITY, lastActivity: "23 dk önce", isActive: true, topic: "Burgundy 2021 vintage: yatırım mı, içim mi?" },
  { id: "gastro-3", clubId: "gastronomy", clubName: "Sofra", name: "Bar", description: "Bar kültürü, reçeteler, distileler.", memberCount: 17, maxCapacity: ROOM_CAPACITY, lastActivity: "45 dk önce", isActive: true, topic: "İstanbul'da şu an en iyi mezcal seçimi nerede?" },
  { id: "gastro-4", clubId: "gastronomy", clubName: "Sofra", name: "Ocak", description: "Sous vide, fermentasyon, ateş üstü pişirme.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 2 dk önce", isActive: true, topic: "Fermentasyon evde yapılabilir mi? Ekipman ve güvenlik rehberi" },
  { id: "gastro-5", clubId: "gastronomy", clubName: "Sofra", name: "Mahalle", description: "Geleneksel teknikler ve çağdaş yorumlar.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "38 dk önce", isActive: true, topic: "İstanbul'un yeni nesil Türk restoranları: otantiklik mi, yeniden yorum mu?" },

  // ── Araba ve Offroad (5) ─────────────────────────
  { id: "cars-1", clubId: "cars", clubName: "Garaj", name: "Döküm", description: "1950–1980 arası klasikler, orijinallik, onarım.", memberCount: 26, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "E-Type Jaguar restorasyon vs orijinal bırakma tartışması" },
  { id: "cars-2", clubId: "cars", clubName: "Garaj", name: "Platin", description: "Pist odaklı Porsche'lar ve onları düzgünce kullananlar.", memberCount: 24, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "PDK mi manuel mi — 992 GT3 için kesin tartışma" },
  { id: "cars-3", clubId: "cars", clubName: "Garaj", name: "Arazi", description: "Land Rover, Toyota, arazi hazırlıkları.", memberCount: 32, maxCapacity: ROOM_CAPACITY, lastActivity: "20 dk önce", isActive: true, topic: "Defender 110 vs GX 460 — Anadolu arazisi için hangisi?" },
  { id: "cars-4", clubId: "cars", clubName: "Garaj", name: "Sektör", description: "Trackday organizasyonu, sürüş teknikleri.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "İstanbul Park yeniden açılırsa: ilk trackday organizasyonu için hazır mıyız?" },
  { id: "cars-5", clubId: "cars", clubName: "Garaj", name: "Volt", description: "EV geçişi, altyapı, menzil gerçeği.", memberCount: 18, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 15 dk önce", isActive: true, topic: "Tesla vs Porsche Taycan: performans değil, uzun yolda yaşanabilirlik" },

  // ── Felsefe ve Sanat (5) ─────────────────────────
  { id: "phil-1", clubId: "philosophy", clubName: "Agora", name: "Stoa", description: "Sokrates, Platon, Aristoteles — kökler.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "10 dk önce", isActive: true, topic: "Platon'un mağara alegorisi — bugün hangi bağlamlarda hâlâ işe yarıyor?" },
  { id: "phil-2", clubId: "philosophy", clubName: "Agora", name: "Varoluş", description: "Kierkegaard, Nietzsche, Sartre, Camus.", memberCount: 34, maxCapacity: ROOM_CAPACITY, lastActivity: "15 dk önce", isActive: true, topic: "Camus'nun 'Sisifos' miti: anlamsızlıkla barış mı, kaçış mı?" },
  { id: "phil-3", clubId: "philosophy", clubName: "Agora", name: "Ayna", description: "Ahlak felsefesi, güncel ikilemler.", memberCount: 27, maxCapacity: ROOM_CAPACITY, lastActivity: "33 dk önce", isActive: true, topic: "Yapay zeka kararları: sorumluluk kimde, ahlaki özne olabilir mi?" },
  { id: "phil-4", clubId: "philosophy", clubName: "Agora", name: "Doğu", description: "Budizm, Taoizm, Konfüçyüsçülük ve Zen.", memberCount: 21, maxCapacity: ROOM_CAPACITY, lastActivity: "48 dk önce", isActive: true, topic: "Zen ve Stoacılık — aynı noktaya mı varıyor, yoksa temelden farklı mı?" },
  { id: "phil-5", clubId: "philosophy", clubName: "Agora", name: "Estetik", description: "Estetik, güzellik teorileri, yorumlama.", memberCount: 16, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 30 dk önce", isActive: true, topic: "Duchamp'ın pisuarından bu yana: çağdaş sanat hâlâ 'sanat' mı?" },

  // ── Finans ve Kripto (5) ─────────────────────────
  { id: "fin-1", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Makro Ekonomi", description: "Merkez bankaları, enflasyon, küresel ekonomi.", memberCount: 36, maxCapacity: ROOM_CAPACITY, lastActivity: "4 dk önce", isActive: true, topic: "Fed'in 2026 faiz politikası: piyasa fiyatlaması gerçeği yansıtıyor mu?" },
  { id: "fin-2", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Kripto ve DeFi", description: "Bitcoin, Ethereum, protokol tartışmaları.", memberCount: 40, maxCapacity: ROOM_CAPACITY, lastActivity: "2 dk önce", isActive: true, topic: "Bitcoin ETF sonrası: kurumsal giriş fiyatlaması tamamlandı mı?" },
  { id: "fin-3", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Değer Yatırımcılığı", description: "Temel analiz, uzun vadeli portföy.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "21 dk önce", isActive: true, topic: "Buffett'ın nakit pozisyonu — sinyal mi, strateji mi?" },
  { id: "fin-4", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Gayrimenkul", description: "Konut, ticari gayrimenkul, REIT.", memberCount: 33, maxCapacity: ROOM_CAPACITY, lastActivity: "36 dk önce", isActive: true, topic: "İstanbul'da ofis boşluk oranı — ticari gayrimenkul nereye gidiyor?" },
  { id: "fin-5", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Alternatif Varlıklar", description: "Sanat, viski, araba — finansal varlık olarak.", memberCount: 24, maxCapacity: ROOM_CAPACITY, lastActivity: "58 dk önce", isActive: true, topic: "Whisky fonları vs fiziksel şişe — likidite ve gerçek getiri" },

  // ── Müzik (5) ────────────────────────────────────
  { id: "music-1", clubId: "music", clubName: "Rezonans", name: "Kontrbas", description: "Miles Davis'ten günümüze caz ve alt türleri.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "7 dk önce", isActive: true, topic: "Kind of Blue 60. yıl dönümü: neden hâlâ ilk dinleyiş gibi geliyor?" },
  { id: "music-2", clubId: "music", clubName: "Rezonans", name: "Kürsü", description: "Orkestra, oda müziği ve opera.", memberCount: 25, maxCapacity: ROOM_CAPACITY, lastActivity: "24 dk önce", isActive: true, topic: "Glenn Gould'un Goldberg varyasyonları: 1955 vs 1981 — hangisi daha derin?" },
  { id: "music-3", clubId: "music", clubName: "Rezonans", name: "Plak", description: "Orijinal baskılar, ses kalitesi, koleksiyon.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "40 dk önce", isActive: true, topic: "180gr repress vs orijinal baskı — fark gerçek mi, psikolojik mi?" },
  { id: "music-4", clubId: "music", clubName: "Rezonans", name: "Armoni", description: "Armoni, kontrpuan, kompozisyon.", memberCount: 19, maxCapacity: ROOM_CAPACITY, lastActivity: "55 dk önce", isActive: true, topic: "Modal jazz'ın teorik temelleri — Dorian ve Mixolydian karşılaştırması" },
  { id: "music-5", clubId: "music", clubName: "Rezonans", name: "Demo", description: "Indie, alternatif ve bağımsız yapımlar.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 8 dk önce", isActive: true, topic: "Bandcamp'in satıştan sonraki durumu — bağımsız sanatçılar ne yapmalı?" },
  { id: "music-6", clubId: "music", clubName: "Rezonans", name: "Sahne", description: "Canlı müzik deneyimleri, setlist analizleri.", memberCount: 41, maxCapacity: ROOM_CAPACITY, lastActivity: "3 dk önce", isActive: true, topic: "İstanbul Jazz Festivali 2026 beklentileri" },
  { id: "music-7", clubId: "music", clubName: "Rezonans", name: "303", description: "Ambient, techno, minimal ve deneysel.", memberCount: 33, maxCapacity: ROOM_CAPACITY, lastActivity: "27 dk önce", isActive: true, topic: "Aphex Twin'in Son işleri: Selected Ambient Works hâlâ tavan mı?" },
  { id: "music-8", clubId: "music", clubName: "Rezonans", name: "Makam", description: "Türk, Arap, Flamenco ve folk gelenekleri.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "52 dk önce", isActive: true, topic: "Münir Nurettin Selçuk arşivleri: yeniden keşif ve dijitalleştirme" },

  // ── Havacılık +3 ─────────────────────────────────
  { id: "avia-6", clubId: "aviation", clubName: "İrtifa", name: "Kule", description: "ATC prosedürleri, frekanslar, telsiz kullanımı.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "ILS vs GPS yaklaşımı — alçak görüşlülükte hangisi tercih edilmeli?" },
  { id: "avia-7", clubId: "aviation", clubName: "İrtifa", name: "Kare", description: "Spotter etiği, ekipman, en iyi noktalar.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "33 dk önce", isActive: true, topic: "İstanbul Havalimanı kuzey peronu için yeni erişim noktaları" },
  { id: "avia-8", clubId: "aviation", clubName: "İrtifa", name: "Yörünge", description: "SpaceX, süpersonik, elektrikli uçuş.", memberCount: 54, maxCapacity: ROOM_CAPACITY, lastActivity: "16 dk önce", isActive: true, topic: "Boom Overture'un 2026 ilerleme durumu: gerçekçi mi?" },

  // ── Gastronomi +3 ────────────────────────────────
  { id: "gastro-6", clubId: "gastronomy", clubName: "Sofra", name: "Çekirdek", description: "Specialty, espresso, brüv yöntemleri.", memberCount: 67, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Washed vs natural process: Etiyopya kökenli specialty tartışması" },
  { id: "gastro-7", clubId: "gastronomy", clubName: "Sofra", name: "Köşe", description: "Şehir rehberleri, gizli noktalar, sezonal lezzetler.", memberCount: 88, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "İstanbul Karaköy'de hâlâ gerçek nohutlu pilav nerede bulunur?" },
  { id: "gastro-8", clubId: "gastronomy", clubName: "Sofra", name: "Doğal", description: "Biyodinamik, doğal fermantasyon, Türk şarapçılığı.", memberCount: 43, maxCapacity: ROOM_CAPACITY, lastActivity: "38 dk önce", isActive: true, topic: "Türkiye'nin doğal şarap üreticileri: Corvus ve Çamlıbağ karşılaştırması" },

  // ── Araba +3 ─────────────────────────────────────
  { id: "cars-6", clubId: "cars", clubName: "Garaj", name: "Pit Lane", description: "F1, WRC, Le Mans — yarış sporunun derinleri.", memberCount: 95, maxCapacity: ROOM_CAPACITY, lastActivity: "2 dk önce", isActive: true, topic: "2026 F1 yeni regülasyonları: güç dengesi gerçekten değişiyor mu?" },
  { id: "cars-7", clubId: "cars", clubName: "Garaj", name: "Ekspertiz", description: "Fiyat müzakeresi, inceleme önerileri, tuzaklar.", memberCount: 72, maxCapacity: ROOM_CAPACITY, lastActivity: "19 dk önce", isActive: true, topic: "İkinci el Porsche 911 alırken PPI dışında ne kontrol edilmeli?" },
  { id: "cars-8", clubId: "cars", clubName: "Garaj", name: "Restomod", description: "Custom build, restomod projeleri.", memberCount: 36, maxCapacity: ROOM_CAPACITY, lastActivity: "44 dk önce", isActive: true, topic: "1970 Mustang restomod: EV mi, crate motor mu?" },

  // ── Felsefe +3 ───────────────────────────────────
  { id: "phil-6", clubId: "philosophy", clubName: "Agora", name: "Polis", description: "Adaletten özgürlüğe, iktidar teorileri.", memberCount: 58, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Rawls vs Nozick: günümüz gelir eşitsizliği tartışmalarında hâlâ geçerli mi?" },
  { id: "phil-7", clubId: "philosophy", clubName: "Agora", name: "Paradigma", description: "Epistemoloji, bilimsel yöntem, paradigma.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "29 dk önce", isActive: true, topic: "Kuhn'un 'Bilimsel Devrimlerin Yapısı' — yapay zeka çağında hâlâ geçerli mi?" },
  { id: "phil-8", clubId: "philosophy", clubName: "Agora", name: "Analiz", description: "Analitik ve kıta felsefesi, güncel tartışmalar.", memberCount: 39, maxCapacity: ROOM_CAPACITY, lastActivity: "53 dk önce", isActive: true, topic: "Bilinç problemi: filozoflar ve nörobilimciler neden hâlâ aynı fikirde değil?" },

  // ── Finans +3 ────────────────────────────────────
  { id: "fin-6", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Girişim ve Startup", description: "Erken aşama yatırım, melek yatırım, VC.", memberCount: 125, maxCapacity: ROOM_CAPACITY, lastActivity: "1 dk önce", isActive: true, topic: "2026 Türk startup ekosistemi: hangi sektörler büyüyor?" },
  { id: "fin-7", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Emeklilik Planlaması", description: "Uzun vadeli portföy, TRS, yurt dışı hesaplar.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "31 dk önce", isActive: true, topic: "Türk yatırımcı için dolar bazlı emeklilik: pratik yollar" },
  { id: "fin-8", clubId: "finance", clubName: "Finans, Borsa ve Kripto", name: "Yabancı Piyasalar", description: "NYSE, LSE, Asya borsaları ve ETF stratejileri.", memberCount: 61, maxCapacity: ROOM_CAPACITY, lastActivity: "47 dk önce", isActive: true, topic: "Çin piyasaları 2026: yapısal risk mi, değerleme fırsatı mı?" },

  // ── Motosiklet +3 ────────────────────────────────
  { id: "moto-6", clubId: "motorcycles", clubName: "Apex", name: "ECU", description: "ECU ayarı, egzoz, hız tutucu donanımı.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "14 dk önce", isActive: true, topic: "Quickshifter aftermarket vs OEM: ses ve güvenilirlik farkı" },
  { id: "moto-7", clubId: "motorcycles", clubName: "Apex", name: "Trafik", description: "Trafik hukuku, sigorta taktikleri, haklar.", memberCount: 37, maxCapacity: ROOM_CAPACITY, lastActivity: "41 dk önce", isActive: true, topic: "Kask kamerası hukuki açıdan delil sayılır mı? Güncel içtihatlar" },
  { id: "moto-8", clubId: "motorcycles", clubName: "Apex", name: "Buluşma", description: "Tur organizasyonları, buluşmalar, ralliler.", memberCount: 66, maxCapacity: ROOM_CAPACITY, lastActivity: "22 dk önce", isActive: true, topic: "2026 Güz ORUN Moto Turu: Kapadokya rotası netleşiyor" },

  // ── Saat +3 ──────────────────────────────────────
  { id: "watch-6", clubId: "watches", clubName: "Kadran", name: "Bant", description: "NATO, kauçuk, timsah — materyal ve tarz.", memberCount: 52, maxCapacity: ROOM_CAPACITY, lastActivity: "16 dk önce", isActive: true, topic: "Hirsch vs Barton: gerçek timsah kalitesi nasıl ayırt edilir?" },
  { id: "watch-7", clubId: "watches", clubName: "Kadran", name: "Revizyon", description: "Revizyon, ultrasonik temizlik, servis dönemleri.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "43 dk önce", isActive: true, topic: "Rolex servis fiyatları 2026: orijinal servis vs yetkili dışı fark" },
  { id: "watch-8", clubId: "watches", clubName: "Kadran", name: "W&W", description: "Baselworld/Watches & Wonders, yeni referanslar.", memberCount: 78, maxCapacity: ROOM_CAPACITY, lastActivity: "7 dk önce", isActive: true, topic: "2026 Watches & Wonders en çok konuşulan 5 referans" },

  // ── Viski +3 ─────────────────────────────────────
  { id: "whisky-6", clubId: "whisky", clubName: "Mahzen", name: "Küre", description: "İrlanda, Tayvan, İskandinav damıtma sahnesi.", memberCount: 57, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "Kavalan Solist vs Yamazaki 12: Asya viski karşılaştırması" },
  { id: "whisky-7", clubId: "whisky", clubName: "Mahzen", name: "Masa", description: "Tadım seti oluşturma, eşleştirme, not tutma.", memberCount: 43, maxCapacity: ROOM_CAPACITY, lastActivity: "35 dk önce", isActive: true, topic: "Ideal 6 şişelik başlangıç tadım seti — her bütçe için öneriler" },
  { id: "whisky-8", clubId: "whisky", clubName: "Mahzen", name: "Distileri", description: "İskoçya, İrlanda, Japonya tur raporları.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "58 dk önce", isActive: true, topic: "Speyside turunda düşük profilli ama ziyaret zorunlu distileri" },

  // ── Puro +3 ──────────────────────────────────────
  { id: "cigar-6", clubId: "cigars", clubName: "Amber", name: "Kesici", description: "Kesiciler, kibritler, kül tablası — ekipman rehberi.", memberCount: 34, maxCapacity: ROOM_CAPACITY, lastActivity: "18 dk önce", isActive: true, topic: "Xikar vs Colibri guillotine kesici: uzun vadeli tercih" },
  { id: "cigar-7", clubId: "cigars", clubName: "Amber", name: "Sezon", description: "Yaz ve kış için beden ve sera önerileri.", memberCount: 27, maxCapacity: ROOM_CAPACITY, lastActivity: "49 dk önce", isActive: true, topic: "Yaz sıcağında nemli iklimde puro muhafazası: pratik rehber" },
  { id: "cigar-8", clubId: "cigars", clubName: "Amber", name: "Rezerv", description: "Kısıtlı üretimler, bölge özel serileri.", memberCount: 19, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 22 dk önce", isActive: true, topic: "Cohiba Siglo VI Gran Reserva Cosecha 2016 — son stoklar nerede?" },

  // ── Kitaplar +3 ──────────────────────────────────
  { id: "book-6", clubId: "books", clubName: "Satır Arası", name: "Panel", description: "Maus'tan Watchmen'e, Moebius'tan Tanpınar adaptasyonlarına.", memberCount: 48, maxCapacity: ROOM_CAPACITY, lastActivity: "13 dk önce", isActive: true, topic: "Graphic novel olarak siyasi tarih: 'Persepolis' sonrası en etkileyiciler" },
  { id: "book-7", clubId: "books", clubName: "Satır Arası", name: "Halka", description: "Aylık ortak okuma, tartışma, soru-cevap.", memberCount: 73, maxCapacity: ROOM_CAPACITY, lastActivity: "4 dk önce", isActive: true, topic: "Mayıs Kitabı: Kazuo Ishiguro — 'Klara and the Sun' bölüm tartışması" },
  { id: "book-8", clubId: "books", clubName: "Satır Arası", name: "Tercüme", description: "Özgün dil okuma, çeviri kalitesi tartışmaları.", memberCount: 35, maxCapacity: ROOM_CAPACITY, lastActivity: "36 dk önce", isActive: true, topic: "Dostoevsky'nin yeni Türkçe çevirisi: Özgün mi, Rusçadan mı okunmalı?" },

  // ── Film +3 ──────────────────────────────────────
  { id: "film-6", clubId: "film", clubName: "Perde", name: "Gerçek", description: "Belgesel film sanatı ve önerileri.", memberCount: 64, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "Errol Morris belgesellerinde nesnel gerçek sorunu" },
  { id: "film-7", clubId: "film", clubName: "Perde", name: "Çizgi", description: "Studio Ghibli, Pixar, Avrupa animasyonu.", memberCount: 55, maxCapacity: ROOM_CAPACITY, lastActivity: "21 dk önce", isActive: true, topic: "Miyazaki'nin son filmi: veda mı, yeni bir başlangıç mı?" },
  { id: "film-8", clubId: "film", clubName: "Perde", name: "Kırmızı Halı", description: "Cannes, Berlin, Venedik — festival sezonu.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "39 dk önce", isActive: true, topic: "Cannes 2026 En İyi Film: kazanan ve kaybeden değerlendirmesi" },

  // ── Dil Odaları +3 ───────────────────────────────
  { id: "lang-zh", clubId: "languages", clubName: "Yabancı Dil", name: "Çince Pratik", description: "AI destekli Mandarin konuşma pratiği.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "Günlük Mandarin: sipariş, selamlama ve temel konuşmalar", isLanguageRoom: true, targetLanguage: "en" },
  { id: "lang-ja", clubId: "languages", clubName: "Yabancı Dil", name: "Japonca Pratik", description: "AI destekli Japonca konuşma pratiği.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "Keigo (kibar dil) ve günlük konuşma farkı — pratik rehber", isLanguageRoom: true, targetLanguage: "en" },
  { id: "lang-ar", clubId: "languages", clubName: "Yabancı Dil", name: "Arapça Pratik", description: "AI destekli Modern Standart Arapça pratiği.", memberCount: 26, maxCapacity: ROOM_CAPACITY, lastActivity: "24 dk önce", isActive: true, topic: "Fus'ha ve Amiyye arasında nerede durmalı? Başlangıç rehberi", isLanguageRoom: true, targetLanguage: "en" },

  // ── ORUN Master Kulüp (8 oda) ────────────────────
  { id: "master-1", clubId: "master", clubName: "ORUN", name: "Genel Sohbet", description: "Tüm üyelerin serbest buluşma noktası.", memberCount: 112, maxCapacity: ROOM_CAPACITY, lastActivity: "Az önce", isActive: true, topic: "Bu hafta ORUN'da neler konuşuldu? Haftalık özet ve öne çıkanlar" },
  { id: "master-2", clubId: "master", clubName: "ORUN", name: "Yeni Üyeler", description: "Tanışma, ilk adımlar ve topluluk rehberi.", memberCount: 89, maxCapacity: ROOM_CAPACITY, lastActivity: "3 dk önce", isActive: true, topic: "Hoş geldiniz — kendinizi kısaca tanıtın ve ilgi alanlarınızı paylaşın" },
  { id: "master-3", clubId: "master", clubName: "ORUN", name: "Haftanın Gündemi", description: "Tüm kulüplerdeki öne çıkan tartışmalar.", memberCount: 97, maxCapacity: ROOM_CAPACITY, lastActivity: "7 dk önce", isActive: true, topic: "17 Mayıs haftası: Finans'tan kripto, Kitaplar'dan Ishiguro, Film'den Cannes" },
  { id: "master-4", clubId: "master", clubName: "ORUN", name: "Sorular ve Cevaplar", description: "Topluluk soruları, merak edilen her şey.", memberCount: 76, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "Soru: Bekleme süresi olmadan hangi odalara girebilirsiniz?" },
  { id: "master-5", clubId: "master", clubName: "ORUN", name: "Öneri Kutusu", description: "Yeni özellik ve iyileştirme önerileri.", memberCount: 53, maxCapacity: ROOM_CAPACITY, lastActivity: "28 dk önce", isActive: true, topic: "En çok talep edilen özellik: kulüpler arası çapraz sohbet" },
  { id: "master-6", clubId: "master", clubName: "ORUN", name: "Duyurular", description: "Resmi ORUN duyuruları ve güncellemeler.", memberCount: 125, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa önce", isActive: true, topic: "ORUN v2.1 — Oda erişim sistemi ve master kulüp yayında" },
  { id: "master-7", clubId: "master", clubName: "ORUN", name: "Haber ve Güncel", description: "Dünyanın nabzı — kültür, teknoloji, toplum.", memberCount: 103, maxCapacity: ROOM_CAPACITY, lastActivity: "15 dk önce", isActive: true, topic: "Yapay zeka ve yaratıcılık: araç mı, tehdit mi, eşlikçi mi?" },
  { id: "master-8", clubId: "master", clubName: "ORUN", name: "Etkinlikler", description: "Buluşmalar, online oturumlar, toplantılar.", memberCount: 68, maxCapacity: ROOM_CAPACITY, lastActivity: "33 dk önce", isActive: true, topic: "2026 Yaz ORUN Buluşması — İstanbul yer ve tarih oylaması" },

  // ── Denizcilik (8) ────────────────────────────────
  { id: "mar-1", clubId: "maritime", clubName: "Liman", name: "Tekne", description: "Tekne sahipleri, marka tartışmaları, bakım.", memberCount: 67, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Beneteau Oceanis 45 vs Bavaria C45 — mavi suda uzun yol için hangisi?" },
  { id: "mar-2", clubId: "maritime", clubName: "Liman", name: "Yelken", description: "Yarış ve kruvaziyer yelken, teknik ve taktik.", memberCount: 54, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "Meltemi'de yelken: Ege'de yaz sezonu güzergah önerileri 2026" },
  { id: "mar-3", clubId: "maritime", clubName: "Liman", name: "Derinlik", description: "Dalış noktaları, sertifikasyon, ekipman.", memberCount: 43, maxCapacity: ROOM_CAPACITY, lastActivity: "18 dk önce", isActive: true, topic: "Kaş-Kekova dalış noktaları: görüş mesafesi ve deniz yaşamı raporu" },
  { id: "mar-4", clubId: "maritime", clubName: "Liman", name: "İskele", description: "Teknik, nokta paylaşımı, sezon rehberi.", memberCount: 39, maxCapacity: ROOM_CAPACITY, lastActivity: "27 dk önce", isActive: true, topic: "Karadeniz hamsi sezonu 2026: başlangıç tarihi ve nokta tahminleri" },
  { id: "mar-5", clubId: "maritime", clubName: "Liman", name: "Rota", description: "Deniz haritaları, GPS, planlama.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "41 dk önce", isActive: true, topic: "Navionics vs OpenCPN: Türkiye kıyıları için hangisi daha güncel?" },
  { id: "mar-6", clubId: "maritime", clubName: "Liman", name: "Marina", description: "Türkiye marinalar, fiyat ve hizmet karşılaştırması.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "55 dk önce", isActive: true, topic: "D-Marin Göcek 2026 sezon fiyatları ve yoğunluk tahminleri" },
  { id: "mar-7", clubId: "maritime", clubName: "Liman", name: "Mevzuat", description: "Ehliyet, mevzuat, sigorta rehberi.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 10 dk önce", isActive: true, topic: "Yeni SHGM tekne ehliyeti sınavı: değişen kurallar ve pratik hazırlık" },
  { id: "mar-8", clubId: "maritime", clubName: "Liman", name: "Demir", description: "Koy kamp, gece seyr-ü seferi, atmosfer.", memberCount: 19, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 45 dk önce", isActive: true, topic: "Türkiye'nin en sessiz koyu: kişisel favorileriniz ve koordinatlar" },

  // ── Spor ve Fitness (8) ───────────────────────────
  { id: "fit-1", clubId: "fitness", clubName: "Tempo", name: "Kilometre", description: "Antrenman planları, yarışlar, teknik.", memberCount: 89, maxCapacity: ROOM_CAPACITY, lastActivity: "3 dk önce", isActive: true, topic: "İstanbul Maratonu 2026: sub-4 hedefi için 16 haftalık plan" },
  { id: "fit-2", clubId: "fitness", clubName: "Tempo", name: "Pedal", description: "Yol, gravel, MTB — teknik ve rota.", memberCount: 76, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Shimano 105 Di2 vs SRAM Rival AXS: fiyat-performans 2026" },
  { id: "fit-3", clubId: "fitness", clubName: "Tempo", name: "Demir", description: "Powerlifting, bodybuilding, fonksiyonel antrenman.", memberCount: 94, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Progressive overload pratikte nasıl uygulanır? Haftalık artış protokolleri" },
  { id: "fit-4", clubId: "fitness", clubName: "Tempo", name: "Havuz", description: "Teknik, açık su, yarışlar.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "23 dk önce", isActive: true, topic: "Açık su yüzüşü için soğuk su adaptasyonu: protokol ve güvenlik" },
  { id: "fit-5", clubId: "fitness", clubName: "Tempo", name: "Yakıt", description: "Spor beslenmesi, takviye, periyodizasyon.", memberCount: 83, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "Kreatin, protein tozu, kafein: kanıtlanmış takviyeler ve dozlama" },
  { id: "fit-6", clubId: "fitness", clubName: "Tempo", name: "Patika", description: "Trail koşu, doğa yürüyüşü, ultramaraton.", memberCount: 58, maxCapacity: ROOM_CAPACITY, lastActivity: "35 dk önce", isActive: true, topic: "Kaçkar Ultra 2026 hazırlık: irtifa antrenmanı ve ekipman listesi" },
  { id: "fit-7", clubId: "fitness", clubName: "Tempo", name: "Nefes", description: "Esneklik, denge, nefes çalışması.", memberCount: 41, maxCapacity: ROOM_CAPACITY, lastActivity: "52 dk önce", isActive: true, topic: "Sabah yoga rutini ve atletik performansa katkısı: bilimsel kanıtlar" },
  { id: "fit-8", clubId: "fitness", clubName: "Tempo", name: "Start", description: "Yarış takvimleri, hedefler, sonuç paylaşımı.", memberCount: 65, maxCapacity: ROOM_CAPACITY, lastActivity: "19 dk önce", isActive: true, topic: "2026 Mayıs-Haziran Türkiye yarış takvimi: kayıt son tarihleri" },

  // ── Tarih (8) ─────────────────────────────────────
  { id: "hist-1", clubId: "history", clubName: "Tarih", name: "Osmanlı Tarihi", description: "İmparatorluk dönemi, kurumlar ve toplum.", memberCount: 73, maxCapacity: ROOM_CAPACITY, lastActivity: "7 dk önce", isActive: true, topic: "Tanzimat reformları: gerçek modernleşme mi, diplomatik manevra mı?" },
  { id: "hist-2", clubId: "history", clubName: "Tarih", name: "Antik Çağ", description: "Roma, Yunan, Pers ve Anadolu uygarlıkları.", memberCount: 58, maxCapacity: ROOM_CAPACITY, lastActivity: "14 dk önce", isActive: true, topic: "Troya gerçekten var mıydı? Arkeoloji ve Homeros arasındaki boşluk" },
  { id: "hist-3", clubId: "history", clubName: "Tarih", name: "İkinci Dünya Savaşı", description: "Avrupa ve Pasifik cepheleri, analiz.", memberCount: 81, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "Doğu Cephesi'nin savaşın sonucunu belirlemedeki ağırlığı" },
  { id: "hist-4", clubId: "history", clubName: "Tarih", name: "Askeri Tarih", description: "Savaşlar, stratejiler, liderler.", memberCount: 67, maxCapacity: ROOM_CAPACITY, lastActivity: "22 dk önce", isActive: true, topic: "Çanakkale'nin taktiksel başarısının stratejik sonuçları" },
  { id: "hist-5", clubId: "history", clubName: "Tarih", name: "Arkeoloji", description: "Kazılar, bulgular, koruma tartışmaları.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "38 dk önce", isActive: true, topic: "Göbeklitepe yeniden: 2026 kazı sezonu bulguları ve çıkarımlar" },
  { id: "hist-6", clubId: "history", clubName: "Tarih", name: "Belgesel ve Kaynaklar", description: "Kitap, belgesel ve arşiv önerileri.", memberCount: 36, maxCapacity: ROOM_CAPACITY, lastActivity: "49 dk önce", isActive: true, topic: "En iyi Osmanlı tarihi kaynakları: akademik vs popüler karşılaştırma" },
  { id: "hist-7", clubId: "history", clubName: "Tarih", name: "Cumhuriyet Tarihi", description: "1923'ten günümüze Türkiye siyasi tarihi.", memberCount: 55, maxCapacity: ROOM_CAPACITY, lastActivity: "31 dk önce", isActive: true, topic: "1950 seçimleri ve DP iktidarı: çok partili hayata geçişin sosyal temelleri" },
  { id: "hist-8", clubId: "history", clubName: "Tarih", name: "Dünya Tarihi", description: "Global bakış açısı, karşılaştırmalı tarih.", memberCount: 48, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 5 dk önce", isActive: true, topic: "Çin'in yükselişi tarihsel perspektiften: Tang'dan günümüze döngüler" },

  // ── Moda (8) ──────────────────────────────────────
  { id: "fash-1", clubId: "fashion", clubName: "Moda", name: "Erkek Giyimi", description: "Takım elbise, casual, streetwear — erkek stili.", memberCount: 71, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "İtalyan vs İngiliz kesimi 2026: hangisi günümüz yaşam tarzına daha uygun?" },
  { id: "fash-2", clubId: "fashion", clubName: "Moda", name: "Kadın Giyimi", description: "Sezon trendleri, tasarımcılar, stil rehberi.", memberCount: 84, maxCapacity: ROOM_CAPACITY, lastActivity: "4 dk önce", isActive: true, topic: "Quiet luxury akımı 2026'da: hâlâ geçerli mi, yoksa yerini aldı mı?" },
  { id: "fash-3", clubId: "fashion", clubName: "Moda", name: "Vintage ve Arşiv", description: "İkinci el, arşiv parçalar, resale piyasası.", memberCount: 63, maxCapacity: ROOM_CAPACITY, lastActivity: "15 dk önce", isActive: true, topic: "Vestiaire vs Depop: hangi platform daha güvenilir ve adil fiyatlı?" },
  { id: "fash-4", clubId: "fashion", clubName: "Moda", name: "Bağımsız Tasarımcılar", description: "Yerli ve uluslararası bağımsız markalar.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "28 dk önce", isActive: true, topic: "Türk bağımsız tasarımcıları 2026: global radar yakalayan isimler" },
  { id: "fash-5", clubId: "fashion", clubName: "Moda", name: "Aksesuar", description: "Çanta, kemer, ayakkabı ve takı.", memberCount: 55, maxCapacity: ROOM_CAPACITY, lastActivity: "21 dk önce", isActive: true, topic: "Hermès Birkin vs Saint Laurent Le 5 à 7: yatırım değeri gerçek mi?" },
  { id: "fash-6", clubId: "fashion", clubName: "Moda", name: "Sürdürülebilir Moda", description: "Etik üretim, slow fashion, çevre dostu markalar.", memberCount: 39, maxCapacity: ROOM_CAPACITY, lastActivity: "44 dk önce", isActive: true, topic: "Greenwashing ve gerçek sürdürülebilirlik: fark nasıl anlaşılır?" },
  { id: "fash-7", clubId: "fashion", clubName: "Moda", name: "Stil Rehberi", description: "Kapsül gardırop, renk uyumu, vücut tipine göre giyim.", memberCount: 68, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "10 parçalık kapsül gardırop: iklim ve yaşam tarzına göre seçim" },
  { id: "fash-8", clubId: "fashion", clubName: "Moda", name: "Pazar ve Koleksiyon", description: "Koleksiyonculuk, özel parçalar, auksiyon.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 20 dk önce", isActive: true, topic: "Vintage Chanel tweed ceket: otantiklik kontrolü ve değer tespiti" },

  // ── Tarım (8) ─────────────────────────────────────
  { id: "agr-1", clubId: "agriculture", clubName: "Tarım", name: "Sebze ve Meyve", description: "Ev bahçesi, balkon sebzeciliği, yetiştirme rehberi.", memberCount: 58, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "Kalsiyum eksikliği ve domates çiçek ucu çürümesi: kesin çözüm" },
  { id: "agr-2", clubId: "agriculture", clubName: "Tarım", name: "Arıcılık", description: "Kovan yönetimi, bal üretimi, sağlık.", memberCount: 43, maxCapacity: ROOM_CAPACITY, lastActivity: "24 dk önce", isActive: true, topic: "Varroa akarına karşı organik mücadele: okzalik asit uygulama zamanı" },
  { id: "agr-3", clubId: "agriculture", clubName: "Tarım", name: "Organik Tarım", description: "Sertifikasyon, yöntemler, pazar erişimi.", memberCount: 51, maxCapacity: ROOM_CAPACITY, lastActivity: "18 dk önce", isActive: true, topic: "Türkiye organik sertifikasyon süreci: maliyet ve bürokratik engeller" },
  { id: "agr-4", clubId: "agriculture", clubName: "Tarım", name: "Toprak ve Kompost", description: "Toprak sağlığı, kompostlama, vermikompost.", memberCount: 37, maxCapacity: ROOM_CAPACITY, lastActivity: "36 dk önce", isActive: true, topic: "Vermikompost vs klasik kompost: mikrobiyom açısından fark ne?" },
  { id: "agr-5", clubId: "agriculture", clubName: "Tarım", name: "Su Yönetimi", description: "Damla sulama, yağmur suyu toplama, verimlilik.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "29 dk önce", isActive: true, topic: "Akıllı sulama kontrolcüleri: maliyet geri dönüşü ve pratik deneyimler" },
  { id: "agr-6", clubId: "agriculture", clubName: "Tarım", name: "Tohumculuk", description: "Yerel tohumlar, tohumluk saklama, çeşitlilik.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "48 dk önce", isActive: true, topic: "Anadolu yerel domates çeşitleri: kayıp tohumların izinde" },
  { id: "agr-7", clubId: "agriculture", clubName: "Tarım", name: "Kentsel Tarım", description: "Çatı bahçeleri, hydroponik, balkon tarımı.", memberCount: 62, maxCapacity: ROOM_CAPACITY, lastActivity: "15 dk önce", isActive: true, topic: "NFT hydroponik vs toprak: İstanbul apartman dairesinde hangisi işe yarar?" },
  { id: "agr-8", clubId: "agriculture", clubName: "Tarım", name: "Tarım Teknolojisi", description: "Drone, sensör, veri odaklı tarım.", memberCount: 35, maxCapacity: ROOM_CAPACITY, lastActivity: "57 dk önce", isActive: true, topic: "DJI Agras T50 dron ilaçlama: maliyet analizi ve erişilebilirlik" },

  // ── Peyzaj (8) ────────────────────────────────────
  { id: "land-1", clubId: "landscaping", clubName: "Peyzaj", name: "Bahçe Tasarımı", description: "Konsept, plan, bitki seçimi.", memberCount: 48, maxCapacity: ROOM_CAPACITY, lastActivity: "13 dk önce", isActive: true, topic: "Kuru bahçe (xeriscaping) Türkiye'nin Akdeniz iklimine uygunluğu" },
  { id: "land-2", clubId: "landscaping", clubName: "Peyzaj", name: "Bitkiler ve Bakım", description: "Yerel bitkiler, budama, gübreleme.", memberCount: 55, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Zeytin ağacı bakımı: budama zamanı ve biçimi şehir bahçesinde" },
  { id: "land-3", clubId: "landscaping", clubName: "Peyzaj", name: "Su Özellikleri", description: "Havuz, gölet, şelale tasarımı.", memberCount: 33, maxCapacity: ROOM_CAPACITY, lastActivity: "32 dk önce", isActive: true, topic: "Küçük bahçe göleti: ekosistem, filtre ve kurbağa davet etmek" },
  { id: "land-4", clubId: "landscaping", clubName: "Peyzaj", name: "Dış Mekan Mobilyası", description: "Malzeme, dayanıklılık, estetik.", memberCount: 41, maxCapacity: ROOM_CAPACITY, lastActivity: "27 dk önce", isActive: true, topic: "Teakwood vs IPE vs kompozit deck: 10 yıl sonra kim kazanıyor?" },
  { id: "land-5", clubId: "landscaping", clubName: "Peyzaj", name: "Aydınlatma", description: "Bahçe ışıklandırması, LED, güneş enerjili.", memberCount: 37, maxCapacity: ROOM_CAPACITY, lastActivity: "43 dk önce", isActive: true, topic: "Warm vs cool white bahçe aydınlatması: bitki ve ahşap için renk sıcaklığı" },
  { id: "land-6", clubId: "landscaping", clubName: "Peyzaj", name: "Terras ve Balkon", description: "Küçük alanlarda büyük etki tasarım fikirleri.", memberCount: 64, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "40m² teras peyzajı: mahremiyet, yeşil duvar ve saksı kompozisyonu" },
  { id: "land-7", clubId: "landscaping", clubName: "Peyzaj", name: "Mevsimlik Planlama", description: "4 mevsim canlı bahçe planlaması.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "54 dk önce", isActive: true, topic: "Kış bahçesi: İstanbul ikliminde Ocak-Şubat'ta renkli kalan bitkiler" },
  { id: "land-8", clubId: "landscaping", clubName: "Peyzaj", name: "Ağaç ve Çalı", description: "Büyük ölçekli peyzaj, ağaç seçimi.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa 30 dk önce", isActive: true, topic: "Japon akçaağacı Türkiye'de yetiştirilir mi? Toprak ve iklim gereksinimleri" },

  // ── Dağcılık (8) ──────────────────────────────────
  { id: "mnt-1", clubId: "mountaineering", clubName: "Dağcılık", name: "Teknik Tırmanış", description: "Kaya tırmanışı, bouldering, spor tırmanış.", memberCount: 61, maxCapacity: ROOM_CAPACITY, lastActivity: "10 dk önce", isActive: true, topic: "Geyikbayırı sport tırmanış: güz sezonu için en iyi güzergahlar" },
  { id: "mnt-2", clubId: "mountaineering", clubName: "Dağcılık", name: "Yüksek Rakım", description: "4000m+ zirve hedefleri ve aklimatizasyon.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "17 dk önce", isActive: true, topic: "Ağrı Dağı 2026 sezonu: izin süreci ve Doğubayazıt rehber listesi" },
  { id: "mnt-3", clubId: "mountaineering", clubName: "Dağcılık", name: "Ekipman", description: "Bot, halat, kışlık donanım rehberi.", memberCount: 54, maxCapacity: ROOM_CAPACITY, lastActivity: "24 dk önce", isActive: true, topic: "La Sportiva vs Scarpa: kış dağcılığı botu 2026 modelleri karşılaştırması" },
  { id: "mnt-4", clubId: "mountaineering", clubName: "Dağcılık", name: "Rota ve Harita", description: "Topografik harita okuma, GPS, rota planlama.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "39 dk önce", isActive: true, topic: "Garmin inReach vs SPOT: dağda uydu iletişimi güvenilirlik karşılaştırması" },
  { id: "mnt-5", clubId: "mountaineering", clubName: "Dağcılık", name: "Güvenlik", description: "Çığ güvenliği, ilkyardım, kurtarma protokolleri.", memberCount: 71, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "Çığ riski değerlendirmesi: ATES ölçeği ve arazi kararları pratikte" },
  { id: "mnt-6", clubId: "mountaineering", clubName: "Dağcılık", name: "Kış Dağcılığı", description: "Buz tırmanışı, kar güvenliği, kış teknikleri.", memberCount: 43, maxCapacity: ROOM_CAPACITY, lastActivity: "31 dk önce", isActive: true, topic: "Kaçkar kış tırmanışı: şubat fırsatları ve hava penceresi okuma" },
  { id: "mnt-7", clubId: "mountaineering", clubName: "Dağcılık", name: "Türkiye Rotaları", description: "Ağrı, Kaçkar, Süphan, Erciyes ve diğerleri.", memberCount: 66, maxCapacity: ROOM_CAPACITY, lastActivity: "14 dk önce", isActive: true, topic: "Kaçkar traverse: kuzeyden güneye geçiş için en iyi sezon ve hazırlık" },
  { id: "mnt-8", clubId: "mountaineering", clubName: "Dağcılık", name: "Himalaya ve Alpler", description: "8000m zirveler, Alp tırmanışı, ekspedisyon.", memberCount: 29, maxCapacity: ROOM_CAPACITY, lastActivity: "58 dk önce", isActive: true, topic: "K2 kış sezonu 2026: başarı istatistikleri ve ölçülen zorluklar" },

  // ── Kamp ve Karavan (8) ───────────────────────────
  { id: "camp-1", clubId: "camping", clubName: "Kamp ve Karavan", name: "Kamp Alanları", description: "Türkiye'nin en iyi kamp alanları.", memberCount: 78, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "Kapadokya kamp alanları 2026: yeni açılanlar ve kapananlar" },
  { id: "camp-2", clubId: "camping", clubName: "Kamp ve Karavan", name: "Karavan Yaşamı", description: "Karavan bakımı, park yerleri, yaşam tüyoları.", memberCount: 63, maxCapacity: ROOM_CAPACITY, lastActivity: "13 dk önce", isActive: true, topic: "Türkiye'de karavan park yerleri 2026: Ege kıyısı route haritası" },
  { id: "camp-3", clubId: "camping", clubName: "Kamp ve Karavan", name: "Ekipman", description: "Çadır, uyku tulumu, mat — seçim rehberi.", memberCount: 71, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "MSR vs Big Agnes: 3 mevsim çadır 2026 — hangisi Türkiye iklimi için?" },
  { id: "camp-4", clubId: "camping", clubName: "Kamp ve Karavan", name: "Kamp Yemekleri", description: "Ateş pişirimi, taşınabilir ocak, tarif paylaşımı.", memberCount: 86, maxCapacity: ROOM_CAPACITY, lastActivity: "4 dk önce", isActive: true, topic: "Ultralight yemek sistemi: liyofilize mi, kendin yap mı?" },
  { id: "camp-5", clubId: "camping", clubName: "Kamp ve Karavan", name: "Van Life", description: "Van dönüşümü, off-grid yaşam, seyahat.", memberCount: 54, maxCapacity: ROOM_CAPACITY, lastActivity: "19 dk önce", isActive: true, topic: "Mercedes Sprinter dönüşümü: solar sistem boyutlandırma rehberi" },
  { id: "camp-6", clubId: "camping", clubName: "Kamp ve Karavan", name: "Kış Kampı", description: "Soğuk hava kampı, ekipman, güvenlik.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "35 dk önce", isActive: true, topic: "-15°C'de çadır: uyku tulumu R-değeri ve katmanlanma sistemi" },
  { id: "camp-7", clubId: "camping", clubName: "Kamp ve Karavan", name: "Ultra-Light", description: "Gramaj odaklı sistem, hafiflik teknikleri.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "27 dk önce", isActive: true, topic: "Big Three altı kilogram altı: Türkiye'de erişilebilir UL sistem maliyeti" },
  { id: "camp-8", clubId: "camping", clubName: "Kamp ve Karavan", name: "Rota Planlama", description: "Wild camp rotaları, uzun mesafe yürüyüşler.", memberCount: 59, maxCapacity: ROOM_CAPACITY, lastActivity: "21 dk önce", isActive: true, topic: "Likya Yolu 2026: planlama ve güncel rota durumu raporu" },

  // ── Maket ve Minyatür (8) ─────────────────────────
  { id: "mod-1", clubId: "models", clubName: "Maket ve Minyatür", name: "Askeri Maketler", description: "Tank, araç, figür — çok ölçekli üretim.", memberCount: 52, maxCapacity: ROOM_CAPACITY, lastActivity: "14 dk önce", isActive: true, topic: "Tamiya 1/35 vs Dragon: İkinci Dünya Savaşı tankı maket kalitesi" },
  { id: "mod-2", clubId: "models", clubName: "Maket ve Minyatür", name: "Otomobil Maketleri", description: "Klasik ve modern araç maketleri.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "22 dk önce", isActive: true, topic: "Hasegawa 1/24 Ferrari 250 GTO: boya öncesi hazırlık ve panel çizgileri" },
  { id: "mod-3", clubId: "models", clubName: "Maket ve Minyatür", name: "Uçak Maketleri", description: "Aviasyon maketleri, kokpit detaylandırma.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "31 dk önce", isActive: true, topic: "Eduard maket seti vs Tamiya: detay farkı ve fiyat analizi" },
  { id: "mod-4", clubId: "models", clubName: "Maket ve Minyatür", name: "Diorama", description: "Sahne kurgusu, zemin yapımı, atmosfer.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "18 dk önce", isActive: true, topic: "Diorama zemininde 'soil & mud' efekti: materyal listesi ve teknik" },
  { id: "mod-5", clubId: "models", clubName: "Maket ve Minyatür", name: "Minyatür Boyama", description: "Wargame figürleri, teknik, kademeli geçişler.", memberCount: 61, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "Non-Metallic Metal (NMM) tekniği başlangıcı: materyaller ve adımlar" },
  { id: "mod-6", clubId: "models", clubName: "Maket ve Minyatür", name: "Warhammer ve Masa Oyunları", description: "GW evrenleri, liste yapımı, turnuvalar.", memberCount: 73, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Warhammer 40K 10. baskı meta: Space Marines vs Tyranids güncel durum" },
  { id: "mod-7", clubId: "models", clubName: "Maket ve Minyatür", name: "3D Baskı", description: "Resin ve FDM maket üretimi, dosya kaynakları.", memberCount: 55, maxCapacity: ROOM_CAPACITY, lastActivity: "16 dk önce", isActive: true, topic: "Elegoo Saturn 4 vs Anycubic Photon M5s: 2026 resin yazıcı karşılaştırması" },
  { id: "mod-8", clubId: "models", clubName: "Maket ve Minyatür", name: "Araç ve Boyalar", description: "Airbrush, fırça, boya markaları rehberi.", memberCount: 39, maxCapacity: ROOM_CAPACITY, lastActivity: "43 dk önce", isActive: true, topic: "Vallejo vs AK Interactive vs Citadel: akrilik boya kıvamı ve kapatma gücü" },

  // ── Dans (8) ──────────────────────────────────────
  { id: "dan-1", clubId: "dance", clubName: "Dans", name: "Tango", description: "Arjantin ve balo salonu tangosu.", memberCount: 57, maxCapacity: ROOM_CAPACITY, lastActivity: "11 dk önce", isActive: true, topic: "Milonga etiket rehberi: davet, ret ve göz teması kuralları" },
  { id: "dan-2", clubId: "dance", clubName: "Dans", name: "Salsa ve Latin", description: "Salsa, bachata, merengue, zouk.", memberCount: 74, maxCapacity: ROOM_CAPACITY, lastActivity: "7 dk önce", isActive: true, topic: "Salsa On1 vs On2 için başlangıç: hangi stile önce başlanmalı?" },
  { id: "dan-3", clubId: "dance", clubName: "Dans", name: "Bale ve Çağdaş", description: "Klasik bale, modern dans, çağdaş hareket.", memberCount: 43, maxCapacity: ROOM_CAPACITY, lastActivity: "19 dk önce", isActive: true, topic: "Yetişkin başlangıç bale: İstanbul'da uygun stüdyolar ve beklentiler" },
  { id: "dan-4", clubId: "dance", clubName: "Dans", name: "Hip-Hop ve Street", description: "B-boying, locking, popping, urban styles.", memberCount: 68, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "İstanbul street dance sahnesi 2026: battle etkinlikleri ve topluluklar" },
  { id: "dan-5", clubId: "dance", clubName: "Dans", name: "Halk Dansları", description: "Türk ve dünya halk dansları, folklorik gösteri.", memberCount: 39, maxCapacity: ROOM_CAPACITY, lastActivity: "27 dk önce", isActive: true, topic: "Zeybek hareket anlayışı: özgürlük mü, disiplin mi — koreografi tartışması" },
  { id: "dan-6", clubId: "dance", clubName: "Dans", name: "Sosyal Dans", description: "Dans gecesi kültürü, etiket, topluluk.", memberCount: 51, maxCapacity: ROOM_CAPACITY, lastActivity: "22 dk önce", isActive: true, topic: "İstanbul dans topluluğu etkinlik takvimi: Mayıs-Haziran 2026" },
  { id: "dan-7", clubId: "dance", clubName: "Dans", name: "Müzik ve Ritim", description: "Dans müziği, ritim duygusu, müzikal analiz.", memberCount: 34, maxCapacity: ROOM_CAPACITY, lastActivity: "41 dk önce", isActive: true, topic: "Tango müziği orkestrasını tanımak: D'Arienzo, Pugliese, Di Sarli farkları" },
  { id: "dan-8", clubId: "dance", clubName: "Dans", name: "Koreografi", description: "Koreografi yazımı, repertuar, gösteri hazırlık.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "53 dk önce", isActive: true, topic: "Grup koreografisinde müzikalite vs teknik: denge nasıl kurulur?" },

  // ── Sim Racing (8) ────────────────────────────────
  { id: "sim-1", clubId: "simracing", clubName: "Sim Racing", name: "Formula Simülatörü", description: "F1, Formula 2, open-wheel yarış.", memberCount: 67, maxCapacity: ROOM_CAPACITY, lastActivity: "6 dk önce", isActive: true, topic: "iRacing Dallara IR18 vs rFactor 2 Formula Pro: fizik motoru karşılaştırması" },
  { id: "sim-2", clubId: "simracing", clubName: "Sim Racing", name: "GT Yarışı", description: "GT3, GT4, GTE sınıfları ve ACC odaklı.", memberCount: 81, maxCapacity: ROOM_CAPACITY, lastActivity: "3 dk önce", isActive: true, topic: "ACC Silverstone setup: yüksek downforce vs düşük sürtünme dengeleme" },
  { id: "sim-3", clubId: "simracing", clubName: "Sim Racing", name: "Rally ve Dirt", description: "EA WRC, Dirt, stage rekabeti.", memberCount: 54, maxCapacity: ROOM_CAPACITY, lastActivity: "14 dk önce", isActive: true, topic: "EA WRC 2025 vs DiRT Rally 2.0: fizik gerçekçiliği ve içerik karşılaştırması" },
  { id: "sim-4", clubId: "simracing", clubName: "Sim Racing", name: "Setup ve Ayarlar", description: "Aero, süspansiyon, diferansiyel rehberi.", memberCount: 72, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "GT3 setup öğrenmek: telemetri okuma ve adım adım iyileştirme süreci" },
  { id: "sim-5", clubId: "simracing", clubName: "Sim Racing", name: "Ekipman", description: "Direksiyon, pedal, simülatör kokpiti.", memberCount: 88, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Simucube 2 Sport vs Fanatec DD Pro: 2026 için bütçeye göre hangisi?" },
  { id: "sim-6", clubId: "simracing", clubName: "Sim Racing", name: "Ligler ve Turnuvalar", description: "ORUN iç ligi, harici turnuvalar, sıralamalar.", memberCount: 61, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "ORUN Sim Racing Ligi Sezon 3: puan tablosu ve kalan yarışlar" },
  { id: "sim-7", clubId: "simracing", clubName: "Sim Racing", name: "Simülatörler", description: "iRacing, ACC, rFactor 2, LMU platform tartışmaları.", memberCount: 75, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Le Mans Ultimate (LMU) 2026 güncellemesi: iRacing'e gerçek rakip oldu mu?" },
  { id: "sim-8", clubId: "simracing", clubName: "Sim Racing", name: "Telemetri ve Analiz", description: "MoTeC, VRS Coaching, veri odaklı gelişim.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "27 dk önce", isActive: true, topic: "Throttle trace analizi: erken vs geç gaz açma — lap time farkı ne kadar?" },

  // ── Atıcılık (8) ──────────────────────────────────
  { id: "arc-1", clubId: "archery", clubName: "Atıcılık", name: "Uzun Menzil", description: "Precision shooting, 500m+ hedefler.", memberCount: 53, maxCapacity: ROOM_CAPACITY, lastActivity: "13 dk önce", isActive: true, topic: "6.5 Creedmoor vs .308 Win: 800m'de balistik katsayı gerçeği" },
  { id: "arc-2", clubId: "archery", clubName: "Atıcılık", name: "Pratik Atıcılık", description: "IPSC, IDPA, hızlı hareket etme teknikleri.", memberCount: 67, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "IPSC Production Optics: 2026 için holographic sight seçimi" },
  { id: "arc-3", clubId: "archery", clubName: "Atıcılık", name: "Okçuluk", description: "Geleneksel okçuluk, compound ve recurve.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "21 dk önce", isActive: true, topic: "Türk okçuluğu tekniği: baş parmak çekimi ve kısa yay avantajları" },
  { id: "arc-4", clubId: "archery", clubName: "Atıcılık", name: "Silah Bakımı", description: "Temizlik, bakım, parça değişimi.", memberCount: 58, maxCapacity: ROOM_CAPACITY, lastActivity: "17 dk önce", isActive: true, topic: "Uzun depolama öncesi silah hazırlığı: korozyon önleme protokolü" },
  { id: "arc-5", clubId: "archery", clubName: "Atıcılık", name: "Poligon Rehberi", description: "Türkiye atış poligonları, kurallar, üyelik.", memberCount: 39, maxCapacity: ROOM_CAPACITY, lastActivity: "34 dk önce", isActive: true, topic: "İstanbul çevresindeki en iyi kapalı poligonlar: tesis ve mesafe karşılaştırması" },
  { id: "arc-6", clubId: "archery", clubName: "Atıcılık", name: "Ekipman", description: "Optik, tetik, aksesuar rehberi.", memberCount: 47, maxCapacity: ROOM_CAPACITY, lastActivity: "29 dk önce", isActive: true, topic: "Vortex vs Nightforce vs Leupold: bütçeye göre scop seçimi rehberi" },
  { id: "arc-7", clubId: "archery", clubName: "Atıcılık", name: "Start", description: "THGF yarışmaları, hazırlık, sonuçlar.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "47 dk önce", isActive: true, topic: "2026 Türkiye Silah Sporları Ligi takvimi ve başvuru süreci" },
  { id: "arc-8", clubId: "archery", clubName: "Atıcılık", name: "Hukuk ve Mevzuat", description: "Ruhsat, taşıma, yasal çerçeve.", memberCount: 76, maxCapacity: ROOM_CAPACITY, lastActivity: "4 dk önce", isActive: true, topic: "2026 silah ruhsatı yenileme: belgeler, süreç ve yeni kurallar" },

  // ── Parfüm (8) ────────────────────────────────────
  { id: "perf-1", clubId: "perfume", clubName: "Parfüm", name: "Oryantal Kokular", description: "Oud, amber, misk ve Doğu parfümcülüğü.", memberCount: 64, maxCapacity: ROOM_CAPACITY, lastActivity: "8 dk önce", isActive: true, topic: "Amouage Interlude Man: oryantal-chypre köprüsünün şaheser örneği mi?" },
  { id: "perf-2", clubId: "perfume", clubName: "Parfüm", name: "Batı Parfümcülüğü", description: "Fransız ve İtalyan parfüm geleneği.", memberCount: 57, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "Guerlain Mitsouko — modern yorumla özgün formül: fark hissedilebilir mi?" },
  { id: "perf-3", clubId: "perfume", clubName: "Parfüm", name: "Niche ve Bağımsız", description: "Küçük ölçekli parfümörler, özel seriler.", memberCount: 71, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Etat Libre d'Orange, Papillon, Tauer: bugün gözden kaçırdığımız niche hangisi?" },
  { id: "perf-4", clubId: "perfume", clubName: "Parfüm", name: "Attar ve Oud", description: "Saf yağ parfümler, oud türleri, Orta Doğu geleneği.", memberCount: 48, maxCapacity: ROOM_CAPACITY, lastActivity: "19 dk önce", isActive: true, topic: "Hintlistan cevizi oud vs Cambodi oud: koku profili ve fiyat farkı" },
  { id: "perf-5", clubId: "perfume", clubName: "Parfüm", name: "Koku Ailesi Rehberi", description: "Fougère, chypre, florals, woody — teori.", memberCount: 53, maxCapacity: ROOM_CAPACITY, lastActivity: "23 dk önce", isActive: true, topic: "Chypre ailesini anlamak: Guerlain Mitsouko'dan Chanel No.19'a köprü" },
  { id: "perf-6", clubId: "perfume", clubName: "Parfüm", name: "Mevsimlik Seçimler", description: "İklim ve kıyafete göre koku seçimi.", memberCount: 67, maxCapacity: ROOM_CAPACITY, lastActivity: "9 dk önce", isActive: true, topic: "İstanbul yazında kalın oud kullanımı: yanlış mı, yoksa gözü pek tercih mi?" },
  { id: "perf-7", clubId: "perfume", clubName: "Parfüm", name: "Koleksiyon", description: "Koleksiyon kurma stratejisi, depolama, değer.", memberCount: 44, maxCapacity: ROOM_CAPACITY, lastActivity: "31 dk önce", isActive: true, topic: "15 şişelik kapsül koleksiyon: her durumu karşılayan liste nasıl kurulur?" },
  { id: "perf-8", clubId: "perfume", clubName: "Parfüm", name: "Koku Notları", description: "Üst, orta ve taban notalar — analitik tadım.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "45 dk önce", isActive: true, topic: "Synthetics vs naturals: ambroxan, iso e super, hedione — kötü mü gerçekten?" },

  // ── Atölye ──────────────────────────────────────────────────────────────
  { id: "atolye-1", clubId: "atolye", clubName: "Atölye", name: "Tuval", description: "Soyut ve figüratif resim, teknik ve estetik tartışmalar.", memberCount: 42, maxCapacity: ROOM_CAPACITY, lastActivity: "12 dk önce", isActive: true, topic: "Gerhard Richter'in soyutlaması: rastlantı mı, kontrol mü?" },
  { id: "atolye-2", clubId: "atolye", clubName: "Atölye", name: "Heykel", description: "Taş, bronz, seramik ve çağdaş malzeme.", memberCount: 28, maxCapacity: ROOM_CAPACITY, lastActivity: "35 dk önce", isActive: true, topic: "Brancusi ve soyut formun sessiz dili üzerine." },
  { id: "atolye-3", clubId: "atolye", clubName: "Atölye", name: "Baskı", description: "Serigrafi, litografi, etching ve özgün baskı sanatı.", memberCount: 19, maxCapacity: ROOM_CAPACITY, lastActivity: "1 sa önce", isActive: true, topic: "Dijital baskı özgün baskıyı öldürür mü?" },
  { id: "atolye-4", clubId: "atolye", clubName: "Atölye", name: "Lens", description: "Sanat fotoğrafçılığı, görsel dil ve gözlem estetiği.", memberCount: 55, maxCapacity: ROOM_CAPACITY, lastActivity: "5 dk önce", isActive: true, topic: "Cindy Sherman'ın kimlik performansı ve kamera önü kimliği." },
  { id: "atolye-5", clubId: "atolye", clubName: "Atölye", name: "Alan", description: "Enstalasyon, performans ve mekan-sanat ilişkisi.", memberCount: 22, maxCapacity: ROOM_CAPACITY, lastActivity: "50 dk önce", isActive: true, topic: "Site-specific sanat: mekan olmadan anlam var mı?" },
  { id: "atolye-6", clubId: "atolye", clubName: "Atölye", name: "Galeri", description: "Müzeler, koleksiyonlar ve sergi deneyimi.", memberCount: 38, maxCapacity: ROOM_CAPACITY, lastActivity: "20 dk önce", isActive: true, topic: "Tate Modern mi, küçük bağımsız galeri mi — sanatla buluşmanın kalitesi." },
  { id: "atolye-7", clubId: "atolye", clubName: "Atölye", name: "Piyasa", description: "Sanat piyasası, müzayede dünyası ve koleksiyonerlik.", memberCount: 31, maxCapacity: ROOM_CAPACITY, lastActivity: "45 dk önce", isActive: true, topic: "NFT çöküşünden sonra dijital sanat nereye gidiyor?" },
  { id: "atolye-8", clubId: "atolye", clubName: "Atölye", name: "Teknik", description: "Malzeme, yöntem, zanaat ve atölye pratiği.", memberCount: 17, maxCapacity: ROOM_CAPACITY, lastActivity: "2 sa önce", isActive: true, topic: "Yağlıboya hazırlama: endüstriyel boya mı, el yapımı mı?" },
];

export const LANGUAGE_AI_MESSAGES: Record<string, Message[]> = {
  en: [
    {
      id: "lai-en-1",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "Welcome to the English Practice Room. I'll help you with vocabulary, grammar, and natural conversation. Type anything in Turkish or English — I'll respond and correct gently. Let's start: How was your day?",
      timestamp: "21:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-en-2",
      author: "Ayşe K.",
      handle: "@ayse_k",
      content: "I am going to the market yesterday.",
      timestamp: "21:02",
      membershipLevel: 1,
    },
    {
      id: "lai-en-3",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "Küçük bir düzeltme: \"I went to the market yesterday.\" — Geçmiş zaman için 'went' kullanılır, çünkü 'yesterday' geçmiş zamana işaret eder. 'Going' ile 'yesterday' birlikte kullanılamaz. Harika bir başlangıç!",
      timestamp: "21:02",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-en-4",
      author: "Mehmet D.",
      handle: "@mehmet_d",
      content: "How do I say 'özlemek' in English?",
      timestamp: "21:04",
      membershipLevel: 1,
    },
    {
      id: "lai-en-5",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "\"To miss\" — örneğin: \"I miss you\" (Seni özledim), \"I miss Istanbul\" (İstanbul'u özledim). Daha güçlü hissetmek için: \"I've been missing you\" (Seni özlüyorum / bir süredir). Try it: what do you miss most about home?",
      timestamp: "21:04",
      membershipLevel: 3,
      isAI: true,
    },
  ],
  it: [
    {
      id: "lai-it-1",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "Benvenuti nella stanza di italiano! İtalyanca pratiğinize hoş geldiniz. Dil seviyeniz ne olursa olsun yardımcı olacağım. Başlayalım — Türkçe veya İtalyanca yazabilirsiniz. Come state oggi?",
      timestamp: "21:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-it-2",
      author: "Zeynep A.",
      handle: "@zeynep_a",
      content: "Voglio andare a Roma. Come si dice 'önümüzdeki yıl'?",
      timestamp: "21:02",
      membershipLevel: 1,
    },
    {
      id: "lai-it-3",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "\"L'anno prossimo\" — Tam cümle: \"Voglio andare a Roma l'anno prossimo.\" (Önümüzdeki yıl Roma'ya gitmek istiyorum.) Harika bir seçim! Prossimo = sonraki/önümüzdeki. Benzer: questo mese (bu ay), la prossima settimana (önümüzdeki hafta). Dove vuoi andare a Roma?",
      timestamp: "21:02",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-it-4",
      author: "Can B.",
      handle: "@can_b",
      content: "Mi piace molto la pizza italiana!",
      timestamp: "21:05",
      membershipLevel: 1,
    },
    {
      id: "lai-it-5",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "Perfetto! Mükemmel bir cümle. 'Mi piace' = bana hoşgeliyor / seviyorum. 'Mi piacciono' ise çoğul için kullanılır: \"Mi piacciono i dolci italiani.\" (İtalyan tatlılarını seviyorum.) Çok doğal konuşuyorsunuz!",
      timestamp: "21:05",
      membershipLevel: 3,
      isAI: true,
    },
  ],
  es: [
    {
      id: "lai-es-1",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "¡Bienvenidos a la sala de español! İspanyolca pratiğinize hoş geldiniz. Türkçe ya da İspanyolca yazabilirsiniz — her ikisini de anlıyorum ve yardımcı olacağım. ¿Cuánto tiempo llevan aprendiendo español?",
      timestamp: "21:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-es-2",
      author: "Leyla M.",
      handle: "@leyla_m",
      content: "Soy estudiante. Yo estudio en la universidad desde tres años.",
      timestamp: "21:02",
      membershipLevel: 1,
    },
    {
      id: "lai-es-3",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "¡Muy bien! Küçük bir düzeltme: \"Llevo tres años estudiando en la universidad.\" İspanyolca'da zaman süresi için 'llevar + gerundio' yapısı kullanılır, İngilizce'deki 'since/for' gibi. 'Hace tres años que estudio' da söylenebilir. ¿Qué estudias?",
      timestamp: "21:02",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-es-4",
      author: "Emre T.",
      handle: "@emre_t",
      content: "¿Cómo se dice 'teşekkür etmek' en español?",
      timestamp: "21:06",
      membershipLevel: 1,
    },
    {
      id: "lai-es-5",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "\"Agradecer\" ya da günlük kullanımda \"dar las gracias\" — Örnekler: \"Te lo agradezco mucho\" (Çok teşekkür ederim), \"Gracias por todo\" (Her şey için teşekkürler), \"Muchas gracias\" (Çok teşekkürler / en yaygın). ¡Practiquen usando estas frases!",
      timestamp: "21:06",
      membershipLevel: 3,
      isAI: true,
    },
  ],
  de: [
    {
      id: "lai-de-1",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "Willkommen im deutschen Übungsraum! Almanca pratiğinize hoş geldiniz. Türkçe ya da Almanca yazabilirsiniz. Almanca'da artikeller (der/die/das) zor olabilir — onlara odaklanabiliriz. Wie lange lernen Sie schon Deutsch?",
      timestamp: "21:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-de-2",
      author: "Selin K.",
      handle: "@selin_k",
      content: "Ich lerne Deutsch seit zwei Jahren. Es ist schwer aber interessant!",
      timestamp: "21:02",
      membershipLevel: 1,
    },
    {
      id: "lai-de-3",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "Ausgezeichnet! Mükemmel bir cümle. Küçük bir not: 'aber' yerine 'jedoch' da kullanılabilir, daha resmi bir tonda. Ayrıca: 'Es ist schwer, aber es macht Spaß!' (Zor ama eğlenceli!) diyebilirsiniz. İki yılda bu seviye çok iyi — zwei Jahre, gut gemacht!",
      timestamp: "21:02",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "lai-de-4",
      author: "Berk A.",
      handle: "@berk_a",
      content: "der, die, das nasıl öğrenilir? Çok karıştırıyorum.",
      timestamp: "21:06",
      membershipLevel: 1,
    },
    {
      id: "lai-de-5",
      author: "ORUN Dil AI",
      handle: "@orun.dil",
      content: "En iyi yöntem: kelimeleri artikelleriyle birlikte ezberlemek. Küçük ipuçları: -ung ile biten kelimeler genellikle die (die Wohnung, die Zeitung). -er ile bitenler genellikle der (der Computer, der Fehler). -chen/-lein ile bitenler das (das Mädchen). Ama istisnaları var — birer birer öğrenmek en güvenli yol. Almanca zaman ister, sabırlı olun!",
      timestamp: "21:06",
      membershipLevel: 3,
      isAI: true,
    },
  ],
};

export const LANGUAGE_CONFIG: Record<string, { flag: string; name: string; nativeName: string; level: string }> = {
  en: { flag: "🇬🇧", name: "İngilizce", nativeName: "English", level: "A1 → C2" },
  it: { flag: "🇮🇹", name: "İtalyanca", nativeName: "Italiano", level: "A1 → B2" },
  es: { flag: "🇪🇸", name: "İspanyolca", nativeName: "Español", level: "A1 → C1" },
  de: { flag: "🇩🇪", name: "Almanca", nativeName: "Deutsch", level: "A1 → B2" },
};

export const QUICK_ACTIONS: Record<string, { label: string; prompt: string }[]> = {
  en: [
    { label: "Çevir", prompt: "Please translate this to English:" },
    { label: "Düzelt", prompt: "Please correct my English:" },
    { label: "Açıkla", prompt: "Please explain this grammar:" },
    { label: "Örnek ver", prompt: "Give me example sentences with:" },
  ],
  it: [
    { label: "Çevir", prompt: "Per favore, traduci in italiano:" },
    { label: "Düzelt", prompt: "Per favore, correggi il mio italiano:" },
    { label: "Açıkla", prompt: "Spiega questa grammatica in turco:" },
    { label: "Örnek ver", prompt: "Dammi frasi d'esempio con:" },
  ],
  es: [
    { label: "Çevir", prompt: "Por favor, traduce al español:" },
    { label: "Düzelt", prompt: "Por favor, corrige mi español:" },
    { label: "Açıkla", prompt: "Explica esta gramática en turco:" },
    { label: "Örnek ver", prompt: "Dame frases de ejemplo con:" },
  ],
  de: [
    { label: "Çevir", prompt: "Bitte übersetze ins Deutsche:" },
    { label: "Düzelt", prompt: "Bitte korrigiere mein Deutsch:" },
    { label: "Açıkla", prompt: "Erkläre diese Grammatik auf Türkisch:" },
    { label: "Beispiel", prompt: "Gib mir Beispielsätze mit:" },
  ],
};

export const FLOW_ITEMS: FlowItem[] = [
  {
    id: "f0",
    author: "ORUN",
    handle: "@orun.ai",
    clubName: "Yabancı Dil",
    content: "Bu hafta Dil Odaları'nda 847 pratik seansı gerçekleşti. İtalyanca odası en yüksek büyümeyi gösterdi — üye sayısı %34 arttı. AI asistanımız bugüne kadar 12.000'den fazla gramer düzeltmesi yaptı.",
    timestamp: "8 dk önce",
    replyCount: 34,
    membershipLevel: 3,
  },
  {
    id: "f1",
    author: "Alessandro V.",
    handle: "@velours",
    clubName: "Kadran",
    content: "Sabahı bir saatçi arkadaşımla Patek 5711 hareketini inceleyerek geçirdim. Gyromax denge çarkındaki yüzey işçiliği — sadece pahlama işlemi saatler alıyor. Fiyatı mantıksal olarak haklı çıkarmak zor. Estetik olarak ise çok kolay.",
    timestamp: "22 dk önce",
    replyCount: 12,
    membershipLevel: 3,
  },
  {
    id: "f2",
    author: "M. Thornton",
    handle: "@northwind",
    clubName: "Satır Arası",
    content: "Pessoa'nın Huzursuzluğun Kitabı'nı yeni bitirdim. Roman değil, günlük de değil — bambaşka bir şey. O kadar hassas bir nesir ki kendi düşüncelerinizin ne kadar belirsiz olduğunu fark ettiriyor.",
    timestamp: "40 dk önce",
    replyCount: 8,
    membershipLevel: 2,
  },
  {
    id: "f3",
    author: "R. Saltanat",
    handle: "@saltpilot",
    clubName: "İrtifa",
    content: "Bu ay üçüncü transatlantik konumlama uçuşum. FL380'de, 02:00 UTC'de Kuzey Atlantik'te bir şey var — mutlak sessizlik, aletlerin parıltısı, 400 mil içinde hiç trafik yok. Hiçbir şey buna yakın gelmiyor.",
    timestamp: "2 sa önce",
    replyCount: 19,
    membershipLevel: 2,
  },
  {
    id: "f4",
    author: "Selin K.",
    handle: "@selin_k",
    clubName: "Yabancı Dil",
    content: "İki yıl önce Almanca alfabesini bile bilmiyordum. Bugün iş toplantısında Almanca sunum yaptım. ORUN Dil Odası'ndaki günlük pratik olmasa bunu başaramazdım. Teşekkürler topluluk.",
    timestamp: "3 sa önce",
    replyCount: 41,
    membershipLevel: 1,
  },
  {
    id: "f5",
    author: "J. Moreau",
    handle: "@aerolith",
    clubName: "Garaj",
    content: "Yeni Porsche 911 S/T'yi boş bir dağ yolunda sürdüm. Radar yok, ABS dışında sürücü yardımı yok. Direksiyon aracılığıyla iletişim bugün üretilen başka hiçbir şeye benzemiyor. Giderek nadir hale geliyor — gerçekten geri konuşan bir araba.",
    timestamp: "4 sa önce",
    replyCount: 31,
    membershipLevel: 3,
  },
  {
    id: "f6",
    author: "T. Hashimoto",
    handle: "@kogane",
    clubName: "Sofra",
    content: "Dün gece on bir kurs, her biri beklenmedik bir şeyle eşleştirildi. Somelier güvercin için 2008 Domaine Leroy Chambolle-Musigny açtı. Hiçbir not adaletli olmaz — bazı deneyimler dilin dışında var olur.",
    timestamp: "6 sa önce",
    replyCount: 14,
    membershipLevel: 3,
  },

];

export type RoomMessageCategory =
  | "finance"
  | "vehicles"
  | "books"
  | "gastronomy"
  | "luxury"
  | "sports"
  | "arts"
  | "general";

export const CLUB_MESSAGE_CATEGORY: Record<string, RoomMessageCategory> = {
  finance: "finance",
  motorcycles: "vehicles",
  cars: "vehicles",
  simracing: "vehicles",
  aviation: "vehicles",
  maritime: "vehicles",
  books: "books",
  philosophy: "books",
  history: "books",
  whisky: "gastronomy",
  cigars: "gastronomy",
  gastronomy: "gastronomy",
  watches: "luxury",
  fashion: "luxury",
  perfume: "luxury",
  fitness: "sports",
  mountaineering: "sports",
  archery: "sports",
  camping: "sports",
  film: "arts",
  music: "arts",
  dance: "arts",
};

export const ROOM_MESSAGES_MAP: Record<RoomMessageCategory, Message[]> = {
  finance: [
    {
      id: "f0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "İyi günler. Bu haftanın odak konusu: Fed faiz politikasının seyri ve Türk lirası üzerindeki beklenen etkileri. Beş üye hazır. Başlayalım.",
      timestamp: "10:02",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "f1",
      author: "K. Demirtaş",
      handle: "@kdemirtas",
      content: "Fed'in duraklama sürecine girdiğini düşünüyorum. Ama 'pivot' kelimesini kullananlar aceleci davranıyor — enflasyon hâlâ hedeflerin üzerinde.",
      timestamp: "10:04",
      membershipLevel: 3,
    },
    {
      id: "f2",
      author: "S. Altın",
      handle: "@saltin",
      content: "Borsayı bırak, şu an tek ilgilendiğim konu kısa vadeli tahvil getirileri. %5,3 risksiz getiri varken neden risk al?",
      timestamp: "10:06",
      membershipLevel: 2,
    },
    {
      id: "f3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "@saltin makul bir nokta — fırsat maliyeti tartışması yeniden gündemde. @kdemirtas, dolar endeksi bu senaryoda nereye gider?",
      timestamp: "10:08",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "f4",
      author: "K. Demirtaş",
      handle: "@kdemirtas",
      content: "DXY 103–105 bandını korur diye öngörüyorum. Em piyasaları için aşırı bir kuvvetlenme de değil, rahatlama da değil — o belirsizliğin kendi başına bir riski var.",
      timestamp: "10:11",
      membershipLevel: 3,
    },
    {
      id: "f5",
      author: "B. Sarıgül",
      handle: "@bsarigul",
      content: "BTC bu tabloda farklı mı davranır sorusu var kafamda. Likidite daralmasında korelasyon tekrar artar mı?",
      timestamp: "10:14",
      membershipLevel: 2,
    },
  ],

  vehicles: [
    {
      id: "v0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Hoş geldiniz. Bu haftanın tartışması: Avrupa'nın giderek sıkılaşan emisyon kuralları klasik araç sahipleri için ne anlama geliyor? Dört üye mevcut.",
      timestamp: "19:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "v1",
      author: "E. Karadeniz",
      handle: "@ekaradeniz",
      content: "Almanya'da bazı şehir merkezlerine Euro 4 altı araçlarla giriş yasağı başladı. Klasik plaka muafiyeti hâlâ var ama bu ne kadar sürer bilinmez.",
      timestamp: "19:02",
      membershipLevel: 3,
    },
    {
      id: "v2",
      author: "M. Ateş",
      handle: "@matesrider",
      content: "Bence müze kalitesindeki araçlar her zaman korunur. Asıl tehlike altındakiler 90'lar – 2000'ler dönemi 'yarı yaşlı' araçlar.",
      timestamp: "19:05",
      membershipLevel: 2,
    },
    {
      id: "v3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "İlginç bir ayrım — kültürel miras koruması ile emisyon politikası arasındaki gerilim. @ekaradeniz bu konuda Türkiye'de bir düzenleme beklentisi var mı?",
      timestamp: "19:07",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "v4",
      author: "E. Karadeniz",
      handle: "@ekaradeniz",
      content: "Kısa vadede yok. Ama AB uyum süreci devam ederse 5–7 yıl içinde büyük şehirlerde baskı başlayabilir. Şimdiden depo arayanlara hak veriyorum.",
      timestamp: "19:10",
      membershipLevel: 3,
    },
    {
      id: "v5",
      author: "C. Yılmaz",
      handle: "@cyilmaz",
      content: "Geçen hafta Antalya–Fethiye arasını 1974 model ile yaptım. Yolun kendisi bir müze gibi — modern araçla bu keyfi almazsın.",
      timestamp: "19:13",
      membershipLevel: 1,
    },
  ],

  books: [
    {
      id: "b0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Merhaba. Bu ayın tartışma kitabı Dostoevski'nin 'Karamazov Kardeşler'i. Büyük Engizisyoncu bölümüne odaklanacağız. Hazır olan var mı?",
      timestamp: "20:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "b1",
      author: "A. Şahin",
      handle: "@asahin",
      content: "Büyük Engizisyoncu bence tüm Batı edebiyatının en yoğun bölümlerinden biri. İsa'yı susturan ve 'gel, bir daha gelme' diyen figür — özgürlük hakkındaki en sert soru bu.",
      timestamp: "20:02",
      membershipLevel: 3,
    },
    {
      id: "b2",
      author: "N. Köse",
      handle: "@nkose",
      content: "İvan'ın ağzından söylenmesi önemli — bu Dostoevski'nin kendi görüşü değil. Ama öylesine iyi yazılmış ki okuyucu inanmak istiyor.",
      timestamp: "20:05",
      membershipLevel: 2,
    },
    {
      id: "b3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Güzel bir mesele — yazar ile karakter arasındaki mesafe. @nkose, Alyoşa'nın cevabı yeterince güçlü mü bu argümana karşı?",
      timestamp: "20:07",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "b4",
      author: "N. Köse",
      handle: "@nkose",
      content: "Hayır, bence değil. Alyoşa İvan'ı öpüyor — tıpkı İsa'nın Engizisyoncu'yu öpmesi gibi. Cevap kelime değil, eylem. Bu güzel ama yetersiz.",
      timestamp: "20:10",
      membershipLevel: 2,
    },
    {
      id: "b5",
      author: "T. Erdem",
      handle: "@terdem",
      content: "Romanı ilk okuduğumda lisanstayım. Yeniden okuyunca her sahne farklı görünüyor. Kitap büyümüş, ben değil.",
      timestamp: "20:14",
      membershipLevel: 1,
    },
  ],

  gastronomy: [
    {
      id: "g0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "İyi akşamlar. Bu gecenin konusu: Japon viskisinin güncel durumu — resmi seriler bağımsız şişeleyicilere karşı zemin kaybediyor mu? Altı üye mevcut. Başlayalım.",
      timestamp: "21:02",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "g1",
      author: "A. Velours",
      handle: "@velours",
      content: "Yamazaki 18 beş yıl önce olağanüstüydü. Şimdi tahsisat tiyatrosu. Bağımsız şişeleyiciler tutarlı biçimde daha ilginç şeyler çıkarıyor.",
      timestamp: "21:04",
      membershipLevel: 3,
    },
    {
      id: "g2",
      author: "M. Thornton",
      handle: "@northwind",
      content: "Nikka'nın değer sunmaya devam ettiğini savunurum. Coffey Grain, 500 dolar altındaki en hafife alınan şişelerden biri olmaya devam ediyor.",
      timestamp: "21:06",
      membershipLevel: 2,
    },
    {
      id: "g3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "İlginç bir ayrışma. @velours bağımsız şişeleyicilere, @northwind göz ardı edilen resmi serilere işaret ediyor. Bu yılın en tatmin edici şişesi hangisi oldu?",
      timestamp: "21:08",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "g4",
      author: "R. Saltanat",
      handle: "@saltpilot",
      content: "Chichibu tekli varil. 2016 vintage, %58,2. Tropikal kompleksite açısından resmi serilerle karşılaştırılamaz.",
      timestamp: "21:10",
      membershipLevel: 2,
    },
    {
      id: "g5",
      author: "J. Moreau",
      handle: "@aerolith",
      content: "Japon viskisi Burgundy ile aynı yönde gidiyor — tepede yapay kıtlık, gerçek hazine yana bakabilenlere saklı.",
      timestamp: "21:13",
      membershipLevel: 3,
    },
  ],

  luxury: [
    {
      id: "l0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Hoş geldiniz. Bu haftanın konusu: İkinci el lüks piyasasında fiyat balonu mu var, yoksa değer yeniden mi yazılıyor? Saat ve mücevher özelinde değerlendirelim.",
      timestamp: "14:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "l1",
      author: "H. Çelik",
      handle: "@hcelik",
      content: "Patek ref. 5711 katalog fiyatının dört–beş katına ulaştı. Bu bir koleksiyon değeri değil, spekülasyon. Benim için o cazibe bitti.",
      timestamp: "14:02",
      membershipLevel: 3,
    },
    {
      id: "l2",
      author: "D. Arslan",
      handle: "@darslan",
      content: "Aynı fikirde değilim. Arz gerçekten kısıtlı, talep gerçekten küresel. Balon demek için arzın aniden artması ya da talebin kırılması lazım.",
      timestamp: "14:05",
      membershipLevel: 2,
    },
    {
      id: "l3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Arz–talep dengesi açısından bakınca @darslan'ın noktası güçlü. Peki bu dinamik markanın özgün kimliğini aşındırıyor mu?",
      timestamp: "14:07",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "l4",
      author: "H. Çelik",
      handle: "@hcelik",
      content: "Evet, aşındırıyor. Rolex artık saatçilik markası değil, yatırım aracı. Bu ikisi aynı anda olamaz — biri diğerini öldürür.",
      timestamp: "14:10",
      membershipLevel: 3,
    },
    {
      id: "l5",
      author: "Z. Mercan",
      handle: "@zmercan",
      content: "Ben Grand Seiko yönüne geçtim. Fiyat henüz bozulmadı, zanaat tartışmasız. Kazananlar bugün oraya bakanlar olacak.",
      timestamp: "14:13",
      membershipLevel: 2,
    },
  ],

  sports: [
    {
      id: "s0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Merhaba. Bu haftanın konusu: Antrenman hacmi mi, antrenman yoğunluğu mu? Performans için hangisi öncelikli olmalı? Beş üye bağlı.",
      timestamp: "07:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "s1",
      author: "O. Kaya",
      handle: "@okaya",
      content: "Hacim olmadan yoğunluk havada kalır. Aerobik kapasitenizi geliştirmeden interval antrenmanı yapmak temelsiz bina kurmak gibi.",
      timestamp: "07:02",
      membershipLevel: 3,
    },
    {
      id: "s2",
      author: "P. Demir",
      handle: "@pdemir",
      content: "Katılmıyorum. Zamanı kısıtlı birinin haftada 3 saati varsa yoğunluk çok daha verimli. Hacim ancak o temeli kurarsan anlamlı.",
      timestamp: "07:05",
      membershipLevel: 2,
    },
    {
      id: "s3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "İki farklı öncelik — zaman kısıtı mı yoksa performans tavanı mı arıyorsunuz? @okaya hedef kitleyi hangi sporcu profiline göre belirliyorsunuz?",
      timestamp: "07:07",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "s4",
      author: "O. Kaya",
      handle: "@okaya",
      content: "Dağcılık ve uzun mesafe için konuşuyorum. Zirvede 6–8 saat hareket edebilmek için aerobik taban şart. Yoğunluk o tabanı hızlandırır ama kuramaz.",
      timestamp: "07:10",
      membershipLevel: 3,
    },
    {
      id: "s5",
      author: "L. Özkan",
      handle: "@lozkan",
      content: "Geçen ay Kaçkarlar'daydım. İlk iki günden sonra anladım — tempo değil, süre dayanıklılığı belirliyor. @okaya'ya katılıyorum.",
      timestamp: "07:13",
      membershipLevel: 1,
    },
  ],

  arts: [
    {
      id: "a0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "İyi akşamlar. Bu haftanın odağı: Streaming platformları sinema dilini dönüştürüyor mu, yoksa sadece dağıtım mı değişti? Dört üye hazır.",
      timestamp: "22:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "a1",
      author: "B. Çınar",
      handle: "@bcinar",
      content: "Dil değişiyor. Yönetmenler artık büyük ekran için değil, küçük ekran için kurguluyor. Sahne süresi kısalıyor, diyalog ağırlaşıyor — bu sinema değil televizyon.",
      timestamp: "22:02",
      membershipLevel: 3,
    },
    {
      id: "a2",
      author: "S. Tunç",
      handle: "@stunc",
      content: "Ya Tár? Ya The Power of the Dog? Bunlar streaming için üretildi ama sinema dili tartışmasız. Platformu değil yönetmeni suçla.",
      timestamp: "22:05",
      membershipLevel: 2,
    },
    {
      id: "a3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Güzel karşıtlık. İstisna kural delil olmaz mı, yoksa platformun kendi içinde iki ayrı üretim kültürü mü oluştu?",
      timestamp: "22:07",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "a4",
      author: "B. Çınar",
      handle: "@bcinar",
      content: "İki ayrı kültür var bence. Prestij prodüksiyonları ayrı, binge-watch makineleri ayrı. Ama algoritmik baskı hepsini ikinci tarafa doğru çekiyor.",
      timestamp: "22:10",
      membershipLevel: 3,
    },
    {
      id: "a5",
      author: "F. Yıldız",
      handle: "@fyildiz",
      content: "Cannes'ın Netflix kuralları meselesine döndüğümüzde kurumların da bu ayrımı hissettiği anlaşılıyor. Tanım savaşı henüz bitmedi.",
      timestamp: "22:14",
      membershipLevel: 2,
    },
  ],

  general: [
    {
      id: "gen0",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Hoş geldiniz. Bu oda serbest sohbet için açık. Herhangi bir konuyu gündeme getirebilirsiniz — kalite standartlarımızı korumak yeterli.",
      timestamp: "12:00",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "gen1",
      author: "C. Doğan",
      handle: "@cdogan",
      content: "Geçen hafta İstanbul'dan Bodrum'a karayoluyla gittim. D–400 üzerinde bazı kavşaklar hâlâ yok — Türkiye'nin altyapı önceliği sorgulanır durumda.",
      timestamp: "12:03",
      membershipLevel: 2,
    },
    {
      id: "gen2",
      author: "I. Serdar",
      handle: "@iserdar",
      content: "Bodrum yolu diyorsan — Milas çevresi geçen yıl çok iyileşti. Ama haklısın, bazı bölgeler için mantık kurulamıyor.",
      timestamp: "12:06",
      membershipLevel: 3,
    },
    {
      id: "gen3",
      author: "ORUN",
      handle: "@orun.ai",
      content: "Altyapı tartışması açılmışken: hangi bölge son yıllarda en belirgin ilerlemeyi gösterdi?",
      timestamp: "12:08",
      membershipLevel: 3,
      isAI: true,
    },
    {
      id: "gen4",
      author: "C. Doğan",
      handle: "@cdogan",
      content: "Ege kıyı şeridi. Hem turizm baskısı hem de yerel girişim etkisi. Ancak iç kesimlere yansıması sınırlı kalmış.",
      timestamp: "12:11",
      membershipLevel: 2,
    },
    {
      id: "gen5",
      author: "R. Kaplan",
      handle: "@rkaplan",
      content: "Karadeniz bölgesini takip ediyorum. Yavaş ama kalıcı bir dönüşüm var — turizm değil, tarım ve lojistik odaklı.",
      timestamp: "12:15",
      membershipLevel: 1,
    },
  ],
};

export const AI_INTERVIEW_QUESTIONS = [
  "Dünya hakkındaki düşünce biçiminizi değiştiren bir kitap nedir?",
  "Sizi gerçekten var hissettiren son deneyimi anlatın.",
  "Sizi tanımlayan bir hobi veya ilgi alanı nedir — ve neden?",
  "Sizce iyi bir topluluğu mükemmel bir topluluktan ne ayırır?",
];

export const MOCK_USER: UserProfile = {
  id: "u1",
  handle: "@misafir",
  bio: "Kayıt tamamlanıyor.",
  membershipLevel: 0,
  joinedClubs: [],
  clubJoinDates: {},
  reputation: 0,
  interests: [],
  memberSince: "2026",
};

const ALL_CLUB_IDS = [
  "master", "languages", "motorcycles", "watches", "whisky", "cigars",
  "books", "film", "aviation", "gastronomy", "cars", "philosophy",
  "finance", "music", "maritime", "fitness", "history", "fashion",
  "agriculture", "landscaping", "mountaineering", "camping", "models",
  "dance", "simracing", "archery", "perfume",
];

const ADMIN_JOIN_DATE = "2024-01-01T00:00:00.000Z";

export const ADMIN_USER: UserProfile = {
  id: "admin-001",
  handle: "@admin",
  bio: "ORUN Yöneticisi — tüm kulüplere tam erişim.",
  membershipLevel: 3,
  joinedClubs: ALL_CLUB_IDS,
  clubJoinDates: Object.fromEntries(ALL_CLUB_IDS.map(id => [id, ADMIN_JOIN_DATE])),
  reputation: 9999,
  interests: ALL_CLUB_IDS.filter(id => id !== "master"),
  memberSince: "2024",
};
