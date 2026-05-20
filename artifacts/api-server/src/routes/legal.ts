import { Router } from "express";

const router: Router = Router();

const LAST_UPDATED = "20 Mayıs 2026";

const layout = (title: string, body: string) => `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — ORUN</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px 80px; line-height: 1.6; color: #111; background: #fff; }
  @media (prefers-color-scheme: dark) { body { background: #0b0b0b; color: #eee; } a { color: #6aa3ff; } h1, h2 { color: #fff; } }
  header { border-bottom: 1px solid #e5e5e5; padding-bottom: 16px; margin-bottom: 28px; }
  header .brand { font-weight: 700; letter-spacing: 0.5px; color: #1B3A6B; font-size: 14px; text-transform: uppercase; }
  @media (prefers-color-scheme: dark) { header { border-color: #222; } header .brand { color: #6aa3ff; } }
  h1 { font-size: 28px; margin: 8px 0 4px; }
  .updated { font-size: 13px; color: #666; }
  h2 { font-size: 18px; margin-top: 28px; }
  ul { padding-left: 20px; }
  li { margin: 6px 0; }
  a { color: #1B3A6B; }
  footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #666; }
  @media (prefers-color-scheme: dark) { footer { border-color: #222; color: #999; } }
</style>
</head>
<body>
<header>
  <div class="brand">ORUN</div>
  <h1>${title}</h1>
  <div class="updated">Son güncelleme: ${LAST_UPDATED}</div>
</header>
${body}
<footer>
  ORUN Society · İstanbul, Türkiye · <a href="mailto:destek@orunsociety.com">destek@orunsociety.com</a>
</footer>
</body>
</html>`;

const privacyHtml = layout(
  "Gizlilik Politikası",
  `
<p>ORUN ("biz", "uygulama"), kullanıcılarımızın ("siz") gizliliğine değer verir. Bu politika, ORUN mobil uygulamasını kullandığınızda hangi bilgilerin toplandığını, nasıl kullanıldığını ve haklarınızı açıklar.</p>

<h2>1. Topladığımız Bilgiler</h2>
<ul>
  <li><strong>Hesap bilgileri:</strong> Ad, e-posta adresi, şifre (geri döndürülemez şekilde hash'lenmiş olarak saklanır).</li>
  <li><strong>Profil bilgileri:</strong> Profil fotoğrafı, biyografi, konum (il/şehir), tercih ettiğiniz konular.</li>
  <li><strong>Kullanım verileri:</strong> Mesajlar, oda etkinlikleri, üyelik seviyesi, token kullanımı.</li>
  <li><strong>Teknik bilgiler:</strong> Cihaz modeli, işletim sistemi sürümü, uygulama sürümü, IP adresi (oturum güvenliği için).</li>
</ul>

<h2>2. Bilgileri Nasıl Kullanırız</h2>
<ul>
  <li>Hesabınızı oluşturmak ve yönetmek</li>
  <li>Mesajlaşma, odalar ve etkinlik özelliklerini sağlamak</li>
  <li>Üyelik ve abonelik yönetimi (Apple üzerinden ödeme bilgilerini biz görmüyoruz)</li>
  <li>Topluluk güvenliği: raporları incelemek, kötüye kullanımı engellemek</li>
  <li>Yasal yükümlülükleri yerine getirmek</li>
</ul>

<h2>3. Bilgileri Kimlerle Paylaşırız</h2>
<p>Kişisel bilgilerinizi <strong>üçüncü taraflara satmayız</strong>. Yalnızca aşağıdaki durumlarda paylaşırız:</p>
<ul>
  <li><strong>Hizmet sağlayıcılar:</strong> Bulut altyapısı (Replit/AWS), abonelik yönetimi (Apple App Store, RevenueCat), AI sohbet (OpenAI/Anthropic — yalnızca sohbet içeriği, hesap bilgileri değil).</li>
  <li><strong>Yasal zorunluluklar:</strong> Mahkeme kararı veya yetkili merci talebi.</li>
  <li><strong>Güvenlik:</strong> Dolandırıcılık, kötüye kullanım veya yasal ihlalleri önlemek için.</li>
</ul>

<h2>4. Veri Saklama Süresi</h2>
<p>Verilerinizi hesabınız aktif olduğu sürece saklarız. Hesabınızı sildiğinizde, kişisel bilgileriniz 30 gün içinde sistemlerimizden kalıcı olarak silinir (yasal saklama yükümlülüğü olan kayıtlar hariç).</p>

<h2>5. Haklarınız (KVKK & GDPR)</h2>
<ul>
  <li><strong>Erişim:</strong> Hakkınızda hangi verilerin tutulduğunu öğrenme</li>
  <li><strong>Düzeltme:</strong> Yanlış bilgileri düzeltme</li>
  <li><strong>Silme:</strong> Hesabınızı ve verilerinizi silme (uygulama içinden: Ayarlar → Hesap → Hesabı Sil)</li>
  <li><strong>Taşınabilirlik:</strong> Verilerinizin bir kopyasını alma</li>
  <li><strong>İtiraz:</strong> Belirli işlemelere itiraz etme</li>
</ul>
<p>Bu haklarınızı kullanmak için <a href="mailto:destek@orunsociety.com">destek@orunsociety.com</a> adresine yazabilirsiniz.</p>

<h2>6. Çocukların Gizliliği</h2>
<p>ORUN 17 yaş ve üzeri kullanıcılar içindir. 17 yaş altındaki bir kişiden bilgi topladığımızı fark edersek, bu bilgileri derhal sileriz.</p>

<h2>7. Güvenlik</h2>
<p>Verileriniz şifreli bağlantılar (HTTPS/TLS) üzerinden iletilir, şifreler bcrypt ile hash'lenir, oturum token'ları (JWT) güvenli şekilde saklanır. Yine de internet üzerinden hiçbir aktarım %100 güvenli değildir.</p>

<h2>8. Üçüncü Taraf Hizmetleri</h2>
<ul>
  <li><strong>Apple:</strong> Uygulama içi satın alımlar ve abonelikler için <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener">apple.com/legal/privacy</a></li>
  <li><strong>OpenAI / Anthropic:</strong> AI sohbet özelliği için sohbet içeriği iletilir, hesap kimliğiniz iletilmez</li>
</ul>

<h2>9. Politika Değişiklikleri</h2>
<p>Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişikliklerde uygulama içinden bildirim göndereceğiz.</p>

<h2>10. İletişim</h2>
<p>Sorularınız için: <a href="mailto:destek@orunsociety.com">destek@orunsociety.com</a></p>
`,
);

