import qs from 'qs';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : '');

// —— Strapi API response shapes (v5) ——
export interface StrapiImage {
  id?: number;
  name?: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width?: number; height?: number }>;
}

export interface HeroAttributes {
  title?: string;
  subtitle?: string;
  image?: { data: StrapiImageData | null };
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface HeroStrapi {
  id: number;
  documentId?: string;
  title?: string;
  subtitle?: string;
  image?: StrapiImage | null;
  cta?: string;
  ctalink?: string;
  SecondaryCta?: string;
  SecondaryCtaLink?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface FeatureAttributes {
  title?: string;
  desc?: string;
  icon?: { data: StrapiImageData | null };
}

export interface FeatureStrapi {
  id: number;
  documentId?: string;
  title?: string;
  desc?: string;
  icon?: StrapiImage | null;
}

export interface MenuStrapi {
  id: number;
  documentId?: string;
  title?: string;
  description?: string;
  icon?: StrapiImage | null;
  order?: number;
}

export interface HeaderNavLink {
  label: string;
  href: string;
  order?: number;
}

export interface HeaderStrapi {
  logo?: StrapiImage | null;
  logoLink?: string;
  navLinks?: HeaderNavLink[];
  ctaText?: string;
  ctaLink?: string;
}

interface StrapiImageData {
  id: number;
  attributes?: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
  url?: string;
}

// Flatten Strapi v5 single-type/collection response to our types
function normalizeStrapiImage(data: StrapiImageData | null | undefined): StrapiImage | null {
  if (!data) return null;
  const url = typeof data === 'object' && 'attributes' in data
    ? (data as { attributes?: { url: string } }).attributes?.url
    : (data as { url?: string }).url;
  if (!url) return null;
  // If it's already an absolute URL (external), keep as-is.
  // If it's a relative Strapi upload path (/uploads/...), keep relative so that
  // the Next.js rewrite proxy serves it without going through ngrok directly.
  const finalUrl = url.startsWith('http') ? url : url;
  return {
    url: finalUrl,
    alternativeText: (data as { attributes?: { alternativeText?: string } }).attributes?.alternativeText,
    width: (data as { attributes?: { width?: number } }).attributes?.width,
    height: (data as { attributes?: { height?: number } }).attributes?.height,
  };
}

// Strapi Hero schema uses Title, Subtitle, Image (capitalized); note: SeconadaryctaLink has typo in schema
type HeroDoc = {
  id?: number;
  documentId?: string;
  Title?: string;
  Subtitle?: string;
  Image?: StrapiImageData | { url?: string } | null;
  cta?: string;
  ctalink?: string;
  SecondaryCta?: string;
  SeconadaryctaLink?: string;
  SecondaryCtaLink?: string;
  seo?: unknown;
};

function normalizeStrapiMedia(media: StrapiImageData | { url?: string; attributes?: { url?: string }; data?: { url?: string; attributes?: { url?: string } } } | null | undefined): StrapiImage | null {
  if (!media || typeof media !== 'object') return null;
  const unwrapped = (media as { data?: unknown }).data ?? media;
  const m = unwrapped as { url?: string; attributes?: { url?: string } };
  const url = m?.url ?? m?.attributes?.url;
  if (!url || typeof url !== 'string') return null;
  // Keep relative /uploads/ paths as-is so the Next.js rewrite proxy handles them.
  // Only prepend base URL for genuinely external absolute URLs from other providers.
  const finalUrl = url.startsWith('http') ? url : url;
  return {
    url: finalUrl,
  };
}

function normalizeHero(doc: HeroDoc | null): HeroStrapi | null {
  if (!doc) return null;
  const img = doc.Image;
  return {
    id: (doc as { id?: number }).id ?? 0,
    documentId: doc.documentId,
    title: doc.Title ?? undefined,
    subtitle: doc.Subtitle ?? undefined,
    image: normalizeStrapiMedia(img),
    cta: doc.cta ?? undefined,
    ctalink: doc.ctalink ?? undefined,
    SecondaryCta: doc.SecondaryCta ?? undefined,
    SecondaryCtaLink: doc.SeconadaryctaLink ?? doc.SecondaryCtaLink ?? undefined,
    seo: doc.seo as HeroStrapi['seo'],
  };
}

type FeatureDoc = {
  id?: number;
  documentId?: string;
  Title?: string;
  Desc?: string;
  Icon?: StrapiImageData | { url?: string } | null;
  Order?: number;
};

function normalizeFeature(doc: FeatureDoc | null): FeatureStrapi | null {
  if (!doc) return null;
  return {
    id: (doc as { id?: number }).id ?? 0,
    documentId: doc.documentId,
    title: doc.Title ?? undefined,
    desc: doc.Desc ?? undefined,
    icon: normalizeStrapiMedia(doc.Icon),
  };
}

type MenuDoc = {
  id?: number;
  documentId?: string;
  Title?: string;
  Description?: string;
  Icon?: StrapiImageData | { url?: string } | null;
  Order?: number;
};

function normalizeMenu(doc: MenuDoc | null): MenuStrapi | null {
  if (!doc) return null;
  return {
    id: (doc as { id?: number }).id ?? 0,
    documentId: doc.documentId,
    title: doc.Title ?? undefined,
    description: doc.Description ?? undefined,
    icon: normalizeStrapiMedia(doc.Icon),
    order: doc.Order ?? 0,
  };
}

type NavLinkDoc = { Label?: string; Href?: string; Order?: number };

type HeaderDoc = {
  Logo?: StrapiImageData | { url?: string } | null;
  LogoLink?: string;
  NavLinks?: NavLinkDoc[];
  CtaText?: string;
  CtaLink?: string;
};

function normalizeHeader(doc: HeaderDoc | null): HeaderStrapi | null {
  if (!doc) return null;
  const rawLinks = doc.NavLinks;
  const navLinks: HeaderNavLink[] = Array.isArray(rawLinks)
    ? rawLinks
      .map((l) => ({
        label: l.Label ?? '',
        href: l.Href ?? '#',
        order: l.Order ?? 0,
      }))
      .filter((l) => l.label)
      .sort((a, b) => a.order - b.order)
    : [];
  return {
    logo: normalizeStrapiMedia(doc.Logo),
    logoLink: doc.LogoLink ?? '/',
    navLinks: navLinks.length > 0 ? navLinks : undefined,
    ctaText: doc.CtaText ?? undefined,
    ctaLink: doc.CtaLink ?? undefined,
  };
}

// In development, warn once when Strapi is unreachable instead of per-request
let strapiUnreachableWarned = false;

// —— Generic fetcher with populate (Strapi v5 REST) ——
async function strapiFetch<T>(
  path: string,
  query: Record<string, unknown> = {}
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error('NEXT_PUBLIC_STRAPI_URL is not set');
  }
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const url = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;
  let res: Response;
  try {
    res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV === 'development') {
      if (!strapiUnreachableWarned) {
        strapiUnreachableWarned = true;
        console.warn(
          `[Strapi] Cannot reach ${STRAPI_URL} (${message}). Returning empty data. Start Strapi to use CMS content.`
        );
      }
      // Return empty data so the app still renders with fallbacks
      return { data: null } as T;
    }
    throw new Error(
      `Strapi request failed: ${message}. Check NEXT_PUBLIC_STRAPI_URL (${STRAPI_URL}) and ensure Strapi is running.`
    );
  }
  const text = await res.text();
  let json: T;
  try {
    json = (text ? JSON.parse(text) : {}) as T;
  } catch {
    json = {} as T;
  }
  if (!res.ok) {
    // 404: single type has no document yet — return null data instead of throwing
    if (res.status === 404) {
      return { data: (json as { data?: unknown }).data ?? null } as T;
    }
    // 403: permissions not enabled — return null data and log a warning
    if (res.status === 403) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Strapi] 403 Forbidden for ${path}. Enable "find" permission in Settings → Users & Permissions → Roles → Public`
        );
      }
      return { data: (json as { data?: unknown }).data ?? null } as T;
    }
    throw new Error(`Strapi error: ${res.status} ${res.statusText} - ${text}`);
  }
  return json;
}

// —— Typed API: /header (single type) ——
export async function getHeader(): Promise<HeaderStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/header', {
      populate: { Logo: true, NavLinks: true },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeHeader(raw as HeaderDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getHeader] Failed to fetch header from Strapi:', err);
    }
    return null;
  }
}

// —— Typed API: /hero (single type), populate Image ——
export async function getHero(): Promise<HeroStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/hero', {
      populate: { Image: true },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeHero(raw as HeroDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getHero] Failed to fetch hero from Strapi:', err);
    }
    return null;
  }
}

export interface FeaturesSectionStrapi {
  title?: string;
}

type FeaturesSectionDoc = { Title?: string };

function normalizeFeaturesSection(doc: FeaturesSectionDoc | null): FeaturesSectionStrapi | null {
  if (!doc) return null;
  return { title: doc.Title ?? undefined };
}

export async function getFeaturesSection(): Promise<FeaturesSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/features-section', {
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeFeaturesSection(raw as FeaturesSectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getFeaturesSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

export async function getFeatures(): Promise<FeatureStrapi[]> {
  if (!STRAPI_URL) return [];
  try {
    const data = await strapiFetch<{ data: unknown }>('/features', {
      populate: { Icon: true },
      sort: ['Order:asc'],
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
      .map((doc) => normalizeFeature(doc as FeatureDoc))
      .filter((x): x is FeatureStrapi => x !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getFeatures] Failed to fetch from Strapi:', err);
    }
    return [];
  }
}

export interface MenuSectionStrapi {
  title?: string;
}

type MenuSectionDoc = { Title?: string };

function normalizeMenuSection(doc: MenuSectionDoc | null): MenuSectionStrapi | null {
  if (!doc) return null;
  return {
    title: doc.Title ?? undefined,
  };
}

export async function getMenuSection(): Promise<MenuSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/menu-section', {
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeMenuSection(raw as MenuSectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getMenuSection] Failed to fetch menu section from Strapi:', err);
    }
    return null;
  }
}

// —— Menu Dish Page Header (single type) — Title + Description for /menu page ——
export interface MenuDishStrapi {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: StrapiImage | null;
}

export interface MenuDishHeaderStrapi {
  title?: string;
  description?: string;
  dishes?: MenuDishStrapi[];
  // Apps Section fields stored in the same single type
  menuTitle?: string;
  menuDescription?: string;
  appLogos?: StrapiImage[];
}

type IconLogoDoc = { Icon?: StrapiImageData | { url?: string } | null };

type MenuDishHeaderDoc = {
  Title?: string;
  Description?: string;
  Dish?: any[];
  MenuTitle?: string;
  MenuDescription?: string;
  Icons?: IconLogoDoc[];
};

export async function getMenuDishHeader(): Promise<MenuDishHeaderStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/menu-dish', {
      populate: {
        Icons: { populate: { Icon: true } },
        Dish: { populate: { Image: true } },
      },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    const doc = raw as MenuDishHeaderDoc;
    const logos = Array.isArray(doc.Icons)
      ? doc.Icons
        .map((item) => normalizeStrapiMedia(item.Icon))
        .filter((x): x is StrapiImage => x !== null)
      : [];

    const dishes = Array.isArray(doc.Dish)
      ? doc.Dish.map((d: any) => ({
        id: d.id,
        name: d.Dish ?? '',
        price: d.Price ?? 0,
        description: d.Description ?? '',
        category: d.Category ?? 'All',
        image: normalizeStrapiMedia(d.Image),
      }))
      : [];

    return {
      title: doc.Title ?? undefined,
      description: doc.Description ?? undefined,
      dishes,
      menuTitle: doc.MenuTitle ?? undefined,
      menuDescription: doc.MenuDescription ?? undefined,
      appLogos: logos.length > 0 ? logos : undefined,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getMenuDishHeader] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}


// —— Apps Section (single type) ——
export interface AppsSectionStrapi {
  title?: string;
  description?: string;
  appLogos?: StrapiImage[];
}

type AppsSectionDoc = {
  Title?: string;
  Description?: string;
  AppLogos?: (StrapiImageData | { url?: string })[];
};

export async function getAppsSection(): Promise<AppsSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/apps-section', {
      populate: { AppLogos: true },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    const doc = raw as AppsSectionDoc;
    const logos = Array.isArray(doc.AppLogos)
      ? doc.AppLogos
        .map((img) => normalizeStrapiMedia(img))
        .filter((x): x is StrapiImage => x !== null)
      : [];
    return {
      title: doc.Title ?? undefined,
      description: doc.Description ?? undefined,
      appLogos: logos.length > 0 ? logos : undefined,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getAppsSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

export async function getMenus(): Promise<MenuStrapi[]> {
  if (!STRAPI_URL) return [];
  try {
    const data = await strapiFetch<{ data: unknown }>('/menus', {
      populate: { Icon: true },
      sort: ['Order:asc'],
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
      .map((doc) => normalizeMenu(doc as MenuDoc))
      .filter((x): x is MenuStrapi => x !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getMenus] Failed to fetch menus from Strapi:', err);
    }
    return [];
  }
}

export interface SignatureDishStrapi {
  id?: number;
  image?: StrapiImage | null;
  subtitle?: string;
  name?: string;
  description?: string;
  order?: number;
}

export interface SignatureDishesStrapi {
  title?: string;
  subtitle?: string;
  dishes?: SignatureDishStrapi[];
}

type SignatureDishDoc = {
  Image?: StrapiImageData | { url?: string } | null;
  Subtitle?: string;
  Name?: string;
  Description?: string;
  Order?: number;
};

type SignatureDishesSectionDoc = {
  Title?: string;
  Subtitle?: string;
  Dishes?: SignatureDishDoc[];
};

function normalizeSignatureDish(doc: SignatureDishDoc): SignatureDishStrapi {
  return {
    image: normalizeStrapiMedia(doc.Image),
    subtitle: doc.Subtitle ?? undefined,
    name: doc.Name ?? undefined,
    description: doc.Description ?? undefined,
    order: doc.Order ?? 0,
  };
}

function normalizeSignatureDishes(doc: SignatureDishesSectionDoc | null): SignatureDishesStrapi | null {
  if (!doc) return null;
  const rawDishes = doc.Dishes;
  const dishes: SignatureDishStrapi[] = Array.isArray(rawDishes)
    ? rawDishes
      .map(normalizeSignatureDish)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  return {
    title: doc.Title ?? undefined,
    subtitle: doc.Subtitle ?? undefined,
    dishes: dishes.length > 0 ? dishes : undefined,
  };
}

export interface AboutSectionStrapi {
  image?: StrapiImage | null;
  /** Image for the dedicated /about page; if not set, use image */
  aboutPageImage?: StrapiImage | null;
  contactBoxTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  headline?: string;
  firstParagraph?: string;
  secondParagraph?: string;
  /** Third paragraph – shown only on /about page */
  thirdParagraph?: string;
  ctaText?: string;
  ctaLink?: string;
}

type AboutSectionDoc = {
  Image?: StrapiImageData | { url?: string } | null;
  AboutPageImage?: StrapiImageData | { url?: string } | null;
  ContactBoxTitle?: string;
  ContactPhone?: string;
  ContactEmail?: string;
  ContactAddress?: string;
  Headline?: string;
  FirstParagraph?: string;
  SecondParagraph?: string;
  ThirdParagraph?: string;
  CtaText?: string;
  CtaLink?: string;
};

function normalizeAboutSection(doc: AboutSectionDoc | null): AboutSectionStrapi | null {
  if (!doc) return null;
  // Support both PascalCase (API) and camelCase (some Strapi versions) for media keys
  const aboutPageImageRaw =
    (doc as AboutSectionDoc & { aboutPageImage?: unknown }).aboutPageImage ?? doc.AboutPageImage;
  return {
    image: normalizeStrapiMedia(doc.Image),
    aboutPageImage: normalizeStrapiMedia(aboutPageImageRaw),
    contactBoxTitle: doc.ContactBoxTitle ?? undefined,
    contactPhone: doc.ContactPhone ?? undefined,
    contactEmail: doc.ContactEmail ?? undefined,
    contactAddress: doc.ContactAddress ?? undefined,
    headline: doc.Headline ?? undefined,
    firstParagraph: doc.FirstParagraph ?? undefined,
    secondParagraph: doc.SecondParagraph ?? undefined,
    thirdParagraph: doc.ThirdParagraph ?? undefined,
    ctaText: doc.CtaText ?? undefined,
    ctaLink: doc.CtaLink ?? undefined,
  };
}

export async function getAboutSection(): Promise<AboutSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    // Populate both images: Image (home), AboutPageImage (/about page). Object form matches hero/header.
    const data = await strapiFetch<{ data: unknown }>('/about-section', {
      populate: { Image: true, AboutPageImage: true },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeAboutSection(raw as AboutSectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getAboutSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

// —— About Video Section (single type, about page) ——
export interface AboutVideoFeatureStrapi {
  icon?: StrapiImage | null;
  title?: string;
  description?: string;
  order?: number;
}

export interface AboutVideoSectionStrapi {
  backgroundImage?: StrapiImage | null;
  headline?: string;
  videoUrl?: string;
  features?: AboutVideoFeatureStrapi[];
}

type AboutVideoFeatureDoc = {
  Icon?: StrapiImageData | { url?: string } | null;
  Title?: string;
  Description?: string;
  Order?: number;
};

type AboutVideoSectionDoc = {
  BackgroundImage?: StrapiImageData | { url?: string } | null;
  Headline?: string;
  VideoUrl?: string;
  Features?: AboutVideoFeatureDoc[];
};

function normalizeAboutVideoFeature(doc: AboutVideoFeatureDoc): AboutVideoFeatureStrapi {
  return {
    icon: normalizeStrapiMedia(doc.Icon),
    title: doc.Title ?? undefined,
    description: doc.Description ?? undefined,
    order: doc.Order ?? 0,
  };
}

function normalizeAboutVideoSection(doc: AboutVideoSectionDoc | null): AboutVideoSectionStrapi | null {
  if (!doc) return null;
  const rawFeatures = doc.Features;
  const features: AboutVideoFeatureStrapi[] = Array.isArray(rawFeatures)
    ? rawFeatures
      .map(normalizeAboutVideoFeature)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  return {
    backgroundImage: normalizeStrapiMedia(doc.BackgroundImage),
    headline: doc.Headline ?? undefined,
    videoUrl: doc.VideoUrl ?? undefined,
    features: features.length > 0 ? features : undefined,
  };
}

export async function getAboutVideoSection(): Promise<AboutVideoSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/about-video-section', {
      populate: {
        BackgroundImage: true,
        Features: { populate: { Icon: true } },
      },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeAboutVideoSection(raw as AboutVideoSectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getAboutVideoSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

// —— About Guest Section (single type, about page) ——
export interface AboutGuestStatStrapi {
  value: string;
  label: string;
  order?: number;
}

export interface AboutGuestSectionStrapi {
  title?: string;
  subtitle?: string;
  stats?: AboutGuestStatStrapi[];
  image?: StrapiImage | null;
}

type AboutGuestStatDoc = {
  Value?: string;
  Label?: string;
  Order?: number;
};

type AboutGuestSectionDoc = {
  Title?: string;
  Subtitle?: string;
  Stats?: AboutGuestStatDoc[];
  Image?: StrapiImageData | { url?: string } | null;
};

function normalizeAboutGuestStat(doc: AboutGuestStatDoc): AboutGuestStatStrapi {
  return {
    value: doc.Value ?? '',
    label: doc.Label ?? '',
    order: doc.Order ?? 0,
  };
}

function normalizeAboutGuestSection(doc: AboutGuestSectionDoc | null): AboutGuestSectionStrapi | null {
  if (!doc) return null;
  const rawStats = doc.Stats;
  const stats: AboutGuestStatStrapi[] = Array.isArray(rawStats)
    ? rawStats
      .map(normalizeAboutGuestStat)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  return {
    title: doc.Title ?? undefined,
    subtitle: doc.Subtitle ?? undefined,
    stats: stats.length > 0 ? stats : undefined,
    image: normalizeStrapiMedia(doc.Image),
  };
}

export async function getAboutGuestSection(): Promise<AboutGuestSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/about-guest-section', {
      populate: { Image: true },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeAboutGuestSection(raw as AboutGuestSectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getAboutGuestSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

// —— Delivery Section (single type) ——
export interface DeliveryFeatureStrapi {
  icon?: StrapiImage | null;
  text?: string;
  order?: number;
}

export interface DeliverySectionStrapi {
  title?: string;
  description?: string;
  imageLeft?: StrapiImage | null;
  imageMiddleTop?: StrapiImage | null;
  imageMiddleBottom?: StrapiImage | null;
  features?: DeliveryFeatureStrapi[];
}

type DeliveryFeatureDoc = {
  Icon?: StrapiImageData | { url?: string } | null;
  Text?: string;
  Order?: number;
};

type DeliverySectionDoc = {
  Title?: string;
  Description?: string;
  ImageLeft?: StrapiImageData | { url?: string } | null;
  ImageMiddleTop?: StrapiImageData | { url?: string } | null;
  ImageMiddleBottom?: StrapiImageData | { url?: string } | null;
  Features?: DeliveryFeatureDoc[];
};

function normalizeDeliveryFeature(doc: DeliveryFeatureDoc): DeliveryFeatureStrapi {
  return {
    icon: normalizeStrapiMedia(doc.Icon),
    text: doc.Text ?? undefined,
    order: doc.Order ?? 0,
  };
}

function normalizeDeliverySection(doc: DeliverySectionDoc | null): DeliverySectionStrapi | null {
  if (!doc) return null;
  const rawFeatures = doc.Features;
  const features: DeliveryFeatureStrapi[] = Array.isArray(rawFeatures)
    ? rawFeatures
      .map(normalizeDeliveryFeature)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  return {
    title: doc.Title ?? undefined,
    description: doc.Description ?? undefined,
    imageLeft: normalizeStrapiMedia(doc.ImageLeft),
    imageMiddleTop: normalizeStrapiMedia(doc.ImageMiddleTop),
    imageMiddleBottom: normalizeStrapiMedia(doc.ImageMiddleBottom),
    features: features.length > 0 ? features : undefined,
  };
}

export async function getDeliverySection(): Promise<DeliverySectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/delivery-section', {
      populate: {
        ImageLeft: true,
        ImageMiddleTop: true,
        ImageMiddleBottom: true,
        Features: { populate: { Icon: true } },
      },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeDeliverySection(raw as DeliverySectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getDeliverySection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

export async function getSignatureDishes(): Promise<SignatureDishesStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/signature-dishes-section', {
      populate: { Dishes: { populate: { Image: true } } },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeSignatureDishes(raw as SignatureDishesSectionDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getSignatureDishes] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

// —— Testimonials (collection) + Testimonials Section (single type) ——
export interface TestimonialStrapi {
  id: number;
  documentId?: string;
  quote?: string;
  review?: string;
  author?: string;
  location?: string;
  photo?: StrapiImage | null;
  order?: number;
}

export interface TestimonialsSectionStrapi {
  title?: string;
}

type TestimonialDoc = {
  id?: number;
  documentId?: string;
  quote?: string;
  Review?: string;
  author?: string;
  Location?: string;
  photo?: StrapiImageData | { url?: string } | null;
  Order?: number;
};

type TestimonialsSectionDoc = { Title?: string };

function normalizeTestimonial(doc: TestimonialDoc | null): TestimonialStrapi | null {
  if (!doc) return null;
  return {
    id: (doc as { id?: number }).id ?? 0,
    documentId: doc.documentId,
    quote: doc.quote ?? undefined,
    review: doc.Review ?? undefined,
    author: doc.author ?? undefined,
    location: doc.Location ?? undefined,
    photo: normalizeStrapiMedia(doc.photo),
    order: doc.Order ?? 0,
  };
}

export async function getTestimonials(): Promise<TestimonialStrapi[]> {
  if (!STRAPI_URL) return [];
  try {
    const data = await strapiFetch<{ data: unknown }>('/testimonials', {
      populate: { photo: true },
      sort: ['Order:asc'],
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
      .map((doc) => normalizeTestimonial(doc as TestimonialDoc))
      .filter((x): x is TestimonialStrapi => x !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getTestimonials] Failed to fetch from Strapi:', err);
    }
    return [];
  }
}

export async function getTestimonialsSection(): Promise<TestimonialsSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/testimonials-section', {
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    const doc = raw as TestimonialsSectionDoc;
    return { title: doc.Title ?? undefined };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getTestimonialsSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

// —— Blog Post (collection) + Blog Section (single type) ——
export interface BlogPostStrapi {
  id: number;
  documentId?: string;
  title?: string;
  slug?: string;
  date?: string;
  image?: StrapiImage | null;
  excerpt?: string;
  content?: unknown; // blocks content for detail page
  featured?: boolean;
  order?: number;
  gallery?: StrapiImage[] | null;
  detailImage?: StrapiImage | null;
}

export interface BlogSectionStrapi {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

type BlogPostDoc = {
  id?: number;
  documentId?: string;
  Title?: string;
  Slug?: string;
  Date?: string;
  Image?: StrapiImageData | { url?: string } | null;
  Excerpt?: string;
  Content?: unknown;
  Featured?: boolean;
  Order?: number;
  Gallery?: { data?: StrapiImageData[] | null } | StrapiImageData[] | null;
  DetailImage?: StrapiImageData | { url?: string } | null;
};

type BlogSectionDoc = {
  Title?: string;
  ButtonText?: string;
  ButtonLink?: string;
};

function normalizeBlogPost(doc: BlogPostDoc | null): BlogPostStrapi | null {
  if (!doc) return null;

  // Gallery can be nested in .data in some Strapi responses
  const galleryData = (doc.Gallery as { data?: StrapiImageData[] | null })?.data ?? (doc.Gallery as StrapiImageData[] | null);
  const gallery = Array.isArray(galleryData)
    ? galleryData.map(normalizeStrapiMedia).filter((img): img is StrapiImage => img !== null)
    : null;

  return {
    id: (doc as { id?: number }).id ?? 0,
    documentId: doc.documentId,
    title: doc.Title ?? undefined,
    slug: doc.Slug ?? undefined,
    date: doc.Date ?? undefined,
    image: normalizeStrapiMedia(doc.Image),
    excerpt: doc.Excerpt ?? undefined,
    content: doc.Content ?? undefined,
    featured: doc.Featured ?? false,
    order: doc.Order ?? 0,
    gallery: gallery,
    detailImage: normalizeStrapiMedia(doc.DetailImage),
  };
}

export async function getBlogPosts(limit?: number, featured?: boolean): Promise<BlogPostStrapi[]> {
  if (!STRAPI_URL) return [];
  try {
    const query: Record<string, unknown> = {
      populate: { Image: true },
      sort: ['Date:desc', 'Featured:desc', 'Order:asc'],
      status: 'published',
    };
    if (limit && limit > 0) {
      query.pagination = { limit };
    }
    if (featured !== undefined) {
      query.filters = { Featured: { $eq: featured } };
    }
    const data = await strapiFetch<{ data: unknown }>('/blog-posts', query);
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
      .map((doc) => normalizeBlogPost(doc as BlogPostDoc))
      .filter((x): x is BlogPostStrapi => x !== null);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getBlogPosts] Failed to fetch from Strapi:', err);
    }
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostStrapi | null> {
  if (!STRAPI_URL || !slug) return null;
  try {
    const query = {
      filters: { Slug: { $eq: slug } },
      populate: { Image: true, Gallery: true, DetailImage: true },
      status: 'published',
    };
    const data = await strapiFetch<{ data: unknown }>('/blog-posts', query);
    const raw = (data as { data?: unknown[] }).data;
    if (!raw || !Array.isArray(raw) || raw.length === 0) return null;
    return normalizeBlogPost(raw[0] as BlogPostDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getBlogPostBySlug] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}


export async function getBlogSection(): Promise<BlogSectionStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/blog-section', {
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    const doc = raw as BlogSectionDoc;
    return {
      title: doc.Title ?? undefined,
      buttonText: doc.ButtonText ?? undefined,
      buttonLink: doc.ButtonLink ?? undefined,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getBlogSection] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

// —— Contact Page (single type) ——
export interface ContactPageStrapi {
  title: string;
  description?: string;
  phone?: string;
  email?: string;
  hours?: string;
  address?: string;
}

type ContactPageDoc = {
  Title: string;
  Description?: string;
  Phone?: string;
  Email?: string;
  Hours?: string;
  Address?: string;
};

function normalizeContactPage(doc: ContactPageDoc | null): ContactPageStrapi | null {
  if (!doc) return null;
  return {
    title: doc.Title,
    description: doc.Description,
    phone: doc.Phone,
    email: doc.Email,
    hours: doc.Hours,
    address: doc.Address,
  };
}

export async function getContactPage(): Promise<ContactPageStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/contact-page', {
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeContactPage(raw as ContactPageDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getContactPage] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  if (!STRAPI_URL) throw new Error('STRAPI_URL not set');

  const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        Name: data.name,
        Email: data.email,
        Subject: data.subject,
        Message: data.message,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit form: ${response.status} ${errorText}`);
  }

  return response.json();
}

