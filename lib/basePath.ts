/**
 * GitHub Pages custom-domain deployment (restova.andalussmart.com): the
 * site is served at the DOMAIN ROOT, so no basePath prefix is applied.
 * lib/basePath's `pub` helper stays as a single place to manage URL
 * generation if hosting ever moves back under a subpath.
 */
export const BASE_PATH = "";

/** Prefix a public path (e.g. "/phone.png") for use as a next/image src. */
export const pub = (p: string) => `${BASE_PATH}${p}`;