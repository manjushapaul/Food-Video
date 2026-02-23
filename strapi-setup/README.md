# Strapi v5 setup – IT services landing (sayonetech.com style)

Content types and seed data for an IT services landing page: **Hero** (single), **Features** (collection), **Testimonials** (collection).

---

## 0. Create the Strapi app (run in your terminal)

The Strapi installer needs an **interactive terminal** (you must choose "Skip" and answer prompts). Run one of these **in your own terminal** (not inside Cursor’s automated run):

```bash
# From the Food-Video project folder – creates ../my-strapi
./scripts/create-strapi.sh
```

Or run the command directly:

```bash
cd /Users/manjushapaul/Projects
npx create-strapi-app@latest my-strapi --quickstart
```

When prompted:

1. **"Please log in or sign up"** → choose **Skip** (arrow down, Enter).
2. **"Participate in anonymous A/B testing?"** → type **N** and Enter.

When it finishes, go to `my-strapi` and run `npm run develop`, then open http://localhost:1337/admin and create your admin user. After that, continue with the content types below.

---

## 1. Content types

### Option A: Content-Type Builder (recommended)

In Strapi Admin: **Content-Type Builder** → **Create new collection type** / **Create new single type**.

#### Hero (single type)

- **Display name:** Hero  
- **API ID (singular):** `hero`  
- **API ID (plural):** `heroes`  
- **Attributes:**

| Name    | Type   | Required | Notes                    |
|---------|--------|----------|--------------------------|
| title   | Text (Short) | Yes  | max 120                  |
| subtitle| Text (Long)   | No   | —                        |
| image   | Media (Single image) | No | Allowed types: images     |
| cta     | Text (Short)  | No   | e.g. "Get started", max 80 |
| ctaLink | Text (Short)  | No   | URL, max 500             |

#### Feature (collection type)

- **Display name:** Feature  
- **API ID (singular):** `feature`  
- **API ID (plural):** `features`  
- **Attributes:**

| Name  | Type   | Required | Notes                |
|-------|--------|----------|----------------------|
| title | Text (Short) | Yes  | max 100          |
| desc  | Text (Long)  | Yes  | —                |
| icon  | Media (Single) | No | Allowed: images, files |
| order | Number (Integer) | No | default 0       |

#### Testimonial (collection type)

- **Display name:** Testimonial  
- **API ID (singular):** `testimonial`  
- **API ID (plural):** `testimonials`  
- **Attributes:**

| Name   | Type   | Required | Notes                |
|--------|--------|----------|----------------------|
| quote  | Text (Long)  | Yes  | —                |
| author | Text (Short)  | Yes  | max 120          |
| photo  | Media (Single image) | No | —             |
| role   | Text (Short)  | No   | max 80             |
| company| Text (Short)  | No   | max 120            |
| order  | Number (Integer) | No | default 0       |

Save and restart Strapi after creating types.

### Option B: Use schema files

If your Strapi project uses file-based schemas, copy the JSON files into the correct API folders:

- **Hero:** `schemas/hero.json` → `src/api/hero/content-types/hero/schema.json`  
  (Create folder `src/api/hero/content-types/hero/` first.)
- **Feature:** `schemas/feature.json` → `src/api/feature/content-types/feature/schema.json`  
- **Testimonial:** `schemas/testimonial.json` → `src/api/testimonial/content-types/testimonial/schema.json`  

Strapi v5 expects a full API structure (routes, controllers, services). Easiest is to create the types in the Content-Type Builder once; the generated structure matches the above. Use the JSON only as reference or for custom projects that already have that structure.

---

## 2. Enable public find permissions

1. **Settings** → **Users & Permissions** → **Roles** → **Public**.
2. Under **Permissions**, find:
   - **Hero** → enable **find** (and **findOne** if your API exposes it).
   - **Feature** → enable **find** (and **findOne** if needed).
   - **Testimonial** → enable **find** (and **findOne** if needed).
3. **Save**.

Your frontend can then call:

- `GET /api/hero` (single type)
- `GET /api/features?populate=icon`
- `GET /api/testimonials?populate=photo`

---

## 3. Sample entries (3–5 per collection)

### Option A: Bootstrap seed (programmatic)

1. In your Strapi project, open `src/index.js` (or `src/index.ts`).
2. In the `bootstrap` function, call the seed helper:

```js
const { seedIfEmpty } = require('../../strapi-setup/bootstrap-seed.js'); // adjust path

module.exports = {
  async bootstrap({ strapi }) {
    await seedIfEmpty(strapi);
  },
};
```

3. Restart Strapi. On first run it will create:
   - 1 Hero entry
   - 5 Feature entries
   - 5 Testimonial entries  

   (No media; upload **image**, **icon**, and **photo** in the Admin after seeding.)

### Option B: Manual entry from JSON

- **Hero:** Content Manager → **Hero** (single type) → Create and paste from `seed-data/hero.json`. Then add **image** in the Media field.
- **Features:** Content Manager → **Feature** → Create 5 entries using `seed-data/features.json`. Add **icon** in the Media field for each if needed.
- **Testimonials:** Content Manager → **Testimonial** → Create 5 entries using `seed-data/testimonials.json`. Add **photo** in the Media field for each if needed.

---

## 4. API summary

| Content type | Endpoint           | Populate example              |
|-------------|--------------------|--------------------------------|
| Hero        | `GET /api/hero`    | `?populate=image`             |
| Features    | `GET /api/features`| `?populate=icon`               |
| Testimonials| `GET /api/testimonials` | `?populate=photo`        |

Use `qs` (or Strapi’s query format) for nested populate if you add more relations later.

---

## 5. Files in this folder

- `schemas/` – Hero, Feature, Testimonial schema JSON (reference / copy).
- `seed-data/` – hero.json, features.json, testimonials.json (sample content).
- `bootstrap-seed.js` – Seed function for Strapi `bootstrap` (creates 1 hero, 5 features, 5 testimonials when empty).

After setup, enable **Public find** for Hero, Feature, and Testimonial, then add or run the seed to get 3–5 sample entries per collection.
