import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PurrCast", short_name: "PurrCast",
    description: "Turn any article into audio with natural neural voices.",
    start_url: "/", display: "standalone", background_color: "#FFF7ED", theme_color: "#EA580C",
    icons: [{ src: "/icon-v3.svg", sizes: "any", type: "image/svg+xml" }, { src: "/apple-icon?v=3", sizes: "180x180", type: "image/png" }],
  };
}
