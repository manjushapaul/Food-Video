# Strapi upload "Internal Server Error" – what to do

## 0. One-shot fix script (local dev)

From the **Food-Video** project root:

```bash
# If Strapi lives in a folder named cms/ (e.g. Food-Video/cms)
chmod +x scripts/fix-uploads.sh
./scripts/fix-uploads.sh
```

If Strapi is in a sibling folder (e.g. **my-strapi**):

```bash
CMS_DIR=../my-strapi ./scripts/fix-uploads.sh
```

The script: removes `.tmp`, sets `public/uploads` to `777`, then runs `npm run develop`. By default it does **not** remove `database.sqlite` (so you keep content and admin). To do a full reset (wipes DB and content), run:
`CLEAR_DB=1 ./scripts/fix-uploads.sh` (use **CLEAR_DB**, not EAR_DB). **Note:** `chmod 777` is for local dev only; see “Production” below.

## 1. fileInfo fix (double-stringified bug)

In **my-strapi** a custom middleware was added to fix the Strapi v5 bug where the admin sends `fileInfo` as double-stringified JSON, which causes "fileInfo must be an object" and Internal Server Error.

- **File:** `my-strapi/src/middlewares/upload-fileinfo-fix.ts`  
  It runs after the body is parsed and converts string `fileInfo` entries into objects.
- **Config:** `my-strapi/config/middlewares.ts` includes `'global::upload-fileinfo-fix'` right after `strapi::body`.

You must **restart Strapi** for this to apply (see step 1).

## 2. Restart Strapi after config changes

In your **my-strapi** project, body/upload limits and the fileInfo fix are in place. Restart Strapi so they apply:

```bash
cd /Users/manjushapaul/Projects/my-strapi
npm run develop
```

## 3. Check the Strapi terminal (not Next.js)

When an upload fails, the **real error** is in the terminal where Strapi is running (`npm run develop` in **my-strapi**). Look for a red stack trace or message right after you click Upload. That will tell you the exact cause (e.g. permission, validation, disk space).

## 4. Try uploading one file

Upload **one image** at a time (e.g. one PNG) instead of several at once. Some "Internal Server Error" cases are triggered only when multiple files are sent.

## 5. Check upload folder permissions

Strapi writes files to `my-strapi/public/uploads/`. Ensure the app can write there:

```bash
cd /Users/manjushapaul/Projects/my-strapi
chmod -R 755 public/uploads
```

On some setups you may need `775` or to fix ownership so the user running `npm run develop` owns the folder.

## 6. Use Content Manager instead of Media Library

If "Add new assets" in the Media Library always fails:

1. Go to **Content Manager** → **Testimonial** (or Hero / Feature).
2. Create or edit an entry.
3. In the **photo** (or **image** / **icon**) field, click **Add new asset** and upload **one file** from that field.

Uploading from a content type field sometimes works when the main Media Library upload does not.

## 7. Known Strapi v5 bug (fileInfo)

In some Strapi v5 versions, Media Library upload fails with a validation error like `fileInfo must be a 'object' type`. That’s a known bug. Workarounds:

- Upload from the **content type field** (step 5), or  
- Upgrade Strapi: `cd my-strapi && npx @strapi/upgrade latest`  
- Or wait for a patch and check: https://github.com/strapi/strapi/issues

---

## Production-ready upload setup

- **Permissions:** Avoid `chmod 777`. Run Strapi under a dedicated user; set `public/uploads` to `755` or `775` and ensure that user owns the directory.
- **Body/upload limits:** Keep the increased `strapi::body` and upload plugin `sizeLimit` in `config/middlewares.ts` and `config/plugins.ts`; adjust values (e.g. 50MB) to match your needs.
- **fileInfo middleware:** Keep `global::upload-fileinfo-fix` in `config/middlewares.ts` until Strapi fixes the double-stringified fileInfo bug upstream.
- **Storage:** For production, consider an upload provider (e.g. S3, Azure) so files are not stored only on the app server.

---

**Summary:** Restart Strapi, check the Strapi terminal for the error, try one file at a time, and if needed upload from Content Manager (Testimonial/Hero/Feature) instead of the Media Library.