// —— Footer (single type) ——
export interface FooterSocialLinkStrapi {
  icon: 'twitter' | 'facebook' | 'instagram' | 'github';
  href: string;
}

export interface FooterNavLinkStrapi {
  label: string;
  href: string;
}

export interface FooterInstagramItemStrapi {
  image?: StrapiImage | null;
  link?: string;
}

export interface FooterStrapi {
  logo?: StrapiImage | null;
  logoLink?: string;
  description?: string;
  socialLinks?: FooterSocialLinkStrapi[];
  pagesTitle?: string;
  pagesLinks?: FooterNavLinkStrapi[];
  utilityTitle?: string;
  utilityLinks?: FooterNavLinkStrapi[];
  instagramTitle?: string;
  instagramItems?: FooterInstagramItemStrapi[];
  copyrightText?: string;
}

type FooterSocialLinkDoc = { Icon?: string; Href?: string; Order?: number };
type FooterNavLinkDoc = { Label?: string; Href?: string; Order?: number };
type FooterInstagramDoc = {
  Image?: StrapiImageData | { url?: string } | null;
  Link?: string;
  Order?: number;
};

type FooterDoc = {
  Logo?: StrapiImageData | { url?: string } | null;
  LogoLink?: string;
  Description?: string;
  SocialLinks?: FooterSocialLinkDoc[];
  PagesTitle?: string;
  PagesLinks?: FooterNavLinkDoc[];
  UtilityTitle?: string;
  UtilityLinks?: FooterNavLinkDoc[];
  InstagramTitle?: string;
  InstagramItems?: FooterInstagramDoc[];
  CopyrightText?: string;
};

