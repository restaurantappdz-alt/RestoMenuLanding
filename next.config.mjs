import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // No basePath: the site is served at the DOMAIN ROOT via the custom
  // subdomain (restova.andalussmart.com), so all asset URLs are root-relative.
  // A basePath (e.g. "/RestoMenuLanding") would 404 every _next/*, /screenshots/*
  // and /bg-images/* file under a custom domain.
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);