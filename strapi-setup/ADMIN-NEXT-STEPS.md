# What to do at http://localhost:1337/admin

Follow these in order.

---

## Step 1: Create your admin user (first time only)

If you see the registration form:

- Enter **First name**, **Last name**, **Email**, **Password**.
- Click **Let’s start**.

---

## Step 2: Content types

The **Hero**, **Header**, **Feature**, **Testimonial**, and **Menu** content types are defined in the codebase (`cms/src/api/*/content-types/`, `cms/src/components/`). Restart Strapi to load them.

If you need to create content types manually:
1. In the left sidebar, open **Content-Type Builder**.
2. **Create new single type**
   - Display name: **Hero**
   - Click **Continue** → leave API ID as **hero** / **heroes** → **Finish**.
   - Add these **attributes** (click **Add another field** for each):
     - **Text** (Short text): name `title`, **Required** → Save.
     - **Text** (Long text): name `subtitle` → Save.
     - **Media** (Single media): name `image`, type **Images** → Save.
     - **Text** (Short text): name `cta` → Save.
     - **Text** (Short text): name `ctaLink` → Save.
   - Click **Save** (top right). Strapi will restart.

3. **Create new collection type**
   - Display name: **Feature**
   - API ID: **feature** / **features** → **Finish**.
   - Add attributes:
     - **Text** (Short): `title`, **Required** → Save.
     - **Text** (Long): `desc`, **Required** → Save.
     - **Media** (Single): `icon`, **Images** or **Files** → Save.
     - **Number** (Integer): `order`, default **0** → Save.
   - **Save** (top right). Strapi will restart.

4. **Create new collection type**
   - Display name: **Testimonial**
   - API ID: **testimonial** / **testimonials** → **Finish**.
   - Add attributes:
     - **Text** (Long): `quote`, **Required** → Save.
     - **Text** (Short): `author`, **Required** → Save.
     - **Media** (Single, Images): `photo` → Save.
     - **Text** (Short): `role` → Save.
     - **Text** (Short): `company` → Save.
     - **Number** (Integer): `order`, default **0** → Save.
   - **Save** (top right). Strapi will restart.

---

## Step 3: Enable public API access (required for frontend)

> **Important:** Without this step, the Next.js app will get 403 Forbidden and hero content won’t appear.

1. **Settings** (left sidebar, bottom) → **Users & Permissions** → **Roles**.
2. Click **Public**.
3. Under **Permissions**, find **Hero**, **Header**, **Feature**, **Features Section**, **Testimonial**, **Testimonials Section**, **Menu**, **Browse Our Menu Section**, **Signature Dishes Section**, **About Section**, **Delivery Section**, **Blog Post**, **Blog Section**, **Footer**.
4. For each, check **find** (and **findOne** if listed).
5. Click **Save** (top right).

Your Next.js app can now call:

- `GET http://localhost:1337/api/hero?populate=image`
- `GET http://localhost:1337/api/header?populate=Logo,NavLinks`
- `GET http://localhost:1337/api/menus?populate=Icon`
- `GET http://localhost:1337/api/menu-section`
- `GET http://localhost:1337/api/signature-dishes-section?populate=Dishes.Image`
- `GET http://localhost:1337/api/about-section?populate=Image`
- `GET http://localhost:1337/api/features-section`
- `GET http://localhost:1337/api/features?populate=Icon`
- `GET http://localhost:1337/api/delivery-section?populate=ImageLeft,ImageMiddleTop,ImageMiddleBottom,Features.Icon`
- `GET http://localhost:1337/api/testimonials-section`
- `GET http://localhost:1337/api/testimonials?populate=photo`
- `GET http://localhost:1337/api/blog-section`
- `GET http://localhost:1337/api/blog-posts?populate=Image`
- `GET http://localhost:1337/api/footer?populate=Logo,SocialLinks,PagesLinks,UtilityLinks,InstagramItems.Image`

---

## Step 4: Add content

1. **Content Manager** (left sidebar).
2. **Header** (single type) – logo, nav links, CTA button
   - Click **Header** → **Create new entry**.
   - Add **Logo** (upload image – or leave empty to use default).
   - Set **LogoLink** (e.g. `/` for homepage).
   - Add **Nav Links** (repeatable): Label, Href, Order for each (Home, About, Menu, etc.).
   - Set **CtaText** (e.g. "Book a Table"), **CtaLink**.
   - Use `strapi-setup/seed-data/header.json` for reference.
   - **Save** then **Publish**.

3. **About Section** (single type) – image, contact box, headline, paragraphs, CTA
   - Click **About Section** → **Create new entry**.
   - Add **Image** (upload).
   - Set **ContactBoxTitle**, **ContactPhone**, **ContactEmail**, **ContactAddress**.
   - Set **Headline**, **FirstParagraph**, **SecondParagraph**.
   - Set **CtaText**, **CtaLink**.
   - **Save** then **Publish**.

4. **Hero** (single type)
   - Click **Hero** → **Create new entry**.
   - Fill **title**, **subtitle**, **cta**, **ctaLink** (e.g. from `strapi-setup/seed-data/hero.json`).
   - Optionally add an **image** (upload).
   - **Save** then **Publish** (if you use draft/publish).

5. **Signature Dishes Section** (single type) – title, subtitle, dishes carousel
   - Click **Signature Dishes Section** → **Create new entry**.
   - Set **Title** (e.g. "Our Signature Dishes"), **Subtitle** (e.g. "Explore a rotating selection of chef favourites").
   - Add **Dishes** (repeatable): **Image**, **Subtitle** (e.g. "CURATED SELECTION"), **Name** (e.g. "Garden Salads"), **Description**, **Order**.
   - **Save** then **Publish**.

