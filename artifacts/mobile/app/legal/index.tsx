import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Tab = "tos" | "privacy" | "kvkk";

const TABS: { id: Tab; label: string }[] = [
  { id: "tos", label: "Kullanım Koşulları" },
  { id: "privacy", label: "Gizlilik" },
  { id: "kvkk", label: "KVKK" },
];

const TOS_CONTENT = `ORUN Kullanım Koşulları
Son güncelleme: Mayıs 2025

1. KABUL

ORUN uygulamasını kullanarak bu koşulları kabul etmiş sayılırsınız. Kabul etmiyorsanız uygulamayı kullanmayınız.

2. HİZMETİN TANIMI

ORUN, belirli ilgi alanları etrafında kurulan özel dijital kulüplere üyelik imkânı sunan bir sosyal platform hizmetidir. Hizmet; kulüpler, odalar, akış ve yapay zekâ destekli etkileşimler içermektedir.

3. ÜYELİK VE ERİŞİM

Üyelik başvurusu onaya tabidir. ORUN, herhangi bir başvuruyu gerekçe göstermeksizin reddedebilir. Üyelik, platform kurallarına uyum koşuluna bağlıdır.

4. KULLANICI SORUMLULUKLARI

• Gerçek ve güncel bilgi sağlamak
• Başkalarına saygılı davranmak
• Fikri mülkiyet haklarına uymak
• Platform bütünlüğünü korumak
• Yasadışı faaliyetlerden kaçınmak

5. YASAKLI İÇERİKLER

Şunları paylaşmak kesinlikle yasaktır:
• Nefret söylemi ve ayrımcı içerik
• Taciz, tehdit veya şiddet içeriği
• Kişisel veri ihlali oluşturan paylaşımlar
• Telif hakkı ihlali
• Yanıltıcı veya sahte bilgi

6. YAPAY ZEKÂ KULLANIMI

ORUN, içerik moderasyonu ve üye etkileşimi için yapay zekâ sistemleri kullanmaktadır. Yapay zekâ kararları nihaidir ve itiraz sürecine tabidir.

7. HESAP ASKIYA ALMA VE SONLANDIRMA

ORUN, bu koşulları ihlal eden hesapları önceden bildirimde bulunmaksızın askıya alma veya sonlandırma hakkını saklı tutar.

8. SORUMLULUK SINIRLAMALARI

ORUN, platformda paylaşılan üçüncü taraf içeriklerden sorumlu değildir. Hizmet "olduğu gibi" sunulmaktadır.

9. DEĞİŞİKLİKLER

Bu koşullar önceden bildirimde bulunularak değiştirilebilir. Değişiklikler yayınlandıktan sonra platformu kullanmaya devam etmek, yeni koşulları kabul etmek anlamına gelir.

10. İLETİŞİM

Sorularınız için: legal@orun.app`;

const PRIVACY_CONTENT = `ORUN Gizlilik Politikası
Son güncelleme: Mayıs 2025

1. TOPLANAN VERİLER

Kişisel Veriler:
• Ad, soyad, e-posta adresi
• Profil bilgileri ve ilgi alanları
• Platform içi aktiviteler ve etkileşimler

Teknik Veriler:
• Cihaz bilgileri ve işletim sistemi
• IP adresi ve konum (yaklaşık)
• Uygulama kullanım istatistikleri

2. VERİLERİN KULLANIMI

Toplanan veriler şu amaçlarla kullanılmaktadır:
• Hizmetin sunulması ve iyileştirilmesi
• Kişiselleştirilmiş deneyim sağlanması
• Güvenlik ve dolandırıcılık önleme
• Yasal yükümlülüklerin yerine getirilmesi

3. VERİ PAYLAŞIMI

Verileriniz şu durumlar dışında üçüncü taraflarla paylaşılmaz:
• Yasal zorunluluk (mahkeme kararı, idari talep)
• Hizmet sağlayıcılarımız (işlem güvenliği kapsamında)
• Açık rızanızın bulunması

4. VERİ GÜVENLİĞİ

Verileriniz endüstri standardı şifreleme ve güvenlik protokolleri ile korunmaktadır. Buna karşın hiçbir sistem mutlak güvenlik garantisi veremez.

5. ÇEREZLER VE İZLEME

Uygulama; oturum yönetimi ve tercih kaydetme amacıyla çerez ve yerel depolama kullanmaktadır.

6. VERİ SAKLAMA SÜRESİ

Kişisel verileriniz, hizmet ilişkisi süresince ve yasal yükümlülükler kapsamında saklanmaktadır. Hesap silme talebinde verileriniz 30 gün içinde silinir.

7. HAKLARINIZ

• Verilerinize erişim talep etme
• Hatalı verilerin düzeltilmesini isteme
• Verilerinizin silinmesini talep etme
• Veri taşınabilirliği hakkı
• İşlemeye itiraz hakkı

8. İLETİŞİM

Gizlilik ile ilgili talepleriniz için: gizlilik@orun.app`;