const termsHtml = layout(
  "Kullanım Koşulları",
  `
<p>ORUN uygulamasını ("Hizmet") kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen dikkatlice okuyun.</p>

<h2>1. Hizmet Tanımı</h2>
<p>ORUN, üye olmak için 17 yaş ve üzeri kullanıcılara yönelik özel bir Türk sosyal kulüp uygulamasıdır. Mesajlaşma, odalar, etkinlikler ve AI destekli sohbet özellikleri sunar.</p>

<h2>2. Hesap Kaydı</h2>
<ul>
  <li>Doğru ve güncel bilgi vermekle yükümlüsünüz.</li>
  <li>Şifrenizin gizliliğinden siz sorumlusunuz.</li>
  <li>Hesabınızı başkalarına devredemezsiniz.</li>
  <li>17 yaşından küçükseniz bu uygulamayı kullanamazsınız.</li>
</ul>

<h2>3. Üyelik ve Abonelikler</h2>
<ul>
  <li>Premium üyelikler Apple App Store üzerinden satın alınır.</li>
  <li>Ödeme onayı sırasında Apple ID hesabınızdan ücret tahsil edilir.</li>
  <li>Abonelik, mevcut dönem bitmeden en az 24 saat önce iptal edilmediği sürece otomatik yenilenir.</li>
  <li>Aboneliğinizi Apple ID Ayarları'ndan yönetebilir ve iptal edebilirsiniz.</li>
  <li>Geri ödemeler Apple'ın geri ödeme politikasına tabidir.</li>
</ul>

<h2>4. Kullanıcı Davranışı</h2>
<p>Aşağıdaki davranışlar <strong>kesinlikle yasaktır</strong> ve hesabınızın derhal kapatılmasına yol açar:</p>
<ul>
  <li>Taciz, nefret söylemi, ayrımcılık, tehdit veya zorbalık</li>
  <li>Cinsel içerik, çıplaklık, şiddet içeren içerik paylaşımı</li>
  <li>Spam, dolandırıcılık, kimlik avı</li>
  <li>Başkasının kimliğine bürünme (impersonation)</li>
  <li>Yasadışı içerik, telif hakkı ihlali</li>
  <li>Botlar, otomatik araçlar veya ters mühendislik</li>
  <li>Diğer kullanıcıların kişisel bilgilerini izinsiz paylaşma (doxxing)</li>
</ul>
<p>Apple'ın <strong>EULA</strong> politikası gereği, kötüye kullanım içerikleri için sıfır tolerans uygulanır. Raporlanan içerikler 24 saat içinde incelenir; ihlal tespit edilen hesaplar uyarısız askıya alınabilir.</p>

<h2>5. İçerik ve Telif Hakları</h2>
<ul>
  <li>Paylaştığınız içeriğin sahipliği size aittir.</li>
  <li>ORUN'a, içeriğinizi hizmet kapsamında saklama ve gösterme hakkı verirsiniz.</li>
  <li>Başkalarının telif hakkına saygı göstermek zorundasınız.</li>
</ul>

<h2>6. AI Sohbet Özelliği</h2>
<p>AI sohbet sonuçları otomatik üretilmiştir; doğruluğu garanti edilmez. Tıbbi, hukuki veya finansal tavsiye olarak kullanmayın. Token kotanız üyelik seviyenize bağlıdır.</p>

<h2>7. Hesap Kapatma</h2>
<ul>
  <li><strong>Sizin tarafınızdan:</strong> Ayarlar → Hesap → Hesabı Sil bölümünden hesabınızı kalıcı olarak silebilirsiniz.</li>
  <li><strong>ORUN tarafından:</strong> Bu koşulları ihlal eden hesapları haber vermeksizin askıya alabilir veya sonlandırabiliriz.</li>
</ul>

<h2>8. Sorumluluk Reddi</h2>
<p>Hizmet "olduğu gibi" sunulur. Yasaların izin verdiği azami ölçüde, ORUN dolaylı, arızi veya sonuç olarak ortaya çıkan zararlardan sorumlu değildir.</p>

<h2>9. Değişiklikler</h2>
<p>Bu koşulları güncelleme hakkını saklı tutarız. Önemli değişikliklerde uygulama içinden bildirim göndereceğiz.</p>

<h2>10. Uygulanacak Hukuk</h2>
<p>Bu koşullar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir.</p>

<h2>11. İletişim</h2>
<p>Sorularınız için: <a href="mailto:destek@orunsociety.com">destek@orunsociety.com</a></p>
`,
);

router.get("/privacy", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(privacyHtml);
});

router.get("/terms", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(termsHtml);
});

export default router;
