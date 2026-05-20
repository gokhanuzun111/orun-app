import { getUncachableRevenueCatClient } from "./revenueCatClient";
import {
  listProjects, createProject, listApps, createApp, listAppPublicApiKeys,
  listProducts, createProduct, listEntitlements, createEntitlement,
  attachProductsToEntitlement, listOfferings, createOffering, updateOffering,
  listPackages, createPackages, attachProductsToPackage,
  type App, type Product, type Project, type Entitlement, type Offering, type Package, type CreateProductData,
} from "@replit/revenuecat-sdk";

const PROJECT_NAME = "ORUN";
const PRODUCT_IDENTIFIER = "orun_premium_monthly";
const PLAY_STORE_PRODUCT_IDENTIFIER = "orun_premium_monthly:monthly";
const PRODUCT_DISPLAY_NAME = "ORUN Premium Aylık";
const PRODUCT_USER_FACING_TITLE = "ORUN Premium";
const PRODUCT_DURATION = "P1M";
const APP_STORE_APP_NAME = "ORUN iOS";
const APP_STORE_BUNDLE_ID = "com.orun.app";
const PLAY_STORE_APP_NAME = "ORUN Android";
const PLAY_STORE_PACKAGE_NAME = "com.orun.app";
const ENTITLEMENT_IDENTIFIER = "premium";
const ENTITLEMENT_DISPLAY_NAME = "ORUN Premium Erişim";
const OFFERING_IDENTIFIER = "default";
const OFFERING_DISPLAY_NAME = "ORUN Premium";
const PACKAGE_IDENTIFIER = "$rc_monthly";
const PACKAGE_DISPLAY_NAME = "Aylık Üyelik";
const PRODUCT_PRICES = [
  { amount_micros: 14990000, currency: "USD" },
  { amount_micros: 13990000, currency: "EUR" },
  { amount_micros: 299000000, currency: "TRY" },
];

type TestStorePricesResponse = { object: string; prices: { amount_micros: number; currency: string }[] };

