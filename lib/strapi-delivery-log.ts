
export async function getDeliverySection(): Promise<DeliverySectionStrapi | null> {
    if (!STRAPI_URL) {
        console.error('STRAPI_URL is missing in getDeliverySection');
        return null;
    }
    try {
        console.log('[getDeliverySection] Fetching from:', STRAPI_URL);
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
        console.log('[getDeliverySection] Raw data keys:', raw ? Object.keys(raw) : 'null');
        if (raw) {
            // Log deep fields to check capitalization
            // @ts-ignore
            if (raw.Features) console.log('[getDeliverySection] First feature keys:', raw.Features[0] ? Object.keys(raw.Features[0]) : 'empty feature');
            // @ts-ignore
            if (raw.ImageLeft) console.log('[getDeliverySection] ImageLeft:', JSON.stringify(raw.ImageLeft).substring(0, 100));
        }

        if (raw === null || raw === undefined) return null;
        const normalized = normalizeDeliverySection(raw as DeliverySectionDoc);
        console.log('[getDeliverySection] Normalized:', JSON.stringify(normalized, null, 2));
        return normalized;
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[getDeliverySection] Failed to fetch from Strapi:', err);
        }
        return null;
    }
}