6. **Browse Our Menu Section** (single type) – section title
   - Click **Browse Our Menu Section** → **Create new entry**.
   - Set **Title** (e.g. "Browse Our Menu").
   - **Save** then **Publish**.

7. **Menu** (collection) – menu category cards
   - Click **Menu** → **Create new entry** (repeat for 4+ items).
   - Fill **Title**, **Description**, set **Order** (1, 2, 3…).
   - Optionally add **Icon** (upload image or SVG).
   - Use `strapi-setup/seed-data/menus.json` for sample content.
   - **Save** then **Publish** each entry.

8. **Delivery Section** (single type) – title, description, 3 images, feature list
   - Click **Delivery Section** → **Create new entry**.
   - Set **Title** (e.g. "Fastest Food Delivery in City"), **Description** (paragraph text).
   - Upload **ImageLeft** (chef), **ImageMiddleTop** (curry/shrimp), **ImageMiddleBottom** (appetizer cups).
   - Add **Features** (repeatable): **Icon** (upload SVG/image), **Text** (e.g. "Delivery within 30 minutes", "Best Offer & Prices", "Online Services Available"), **Order** (1, 2, 3…).
   - **Save** then **Publish**.

9. **Features Section** (single type) – section title
   - Click **Features Section** → **Create new entry**.
   - Set **Title** (e.g. "We also offer unique services for your events").
   - **Save** then **Publish**.

10. **Feature** (collection) – service cards (image, title, description)
   - Click **Feature** → **Create new entry** (repeat for 4+ items).
   - Set **Title** (e.g. "Caterings", "Birthdays", "Weddings", "Events").
   - Set **Desc** (description text).
   - Add **Icon** (upload image).
   - Set **Order** (1, 2, 3…).
   - Use `strapi-setup/seed-data/features.json` for reference.
   - **Save** then **Publish** each entry.

11. **Testimonials Section** (single type) – section title
   - Click **Testimonials Section** → **Create new entry**.
   - Set **Title** (e.g. "What Our Customers Say").
   - **Save** then **Publish**.

12. **Testimonial** (collection) – quote, review, author, location, photo
   - Click **Testimonial** → **Create new entry** (repeat for 3–5 items).
   - Set **quote** (headline, e.g. "The best restaurant"), **Review** (body text), **author** (name), **Location** (e.g. "Los Angeles, CA").
   - Add **photo** (customer image). Set **Order** (1, 2, 3…) for display order.
   - Use `strapi-setup/seed-data/testimonials.json` for reference.
   - **Save** then **Publish** each entry.

13. **Blog Section** (single type) – section title, button
   - Click **Blog Section** → **Create new entry**.
   - Set **Title** (e.g. "Our Blog & Articles"), **ButtonText** (e.g. "Read All Articles"), **ButtonLink** (e.g. "/blog").
   - **Save** then **Publish**.

14. **Blog Post** (collection) – title, slug, date, image, excerpt, content
   - Click **Blog Post** → **Create new entry** (repeat for 5+ items).
   - Set **Title** (e.g. "The secret tips & tricks to prepare a perfect burger"), **Slug** (auto-generated from title).
   - Set **Date** (e.g. 2023-01-03), upload **Image**.
   - Set **Excerpt** (short description shown on homepage for the first/featured post).
   - Optionally add **Content** (rich text for the detail page).
   - Set **Featured** to true for the main/first post, **Order** (1, 2, 3…) for display order.
   - Use `strapi-setup/seed-data/blog-posts.json` for reference.
   - **Save** then **Publish** each entry.

15. **Footer** (single type) – logo, description, social links, nav links, Instagram
   - Click **Footer** → **Create new entry**.
   - Upload **Logo** (or leave empty for default).
   - Set **LogoLink** (e.g. `/`), **Description** (company text).
   - Add **SocialLinks** (repeatable): **Icon** (twitter, facebook, instagram, github), **Href** (URL), **Order**.
   - Set **PagesTitle** (e.g. "Pages"), add **PagesLinks** (Label, Href, Order for Home, About, Menu, etc.).
   - Set **UtilityTitle** (e.g. "Utility Pages"), add **UtilityLinks** (Label, Href, Order).
   - Set **InstagramTitle** (e.g. "Follow Us On Instagram"), add **InstagramItems** (Image, Link, Order) – up to 4.
   - Set **CopyrightText**.
   - **Save** then **Publish**.

---

## Step 5: Use in your Next.js app

1. In **Food-Video**, ensure `.env.local` has:
   ```bash
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```
2. Run the Next.js app: `npm run dev`.
3. The home page will load hero and features from Strapi when the content types and endpoints match (see `lib/strapi.ts` and `app/page.tsx`).

For more detail (bootstrap seed, schema reference), see **strapi-setup/README.md**.

---

## Troubleshooting

**404 Not Found** – Single types (Hero, Header, Features Section, etc.) return 404 until you create and publish content. The app now handles this and shows fallback content. Fix: create the entry in **Content Manager** → select the type → **Create new entry** → fill fields → **Save** and **Publish**.

**403 Forbidden** – API permissions are missing. Fix: **Settings** → **Users & Permissions** → **Roles** → **Public** → enable **find** for the relevant content types → **Save**.
