export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '50mb',
      jsonLimit: '50mb',
      textLimit: '50mb',
      formidable: {
        maxFileSize: 50 * 1024 * 1024, // 50MB per file for uploads
      },
    },
  },
  'global::upload-fileinfo-fix',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