function normalizeFooterNavLinks(raw: FooterNavLinkDoc[] | undefined): FooterNavLinkStrapi[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((l) => ({ label: l.Label ?? '', href: l.Href ?? '#', order: l.Order ?? 0 }))
    .filter((l) => l.label)
    .sort((a, b) => a.order - b.order)
    .map(({ label, href }) => ({ label, href }));
}

function normalizeFooterSocialLinks(raw: FooterSocialLinkDoc[] | undefined): FooterSocialLinkStrapi[] {
  if (!Array.isArray(raw)) return [];
  const icons = ['twitter', 'facebook', 'instagram', 'github'] as const;
  return raw
    .map((l) => ({
      icon: (icons.includes(l.Icon as (typeof icons)[number]) ? l.Icon : 'twitter') as (typeof icons)[number],
      href: l.Href ?? '#',
      order: l.Order ?? 0,
    }))
    .filter((l) => l.href)
    .sort((a, b) => a.order - b.order)
    .map(({ icon, href }) => ({ icon, href }));
}

function normalizeFooterInstagramItems(raw: FooterInstagramDoc[] | undefined): FooterInstagramItemStrapi[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      image: normalizeStrapiMedia(item.Image),
      link: item.Link ?? undefined,
      order: item.Order ?? 0,
    }))
    .sort((a, b) => a.order - b.order)
    .slice(0, 4)
    .map(({ image, link }) => ({ image, link }));
}