const KVKK_CONTENT = `6698 Sayılı Kişisel Verilerin Korunması Kanunu
Aydınlatma Metni

Veri Sorumlusu: ORUN Teknoloji A.Ş.

1. KİŞİSEL VERİLERİN İŞLENME AMACI

Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

• Hizmet sözleşmesinin kurulması ve ifası (KVKK md. 5/2-c)
• Meşru menfaat kapsamında hizmet geliştirme (KVKK md. 5/2-f)
• Yasal yükümlülüklerin yerine getirilmesi (KVKK md. 5/2-ç)
• Açık rıza ile kişiselleştirme (KVKK md. 5/1)

2. İŞLENEN KİŞİSEL VERİLER

• Kimlik: Ad, soyad
• İletişim: E-posta adresi
• Kullanım: Platform aktiviteleri, ilgi alanları
• Teknik: Cihaz ve bağlantı bilgileri

3. KİŞİSEL VERİLERİN AKTARIMI

Kişisel verileriniz; hizmet alınan yurt içi ve yurt dışı teknik altyapı sağlayıcılarına, yasal zorunluluk halinde yetkili kamu kurumlarına aktarılabilmektedir. Yurt dışı aktarımlar, KVKK'nın 9. maddesi kapsamında gerçekleştirilmektedir.

4. KİŞİSEL VERİ TOPLAMANIN YÖNTEMİ

Kişisel verileriniz; uygulama üzerinden elektronik ortamda, otomatik ve otomatik olmayan yollarla toplanmaktadır.

5. KVKK KAPSAMINDAKİ HAKLARINIZ

KVKK'nın 11. maddesi uyarınca haklarınız:

a) Kişisel verilerinizin işlenip işlenmediğini öğrenme
b) İşlenmişse buna ilişkin bilgi talep etme
c) İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
d) Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
e) Eksik veya yanlış işlenmişse düzeltilmesini isteme
f) Silinmesini veya yok edilmesini isteme
g) Otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize sonuç doğurmasına itiraz etme
h) Zararın giderilmesini talep etme

6. HAK KULLANIMI

Haklarınızı kullanmak için: kvkk@orun.app adresine kimliğinizi doğrulayan belgelerle birlikte yazılı olarak başvurabilirsiniz. Talebiniz 30 gün içinde sonuçlandırılacaktır.

Kişisel Verileri Koruma Kurulu'na şikâyet hakkınız saklıdır.`;

const CONTENT: Record<Tab, string> = {
  tos: TOS_CONTENT,
  privacy: PRIVACY_CONTENT,
  kvkk: KVKK_CONTENT,
};

export default function LegalScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("tos");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPadding + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Yasal</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {TABS.map(tab => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && [styles.tabActive, { borderBottomColor: colors.primary }],
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? colors.primary : colors.mutedForeground },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.body, { color: colors.foreground }]}>{CONTENT[activeTab]}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {},
  tabText: { fontFamily: "Inter_500Medium", fontSize: 12, letterSpacing: 0.2 },
  content: { padding: 20 },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
});
