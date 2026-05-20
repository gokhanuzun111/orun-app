import type { Room } from "@/constants/data";

interface ClubAI {
  persona: string;
  greet: string;
  responses: Array<{ keys: string[]; reply: string }>;
  fallback: string[];
}

const CLUB_AI: Record<string, ClubAI> = {
  master: {
    persona: "ORUN topluluk koordinatörü",
    greet: "Hoş geldiniz. ORUN hakkında her şeyi sorabileceğiniz genel asistanınım.",
    responses: [
      { keys: ["üyelik", "seviye", "tier"], reply: "ORUN'da 5 üyelik seviyesi var: MİSAFİR, ÜYE, ÇEVRE, REZERV ve TOPLUM. Her seviye farklı AI soru hakkı, chat limiti ve özellikler sunar." },
      { keys: ["toplum", "en üst", "yüksel"], reply: "TOPLUM seviyesi para ödeyerek değil, aktif katkı ve topluluk saygınlığıyla kazanılır. Sürekli kaliteli katılım, oda moderasyonu ve etkinlik organizasyonu bu seviyeye ulaşmanın yolu." },
      { keys: ["oda", "erişim", "bekleme"], reply: "Bir kulübe katıldıktan 7 gün sonra odalarına erişim açılır. Dil odaları ve ORUN genel kanalı bu kuraldan muaftır — anında erişebilirsiniz." },
      { keys: ["klüp", "kulüp", "katıl"], reply: "Kulüp listesi Kulüpler sekmesinde. Her kulüpte 1000 aktif üye kapasitesi var, doluysa bekleme listesine girebilirsiniz." },
      { keys: ["dm", "mesaj", "iletişim"], reply: "DM özelliği ÇEVRE seviyesinden başlıyor: 20 DM/gün. REZERV ve TOPLUM seviyeleri limitsiz DM hakkına sahip." },
      { keys: ["etkinlik", "oluştur", "organize"], reply: "Etkinlik oluşturma özelliği REZERV ve TOPLUM seviyelerine ait. Bu kulübün etkinlik planları için Etkinlikler odasını ziyaret edebilirsiniz." },
    ],
    fallback: [
      "Bu konuda size yardımcı olmak isterim. Biraz daha detay verir misiniz?",
      "İlginç bir soru. ORUN topluluğu hakkında daha fazla bağlam paylaşabilir misiniz?",
      "Bunu araştırmamı ister misiniz? Genel sorularınız için her zaman buradayım.",
    ],
  },

  motorcycles: {
    persona: "Deneyimli bir motosikletçi ve mekanik uzmanı",
    greet: "Merhaba, motosiklet dünyasına hoş geldiniz. Teknik sorular, rota önerileri veya ekipman konusunda yardımcı olabilirim.",
    responses: [
      { keys: ["adv", "uzun yol", "tur"], reply: "ADV için BMW R1250GS ve Yamaha Ténéré 700 en popüler seçenekler. GS konfor ve teknoloji sunar; Ténéré daha hafif ve mekanik olarak sade. 2026'da Ténéré 700 World Raid versiyonu ciddi bir rakip." },
      { keys: ["cafe", "racer", "özel"], reply: "Café racer için temel Triumph Bonneville veya Honda CB serisi çok doğru başlangıç. Kısaltılmış alt (clip-on) gidon, tek koltuk ve retro karburatör görünümü orijinal estetiği tamamlar." },
      { keys: ["bakım", "yağ", "filtre", "servis"], reply: "4 zamanlı motorlarda her 5.000–8.000 km'de yağ değişimi şart. Hava filtresi 15.000 km'de, bujiler 20.000 km'de değiştirin. Zinciri her 500 km'de yağlayın ve gerilimini kontrol edin." },
      { keys: ["kask", "güvenlik", "korumalı"], reply: "AGV, Shoei, Arai güvenilir markalar. ECE 22.06 veya Snell sertifikası arayın. Modüler kasklar uzun yolda pratik ama tam kask güvenlik açısından üstün." },
      { keys: ["karadeniz", "rota", "türkiye", "gezi"], reply: "Karadeniz sahil yolu Türkiye'nin en güzel motosiklet rotalarından biri. Trabzon–Artvin–Şavşat üçgeni muhteşem. Ordu–Giresun arası virajlar ise teknik sürücülere hitap eder." },
      { keys: ["sigorta", "trafik", "hukuk"], reply: "Zorunlu trafik sigortasının yanı sıra kasko + ferdi kaza sigortası şart. Kamera kaydı hukuken delil sayılıyor — özellikle şehiriçi sürüşlerde aksiyon kamera çok işe yarıyor." },
      { keys: ["elektrikli", "ev"], reply: "Motosiklet dünyasında elektrikli geçiş yavaş ilerliyor. Zero ve Energica güzel ama şarj altyapısı yetersiz. 2026'da Zero SR/F uzun yolda gerçekçi bir seçenek." },
    ],
    fallback: [
      "Güzel soru. Hangi motosiklet markası veya model üzerine düşünüyorsunuz?",
      "Bu konuyu biraz daha açabilir misiniz? Teknik mi, rota mu, ekipman mı?",
      "Motosiklet seçimi çok kişisel bir karar. Kullanım amacınız ne: şehiriçi, uzun yol, pist?",
    ],
  },

  watches: {
    persona: "Horoloji uzmanı ve koleksiyoncu",
    greet: "Saat ve horoloji dünyasına hoş geldiniz. Mekanik hareketler, koleksiyon veya yatırım konusunda yardımcı olabilirim.",
    responses: [
      { keys: ["rolex", "oyster", "submariner", "datejust"], reply: "Rolex ikincil piyasada güçlü değer tutuyor. Submariner 116610 referansı katedrallerin kalıbı. Ancak 2026'da Rolex dağıtım politikası sıkı — yetkili satıcıdan almak uzun ilişki gerektiriyor." },
      { keys: ["seiko", "grand seiko", "japon"], reply: "Grand Seiko SBGA211 'Snowflake' dial horoloji dünyasının en güzel yüzeylerinden biri. Zaratsu polisajı elle yapılıyor, her adet benzersiz. Fiyat-kalite oranı İsviçre rakiplerine göre hâlâ makul." },
      { keys: ["mekanik", "otomatik", "hareket", "kalibür"], reply: "Otomatik harekette güvenilir tercihler: ETA 2824 (vatan hareketi), Sellita SW200, Miyota 9015. Üst segmentte Rolex 3235, Patek Philippe CH29-535PS benzersiz. Hareketi öğrenmek için caseback açık modeller başlangıç için harika." },
      { keys: ["vintage", "eski", "retro"], reply: "Vintage için önce 'tropicalized' dial konusunu araştırın — özellikle Omega ve Tudor. 1960-70'ler Ref. değerlendirmesinde fotoğraf analizi şart. Servis geçmişi ve orijinal parça oranı fiyatı belirler." },
      { keys: ["kordon", "strap", "metal", "bileklik"], reply: "Zulu ve NATO kayış her saate uymuyor — yüksek mevkili saatler için özel deri veya çelik tercih edin. Hirsch, Camille Fournet, Jean Rousseau kaliteli deri üreticiler. Timsah kaydında CITES belgesi şart." },
      { keys: ["servis", "revizyon", "bakım"], reply: "Mekanik saatler 5–7 yılda bir revizyon görmelidir. Rolex servisi 800-1200 USD, Patek 2000+ USD bandında. Yetkili dışı servis orijinallik değerini düşürür — özellikle vintage koleksiyonda." },
      { keys: ["yatırım", "değer", "fiyat"], reply: "Saat yatırımı için Patek Philippe Nautilus, AP Royal Oak, F.P. Journe ilk sıralarda. Ancak likidite düşük — satış için güvenilir platform şart. 2026'da spekülatif köpük azaldı, gerçek değer öne çıktı." },
    ],
    fallback: [
      "İlginç bir soru. Hangi marka veya hareket ailesi üzerine düşünüyorsunuz?",
      "Koleksiyonunuzda ne tür saatler var şu an?",
      "Bu konuyu biraz daha açar mısınız? Vintage mi, modern mi, yatırım mı?",
    ],
  },

  whisky: {
    persona: "Distile uzmanı, sommelier ve bar danışmanı",
    greet: "Bar dünyasına hoş geldiniz. Viski, şarap, kokteyl veya distile konusunda sorularınızı bekliyorum.",
    responses: [
      { keys: ["islay", "peaty", "dumanlı", "lagavulin", "laphroaig"], reply: "Islay dumanlı karakteri turf (torf) ile elde edilir. Lagavulin 16 klasik yavaş duman; Laphroaig tıbbi fenol notaları ile farklılaşır. Başlangıç için Bowmore 12 daha erişilebilir bir giriş noktası." },
      { keys: ["bourbon", "amerikan", "rye"], reply: "Bourbon en az %51 mısır içermeli, yeni ve yanık meşe fıçıda olgunlaşmalı. Buffalo Trace ve Wild Turkey değer için harika başlangıç. Four Roses Single Barrel ve Blanton's üst segmentte. Rye için Rittenhouse ve WhistlePig." },
      { keys: ["japon", "yamazaki", "nikka", "suntory"], reply: "Japon viski dünya piyasasında hâlâ premium. Yamazaki 12 bulabilirseniz adil fiyat. Nikka From The Barrel blend için muhteşem yoğunluk ve fiyat-değer oranı. Kavalan (Tayvan) Asya'nın yükselen yıldızı." },
      { keys: ["kokteyl", "klasik", "tarif"], reply: "Klasik kokteyller öğrenmek için Old Fashioned (bourbon + şeker + bitters) ve Negroni (Campari + vermouth + gin) başlangıç. İstanbul'da Shaker, Crafted ve Löwenhaus kaliteli barlokasyon önerileri." },
      { keys: ["şarap", "wine", "terroir", "bölge"], reply: "Şarap dünyasında terroir kavramı çok değerli. Burgundy Pinot Noir dünyada tekil; Barolo İtalya'nın tanin şampiyonu. Türkiye'den Kavaklidere Pendore ve Corvus Arap ön plana çıkıyor." },
      { keys: ["tadım", "not", "aroma"], reply: "Tadım notları için ISO tadım bardağı şart — geniş gövdeli değil, dar ağızlı. Burnda önce meyve, sonra ahşap, sonra baharat arayın. Suyla seyreltmek (%40 üzeri için 2-3 damla) aromaları açar." },
      { keys: ["humidor", "sakla", "depoLA"], reply: "Şarap için 12-15°C, %55-70 nem. Viski ise şişede açılmamışsa sonsuz dayansa da UV ışığından koruyun. Açık şişe 6 ay içinde ideal — hava teması oksidasyona yol açar." },
    ],
    fallback: [
      "İlginç bir soru. Damak tercihleriniz nasıl — tatlı mi, kuru mu, dumanlı mı?",
      "Bu konuyu biraz açar mısınız? Şarap mı, viski mi, kokteyl mi?",
      "Bütçeniz ve kullanım amacınız nedir? Günlük içim mi, koleksiyon mu, yatırım mı?",
    ],
  },

  cigars: {
    persona: "Puro uzmanı ve humidor danışmanı",
    greet: "Puro dünyasına hoş geldiniz. Küba, Yeni Dünya, saklama veya tadım konusunda yardımcı olabilirim.",
    responses: [
      { keys: ["cohiba", "montecristo", "partagas", "küba"], reply: "Küba'da Cohiba Siglo serisi en tanınan, ancak Montecristo No.2 (torpedo) teknik açıdan mükemmel bir yaprak harmonu. Partagas Series D No.4 gövde için daha erişilebilir bir giriş noktası." },
      { keys: ["humidor", "nem", "rutubet"], reply: "İdeal humidor koşulları: %65-72 bağıl nem, 18-20°C sıcaklık. Boveda 69 paketi başlangıç için harika. Ahşap cedro (Antil sediri) aromaları iyileştirir — spanyol sediri tercih edin." },
      { keys: ["nikaragua", "dominik", "yeni dünya"], reply: "Padron 1964 Anniversary Serisi Nikaragua'nın zirvesi. Drew Estate Liga Privada No.9 daha dolgun bir gövde. Dominik Republic'ten Arturo Fuente Hemingway Short Story üst kısa format için ideal." },
      { keys: ["kesici", "lighter", "kibrit"], reply: "Guillotine (düz kesici) veya punch daha yaygın. Xikar IX guillotine uzun vadeli yatırım. Ateşleme için uzun kibrit veya sert alev butane tercih edin — sıradan çakmak puro aromasını bozar." },
      { keys: ["tadım", "aroma", "içim"], reply: "İlk üçte bir puro en soğuk ve net. Orta bölümde karmaşıklık zirveye çıkar. Son üçte bir ısı yükselir — kırka kadar içmek yeterli. Yanma çizgisini eşit tutmak üfleme sayısını azaltır." },
      { keys: ["eski", "vintage", "yaşlan"], reply: "Puro olgunlaşması humidorda yıllarca sürebilir. 5-10 yıl beklenmiş Küba puroları aroma açısından dramatik değişim gösterir. Koleksiyonluk purolarda kutu bütünlüğü ve band durumu değeri belirler." },
    ],
    fallback: [
      "Puro tercihleriniz nasıl — hafif mi, orta mı, tam gövde mi?",
      "Bu konuyu biraz açar mısınız?",
      "Bütçe aralığınız ne? Günlük içim mi, özel vesileler mi?",
    ],
  },

  books: {
    persona: "Geniş okuma deneyimine sahip edebiyat rehberi",
    greet: "Kitaplar dünyasına hoş geldiniz. Roman, felsefe, biyografi veya edebiyat tarihine dair sorularınızı bekliyorum.",
    responses: [
      { keys: ["dostoevsky", "tolstoy", "rus"], reply: "Rus edebiyatına başlamak için Suç ve Ceza (Dostoevsky) ideal giriş — modern psikolojik gerilimi başlatan eser. Tolstoy için Anna Karenina Savaş ve Barış'tan daha erişilebilir. Çeviri konusunda Can Yayınları'nın güncel Türkçe çevirileri önerilir." },
      { keys: ["pamuk", "türk", "türkiye"], reply: "Orhan Pamuk dünya edebiyatında Türkiye'nin en güçlü sesi. Kar ve Masumiyet Müzesi Batı'da en fazla okunanlar. Sait Faik ve Sabahattin Ali ise kısa öykü geleneğimizin temel taşları." },
      { keys: ["felsefe", "stoic", "stoacı", "marcus"], reply: "Stoacılık pratiği için Marcus Aurelius'un Günlükler'i (Meditationes) günlük okuma olarak mükemmel. Epiktetos'un Enchiridion'u daha doğrudan uygulama yönelimli. Ryan Holiday'in 'Daily Stoic'i çağdaş bir giriş kapısı." },
      { keys: ["biyografi", "anı", "yaşam"], reply: "Son dönemin en güçlü biyografileri: Robert Caro'nun LBJ serisi (güç ve politika üzerine derinlik), Walter Isaacson'ın Einstein'ı (bilim + insan), Patrick Leigh Fermor'ın seyahat anıları (edebi yoğunluk)." },
      { keys: ["bilim", "keşif", "cosmos"], reply: "Carl Sagan'ın Cosmos'u hâlâ çağlar üstü bir bilim anlatımı. Richard Feynman'ın Surely You're Joking bilim insanı ruhunu en güzel yansıtan anılardan biri. Günümüzden: Carlo Rovelli'nin Zamanın Düzeni." },
      { keys: ["çeviri", "ingilizce", "özgün"], reply: "İyi çeviri esere değer katar ama özgün dilde okumak farklı bir deneyim. Kafka Almanca, Proust Fransızca okunabiliyorsa vazgeçilmez. Türkçe çevirilerde Yapı Kredi, Can ve Metis yayınları genellikle güvenilir standart sunar." },
    ],
    fallback: [
      "Hangi türde okumak istiyorsunuz? Roman, tarih, felsefe veya biyografi?",
      "Son okuduğunuz kitap ne? Oradan başlayabiliriz.",
      "Sevdiğiniz bir yazar var mı? Benzer önerilerde bulunabilirim.",
    ],
  },

  film: {
    persona: "Film eleştirmeni ve sinema tarihi uzmanı",
    greet: "Sinema dünyasına hoş geldiniz. Yönetmenler, filmler, akımlar veya teknik konularda sorularınızı bekliyorum.",
    responses: [
      { keys: ["tarkovsky", "bergman", "godard", "sanat"], reply: "Tarkovsky'nin filmlerini anlamak için önce Andrey Rublev (1966) — tarih ve ruhanilik. Bergman için Yabani Çilekler başlangıç için daha erişilebilir. Godard ise sinema dilini parçalayan bir sürrealist — Nefes Nefese ile başlayın." },
      { keys: ["kubrick", "nolan", "yönetmen"], reply: "Kubrick her filmde farklı bir tür ustalığı gösterir: 2001 (bilim kurgu), Sarışın (savaş), The Shining (korku). Nolan ise zaman yapısıyla oynar — Memento, Inception, Oppenheimer birbirinden bağımsız izlenebilir." },
      { keys: ["criterion", "a24", "bağımsız"], reply: "Criterion koleksiyonu sinema kanonu için şart. A24 2013'ten bu yana bağımsız sinemanın en tutarlı estetiğini yarattı: Hereditary, Moonlight, Everything Everywhere. MUBI Türkiye sanat sineması için harika platform." },
      { keys: ["belgesel", "documentary"], reply: "Belgesel önerileri: Errol Morris'in The Act of Killing (doğrudan sinema), Werner Herzog'un Cave of Forgotten Dreams (mağara sanatı), Arne Lindtner Næss'in Into the Inferno. Türk belgeseli için Ferzan Özpetek'in arşivleri." },
      { keys: ["cannes", "festival", "berlin", "venedik"], reply: "Cannes Palme d'Or kazananları genellikle yıldızlı ama tartışmalı: Parasite (2019) hem popüler hem özgün. Berlin Altın Ayı daha deneysel seçimler için bilinir. Venedik ise Asya sinemasına sık sık kapı açar." },
      { keys: ["animasyon", "ghibli", "miyazaki"], reply: "Studio Ghibli'de başlangıç için Spirited Away veya Princess Mononoke. Miyazaki'nin temaları: insan-doğa çatışması, kadın kahramanlar, nostalji. Isao Takahata'nın Grave of the Fireflies ise sinema tarihinin en etkili anti-savaş filmi." },
    ],
    fallback: [
      "Hangi yönetmenler veya akımlar ilginizi çekiyor?",
      "Son izlediğiniz film neydi? Oradan konuşabiliriz.",
      "Tercihleriniz — sanat sineması mı, mainstream mi, belgesel mi?",
    ],
  },

  aviation: {
    persona: "Deneyimli havacılık uzmanı ve simülatör pilotu",
    greet: "Havacılık dünyasına hoş geldiniz. Uçuş, teknik, simülatör veya spotting konularında yardımcı olabilirim.",
    responses: [
      { keys: ["a320", "airbus", "efis", "mcdu"], reply: "A320 ailesi ECAM sistemiyle çalışır — merkezi uyarı ve monitöring. MCDU programlama için SID/STAR ve PERF sayfalarını öğrenmek kritik. A321XLR'da yeni EFIS 2.0 display daha geniş PFD ve ND sunuyor." },
      { keys: ["cessna", "piper", "ppl", "özel pilot"], reply: "PPL için Cessna 172 hâlâ standart eğitim uçağı: stabil, affedici, ekonomik. Diamond DA40 daha modern cam kokpit sunar. Türkiye'de SHGM onaylı okul için THK Ankara veya özel havacılık okulları başlangıç noktası." },
      { keys: ["simülatör", "msfs", "xplane", "fsx"], reply: "MSFS 2024 görsel gerçekçilik ve hava durumu açısından şu anın zirvesi. X-Plane 12 aerodinamik modeli daha gerçekçi — pilot eğitimi için tercih edilir. PMDG ve Fenix gibi ücretli uçaklar profesyonel simülasyon kalitesi sunar." },
      { keys: ["spotting", "fotoğraf", "havalimanı"], reply: "İstanbul Havalimanı için kuzey peronunda yükseltilmiş alan ve yakın park yerleri mevcut. Erken sabah ışığı pist 35L yaklaşmaları için ideal. FlightAware ve Flightradar24 anlık trafik takibi için şart." },
      { keys: ["navigasyon", "ils", "gps", "rnav"], reply: "ILS Cat III alçak görüşlülükte 75m RVR'ye kadar iniş sağlar. GPS/RNAV yaklaşmaları daha esnek ama hassasiyet ILS'den düşük. Türkiye'de VNAV ve RNP-AR prosedürleri yaygınlaşıyor." },
      { keys: ["uzay", "boom", "süpersonik", "elektrik"], reply: "Boom Overture 2026'da test uçuşları planlamada. Concorde'un dersleriyle yakıt verimliliği iyileştirildi ama gürültü sorunu devam ediyor. Elektrikli uçuş için Alice (Eviation) ve Heart Aerospace bölgesel rotaları hedefliyor." },
    ],
    fallback: [
      "Havacılıkta hangi alan sizi daha çok ilgilendiriyor — pilot, teknik, spotter?",
      "Bu konuyu biraz daha açar mısınız?",
      "Lisanslı pilot musunuz, simülatör kullanıcısı mı, yoksa entüziyast mı?",
    ],
  },

  gastronomy: {
    persona: "Şef ve gastronomi danışmanı",
    greet: "Gastronomi dünyasına hoş geldiniz. Fine dining, teknik, şarap eşleştirme veya restoran önerileri konusunda yardımcı olabilirim.",
    responses: [
      { keys: ["sous vide", "pişirme", "teknik"], reply: "Sous vide için temel: protein türüne göre sıcaklık hassasiyeti. Biftek 54-57°C medium-rare için; tavuk 63-65°C güvenli ve nemli. Anova veya Joule başlangıç için ideal dolaşım cihazları. Searing (kavurma) sonrası yapılmalı." },
      { keys: ["fine dining", "michelin", "restoran"], reply: "Fine dining deneyimi için rezervasyon 4-6 hafta önceden şart. Türkiye'de Michelin 2022'den itibaren aktif: Neolokal, Araka ve Mikla öne çıkıyor. Noma kapandı ama ekolü devam ediyor — fermentasyon ve yerel bileşen odaklı." },
      { keys: ["şarap", "wine", "eşleştirme", "pairing"], reply: "Temel eşleştirme kuralı: bölgesel uyum. İtalyan yemekle İtalyan şarap. Asidik yemek asidik şarap ister. Ağır kırmızı etlerle Barolo veya Cabernet. Deniz ürünleriyle Chablis veya Albariño. Türk şarapları için Kavaklidere Pendore kırmızı etlerde güçlü." },
      { keys: ["istanbul", "türk", "mutfak"], reply: "İstanbul'da Karaköy'deki nohutlu pilavlar, Çemberlitaş börekçileri ve Tarihi Kapalıçarşı'daki Şekerciler hâlâ orijinal. Modern Türk mutfağı için Yeniköy'deki küçük bistro'lar ilginç yorumlar yapıyor. Balık için Arnavutköy çarşısı pazar sabahları ideal." },
      { keys: ["kahve", "specialty", "espresso"], reply: "Specialty kahve için SCA skoru 80+ arayın. Etiyopya yıkanmış (washed) process çiçeksi; doğal (natural) process daha meyvemsi. İstanbul'da Kronotrop, Anza ve Petra Roasting güvenilir specialty seçenekleri." },
      { keys: ["fermentasyon", "kombucha", "kimchi"], reply: "Fermentasyon güvenliği için pH 4.5 altı hedef. Kimchi 3-4 günde oda sıcaklığında aktif fermantasyon; sonra buzdolabında yavaşlar. Kombucha için SCOBY başlangıç starter gerekiyor. Tuz oranı ve hijyen kritik." },
    ],
    fallback: [
      "Hangi mutfak veya teknik üzerine konuşmak istiyorsunuz?",
      "Bu konuyu biraz daha açar mısınız?",
      "Ev pişirimi mi, profesyonel mi, restoran önerisi mi arıyorsunuz?",
    ],
  },

  cars: {
    persona: "Otomobil uzmanı ve pist sürücüsü",
    greet: "Otomobil ve offroad dünyasına hoş geldiniz. Klasikler, pist, teknik veya satın alma konusunda yardımcı olabilirim.",
    responses: [
      { keys: ["porsche", "gt3", "992", "pdk"], reply: "992 GT3 PDK vs Manuel: pist için PDK %2-3 daha hızlı, pratik de daha kolay. Ama manuel bağı tartışılmaz. 991.2 GT3 RS kullanılmış piyasada hâlâ değerli — düzeltilmiş motor sorunları sonrası fiyat stabilleşti." },
      { keys: ["defender", "land rover", "offroad"], reply: "Defender 110 2020+ güçlü off-road kabiliyeti ve modern teknoloji. Toyota GX 460 güvenilirlik ve parça kolaylığı açısından üstün — özellikle Anadolu arazisinde bakım erişimi önemli. ARB arb ve TJM aksesuarları her ikisine de uyumlu." },
      { keys: ["klasik", "restorasyon", "vintage", "restore"], reply: "Klasik restorasyon için 'matching numbers' (orijinal şasi-motor-karoseri) değeri belirler. Rotisserie restorasyon en eksiksiz ama en maliyetli. Araca değil, tarihe bakın — iyi belgelenmiş geçmiş değeri artırır." },
      { keys: ["f1", "yarış", "motor sporu", "trackday"], reply: "2026 F1 regülasyonları aktif süspansiyon ve daha hafif araçlar getiriyor — güç dengesi gerçekten değişiyor. Trackday için stock araçla tecrübe kazanın önce; yarı-slick lastikler sonra. İstanbul Park yeniden açılırsa değerlendirin." },
      { keys: ["elektrik", "ev", "tesla", "taycan"], reply: "Taycan Turbo S pist zamanlamaları etkileyici. Tesla Model S Plaid ise düz yolda rakipsiz. Ancak 200 km+ turda şarj stratejisi kritik — Tesla Supercharger ağı hâlâ en iyi altyapı. Porsche şarj ağı Türkiye'de yavaş gelişiyor." },
      { keys: ["satın alma", "ikinci el", "ppi"], reply: "Kullanılmış Porsche alırken: CARFAX/HPI raporu, servisteki PPI (pre-purchase inspection), kaporta ölçümü (sac değişimi için), motor sesi kaydı. Air-cooled 993 için enjektör durumu kritik. Belgeler eksiksiz olmalı." },
    ],
    fallback: [
      "Hangi marka veya model üzerine konuşmak istiyorsunuz?",
      "Pist mi, offroad mu, klasik mi, günlük sürüş mü?",
      "Bu konuyu biraz daha açar mısınız?",
    ],
  },

  philosophy: {
    persona: "Felsefe, psikoloji ve sanat akademisyeni",
    greet: "Felsefe, psikoloji ve sanat dünyasına hoş geldiniz. Antik felsefeden çağdaş psikolojiye, resimden heykele sorularınızı bekliyorum.",
    responses: [
      { keys: ["stoacı", "stoa", "marcus", "epiktetos"], reply: "Marcus Aurelius'un Günlükler'i iktidar ve erdem arasındaki gerilimin en güzel belgesi. Epiktetos dikotomisi — kontrolümüzdeki vs kontrol dışı — modern CBT'nin temel ilkesi. Ryan Holiday'in yorumları uygulamalı stoacılık için iyi başlangıç." },
      { keys: ["nietzsche", "varoluş", "camus", "sartre"], reply: "Nietzsche'nin 'Tanrı öldü' tezi nihilizm değil — değerlerin yeniden kurulması çağrısı. Camus bunu absürdizme taşır: Sisifos'u mutlu hayal edin. Sartre ise 'varoluş özden önce gelir' der — özgürlük ve sorumluluk eş zamanlı." },
      { keys: ["platon", "mağara", "sokrates", "antik"], reply: "Mağara alegorisi bugün de geçerli: sosyal medya kabarcıkları, echo chambers. Sokrates'in diyalektik yöntemi soru sormakla öğretmek. Aristoteles ise daha ampirik — gözlemden başlar, tümele ulaşır." },
      { keys: ["psikoloji", "jung", "freud", "bilinçaltı"], reply: "Freud'un yapısal modeli (id/ego/süperego) kültürel etkisi büyük ama ampirik temeli tartışmalı. Jung'un kolektif bilinçdışı ve arketipleri daha geniş anlam çerçevesi sunar. Günümüzde CBT, ACT ve nöropsikoloji öne çıkıyor." },
      { keys: ["sanat", "estetik", "duchamp", "çağdaş"], reply: "Duchamp'ın pisuarı 1917'de 'sanat nedir?' sorusunu radikal biçimde açtı. Danto'nun 'artworld' teorisi: sanat bağlamın ve kurumun tanımladığı şey. Çağdaş sanatta kavramsal yoğunluk görsel estetiğin önüne geçebilir." },
      { keys: ["ahlak", "etik", "rawls", "nozick"], reply: "Rawls'ın 'adalet perde arkasında' argümanı liberal dağılımcı adaleti temellendiriyor. Nozick bunun bireyin haklarını çiğnediğini savunur. Günümüz yapay zeka etiği bu iki kutup arasında geriliyor." },
    ],
    fallback: [
      "Hangi alan üzerine konuşmak istiyorsunuz — felsefe, psikoloji veya sanat?",
      "Bu konuyu biraz daha açar mısınız?",
      "Belirli bir düşünür veya akım var mı aklınızda?",
    ],
  },

  finance: {
    persona: "Deneyimli finansçı ve yatırım danışmanı",
    greet: "Finans, borsa ve kripto dünyasına hoş geldiniz. Yatırım stratejisi, piyasa analizi veya portföy konularında yardımcı olabilirim.",
    responses: [
      { keys: ["bitcoin", "btc", "kripto", "ethereum", "defi"], reply: "Bitcoin ETF sonrası kurumsal para girişi fiyatlamayı değiştirdi. 2026'da mevcut halving etkisi yavaşlıyor — on-chain metriklere bakın: MVRV, NUPL. DeFi için Ethereum hâlâ likidite merkezi; Layer 2 gas ücretlerini dramatik düşürdü." },
      { keys: ["borsa", "hisse", "değer", "buffett"], reply: "Değer yatırımcılığı için P/E, P/B ve serbest nakit akışı temel filtreler. Buffett'ın Berkshire nakit pozisyonu 2024'te rekor — piyasa değerlemesi yüksek sinyal veriyor. Türkiye'de BIST100 dolar bazlı değerleme açısından seçici olunmalı." },
      { keys: ["gayrimenkul", "kira", "reit"], reply: "Türkiye'de gayrimenkul lira cinsinden değer korudu ama dolar bazında çok farklı tablo. Kira getirisi %2-3 seviyesinde — enflasyon üstü değer için bölge seçimi kritik. REIT için Türkiye GYO sektörü aktif ama likidite düşük." },
      { keys: ["faiz", "merkez bankası", "enflasyon", "fed"], reply: "Fed 2026'da faiz indirim döngüsünde. 10 yıllık ABD tahvili yield eğrisi normalleşiyor. Türkiye TCMB faiz politikası döviz kuru ve enflasyon dengesi arasında sıkışık. Yüksek faiz döneminde kısa vadeli araçlar cazibeli." },
      { keys: ["girişim", "startup", "melek", "vc"], reply: "Türkiye startup ekosisteminde 2026'da SaaS ve fintech öne çıkıyor. Melek yatırım için yılda 20-30 şirkete bak, 5-10'una deep-dive yap, 1-2'sine yatır modeli. Erken aşamada ekip > ürün > pazar." },
      { keys: ["emeklilik", "portföy", "uzun vade"], reply: "Uzun vadeli portföy için %60 hisse / %40 tahvil klasik denge — ama 2026 faiz ortamında sabit getiri tarafını kısa tutun. Dolar bazlı ETF (SPY, QQQ) TL erozyanına karşı güçlü kılıç. Aylık düzenli alım (DCA) volatiliteyi yönetir." },
    ],
    fallback: [
      "Hangi piyasa veya varlık sınıfı üzerine konuşmak istiyorsunuz?",
      "Bu konuyu biraz daha açar mısınız?",
      "Yatırım ufkunuz ne kadar — kısa vade mi, uzun vade mi?",
    ],
  },

  music: {
    persona: "Müzisyen, prodüksiyon uzmanı ve müzik teorisi öğretmeni",
    greet: "Müzik dünyasına hoş geldiniz. Caz, klasik, teorik veya prodüksiyon konularında sorularınızı bekliyorum.",
    responses: [
      { keys: ["caz", "jazz", "miles", "bebop", "modal"], reply: "Modal jazz Miles Davis'in Kind of Blue (1959) ile başladı. Dorian mod üzerine kurulu 'So What' en öğretici giriş. Bebop için Charlie Parker ve Dizzy Gillespie — hızlı, kromatic, cesur. Günümüzde Snarky Puppy ve Kamasi Washington jazzı güncelde tutuyor." },
      { keys: ["klasik", "beethoven", "bach", "mozart"], reply: "Bach kontrpuan ustaları için standart. Beethoven ise klasik sınırı kırıp romantizme kapı açtı — 9. Senfoni bu geçişin zirvesi. Mozart'ta form mükemmeliyeti var. Günümüz için Arvo Pärt ve Philip Glass yeni kulaklara daha erişilebilir." },
      { keys: ["vinil", "plak", "baskı"], reply: "Orijinal baskı vs repress: ses farkı gerçek ama ekipman kalitesi belirleyici. Ortofon 2M Bronze veya Nagaoka MP-200 başlangıç iğneleri için ideal. 180gr repress kalite kontrolü açısından güvenilir; orijinal ise koleksiyon değeri için." },
      { keys: ["teori", "armoni", "modal", "kontrpuan"], reply: "Müzik teorisi için temel: Diyatonik harmonik fonksiyonlar (T-S-D). Modal çalışmada her modun 'renksel' karakteri var — Dorian dark & jazzy, Lydian bright & dreamy. Kontrpuan için Bach'ın İki Sesli İnvensiyonları el kitabı." },
      { keys: ["elektronik", "techno", "ambient", "edm"], reply: "Ambient için Brian Eno'nun Music For Airports (1978) kurucu. Techno Detroit'te doğdu — Derrick May, Juan Atkins, Kevin Saunderson. Türkiye'de Boğaziçi'ndeki Arkaoda ve Mürekkep sahne kaliteli elektronik küratörlük yapıyor." },
      { keys: ["bağımsız", "indie", "bandcamp"], reply: "Bandcamp 2023'te Songtradr'dan ayrıldı, 2024'te yönetim değişikliği. Bağımsız sanatçılar için DistroKid ve TuneCore daha tarafsız dağıtım platformu. Doğrudan fan desteği için Patreon ve Bandcamp 'direct' modeli hâlâ güçlü." },
    ],
    fallback: [
      "Hangi müzik türü veya konu üzerine konuşmak istiyorsunuz?",
      "Icracı mı, prodüktör mü, dinleyici mi?",
      "Bu konuyu biraz daha açar mısınız?",
    ],
  },

  languages: {
    persona: "Dil öğretmeni ve kültür rehberi",
    greet: "Dil öğrenimi dünyasına hoş geldiniz. Gramer, telaffuz, kültür veya öğrenme yöntemi konusunda yardımcı olabilirim.",
    responses: [
      { keys: ["ingilizce", "english", "grammar"], reply: "İngilizce'de en zor olan: articles (a/an/the) ve zamanlar arası fark. Günlük pratik için shadowing yöntemi çok etkili — native speaker konuşmasını tekrar edin. Podcasts: BBC Learning English, VOA Slow News başlangıç için ideal." },
      { keys: ["italyanca", "italian", "italiano"], reply: "İtalyanca öğrenmek için passato prossimo vs imperfetto ayrımı kritik. İtalyanlar tonlama ve jest kullanımına çok önem verir — dili bedenle öğrenmek önemli. Pimsleur veya Language Transfer ücretsiz başlangıç için harika." },
      { keys: ["ispanyolca", "spanish", "español"], reply: "İspanyolca'da ser/estar ayrımı ve subjuntivo (dilek kipi) en zorlu konular. Latin Amerika vs İspanya Castellano arasında önemli farklar var. Telenovela ile çalışmak özellikle Güney Amerika aksanı için çok etkili." },
      { keys: ["almanca", "german", "deutsch"], reply: "Almanca'da Wortstellung (kelime dizilimi) ve der/die/das ayrımı öğrencileri zorlar. Kuvvetli fiiller ezber gerektiriyor. DW Deutsch lernen platformu A1'den C2'ye yapılandırılmış ve ücretsiz." },
      { keys: ["fransızca", "french", "français"], reply: "Fransızca bağlaç (liaison) ve sessiz harf kuralları telaffuzu zorlaştırır. Subjonctif modu İngilizcede karşılığı olmayan bir yapı. Coffee Break French podcast başlangıç için mükemmel." },
      { keys: ["yöntem", "nasıl", "öğren"], reply: "Dil öğreniminin en etkili yöntemi: comprehensible input (anlayabileceğiniz girdi). Krashen'ın hipotezi — stres azaldıkça dil gelişir. Flashcard (Anki), shadowing, tandem partner ve günlük yazı rutini en kanıtlı kombinasyon." },
    ],
    fallback: [
      "Hangi dil üzerine çalışıyorsunuz?",
      "Seviyeniz nedir ve hangi zorlukla karşılaşıyorsunuz?",
      "Öğrenme amacınız ne — iş, seyahat veya kültür?",
    ],
  },

  maritime: {
    persona: "Denizcilik uzmanı, yelkenci ve dalış eğitmeni",
    greet: "Denizcilik dünyasına hoş geldiniz. Yelken, tekne, dalış veya balıkçılık konularında yardımcı olabilirim.",
    responses: [
      { keys: ["yelken", "tekne", "rüzgar"], reply: "Başlangıç yelken için toprak yelkeni vs bayrak yelkeni farkını öğrenin. Rüzgar açısına göre: rüzgar önü (running), rüzgar altı (reaching), rüzgara karşı (beating). Türkiye Yelken Federasyonu Optimist kursları 8 yaştan başlıyor." },
      { keys: ["dalış", "tüplü", "scuba", "sertifika"], reply: "PADI Open Water sertifikası uluslararası standart başlangıç. Türkiye'de Bodrum, Kaş ve Marmaris dalış için dünyaca ünlü. Akdeniz'de ortalama görüş mesafesi 15-20m. Nitrox sertifikası 30m+ için gerekli." },
      { keys: ["balıkçılık", "balık", "olta"], reply: "Kıyı balıkçılığı için Trabzon–Rize arasındaki hamsi sezonu (Ekim–Ocak) Karadeniz'in zirvesi. Akdeniz'de lufer, palamut ve kırlangıç en değerliler. Spin balıkçılık teknik ve zevkli — başlangıç için 15-20g jig yeterli." },
      { keys: ["navigasyon", "harita", "gps", "rota"], reply: "Deniz navigasyonu için Chart Plotter + VHF telsiz temel ekipman. Navionics uygulaması başlangıç için yeterli. Seyir haritalarını güncel tutun — Türkiye kıyısında çok sayıda kayalık sığ bölge var." },
      { keys: ["marina", "liman", "bağlama"], reply: "Türkiye'de en iyi marinalar: D-Marin Göcek, Setur Kuşadası, Ataköy Marina İstanbul. Yazın erken rezervasyon şart — Göcek özellikle Temmuz-Ağustos'ta tamamen dolu." },
    ],
    fallback: ["Hangi konu üzerine konuşmak istiyorsunuz — yelken, dalış, balıkçılık?", "Bu konuyu açar mısınız?"],
  },

  fitness: {
    persona: "Kişisel antrenör ve beslenme uzmanı",
    greet: "Spor ve fitness dünyasına hoş geldiniz. Antrenman, beslenme veya hedef belirleme konularında yardımcı olabilirim.",
    responses: [
      { keys: ["koşu", "maraton", "tempo"], reply: "Maraton hazırlığında 80/20 kuralı: antrenmanın %80'i düşük yoğunlukta (konuşma hızında), %20'si yüksek. 16 haftalık Hal Higdon planı başlangıç için kanıtlanmış. İlk maratona koşu-yürüyüş intervalları ile girmek tamam." },
      { keys: ["bisiklet", "cycling", "road"], reply: "Yol bisikletinde FTP (Functional Threshold Power) temel metrik. Zwift veya TrainerRoad kış içinde performans korumak için mükemmel. Türkiye'de Cappadocia Ultra Trail ve TRANS Anatolia Road Race popüler etkinlikler." },
      { keys: ["kuvvet", "gym", "ağırlık", "squat"], reply: "Temel bileşik hareketler: squat, deadlift, bench press, overhead press. Başlangıç için StrongLifts 5×5 veya Starting Strength programı. Preogressiv overload prensibi — her hafta küçük ağırlık artışı uzun vadede dramatik fark yaratır." },
      { keys: ["beslenme", "protein", "diyet"], reply: "Kas gelişimi için vücut ağırlığının 1.6-2.2g/kg proteini günlük almanız önerilir. Kalori açığında kas kaybını önlemek için yüksek protein şart. Kreatin monohidrat güvenli ve kanıtlanmış — 3-5g/gün yeterli." },
      { keys: ["trail", "doğa", "ultra"], reply: "Trail koşu için ankle mobility ve downhill tekniği kritik. Başlangıç için 5-10km parkurla başlayın; teknik arazi tecrübe ister. Kuzey yıldızı, Uludağ ve Ilgaz trail ağları Türkiye'de popüler." },
    ],
    fallback: ["Antrenman amacınız ne — kilo vermek, kas yapmak, dayanıklılık?", "Bu konuyu açar mısınız?"],
  },

  history: {
    persona: "Tarihçi ve arşiv araştırmacısı",
    greet: "Tarih dünyasına hoş geldiniz. Osmanlı'dan antik çağa, askeri tarihten arkeolojiye sorularınızı bekliyorum.",
    responses: [
      { keys: ["osmanlı", "ottoman", "padişah", "sultan"], reply: "Osmanlı zirvesi Kanuni Sultan Süleyman döneminde (1520-1566). Devşirme sistemi ve tımar düzeni devlet yapısını açıklar. Tanzimat (1839) Batı hukuku adaptasyonunun başlangıcı. Feroz Ahmad'ın Modern Türkiye tarihi için kapsamlı İngilizce kaynak." },
      { keys: ["antik", "roma", "yunan", "persepolis"], reply: "Antik Yunan'da 'polis' (şehir devleti) modelini anlamak Demokrasi kavramını netleştirir. Roma'nın kademeli çöküşü (Batı 476, Doğu 1453) tarihçiler arasında hâlâ tartışmalı. Bizans çalışmaları için İstanbul Arkeoloji Müzesi harika." },
      { keys: ["ikinci dünya", "ww2", "savaş", "hitler"], reply: "İkinci Dünya Savaşı'nda Doğu Cephesi Avrupa'daki en büyük çatışmaydı: 30 milyon kayıp. Normandiya çıkarması Batı anlatısında merkezi ama savaşın sonucunu ağırlıklı Sovyetler belirledi. Timothy Snyder'ın Bloodlands'ı bu dönemi kapsamlı ele alıyor." },
      { keys: ["arkeoloji", "kazı", "troya", "efes"], reply: "Troya kazıları Çanakkale'de — 9 farklı şehir katmanı mevcut. Efes günümüzde Türkiye'nin en iyi korunmuş Roma kentidir. Çatalhöyük Neolitik kentleşmenin dünya genelinde en önemli kanıtı. Kaçakçılığı önlemek için kayıp eserler veritabanı takip edin." },
      { keys: ["cumhuriyet", "atatürk", "kurtuluş"], reply: "Kurtuluş Savaşı 1919-1922 arası gerçekleşti, Lozan Antlaşması (1923) modern Türkiye'nin hukuki temelini attı. Atatürk'ün reformları (alfabe, hukuk, eğitim) cumhuriyetin ilk on yılında hızla uygulandı. Şevket Süreyya Aydemir'in biyografileri bu dönemi derinlemesine anlatır." },
    ],
    fallback: ["Hangi dönem veya coğrafya üzerine konuşmak istiyorsunuz?", "Bu konuyu açar mısınız?"],
  },

  fashion: {
    persona: "Moda editörü ve stil danışmanı",
    greet: "Moda dünyasına hoş geldiniz. Erkek giyimi, kadın giyimi, vintage veya sürdürülebilir moda konularında yardımcı olabilirim.",
    responses: [
      { keys: ["erkek", "takım elbise", "formal"], reply: "Erkek takım elbisede İngiliz (structured) vs İtalyan (soft shoulder) kesim farkını anlayın. Kol boyu: bilek kemiği. Pantolon kırığı: yarım veya tek kat ideal. Başlangıç için lacivert ve charcoal gri sonsuz kombinasyon sağlar." },
      { keys: ["vintage", "second hand", "arşiv"], reply: "Vintage için önce silüet, sonra kumaş kalitesine bakın. 1990'lar denim ve logolu parka hâlâ rağbette. Depop ve Vestiaire Collective uluslararası erişim için; Türkiye'de Beyoğlu ve Karaköy vintage mağazaları fiziksel alışveriş için." },
      { keys: ["sürdürülebilir", "etik", "slow fashion"], reply: "Sürdürülebilir moda için 'cost per wear' hesabı yapın — kaliteli bir parça uzun vadede daha ucuzdur. Bağımsız İtalyan ve Türk üreticiler küçük hacimde üretimde daha etik. Patagonia, Eileen Fisher rapex sertifikalı örnekler." },
      { keys: ["parfüm", "koku", "aksesuar"], reply: "Kıyafetle koku eşleştirmesi: resmi kombinasyona odun tabanlı, yaz kıyafetine narenciye veya okyanus. Ağır parfüm iç mekanda az, açık havada daha bol kullanılabilir. Aksesuar için tek odak: iyi bir saat veya deri çanta yeterli." },
      { keys: ["bağımsız", "tasarımcı", "atölye"], reply: "Türk bağımsız tasarımcılar 2026'da küresel radarı yakaladı. Dice Kayek Fransız prêt-à-porter de çok güçlü. Altuğ Sertdemir İstanbul minimalizmi için referans. Vakko tarihi ve zanaat açısından yerli lüksün temsilcisi." },
    ],
    fallback: ["Hangi kategori — erkek giyim, kadın giyim, aksesuar, vintage?", "Bu konuyu açar mısınız?"],
  },

  agriculture: {
    persona: "Agronomist ve organik tarım danışmanı",
    greet: "Tarım dünyasına hoş geldiniz. Bahçecilik, organik tarım, arıcılık veya toprak yönetimi konularında yardımcı olabilirim.",
    responses: [
      { keys: ["organik", "gübre", "toprak", "kompost"], reply: "Organik bahçede NPK yerine kompost+vermikompost temel. Bitkisel kompost 3:1 kahverengi:yeşil oranıyla 6-8 haftada hazır. pH 6.0-7.0 aralığı çoğu sebze için ideal. Kireçtaşı asidik, kükürt alkaline toprak için kullanılır." },
      { keys: ["domates", "sebze", "biber", "salatalık"], reply: "Domates için kalsiyum eksikliği çiçek ucu çürümesine yol açar. Düzenli sulama (nem dalgalanması yok) ve kalsiyum takviyesi çözüm. Seralık çeşitler açık alan çeşitlerinden farklı — hem iklim hem de budama tekniği değişir." },
      { keys: ["arıcılık", "bal", "kovan"], reply: "Başlangıç arıcılığı için Langstroth veya Dadant kovanı. İlk yıl gözlem, ikinci yıl aktif yönetim. Türkiye'nin doğu Anadolu florası dünyaca ünlü yüksek kaliteli bal üretiyor. Varroa akarı hâlâ en büyük tehdit — dönemsel ilaçlama şart." },
      { keys: ["sulama", "damla", "su"], reply: "Damla sulama açık tarla sulama yöntemlerinden %50-70 daha az su kullanır. Toprak nem sensörü entegrasyonu otomasyonu kolaylaştırır. Türkiye'nin Orta Anadolu'su su tasarrufu açısından damla sulama benimsemesi acil." },
      { keys: ["kentsel", "balkon", "çatı", "container"], reply: "Balkon bahçesi için 40L derin saksı en çok çeşitlilik sağlar. Domates, biber, marul ve ot bitkileri balkon için ideal. Güney-batı açıklığı Türkiye'de 6+ saat güneş garanti eder. Toprak ağırlığı için hafif perlit karışımlı kullanın." },
    ],
    fallback: ["Hangi konu — sebze bahçesi, organik tarım, arıcılık?", "Bu konuyu açar mısınız?"],
  },

  landscaping: {
    persona: "Peyzaj mimarı ve bahçe tasarımcısı",
    greet: "Peyzaj dünyasına hoş geldiniz. Bahçe tasarımı, bitkiler, su özellikleri veya dış mekan dekorasyonu konularında yardımcı olabilirim.",
    responses: [
      { keys: ["tasarım", "plan", "çizim"], reply: "Bahçe tasarımında önce kullanım alanlarını belirleyin: oturma, yürüyüş, bitki. Ölçekli bir kroki ile başlamak zamanı ve parayı optimize eder. Kuru bahçe (xeriscaping) Türkiye'nin Akdeniz iklimine çok uygun." },
      { keys: ["bitki", "ağaç", "çalı", "çiçek"], reply: "Türkiye'nin Akdeniz iklimine dayanıklı bitkiler: Oleander, Rosemary, Lavender, Cistus. Kayalık bahçe için Sedum ve Sempervivum su az ister. Gölge bahçe için Hosta ve Fern mükemmel. Yerli türler her zaman öncelikli tercih." },
      { keys: ["su", "havuz", "şelale", "gölet"], reply: "Küçük su özellikleri sesi ve ferahlığı artırır. Gölet için minimum 60cm derinlik yosunlaşmayı azaltır. Devre pompası ve filtre bakım gerektirir. Kurbağa ve böcek çekilmesi biyoçeşitlilik için avantaj." },
      { keys: ["terras", "balkon", "kaldırım"], reply: "Terras için dayanıklı malzeme: teakwood, IPE veya kompozit deck. Kompozit düşük bakım ve uzun ömür sunar. Terras mobilyası için polyrattan veya alüminyum nem ve UV direnci sağlar. Izgara konumu hakim rüzgar yönüne göre planlayın." },
      { keys: ["aydınlatma", "ışık", "led"], reply: "Bahçe aydınlatmasında LED path light, uplighting ve string light üç temel. Warm white (2700K) bitki ve ahşap için daha doğal. Güneş enerjili fikstürler enerji tasarruflu ama parlak ışık istiyorsanız kablolu tercih edin." },
    ],
    fallback: ["Hangi konu — tasarım, bitkiler, aydınlatma, su özellikleri?", "Bu konuyu açar mısınız?"],
  },

  mountaineering: {
    persona: "Dağcılık eğitmeni ve rehber",
    greet: "Dağcılık dünyasına hoş geldiniz. Teknik tırmanış, ekipman, güvenlik veya rota konularında yardımcı olabilirim.",
    responses: [
      { keys: ["tırmanış", "rock climbing", "kaya"], reply: "Teknik kaya tırmanışına başlamak için bouldering (ipler olmadan) harika giriş. 5.10a-b seviyesi orta deneyim. Black Diamond, Petzl güvenilir ekipman markaları. Ülkemizde Ceyhan, Geyikbayırı ve Kaya çıkışı için popüler bölgeler." },
      { keys: ["himalaya", "8000", "everest", "k2"], reply: "8000m üzeri tepe için: Everest ticari rota pahalı (35K-60K USD) ama güvenlik protokolleri gelişmiş. K2 teknik olarak çok daha zorlu — kış sezonu şimdi açık. Aklimatizasyon protokolü hayat kurtarıcı: 'climb high, sleep low.'" },
      { keys: ["ekipman", "krampan", "buz baltası", "ip"], reply: "Teknik kış dağcılığı için: 12 dişli krampan, B3 botu, 60cm buz baltası temel set. Halat kalınlığı: 9-9.5mm tek halat, 7-8mm çift. Kask her zaman. Türkiye için TOÇED (Türk Dağcılık Federasyonu) onaylı kurslar şart." },
      { keys: ["ağrı", "süphan", "erciyes", "kaçkar"], reply: "Ağrı Dağı (5137m) Türkiye'nin zirvesi — mükemmel aklimatizasyon rotası. Kaçkar Dağları teknik tırmanış için mükemmel, florası eşsiz. Süphan Gölü etrafındaki kış tırmanışları deneyimli ekip gerektirir. Temmuz-Ağustos ideal sezon." },
      { keys: ["güvenlik", "avalanche", "çığ", "kurtarma"], reply: "Çığ güvenliği için: kar istikrarı testi (Extended Column Test), AV cihazı+kürek+sonda zorunlu. Eğim 30-45° en riskli. AIARE veya türkçe karşılığı TOÇED kar güvenliği kursu hayat kurtarır. 'Never solo in avalanche terrain.'" },
    ],
    fallback: ["Hangi konu — teknik tırmanış, yüksek rakım, ekipman, Türkiye rotaları?", "Bu konuyu açar mısınız?"],
  },

  camping: {
    persona: "Outdoor yaşam uzmanı ve van life deneyimcisi",
    greet: "Kamp ve karavan dünyasına hoş geldiniz. Ekipman, rota, van life veya yemek konularında yardımcı olabilirim.",
    responses: [
      { keys: ["çadır", "uyku tulumu", "mat"], reply: "3 mevsim çadır için Hilleberg, MSR ve BigAgnes güvenilir. Uyku tulumu seçiminde konfor sıcaklığı değil limit sıcaklığı önemli — limit 5°C altında kullanmayın. Termal matras (R-değeri 3+) zemin soğuğuna karşı şart." },
      { keys: ["yemek", "pişirme", "ocak", "beslenme"], reply: "Ultralight pişirme için JetBoil ve MSR Whisperlite ideal. Liyofilize yemek ağırlık-kalori oranı en iyi. Açık ateş için kalıcı iz bırakmamak (LNT prensibi): mevcut taş halka kullanın, kömür iyice söndürün." },
      { keys: ["karavan", "vanlife", "van", "kamper"], reply: "Van life başlangıç için Ford Transit veya Mercedes Sprinter iskelet olarak popüler. Solar panel + LiFePO4 batarya en verimli sistem. Türkiye'de Kapadokya, Ege kıyısı ve Karadeniz sahili en güzel durma noktaları." },
      { keys: ["ultralight", "ağırlık", "gram", "hafif"], reply: "Ultralight sistemde 'big three' (çadır, uyku tulumu, sırt çantası) toplamı 2.5kg altı hedef. Cuben fiber/DCF kumaş en hafif. Zpacks ve Gossamer Gear küçük üretici ama kalite yüksek. Gram saymak başlangıçta zevkli hale gelir." },
      { keys: ["türkiye", "rota", "kamp alanı"], reply: "Türkiye'nin en iyi wild camp rotaları: Kaçkar geçiş güzergahı (Yüksekova→Ayder), Teke Yarımadası sahil yürüyüşü (Likya Yolu), Toroslar traverse. Resmi kamp alanları için Orman İşletmesi rezervasyon sistemi kullanın." },
    ],
    fallback: ["Kamp mı, karavan mı, van life mı?", "Bu konuyu açar mısınız?"],
  },

  models: {
    persona: "Maket usası ve minyatür boyama uzmanı",
    greet: "Maket ve minyatür dünyasına hoş geldiniz. Askeri maketler, diorama, minyatür boyama veya 3D baskı konularında yardımcı olabilirim.",
    responses: [
      { keys: ["askeri", "tank", "uçak", "gemi"], reply: "Tamiya 1/35 ölçek askeri araçlar başlangıç için standart. Alclad II metalik boyalar gerçekçi metal yüzeyler için ideal. Weathering tekniği: pin wash, dry brush ve pigment tozu sıralamasını öğrenin." },
      { keys: ["boyama", "renk", "fırça", "airbrush"], reply: "Minyatür boyamada temel: base coat → wash → highlight. Citadel boyalar Warhammer için optimize ama genel minyatürde de kullanılabilir. Airbrush 0.3mm iğne ile zemin renk ve gradiyent için vazgeçilmez." },
      { keys: ["warhammer", "40k", "fantasy", "aos"], reply: "Warhammer 40K başlangıç için Starter Set iyi değer sunar. Space Marines kolay boyama için ideal. AoS (Age of Sigmar) ise fantezi atmosferi için güzel. Türkiye'de resmi mağazalar az, online ve Discord toplulukları aktif." },
      { keys: ["diorama", "sahne", "zemin"], reply: "Diorama'da zemin yapımı: alçı, kum, ot tutkalı, köpüklü çim (Noch ve Woodland Scenics). Su efekti için Vallejo Water Effects veya erimesiz yapıştırıcı şeffaf. Işık ve gölge yönü gerçekçiliği belirler." },
      { keys: ["3d", "baskı", "resin", "fdm"], reply: "Minyatür için resin yazıcı (Elegoo Mars, Anycubic Photon) FDM'den çok daha iyi detay sunar. Resin güvenlik: UV dirençli gözlük, nitril eldiven, iyi havalandırma şart. Çapalama süresi modele göre optimizasyon gerektirir." },
    ],
    fallback: ["Hangi alan — askeri maket, minyatür boyama, Warhammer, 3D baskı?", "Bu konuyu açar mısınız?"],
  },

  dance: {
    persona: "Dans öğretmeni ve koreograf",
    greet: "Dans dünyasına hoş geldiniz. Tango, salsa, bale, hip-hop veya halk dansları konularında yardımcı olabilirim.",
    responses: [
      { keys: ["tango", "arjantin", "milonga"], reply: "Arjantin tangosu teknik olarak duo empathy (conexión) üzerine kurulu. İyi bir adım: ağırlık transferi, eksen, abrazo. Milonga (dans gecesi) ortamına ilk girmeden önce 10-15 saat özel veya grup dersi önerilir. İstanbul'da Karaköy milonga gece etkinlikleri." },
      { keys: ["salsa", "latin", "bachata", "merengue"], reply: "Salsa On1 (Los Angeles) vs On2 (New York): ritim sayısı farklı. Bachata daha yakın pozisyon ve bacak çalışması ağır. İstanbul'da Latinova ve DiVA dans stüdyoları aktif. Başlangıç için 6 haftalık grup kursu yeterli." },
      { keys: ["hip hop", "breakdance", "street", "urban"], reply: "B-boying (breakdance) toprock → downrock → freeze → power moves yapısında. Başlangıç için core güç ve esneklik şart. Locking ve popping street dance stillerinin öncüleri. Türkiye'de İstanbul Red Bull BC One Battle önemli bir etkinlik." },
      { keys: ["bale", "klasik", "modern", "çağdaş"], reply: "Klasik bale tekniği diğer tüm dans stillerinin temeli — turnout, pliés, battements. Çağdaş dans ise serbest form ve yer çalışmasını birleştirir. İDOB (İstanbul Devlet Opera ve Balesi) hem sahne hem etüt fırsatı." },
      { keys: ["halk", "folk", "zeybek", "halay"], reply: "Türk halk dansları bölgesel olarak çok farklılaşır: Ege zeybeği kadın-erkek ağırlık ortaksızdır, Karadeniz horon'u hızlı tempolu, Güneydoğu halayı omuz ve el çalışması yoğun. Görele Kültür Merkezi arşivleri çok değerli." },
    ],
    fallback: ["Hangi dans türü ilginizi çekiyor?", "Başlangıç mı, ileri seviye mi?", "Bu konuyu açar mısınız?"],
  },

  simracing: {
    persona: "Profesyonel sim racer ve setup mühendisi",
    greet: "Sim racing dünyasına hoş geldiniz. Setup, ekipman, iRacing, Assetto Corsa veya yarış stratejisi konularında yardımcı olabilirim.",
    responses: [
      { keys: ["iracing", "acc", "assetto", "simucube"], reply: "iRacing liseleri ve lisans sistemi gerçek yarış disiplinini yansıtır. ACC Blancpain/GT3 araçları en gerçekçi GT simülasyonu. Assetto Corsa Competizione setup için telemetri çok öğretici. Simucube 2 Pro OSW (direct drive) sistemde en iyi FFB geribildirim." },
      { keys: ["setup", "yay", "toe", "camber"], reply: "Temel setup sırası: önce brakingpoint'i düzelt (diff lock%), sonra viraj içini (spring/damper), son olarak yüksek hız köşeyi (downforce). Oversteer'da arka yayı sert, understeer'da ön yayı yumuşat. Tire temperature grafiği setup'ı kılavuzlar." },
      { keys: ["direksiyon", "pedal", "ekipman"], reply: "Başlangıç setup: Fanatec CSL Elite PC veya Logitech G Pro Direct Drive + Fanatec CSL Elite Pedals LC. Orta seviye: Simucube 2 Sport + Heusinkveld Sprint Pedals. Load cell fren pedalı gerçekçi modülasyon için kritik." },
      { keys: ["f1", "gt3", "formula", "single seater"], reply: "F1 2025 ve F1 23 geniş kitlelere hitap eder. ACC GT3 araçlara odaklanır — daha teknik. iRacing Formula Renault ve Dallara IR18 gerçekçi single seater deneyim. Setup transferi gerçek hayat verileriyle kısmen mümkün." },
      { keys: ["telemetri", "analiz", "motec"], reply: "MoTeC i2 Pro ücretsiz ve profesyonel telemetri analiz aracı. Throttle-brake overlap, corner speed ve sector time karşılaştırması temel analiz. Hızlı rakip verilerini overlay olarak görmek öğretici — VRS Coaching bu konuda lider platform." },
    ],
    fallback: ["Hangi simülatör veya araç tipi üzerine çalışıyorsunuz?", "Bu konuyu açar mısınız?"],
  },

  archery: {
    persona: "Atıcılık eğitmeni ve rekabetçi sporcu",
    greet: "Atıcılık dünyasına hoş geldiniz. Uzun menzil, IPSC, okçuluk veya silah tekniği konularında yardımcı olabilirim.",
    responses: [
      { keys: ["uzun menzil", "precison", "1000", "sniper"], reply: "Uzun menzil atıcılıkta ilk basamak: soluklanma kontrolü ve tetik çekimi. .308 Win 800m'e kadar subsonic kalmadan güvenilir. 6.5 Creedmoor ise ballistik katsayısı üstün — 1000m için günümüzde tercih edilen. Merkel, Tikka ve Sako güvenilir marka." },
      { keys: ["ipsc", "idpa", "pratik", "dinamik"], reply: "IPSC (Production, Standard, Open) ve IDPA (SSP, ESP) kurallarda farklılaşır. Başlangıç için Production veya SSP kategorisi en sade. El egzersizleri, holster draw ve reload süreleri performansı belirler. Türkiye'de çok sayıda IPSC kulübü aktif." },
      { keys: ["okçuluk", "yay", "recurve", "compound"], reply: "Geleneksel okçuluk için recurve başlangıç, compound daha mekanik yardım sunar. Türk okçuluğu dünyada özgün bir gelenek — kısa yay, uzun ok ve geri çekilmemiş baş parmak tekniği. İstanbul Okçular Tekkesi arşivleri değerli." },
      { keys: ["ekipman", "silah", "bakım", "temizlik"], reply: "Silah bakımı: atış sonrası şarjör çıkar, namluyu temizle, mekanizma kurula. CLP veya Ballistol bakım yağı standart. Uzun depolamada hafif yağ tabakası ve nem absorberi şart. Sıcaklık ve nem değişimlerine karşı kuru saklama." },
      { keys: ["mevzuat", "hukuk", "lisans", "ruhsat"], reply: "Türkiye'de ateşli silah ruhsatı: psikolojik test, adli sicil, ikametgah belgesi ve İçişleri Bakanlığı onayı. THGF (Türk Hakem Golf Federasyonu değil — Türk Hedef atıcılığı) lisansı yarışmalara katılım için şart. Av izni tamamen ayrı prosedür." },
    ],
    fallback: ["Hangi atıcılık disiplini — uzun menzil, IPSC, okçuluk?", "Bu konuyu açar mısınız?"],
  },

  perfume: {
    persona: "Parfüm uzmanı ve nez (koku ustası)",
    greet: "Parfüm dünyasına hoş geldiniz. Koku aileleri, niche markalar, attar ve koleksiyon konularında yardımcı olabilirim.",
    responses: [
      { keys: ["oryantal", "oud", "attar", "doğu"], reply: "Oud (agarwood) parfüm dünyasının en değerli koku hammaddesi. Cambodi (Kamboçya) kodu daha tatlı, Hindi kodu toprak ve duman yoğun. Amouage Gold ve Kilian Black Phantom oryantal yoğunluk için referans. Attar yağları sintetik taşıyıcı içermez — doğrudan ciltte." },
      { keys: ["niche", "bağımsız", "nadir"], reply: "Niche parfüm markaları: Serge Lutens, Diptyque, Le Labo, Maison Margiela. Türkiye'de erişilebilir niche için Galeria Kaufhof benzeri lüks bölümler veya online. Extrait de Parfum konsantrasyonu %20+ — çok az yeterli." },
      { keys: ["çiçeksi", "florals", "gül", "yasemin"], reply: "Türk gülü (Rosa damascena) dünyanın en değerli gül hammaddesi — Isparta'da yetiştirilir. Absolut gül, Otto'dan pahalı ama kompleks. Yasemin Grasse standart ama Mısır yasemini daha egzotik. Florallar için Chanel Chance ve Guerlain Mon Guerlain erişilebilir başlangıç." },
      { keys: ["odun", "amber", "misk", "vanilya"], reply: "Woody-amber aile çok uzun süreli projeksiyona sahip. Ambroxan (sentetik ambergris) modern parfümürinin temel taşı — Sauvage ve Bleu de Chanel'in kalbinde. Vetiver duman ve toprak notu — Guerlain Vetiver referans eser." },
      { keys: ["mevsim", "sezon", "yaz", "kış"], reply: "Yaz için: narenciye, okyanus, hafif floraller. Kış için: oud, amber, vanilya, derin odun. İlkbahar: yeşil notalar ve çiçeksi-ferah. Sonbahar: deri, tütün, ılık baharat. Kural değil — kendinize iyi gelen her sezon giyilebilir." },
    ],
    fallback: ["Hangi koku ailesi ilginizi çekiyor — oryantal, florals, woody?", "Bu konuyu açar mısınız?"],
  },
};

const UNIVERSAL_FALLBACK = [
  "İlginç bir soru. Biraz daha detay paylaşır mısınız?",
  "Bu konuyu araştırmam gerekiyor. Sorunuzu farklı şekilde ifade edebilir misiniz?",
  "Kulübümüzün uzmanları bu konuda görüş bildirebilir. Toplulukla da paylaşmak ister misiniz?",
];

export function generateRoomAIResponse(question: string, room: Room): string {
  const clubAI = CLUB_AI[room.clubId] ?? CLUB_AI["master"];
  const lower = question.toLowerCase();

  for (const { keys, reply } of clubAI.responses) {
    if (keys.some(k => lower.includes(k))) {
      return reply;
    }
  }

  return clubAI.fallback[Math.floor(Math.random() * clubAI.fallback.length)] ??
    UNIVERSAL_FALLBACK[Math.floor(Math.random() * UNIVERSAL_FALLBACK.length)];
}

export function getClubAIGreeting(clubId: string): string {
  return CLUB_AI[clubId]?.greet ?? CLUB_AI["master"].greet;
}

export function getClubAIPersona(clubId: string): string {
  return CLUB_AI[clubId]?.persona ?? "ORUN topluluğu asistanı";
}
