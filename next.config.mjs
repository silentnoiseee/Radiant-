/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a fully static site in ./out for Hostinger (no Node server needed).
  output: "export",
  // Emit each route as a folder with index.html (e.g. /login/index.html),
  // which Apache-based hosts like Hostinger serve cleanly on direct visits/refresh.
  trailingSlash: true,
  // next/image optimization needs a server; disable it for static export.
  images: { unoptimized: true },
};
export default nextConfig;
