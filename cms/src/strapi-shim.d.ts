/**
 * Fallback type declarations when IDE cannot resolve @strapi/strapi from node_modules.
 * The package is installed in cms/node_modules - this shim ensures type-checking works
 * when the workspace root differs from the cms folder.
 */
declare module '@strapi/strapi' {
  export const factories: {
    createCoreRouter: (uid: string) => unknown;
    createCoreController: (uid: string) => unknown;
    createCoreService: (uid: string) => unknown;
  };
}
