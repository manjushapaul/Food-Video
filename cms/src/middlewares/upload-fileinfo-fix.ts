/**
 * Fix Strapi v5 admin upload bug: fileInfo is sent as double-stringified JSON
 * (e.g. [ "\"{\"name\":\"file.png\"}\"" ]) and fails validation.
 * This middleware parses string elements into objects before the upload controller runs.
 */
function parseFileInfoArray(arr: unknown[]): unknown[] {
  return arr.map((item: unknown) => {
    if (typeof item === 'string') {
      try {
        const parsed = JSON.parse(item) as unknown;
        return typeof parsed === 'object' && parsed !== null ? parsed : item;
      } catch {
        return item;
      }
    }
    return item;
  });
}

export default (_config: unknown, _opts: { strapi: unknown }) => {
  return async (ctx: { request?: { body?: Record<string, unknown> } }, next: () => Promise<void>) => {
    const body = ctx.request?.body as Record<string, unknown> | undefined;
    if (!body) {
      await next();
      return;
    }
    if (body.fileInfo && Array.isArray(body.fileInfo)) {
      body.fileInfo = parseFileInfoArray(body.fileInfo);
    }
    const fields = body.fields as Record<string, unknown> | undefined;
    if (fields?.fileInfo && Array.isArray(fields.fileInfo)) {
      fields.fileInfo = parseFileInfoArray(fields.fileInfo);
    }
    await next();
  };
};
