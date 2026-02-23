const qs = require('qs');

const STRAPI_URL = 'http://localhost:1337';

async function strapiFetch(path, query = {}) {
    const queryString = qs.stringify(query, { encodeValuesOnly: true });
    const url = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

    console.log(`Fetching: ${url}`);

    try {
        const res = await fetch(url, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`Error ${res.status}: ${text}`);
            return null;
        }

        const text = await res.text();
        console.log('Response:', text);
        return JSON.parse(text);
    } catch (err) {
        console.error('Fetch error:', err);
        return null;
    }
}

async function debug() {
    await strapiFetch('/delivery-section', {
        populate: {
            ImageLeft: true,
            ImageMiddleTop: true,
            ImageMiddleBottom: true,
            Features: { populate: { Icon: true } },
        },
        status: 'published',
    });
}

debug();
