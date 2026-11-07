/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["jsdom", "msedge-tts", "ws"],
  // make the bundled font files available to the OG / press image routes when deployed
  outputFileTracingIncludes: { "/**": ["./lib/fonts/**"] },
};
export default nextConfig;