function normalizeFooter(doc: FooterDoc | null): FooterStrapi | null {
  if (!doc) return null;
  return {
    logo: normalizeStrapiMedia(doc.Logo),
    logoLink: doc.LogoLink ?? '/',
    description: doc.Description ?? undefined,
    socialLinks: normalizeFooterSocialLinks(doc.SocialLinks),
    pagesTitle: doc.PagesTitle ?? undefined,
    pagesLinks: normalizeFooterNavLinks(doc.PagesLinks),
    utilityTitle: doc.UtilityTitle ?? undefined,
    utilityLinks: normalizeFooterNavLinks(doc.UtilityLinks),
    instagramTitle: doc.InstagramTitle ?? undefined,
    instagramItems: normalizeFooterInstagramItems(doc.InstagramItems),
    copyrightText: doc.CopyrightText ?? undefined,
  };
}

export async function getFooter(): Promise<FooterStrapi | null> {
  if (!STRAPI_URL) return null;
  try {
    const data = await strapiFetch<{ data: unknown }>('/footer', {
      populate: {
        Logo: true,
        SocialLinks: true,
        PagesLinks: true,
        UtilityLinks: true,
        InstagramItems: { populate: { Image: true } },
      },
      status: 'published',
    });
    const raw = (data as { data?: unknown }).data;
    if (raw === null || raw === undefined) return null;
    return normalizeFooter(raw as FooterDoc);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getFooter] Failed to fetch from Strapi:', err);
    }
    return null;
  }
}

export function getStrapiMediaUrl(path: string | undefined | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return STRAPI_URL ? `${STRAPI_URL}${path.startsWith('/') ? path : `/${path}`}` : null;
}

export { STRAPI_URL };