async function seedRevenueCat() {
  const client = await getUncachableRevenueCatClient();

  let project: Project;
  const { data: existingProjects, error: listProjectsError } = await listProjects({ client, query: { limit: 20 } });
  if (listProjectsError) throw new Error("Projeler listelenemedi");
  const existingProject = existingProjects.items?.find((p) => p.name === PROJECT_NAME);
  if (existingProject) { console.log("Proje mevcut:", existingProject.id); project = existingProject; }
  else {
    const { data: newProject, error } = await createProject({ client, body: { name: PROJECT_NAME } });
    if (error) throw new Error("Proje oluşturulamadı");
    console.log("Proje oluşturuldu:", newProject.id); project = newProject;
  }

  const { data: apps, error: listAppsError } = await listApps({ client, path: { project_id: project.id }, query: { limit: 20 } });
  if (listAppsError || !apps || apps.items.length === 0) throw new Error("Uygulama bulunamadı");

  let app: App | undefined = apps.items.find((a) => a.type === "test_store");
  let appStoreApp: App | undefined = apps.items.find((a) => a.type === "app_store");
  let playStoreApp: App | undefined = apps.items.find((a) => a.type === "play_store");

  if (!app) throw new Error("Test store bulunamadı");
  console.log("Test store:", app.id);

  if (!appStoreApp) {
    const { data: newApp, error } = await createApp({ client, path: { project_id: project.id }, body: { name: APP_STORE_APP_NAME, type: "app_store", app_store: { bundle_id: APP_STORE_BUNDLE_ID } } });
    if (error) throw new Error("App Store uygulaması oluşturulamadı");
    appStoreApp = newApp; console.log("App Store oluşturuldu:", appStoreApp.id);
  } else { console.log("App Store mevcut:", appStoreApp.id); }

  if (!playStoreApp) {
    const { data: newApp, error } = await createApp({ client, path: { project_id: project.id }, body: { name: PLAY_STORE_APP_NAME, type: "play_store", play_store: { package_name: PLAY_STORE_PACKAGE_NAME } } });
    if (error) throw new Error("Play Store uygulaması oluşturulamadı");
    playStoreApp = newApp; console.log("Play Store oluşturuldu:", playStoreApp.id);
  } else { console.log("Play Store mevcut:", playStoreApp.id); }

  const { data: existingProducts, error: listProductsError } = await listProducts({ client, path: { project_id: project.id }, query: { limit: 100 } });
  if (listProductsError) throw new Error("Ürünler listelenemedi");

  const ensureProduct = async (targetApp: App, label: string, identifier: string, isTestStore: boolean): Promise<Product> => {
    const existing = existingProducts.items?.find((p) => p.store_identifier === identifier && p.app_id === targetApp.id);
    if (existing) { console.log(label + " ürünü mevcut:", existing.id); return existing; }
    const body: CreateProductData["body"] = { store_identifier: identifier, app_id: targetApp.id, type: "subscription", display_name: PRODUCT_DISPLAY_NAME };
    if (isTestStore) { body.subscription = { duration: PRODUCT_DURATION }; body.title = PRODUCT_USER_FACING_TITLE; }
    const { data, error } = await createProduct({ client, path: { project_id: project.id }, body });
    if (error) throw new Error(label + " ürünü oluşturulamadı");
    console.log(label + " ürünü oluşturuldu:", data.id); return data;
  };

  const testProduct = await ensureProduct(app, "Test Store", PRODUCT_IDENTIFIER, true);
  const appStoreProduct = await ensureProduct(appStoreApp, "App Store", PRODUCT_IDENTIFIER, false);
  const playStoreProduct = await ensureProduct(playStoreApp, "Play Store", PLAY_STORE_PRODUCT_IDENTIFIER, false);

  const { data: priceData, error: priceError } = await client.post<TestStorePricesResponse>({ url: "/projects/{project_id}/products/{product_id}/test_store_prices", path: { project_id: project.id, product_id: testProduct.id }, body: { prices: PRODUCT_PRICES } });
  if (priceError) { if ((priceError as any)?.type === "resource_already_exists") { console.log("Fiyatlar zaten mevcut"); } else { throw new Error("Fiyatlar eklenemedi"); } }
  else { console.log("Fiyatlar eklendi"); }

  let entitlement: Entitlement | undefined;
  const { data: existingEntitlements, error: listEntitlementsError } = await listEntitlements({ client, path: { project_id: project.id }, query: { limit: 20 } });
  if (listEntitlementsError) throw new Error("Yetkiler listelenemedi");
  const existingEntitlement = existingEntitlements.items?.find((e) => e.lookup_key === ENTITLEMENT_IDENTIFIER);
  if (existingEntitlement) { console.log("Yetki mevcut:", existingEntitlement.id); entitlement = existingEntitlement; }
  else {
    const { data, error } = await createEntitlement({ client, path: { project_id: project.id }, body: { lookup_key: ENTITLEMENT_IDENTIFIER, display_name: ENTITLEMENT_DISPLAY_NAME } });
    if (error) throw new Error("Yetki oluşturulamadı");
    console.log("Yetki oluşturuldu:", data.id); entitlement = data;
  }

  const { error: attachErr } = await attachProductsToEntitlement({ client, path: { project_id: project.id, entitlement_id: entitlement.id }, body: { product_ids: [testProduct.id, appStoreProduct.id, playStoreProduct.id] } });
  if (attachErr && (attachErr as any)?.type !== "unprocessable_entity_error") throw new Error("Ürünler yetkiye eklenemedi");
  console.log("Ürünler yetkiye eklendi");

  let offering: Offering | undefined;
  const { data: existingOfferings, error: listOfferingsError } = await listOfferings({ client, path: { project_id: project.id }, query: { limit: 20 } });
  if (listOfferingsError) throw new Error("Teklifler listelenemedi");
  const existingOffering = existingOfferings.items?.find((o) => o.lookup_key === OFFERING_IDENTIFIER);
  if (existingOffering) { console.log("Teklif mevcut:", existingOffering.id); offering = existingOffering; }
  else {
    const { data, error } = await createOffering({ client, path: { project_id: project.id }, body: { lookup_key: OFFERING_IDENTIFIER, display_name: OFFERING_DISPLAY_NAME } });
    if (error) throw new Error("Teklif oluşturulamadı");
    console.log("Teklif oluşturuldu:", data.id); offering = data;
  }

  if (!offering.is_current) {
    const { error } = await updateOffering({ client, path: { project_id: project.id, offering_id: offering.id }, body: { is_current: true } });
    if (error) throw new Error("Teklif aktif yapılamadı");
    console.log("Teklif aktif edildi");
  }

  let pkg: Package | undefined;
  const { data: existingPackages, error: listPackagesError } = await listPackages({ client, path: { project_id: project.id, offering_id: offering.id }, query: { limit: 20 } });
  if (listPackagesError) throw new Error("Paketler listelenemedi");
  const existingPackage = existingPackages.items?.find((p) => p.lookup_key === PACKAGE_IDENTIFIER);
  if (existingPackage) { console.log("Paket mevcut:", existingPackage.id); pkg = existingPackage; }
  else {
    const { data, error } = await createPackages({ client, path: { project_id: project.id, offering_id: offering.id }, body: { lookup_key: PACKAGE_IDENTIFIER, display_name: PACKAGE_DISPLAY_NAME } });
    if (error) throw new Error("Paket oluşturulamadı");
    console.log("Paket oluşturuldu:", data.id); pkg = data;
  }

  const { error: attachPkgErr } = await attachProductsToPackage({ client, path: { project_id: project.id, package_id: pkg.id }, body: { products: [{ product_id: testProduct.id, eligibility_criteria: "all" }, { product_id: appStoreProduct.id, eligibility_criteria: "all" }, { product_id: playStoreProduct.id, eligibility_criteria: "all" }] } });
  if (attachPkgErr && !(attachPkgErr as any)?.message?.includes("Cannot attach product")) throw new Error("Ürünler pakete eklenemedi");
  console.log("Ürünler pakete eklendi");

  const { data: testKeys } = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: app.id } });
  const { data: iosKeys } = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: appStoreApp.id } });
  const { data: androidKeys } = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: playStoreApp.id } });

  console.log("\n====================");
  console.log("RevenueCat kurulumu tamamlandı!");
  console.log("REVENUECAT_PROJECT_ID=" + project.id);
  console.log("REVENUECAT_TEST_STORE_APP_ID=" + app.id);
  console.log("REVENUECAT_APPLE_APP_STORE_APP_ID=" + appStoreApp.id);
  console.log("REVENUECAT_GOOGLE_PLAY_STORE_APP_ID=" + playStoreApp.id);
  console.log("EXPO_PUBLIC_REVENUECAT_TEST_API_KEY=" + (testKeys?.items.map((k) => k.key).join(", ") ?? "N/A"));
  console.log("EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=" + (iosKeys?.items.map((k) => k.key).join(", ") ?? "N/A"));
  console.log("EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=" + (androidKeys?.items.map((k) => k.key).join(", ") ?? "N/A"));
  console.log("====================\n");
}

seedRevenueCat().catch(console.error);
